export default function Privacy() {
  return (
    <div className="min-h-screen" style={{ background: "#f7f4ef" }}>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-10">
          <a href="/" className="text-sm font-semibold" style={{ color: "#c97b3a" }}>← Back to Clienty</a>
        </div>
        <h1 className="text-4xl font-black mb-3" style={{ color: "#111827" }}>Privacy Policy</h1>
        <p className="text-sm mb-12" style={{ color: "#9ca3af" }}>Last updated: February 2026</p>

        <div className="flex flex-col gap-10" style={{ color: "#374151" }}>
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>1. Who We Are</h2>
            <p className="text-base leading-relaxed">Clienty (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a digital loyalty platform operated by Clienty Ltd. This Privacy Policy explains how we collect, use, and protect your personal information when you use our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>2. Information We Collect</h2>
            <ul className="text-base leading-relaxed flex flex-col gap-2 list-disc list-inside">
              <li><strong>Account information:</strong> name, email address, and password when you register.</li>
              <li><strong>Business information:</strong> business name, address, and contact details for business accounts.</li>
              <li><strong>Usage data:</strong> visits, stamps collected, rewards redeemed, and in-app activity.</li>
              <li><strong>Device data:</strong> device type, operating system, and push notification tokens where you grant permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>3. How We Use Your Information</h2>
            <ul className="text-base leading-relaxed flex flex-col gap-2 list-disc list-inside">
              <li>To operate and improve the Clienty platform.</li>
              <li>To send push notifications about rewards and offers (only with your consent).</li>
              <li>To provide businesses with anonymised analytics about visit trends and customer behaviour.</li>
              <li>To contact you about your account or respond to support requests.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>4. Data Sharing</h2>
            <p className="text-base leading-relaxed">We do not sell your personal data. We share data only with the business whose loyalty programme you have joined (e.g. visit history relevant to that programme), and with service providers necessary to operate the platform (e.g. hosting, analytics). All third parties are contractually bound to protect your data.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>5. Data Retention</h2>
            <p className="text-base leading-relaxed">We retain your data for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>6. Your Rights</h2>
            <p className="text-base leading-relaxed">Under UK GDPR you have the right to access, correct, or delete your personal data; to object to or restrict processing; and to data portability. To exercise any of these rights, contact us at <a href="mailto:hello@clienty.app" style={{ color: "#c97b3a", textDecoration: "underline" }}>hello@clienty.app</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>7. Cookies</h2>
            <p className="text-base leading-relaxed">Our website uses only essential cookies required for the site to function. We do not use advertising or tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>8. Security</h2>
            <p className="text-base leading-relaxed">We use industry-standard encryption and security practices to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>9. Changes to This Policy</h2>
            <p className="text-base leading-relaxed">We may update this Privacy Policy periodically. We will notify you of significant changes via email or in-app notification. Continued use of the Service after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>10. Contact</h2>
            <p className="text-base leading-relaxed">For any privacy-related queries, contact us at <a href="mailto:hello@clienty.app" style={{ color: "#c97b3a", textDecoration: "underline" }}>hello@clienty.app</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
