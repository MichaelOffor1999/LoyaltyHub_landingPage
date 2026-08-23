"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Loader2, CheckCircle2, ExternalLink, Star as StarIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { StarRatingInput } from "../../components/StarRatingInput";

const DEVICE_TOKEN_KEY = "clientin_review_device_token";

function getDeviceToken(): string {
  if (typeof window === "undefined") return "";
  let token = window.localStorage.getItem(DEVICE_TOKEN_KEY);
  if (!token) {
    token = crypto.randomUUID();
    window.localStorage.setItem(DEVICE_TOKEN_KEY, token);
  }
  return token;
}

interface Business {
  id: string;
  name: string;
  images: string[] | null;
  gallery: string[] | null;
  google_maps_url: string | null;
  brand_color: string | null;
  review_background_image: string | null;
  review_profile_image: string | null;
  review_button_color: string | null;
  review_button_text_color: string | null;
}

type Status = "loading" | "ready" | "submitting" | "submitted" | "cooldown" | "not_found";

export default function ReviewPage() {
  const params = useParams();
  const businessId = params.businessId as string;

  const [status, setStatus] = useState<Status>("loading");
  const [business, setBusiness] = useState<Business | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submittedText, setSubmittedText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!businessId) return;

    (async () => {
      const { data, error: fetchError } = await supabase
        .from("businesses")
        .select("id, name, images, gallery, google_maps_url, brand_color, review_background_image, review_profile_image, review_button_color, review_button_text_color")
        .eq("id", businessId)
        .single();

      if (fetchError || !data) {
        setStatus("not_found");
        return;
      }

      setBusiness(data);
      setStatus("ready");

      // Visit-tracking is intentionally paused for now — this page is reviews-only.
      // The record_qr_visit RPC and qr_review_visits table are still in the schema
      // (see supabase/sql/ADD_QR_REVIEWS.sql) if this gets revisited later; just
      // uncomment the call below to turn it back on.
      // const deviceToken = getDeviceToken();
      // void supabase.rpc("record_qr_visit", {
      //   p_business_id: businessId,
      //   p_device_token: deviceToken,
      // });
    })();
  }, [businessId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return;
    setError(null);
    setStatus("submitting");

    const deviceToken = getDeviceToken();
    const { error: rpcError } = await supabase.rpc("submit_qr_review", {
      p_business_id: businessId,
      p_device_token: deviceToken,
      p_rating: rating,
      p_review_text: reviewText.trim() || null,
      p_reviewer_name: reviewerName.trim() || null,
    });

    if (rpcError) {
      if (rpcError.message.includes("already reviewed")) {
        setStatus("cooldown");
      } else {
        setError("Something went wrong. Please try again.");
        setStatus("ready");
      }
      return;
    }

    setSubmittedText(reviewText.trim());
    setStatus("submitted");
  };

  const handleGoogleReview = async () => {
    if (!business?.google_maps_url) return;
    if (submittedText) {
      try {
        await navigator.clipboard.writeText(submittedText);
        setCopied(true);
      } catch {
        // Clipboard may be unavailable — still open the Google review page.
      }
    }
    window.open(business.google_maps_url, "_blank", "noopener,noreferrer");
  };

  const photo = business?.review_profile_image ?? business?.images?.[0] ?? business?.gallery?.[0] ?? null;

  // A background photo takes priority over a solid brand color; both are optional
  // and fall back to the default cream theme when unset. Neither is ever applied
  // as a flat, fully-saturated fill — both blend into a deep neutral tone via a
  // gradient so any color/photo a business picks still reads as intentional and
  // matches the dark card sitting on top of it, instead of clashing with it.
  const pageBackgroundStyle: React.CSSProperties = business?.review_background_image
    ? {
        backgroundImage: `linear-gradient(165deg, rgba(15,11,8,0.35) 0%, rgba(15,11,8,0.85) 100%), url(${business.review_background_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : business?.brand_color
    ? { backgroundImage: `linear-gradient(165deg, ${business.brand_color} 0%, #15110d 100%)` }
    : { background: "var(--background)" };

  // Once a business sets a custom color/photo, the page background is always a
  // deep, dark tone by design (see the gradient above). In that case the card
  // becomes frosted glass — translucent + blurred — so it always looks
  // intentional against whatever's behind it, rather than a flat cream box
  // sitting on top. With no customization, it stays the plain cream card.
  const hasCustomBackground = !!(business?.review_background_image || business?.brand_color);
  const fg = hasCustomBackground ? "#f5f0e8" : "var(--foreground)";
  const fgSub = hasCustomBackground ? "rgba(245,240,232,0.75)" : "var(--text-sub)";
  const fgMuted = hasCustomBackground ? "rgba(245,240,232,0.55)" : "var(--text-muted)";
  const innerBorder = hasCustomBackground ? "1px solid rgba(255,255,255,0.14)" : "1px solid var(--card-border)";
  const cardStyle: React.CSSProperties = hasCustomBackground
    ? {
        background: "rgba(20,16,12,0.4)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: innerBorder,
      }
    : { background: "var(--card-bg)", border: innerBorder };

  return (
    <div
      className="min-h-screen font-sans flex items-center justify-center px-4 py-10"
      style={{ ...pageBackgroundStyle, color: "var(--foreground)" }}
    >
      <div className="w-full max-w-md">
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--brand)" }} />
          </div>
        )}

        {status === "not_found" && (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
          >
            <p className="text-base font-bold" style={{ color: "var(--foreground)" }}>
              We couldn&apos;t find this business
            </p>
            <p className="text-sm mt-2" style={{ color: "var(--text-sub)" }}>
              The QR code may be out of date. Please ask a staff member for help.
            </p>
          </div>
        )}

        {business && status !== "loading" && status !== "not_found" && (
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              ...cardStyle,
              boxShadow: "0 30px 70px -20px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            {/* Business header */}
            <div className="flex flex-col items-center text-center px-6 pt-9 pb-6">
              {photo ? (
                <Image
                  src={photo}
                  alt={business.name}
                  width={72}
                  height={72}
                  className="rounded-2xl object-cover mb-4"
                  style={{
                    width: 72,
                    height: 72,
                    boxShadow: "0 10px 28px rgba(0,0,0,0.3), 0 0 0 3px rgba(255,255,255,0.08)",
                  }}
                  unoptimized
                />
              ) : (
                <div
                  className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center mb-4"
                  style={{
                    background: "linear-gradient(160deg, rgba(201,123,58,0.22), rgba(201,123,58,0.08))",
                    boxShadow: "0 0 0 3px rgba(255,255,255,0.06)",
                  }}
                >
                  <StarIcon size={28} color="var(--brand)" fill="var(--brand)" />
                </div>
              )}
              <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--brand)" }}>
                clientIn
              </p>
              <h1 className="text-xl font-black leading-tight" style={{ color: fg }}>
                {business.name}
              </h1>
            </div>

            <div className="px-6 pb-8">
              {(status === "ready" || status === "submitting") && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <p className="text-sm text-center" style={{ color: fgSub }}>
                    How was your experience?
                  </p>
                  <StarRatingInput value={rating} onChange={setRating} disabled={status === "submitting"} />
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    disabled={status === "submitting"}
                    placeholder="Tell us more (optional)"
                    rows={4}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: innerBorder, color: fg }}
                  />
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    disabled={status === "submitting"}
                    placeholder="Your name (optional)"
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: innerBorder, color: fg }}
                  />
                  {error && (
                    <p className="text-sm rounded-xl px-4 py-3" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "submitting" || rating < 1}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold tracking-wide transition-all hover:opacity-90 disabled:opacity-60"
                    style={{
                      background: business.review_button_color || "var(--brand)",
                      color: business.review_button_text_color || "#fff",
                    }}
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                      </>
                    ) : (
                      "Submit review"
                    )}
                  </button>
                </form>
              )}

              {status === "submitted" && (
                <div className="flex flex-col items-center text-center gap-4">
                  <CheckCircle2 className="w-12 h-12" style={{ color: "#4ade80" }} />
                  <p className="text-base font-bold" style={{ color: fg }}>
                    Thanks for your review!
                  </p>
                  {business.google_maps_url && (
                    <>
                      <p className="text-sm" style={{ color: fgSub }}>
                        Mind sharing it on Google too? It really helps.
                      </p>
                      <button
                        onClick={handleGoogleReview}
                        className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold tracking-wide transition-all hover:opacity-90"
                        style={{ background: "rgba(255,255,255,0.06)", border: innerBorder, color: fg }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Also leave a Google review
                      </button>
                      {copied && (
                        <p className="text-xs" style={{ color: fgMuted }}>
                          Your review was copied — just paste it in on Google.
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {status === "cooldown" && (
                <div className="flex flex-col items-center text-center gap-3">
                  <CheckCircle2 className="w-12 h-12" style={{ color: "var(--brand)" }} />
                  <p className="text-base font-bold" style={{ color: fg }}>
                    You&apos;ve already reviewed this business today
                  </p>
                  <p className="text-sm" style={{ color: fgSub }}>
                    Thanks — come back tomorrow if you&apos;d like to leave another one.
                  </p>
                </div>
              )}
            </div>

            {/* Get the app */}
            <div
              className="flex items-center justify-center gap-3 px-6 py-4"
              style={{ borderTop: innerBorder }}
            >
              <p className="text-xs" style={{ color: fgMuted }}>Get the ClientIn app</p>
              <a
                href="https://apps.apple.com/ie/app/clientin/id6759510406"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download on the App Store"
                className="flex items-center justify-center w-8 h-8 rounded-full transition-opacity hover:opacity-80"
                style={{ background: "rgba(255,255,255,0.08)", border: innerBorder }}
              >
                <svg width="14" height="16" viewBox="0 0 22 26" fill="none" aria-hidden="true">
                  <path d="M18.068 13.825c-.03-3.22 2.63-4.77 2.75-4.845-1.5-2.192-3.83-2.49-4.655-2.52-1.975-.2-3.87 1.17-4.875 1.17-1.005 0-2.56-1.145-4.21-1.115-2.155.03-4.15 1.26-5.26 3.185-2.25 3.905-.575 9.685 1.62 12.855 1.075 1.555 2.35 3.3 4.025 3.235 1.62-.065 2.23-1.05 4.19-1.05 1.96 0 2.51 1.05 4.225 1.015 1.74-.03 2.845-1.575 3.91-3.135 1.24-1.79 1.745-3.545 1.77-3.635-.04-.015-3.39-1.305-3.42-5.16v-.005z" fill={fg} />
                  <path d="M14.8 4.38c.89-1.08 1.49-2.575 1.325-4.075-1.28.055-2.84.855-3.76 1.935-.825.955-1.55 2.495-1.355 3.965 1.43.11 2.89-.73 3.79-1.825z" fill={fg} />
                </svg>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.loyaltyhubapp.android"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get it on Google Play"
                className="flex items-center justify-center w-8 h-8 rounded-full transition-opacity hover:opacity-80"
                style={{ background: "rgba(255,255,255,0.08)", border: innerBorder }}
              >
                <svg width="14" height="15" viewBox="0 0 22 24" fill="none" aria-hidden="true">
                  <path d="M1.22 0.5C0.77 0.76 0.5 1.22 0.5 1.82v20.36c0 .6.27 1.06.72 1.32l.12.07 11.4-11.4v-.27L1.34 0.43l-.12.07z" fill={fg} />
                  <path d="M16.45 15.9l-3.79-3.79v-.27l3.8-3.8.08.05 4.5 2.56c1.28.73 1.28 1.92 0 2.65l-4.5 2.56-.09.04z" fill={fg} />
                  <path d="M16.54 15.86L12.66 12 1.22 23.5c.42.44 1.11.5 1.89.05l13.43-7.69" fill={fg} />
                  <path d="M16.54 8.14L3.11.45C2.33 0 1.64.06 1.22.5L12.66 12l3.88-3.86z" fill={fg} />
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
