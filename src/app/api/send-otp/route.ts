/**
 * POST /api/send-otp
 * Sends a 6-digit OTP email via Supabase Auth (email OTP, not magic link).
 * Uses the anon key so Supabase applies the correct rate-limiting and templates.
 */
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://elyonkqglhsrzafbanph.supabase.co";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!anonKey) {
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    // Use the anon client — signInWithOtp sends a 6-digit code when
    // "Email OTP" is enabled in Supabase Auth settings.
    const supabase = createClient(SUPABASE_URL, anonKey);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    if (error) {
      console.error("[send-otp] error:", error.message);
      return NextResponse.json(
        { error: error.message || "Failed to send verification code." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[send-otp] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
