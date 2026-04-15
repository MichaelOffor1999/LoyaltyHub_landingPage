// Force this route to always be server-rendered on demand (never statically cached).
// This must live in a server component — "use client" files cannot export route config.
export const dynamic = "force-dynamic";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
