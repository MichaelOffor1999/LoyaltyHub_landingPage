import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ── Rate limiter (in-memory, resets on deploy) ──────────────────────────────
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 5;   // per IP per window
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > MAX_REQUESTS;
}

// ── Email validation ────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const { email, website } = await req.json();

    // Honeypot — bots fill the hidden "website" field, real users don't
    if (website) {
      // Silently accept so bots think it worked
      return NextResponse.json({ success: true });
    }

    // Validate email format
    if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const { error } = await supabase
      .from("waitlist_signups")
      .insert({ email: email.trim().toLowerCase(), source: "landing_page" });

    if (error) {
      // Unique violation = already signed up
      if (error.code === "23505") {
        return NextResponse.json({ error: "Already on the waitlist!" }, { status: 409 });
      }
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
