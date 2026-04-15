import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Parse .env.local manually
const env = readFileSync(".env.local", "utf-8");
const vars = Object.fromEntries(
  env.split("\n")
    .filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => [l.split("=")[0].trim(), l.split("=").slice(1).join("=").trim()])
);

const SUPABASE_URL = vars["SUPABASE_URL"];
const SERVICE_KEY = vars["SUPABASE_SERVICE_ROLE_KEY"];

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const { data: users, error: ue } = await supabase.auth.admin.listUsers({ perPage: 200 });
if (ue) { console.error("auth error:", ue.message); process.exit(1); }

const user = users.users.find(u => u.email === "sofoladaniel1@gmail.com");
if (!user) { console.log("User sofoladaniel1@gmail.com NOT FOUND in auth"); process.exit(0); }
console.log("Found user:", user.id, user.email);

const { data, error } = await supabase
  .from("businesses")
  .select("id, name, verification_status, subscription_status, owner_id")
  .eq("owner_id", user.id);

if (error) { console.error("DB error:", error.message); process.exit(1); }
console.log("Business rows:", JSON.stringify(data, null, 2));
