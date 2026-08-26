"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PollOption {
  id: string;
  label: string;
  image_url: string | null;
}

interface Poll {
  id: string;
  question: string;
  business_poll_options: PollOption[];
}

type Step = "loading" | "hidden" | "pick" | "email" | "otp" | "busy" | "voted";

// No account exists for a web voter, so "already voted" is remembered
// locally only — same idea as the review flow's device token.
function pollVoteStorageKey(pollId: string): string {
  return `clientin_poll_vote_${pollId}`;
}

const CONFETTI_COLORS = ["#C97B3A", "#4ade80", "#60a5fa", "#f472b6", "#fbbf24"];

interface ConfettiPiece {
  angle: number;
  distance: number;
  color: string;
  size: number;
  delay: number;
}

function Confetti() {
  // useState's lazy initializer is the React-blessed spot for one-time impure
  // computation — it runs exactly once on mount, unlike a plain useRef(value)
  // argument (which gets recomputed, and discarded, on every render).
  const [pieces] = useState<ConfettiPiece[]>(() =>
    Array.from({ length: 14 }, (_, i) => ({
      angle: (i / 14) * Math.PI * 2 + Math.random() * 0.4,
      distance: 60 + Math.random() * 50,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 5 + Math.random() * 4,
      delay: Math.random() * 0.08,
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-sm"
          style={{ width: p.size, height: p.size, background: p.color, top: "50%", left: "50%" }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{
            x: Math.cos(p.angle) * p.distance,
            y: Math.sin(p.angle) * p.distance - 10,
            opacity: 0,
            scale: 0.4,
            rotate: 180,
          }}
          transition={{ duration: 0.8, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function OptionLeaderboard({
  options,
  onCommit,
  fg,
  innerBorder,
}: {
  options: PollOption[];
  onCommit: (optionId: string) => void;
  fg: string;
  innerBorder: string;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt, i) =>
        opt.image_url ? (
          <motion.button
            key={opt.id}
            type="button"
            onClick={() => onCommit(opt.id)}
            className="relative rounded-2xl overflow-hidden text-left"
            style={{ height: 104 }}
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={opt.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 55%, transparent 75%)" }}
            />
            <span
              className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
              style={{ background: "rgba(255,255,255,0.22)", color: "#fff" }}
            >
              {i + 1}
            </span>
            <span className="absolute bottom-3.5 left-4 right-4 text-white text-base font-bold leading-snug">
              {opt.label}
            </span>
          </motion.button>
        ) : (
          <motion.button
            key={opt.id}
            type="button"
            onClick={() => onCommit(opt.id)}
            className="relative flex items-center gap-3 rounded-2xl overflow-hidden text-left pr-4"
            style={{
              height: 76,
              background: "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))",
              border: innerBorder,
            }}
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
          >
            <span
              className="relative flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
              style={{ background: "rgba(201,123,58,0.22)", color: "var(--brand)" }}
            >
              {i + 1}
            </span>
            <span className="relative text-base font-bold leading-snug" style={{ color: fg }}>
              {opt.label}
            </span>
          </motion.button>
        )
      )}
    </div>
  );
}

export function PollWidget({
  businessId,
  businessName,
  fg,
  fgSub,
  fgMuted,
  innerBorder,
  onStatusKnown,
  onSkip,
  onContinue,
}: {
  businessId: string;
  businessName: string;
  fg: string;
  fgSub: string;
  fgMuted: string;
  innerBorder: string;
  onStatusKnown?: (hasPoll: boolean) => void;
  onSkip?: () => void;
  onContinue?: () => void;
}) {
  const [step, setStep] = useState<Step>("loading");
  const [poll, setPoll] = useState<Poll | null>(null);
  const [tally, setTally] = useState<Record<string, number>>({});
  const [pickedOptionId, setPickedOptionId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [myVoteOptionId, setMyVoteOptionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [justVoted, setJustVoted] = useState(false);

  const refreshTally = async (pollId: string) => {
    const { data } = await supabase.rpc("get_poll_tally", { p_poll_id: pollId });
    const counts: Record<string, number> = {};
    (data ?? []).forEach((row: { option_id: string; vote_count: number }) => {
      counts[row.option_id] = Number(row.vote_count);
    });
    setTally(counts);
  };

  useEffect(() => {
    if (!businessId) return;

    (async () => {
      const { data, error: fetchError } = await supabase
        .from("business_polls")
        .select("id, question, business_poll_options!poll_id(id, label, image_url)")
        .eq("business_id", businessId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError || !data) {
        setStep("hidden");
        onStatusKnown?.(false);
        return;
      }
      const activePoll = data as unknown as Poll;
      setPoll(activePoll);
      onStatusKnown?.(true);

      // No account/session exists for web voters, so "already voted" is a
      // soft, local-only signal — same idea as the review flow's device
      // token, just remembering their own choice, not proving anything.
      const rememberedOptionId = window.localStorage.getItem(pollVoteStorageKey(activePoll.id));
      if (rememberedOptionId) {
        setMyVoteOptionId(rememberedOptionId);
        await refreshTally(activePoll.id);
        setStep("voted");
        return;
      }
      setStep("pick");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const handlePick = (optionId: string) => {
    setPickedOptionId(optionId);
    setError(null);
    setStep("email");
  };

  const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "").replace(/\/$/, "");

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError(null);
    setStep("busy");
    try {
      const res = await fetch(`${backendUrl}/api/email/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (!res.ok) throw new Error();
      setStep("otp");
    } catch {
      setError("Couldn't send a code — check the email and try again.");
      setStep("email");
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !poll || !pickedOptionId) return;
    setError(null);
    setStep("busy");

    try {
      const res = await fetch(`${backendUrl}/api/email/verify-poll-vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: code.trim(),
          pollId: poll.id,
          optionId: pickedOptionId,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error ?? "That code didn't work — check it and try again.");
        setStep("otp");
        return;
      }
    } catch {
      setError("Something went wrong recording your vote.");
      setStep("otp");
      return;
    }

    window.localStorage.setItem(pollVoteStorageKey(poll.id), pickedOptionId);
    setMyVoteOptionId(pickedOptionId);
    await refreshTally(poll.id);
    setJustVoted(true);
    setStep("voted");
  };

  if (step === "loading" || step === "hidden" || !poll) return null;

  const options = poll.business_poll_options ?? [];
  const totalVotes = Object.values(tally).reduce((sum, n) => sum + n, 0);
  const fieldStyle = { background: "rgba(255,255,255,0.06)", border: innerBorder, color: fg };

  return (
    <div className="flex flex-col gap-5">
      <motion.p
        className="text-lg font-black text-center leading-snug"
        style={{ color: fg }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        {poll.question}
      </motion.p>

      <AnimatePresence mode="wait">
        {step === "pick" && (
          <motion.div
            key="pick"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-3"
          >
            <OptionLeaderboard options={options} onCommit={handlePick} fg={fg} innerBorder={innerBorder} />
            {onSkip && (
              <button type="button" onClick={onSkip} className="text-xs block mx-auto underline underline-offset-2" style={{ color: fgMuted }}>
                Skip — just leave a review
              </button>
            )}
          </motion.div>
        )}

        {step === "email" && (
          <motion.form
            key="email"
            onSubmit={handleSendCode}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-3"
          >
            <p className="text-xs text-center" style={{ color: fgSub }}>
              We&apos;ll email you when {businessName} decides. Enter your email below, then we&apos;ll send a quick code to confirm it&apos;s you.
            </p>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={fieldStyle}
            />
            {error && <p className="text-xs text-center" style={{ color: "#ef4444" }}>{error}</p>}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              className="w-full rounded-xl py-3 text-sm font-bold"
              style={{ background: "var(--brand)", color: "#fff" }}
            >
              Send code
            </motion.button>
          </motion.form>
        )}

        {step === "otp" && (
          <motion.form
            key="otp"
            onSubmit={handleVerifyCode}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-3"
          >
            <p className="text-xs text-center" style={{ color: fgSub }}>
              We sent a code to {email}. Enter it below.
            </p>
            <input
              type="text"
              inputMode="numeric"
              required
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6-digit code"
              className="w-full rounded-xl px-4 py-3 text-sm text-center tracking-[0.3em] outline-none"
              style={fieldStyle}
            />
            {error && <p className="text-xs text-center" style={{ color: "#ef4444" }}>{error}</p>}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              className="w-full rounded-xl py-3 text-sm font-bold"
              style={{ background: "var(--brand)", color: "#fff" }}
            >
              Confirm vote
            </motion.button>
          </motion.form>
        )}

        {step === "busy" && (
          <motion.div key="busy" exit={{ opacity: 0 }} className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--brand)" }} />
          </motion.div>
        )}

        {step === "voted" && (
          <motion.div key="voted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="flex flex-col gap-3">
            {justVoted && (
              <div className="relative flex flex-col items-center gap-2">
                <Confetti />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 14 }}
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(74,222,128,0.15)" }}
                >
                  <CheckCircle2 className="w-7 h-7" style={{ color: "#4ade80" }} />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-sm font-bold"
                  style={{ color: fg }}
                >
                  Thanks for voting!
                </motion.p>
              </div>
            )}
            <div className="flex flex-col gap-2.5">
              {options.map((opt, i) => {
                const votes = tally[opt.id] ?? 0;
                const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                const isMine = myVoteOptionId === opt.id;
                return (
                  <motion.div
                    key={opt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="rounded-xl px-4 py-3"
                    style={{ background: "rgba(255,255,255,0.06)", border: innerBorder }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold flex items-center gap-2" style={{ color: isMine ? "var(--brand)" : fg }}>
                        {opt.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={opt.image_url} alt="" className="w-6 h-6 rounded-md object-cover flex-shrink-0" />
                        ) : null}
                        <span className="flex items-center gap-1.5">
                          {isMine && <Check size={13} />}
                          {opt.label}
                        </span>
                      </span>
                      <span className="text-xs font-semibold" style={{ color: fgMuted }}>{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ background: isMine ? "var(--brand)" : "rgba(255,255,255,0.35)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: 0.25 + i * 0.08, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-center flex items-center justify-center gap-1.5"
              style={{ color: fgMuted }}
            >
              <CheckCircle2 size={13} style={{ color: "#4ade80" }} />
              We&apos;ll email you when {businessName} decides.
            </motion.p>
            {onContinue && (
              <motion.button
                type="button"
                onClick={onContinue}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileTap={{ scale: 0.97 }}
                className="w-full rounded-xl py-3 text-sm font-bold"
                style={{ background: "var(--brand)", color: "#fff" }}
              >
                Continue to review →
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
