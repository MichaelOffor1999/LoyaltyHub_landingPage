import Link from "next/link";

export default function Privacy() {
  return (
    <div className="min-h-screen" style={{ background: "#f7f4ef" }}>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-10">
          <Link href="/" className="text-sm font-semibold" style={{ color: "#c97b3a" }}>← Back to clientIn</Link>
        </div>
        <h1 className="text-4xl font-black mb-3" style={{ color: "#111827" }}>Privacy Policy</h1>
        <p className="text-sm mb-12" style={{ color: "#9ca3af" }}>Last updated: May 2026</p>

        <div className="flex flex-col gap-10" style={{ color: "#374151" }}>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>1. Who We Are</h2>
            <p className="text-base leading-relaxed">
              clientIn (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a digital loyalty platform operated by clientIn Ltd. This Privacy Policy explains how we collect, use, and protect your personal information when you use our services.
            </p>
            <p className="text-base leading-relaxed mt-3">
              For the purposes of GDPR (EU) 2016/679, clientIn Ltd is the data controller. You can contact us at{" "}
              <a href="mailto:hello@clientin.co" className="underline" style={{ color: "#c97b3a" }}>hello@clientin.co</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>2. Information We Collect</h2>
            <ul className="text-base leading-relaxed flex flex-col gap-2 list-disc list-inside">
              <li><strong>Account information:</strong> name, email address, and password when you register.</li>
              <li><strong>Contact information:</strong> phone number, where provided, used to enable WhatsApp-based communications and AI-assisted support.</li>
              <li><strong>Business information:</strong> business name, address, and contact details for business accounts.</li>
              <li><strong>Usage data:</strong> visits, stamps collected, rewards redeemed, and in-app activity.</li>
              <li><strong>Device data:</strong> device type, operating system, and push notification tokens where you grant permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>3. How We Use Your Information</h2>
            <ul className="text-base leading-relaxed flex flex-col gap-2 list-disc list-inside">
              <li>To operate and improve the clientIn platform.</li>
              <li>To send push notifications about rewards and offers (only with your consent).</li>
              <li>To provide businesses with anonymised analytics about visit trends and customer behaviour.</li>
              <li>To contact you about your account or respond to support requests.</li>
              <li>To enable WhatsApp-based communications, including AI-assisted responses to your enquiries.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>4. AI-Assisted Features</h2>
            <p className="text-base leading-relaxed">
              clientIn uses AI-assisted tools to help respond to customer enquiries via WhatsApp. When you interact with this feature, your messages may be processed by AI systems to generate responses. You will always be informed when you are interacting with an AI-assisted service. You can opt out of WhatsApp communications at any time by contacting us at{" "}
              <a href="mailto:hello@clientin.co" className="underline" style={{ color: "#c97b3a" }}>hello@clientin.co</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>5. Data Sharing</h2>
            <p className="text-base leading-relaxed">
              We do not sell your personal data. We share data only with:
            </p>
            <ul className="text-base leading-relaxed flex flex-col gap-2 list-disc list-inside mt-3">
              <li>The business whose loyalty programme you have joined (e.g. visit history relevant to that programme).</li>
              <li>Service providers necessary to operate the platform (e.g. hosting, analytics, messaging). All third parties are contractually bound to protect your data in accordance with GDPR.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>6. Data Retention</h2>
            <p className="text-base leading-relaxed">
              We retain your personal data for as long as your account is active, and for up to 2 years following your last activity or account deletion request. You may request deletion of your account and all associated data at any time by contacting us at{" "}
              <a href="mailto:hello@clientin.co" className="underline" style={{ color: "#c97b3a" }}>hello@clientin.co</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>7. Your Rights</h2>
            <p className="text-base leading-relaxed mb-3">
              Under GDPR (EU) 2016/679 and applicable data protection law, you have the right to:
            </p>
            <ul className="text-base leading-relaxed flex flex-col gap-2 list-disc list-inside">
              <li><strong>Access</strong> the personal data we hold about you.</li>
              <li><strong>Correct</strong> inaccurate or incomplete data.</li>
              <li><strong>Delete</strong> your personal data (&quot;right to be forgotten&quot;).</li>
              <li><strong>Object to or restrict</strong> how we process your data.</li>
              <li><strong>Data portability</strong> — receive your data in a machine-readable format.</li>
              <li><strong>Withdraw consent</strong> at any time where processing is based on consent.</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:hello@clientin.co" className="underline" style={{ color: "#c97b3a" }}>hello@clientin.co</a>.
              You also have the right to lodge a complaint with the <strong>Data Protection Commission (DPC)</strong> in Ireland at{" "}
              <a href="https://www.dataprotection.ie" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#c97b3a" }}>www.dataprotection.ie</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>8. Cookies</h2>
            <p className="text-base leading-relaxed">
              Our website uses only essential cookies required for the site to function. We do not use advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>9. Security</h2>
            <p className="text-base leading-relaxed">
              We use industry-standard encryption and security practices to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>10. Changes to This Policy</h2>
            <p className="text-base leading-relaxed">
              We may update this Privacy Policy periodically. We will notify you of significant changes via email or in-app notification. The date at the top of this page reflects the most recent update.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>11. Contact</h2>
            <p className="text-base leading-relaxed">
              For any privacy-related queries, contact us at{" "}
              <a href="mailto:hello@clientin.co" className="underline" style={{ color: "#c97b3a" }}>hello@clientin.co</a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
