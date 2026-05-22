import Link from "next/link";

export default function Terms() {
  return (
    <div className="min-h-screen" style={{ background: "#f7f4ef" }}>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-10">
          <Link href="/" className="text-sm font-semibold" style={{ color: "#c97b3a" }}>← Back to clientIn</Link>
        </div>
        <h1 className="text-4xl font-black mb-3" style={{ color: "#111827" }}>Terms of Service</h1>
        <p className="text-sm mb-12" style={{ color: "#9ca3af" }}>Last updated: May 2026</p>

        <div className="flex flex-col gap-10" style={{ color: "#374151" }}>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>1. Acceptance of Terms</h2>
            <p className="text-base leading-relaxed">
              By accessing or using clientIn (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>2. Description of Service</h2>
            <p className="text-base leading-relaxed">
              clientIn provides a digital loyalty programme platform for businesses and their customers. Businesses can create and manage loyalty programmes; customers can collect stamps and redeem rewards through the mobile application. The Service also includes an optional AI-assisted WhatsApp communication feature for businesses to engage with customers. Use of this feature is subject to WhatsApp&apos;s terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>3. User Accounts</h2>
            <p className="text-base leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must notify us immediately of any unauthorised use of your account at{" "}
              <a href="mailto:hello@clientin.co" className="underline" style={{ color: "#c97b3a" }}>hello@clientin.co</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>4. Acceptable Use</h2>
            <p className="text-base leading-relaxed">
              You agree not to misuse the Service, including but not limited to: fraudulently claiming rewards, creating false accounts, or interfering with the normal operation of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>5. Intellectual Property</h2>
            <p className="text-base leading-relaxed">
              All content, branding, and technology within clientIn remain the intellectual property of clientIn Ltd. You may not reproduce or distribute any part of the Service without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>6. Termination</h2>
            <p className="text-base leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate these terms, at our sole discretion. Where possible, we will provide notice before termination unless the violation requires immediate action.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>7. Limitation of Liability</h2>
            <p className="text-base leading-relaxed">
              clientIn is provided &quot;as is.&quot; To the fullest extent permitted by applicable law, clientIn Ltd shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. Nothing in these Terms limits our liability for death, personal injury caused by negligence, fraud, or any other liability that cannot be excluded under Irish or EU law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>8. Changes to Terms</h2>
            <p className="text-base leading-relaxed">
              We may update these Terms from time to time. We will notify you of significant changes via email or in-app notification at least 14 days before they take effect. Continued use of the Service after that period constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>9. Contact</h2>
            <p className="text-base leading-relaxed">
              For any questions about these Terms, please contact us at{" "}
              <a href="mailto:hello@clientin.co" className="underline" style={{ color: "#c97b3a" }}>hello@clientin.co</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>10. Business Video Content</h2>
            <p className="text-base leading-relaxed mb-4">
              Businesses on ClientIn may upload short promotional videos (&quot;Business Videos&quot;) to their profile for display to customers on the platform.
            </p>
            <p className="text-base font-semibold mb-2">By uploading a Business Video, you agree that:</p>
            <ol className="text-base leading-relaxed flex flex-col gap-2 list-decimal list-inside mb-4">
              <li>You own all rights to the video content, or have obtained all necessary licences, consents, and permissions from any individuals, rights holders, or third parties featured in or associated with the video.</li>
              <li>The video does not contain content that is unlawful, defamatory, obscene, misleading, or in violation of any third-party intellectual property rights.</li>
              <li>You grant ClientIn a non-exclusive, royalty-free, worldwide licence to host, display, and distribute the video solely for the purpose of operating the platform.</li>
              <li>You are solely responsible for any claims arising from the content of your video.</li>
              <li>Videos must not contain contact details, third-party URLs, or any content designed to redirect customers away from the platform in an unsanctioned manner.</li>
            </ol>
            <p className="text-base leading-relaxed mb-4">
              <strong>ClientIn reserves the right to remove any Business Video at its sole discretion, without notice, if it reasonably believes the content violates these Terms or applicable law.</strong>
            </p>
            <p className="text-base leading-relaxed">
              Video content is stored and delivered via Cloudflare Stream. By uploading a video, you acknowledge that it will be processed and hosted on Cloudflare&apos;s infrastructure in accordance with Cloudflare&apos;s terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>11. Video Analytics</h2>
            <p className="text-base leading-relaxed">
              When customers view a Business Video, ClientIn may collect anonymised engagement data including view counts, video completion rates, profile visits, and booking link taps (&quot;Video Analytics&quot;). This data is provided to the business owner solely for the purpose of measuring promotional performance. Video Analytics exclude activity by the business owner themselves. ClientIn makes no warranties as to the absolute accuracy of Video Analytics data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>12. Governing Law</h2>
            <p className="text-base leading-relaxed">
              These Terms are governed by the laws of Ireland. Any disputes shall be subject to the exclusive jurisdiction of the Irish courts. If you are an EU consumer, you may also have rights under the laws of your country of residence. You may also use the EU Online Dispute Resolution platform at{" "}
              <a href="https://www.ccpc.ie" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#c97b3a" }}>https://www.ccpc.ie</a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
