import Link from "next/link";

export const metadata = {
  title: "Page Not Found – Clienty",
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f4ef",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "2rem",
        textAlign: "center" as const,
      }}
    >
      <span
        style={{ fontSize: "5rem", lineHeight: 1, marginBottom: "0.5rem" }}
        aria-hidden="true"
      >
        🤝
      </span>
      <h1
        style={{
          fontSize: "clamp(2rem, 6vw, 3.5rem)",
          fontWeight: 800,
          color: "#111827",
          margin: "0.5rem 0",
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: "1.15rem",
          color: "#6b7280",
          maxWidth: 420,
          marginBottom: "2rem",
        }}
      >
        Oops — this page doesn&apos;t exist. Let&apos;s get you back on track.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "14px 32px",
          background: "#c97b3a",
          color: "#fff",
          fontWeight: 700,
          fontSize: "1rem",
          borderRadius: 12,
          textDecoration: "none",
          transition: "background 0.2s",
        }}
      >
        ← Back to Home
      </Link>
    </div>
  );
}
