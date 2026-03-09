import Link from "next/link";

export default function Terms() {
  return (
    <div className="min-h-screen" style={{ background: "#f7f4ef" }}>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-10">
          <Link href="/" className="text-sm font-semibold" style={{ color: "#c97b3a" }}>← Back to clientIn</Link>
        </div>
        <h1 className="text-4xl font-black mb-3" style={{ color: "#111827" }}>Terms of Service</h1>
        <p className="text-sm mb-12" style={{ color: "#9ca3af" }}>Last updated: February 2026</p>

        <div className="flex flex-col gap-10" style={{ color: "#374151" }}>
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>1. Acceptance of Terms</h2>
            <p className="text-base leading-relaxed">By accessing or using clientIn (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>2. Description of Service</h2>
            <p className="text-base leading-relaxed">clientIn provides a digital loyalty programme platform for businesses and their customers. Businesses can create and manage loyalty programmes; customers can collect stamps and redeem rewards through the mobile application.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>3. User Accounts</h2>
            <p className="text-base leading-relaxed">You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must notify us immediately of any unauthorised use of your account.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>4. Acceptable Use</h2>
            <p className="text-base leading-relaxed">You agree not to misuse the Service, including but not limited to: fraudulently claiming rewards, creating false accounts, or interfering with the normal operation of the platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>5. Intellectual Property</h2>
            <p className="text-base leading-relaxed">All content, branding, and technology within clientIn remain the intellectual property of clientIn Ltd. You may not reproduce or distribute any part of the Service without prior written consent.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>6. Termination</h2>
            <p className="text-base leading-relaxed">We reserve the right to suspend or terminate accounts that violate these terms, at our sole discretion and without prior notice.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>7. Limitation of Liability</h2>
            <p className="text-base leading-relaxed">clientIn is provided &quot;as is&quot; without warranties of any kind. To the fullest extent permitted by law, clientIn Ltd shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>8. Changes to Terms</h2>
            <p className="text-base leading-relaxed">We may update these Terms from time to time. Continued use of the Service after changes are posted constitutes your acceptance of the revised Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>9. Contact</h2>
            <p className="text-base leading-relaxed">For any questions about these Terms, please contact us at <a href="mailto:hello@clientin.co" style={{ color: "#c97b3a", textDecoration: "underline" }}>hello@clientin.co</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
