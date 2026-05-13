"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-display font-black text-white mb-2">Privacy Policy</h1>
      <p className="text-white/40 mb-8">Last updated: March 17, 2026</p>

      <div className="prose prose-invert max-w-none space-y-8 text-white/70 text-base leading-relaxed">
        <section>
          <h2 className="text-2xl font-display font-bold text-white">1. Information We Collect</h2>
          <h3 className="text-lg font-display font-bold text-white/80 mt-4">Account Information</h3>
          <p>When you create an account, we collect your email address, username, and password (stored securely using bcrypt hashing). If you sign up via Google or Discord, we receive your name, email, and profile picture from those services.</p>
          
          <h3 className="text-lg font-display font-bold text-white/80 mt-4">Seller Information</h3>
          <p>If you register as a seller, Stripe Connect collects additional information including your legal name, address, date of birth, and bank account details. This information is processed and stored by Stripe — we do not store your bank account or tax identification numbers on our servers.</p>

          <h3 className="text-lg font-display font-bold text-white/80 mt-4">Transaction Information</h3>
          <p>We record details of transactions including items purchased, prices, shipping addresses, and tracking information.</p>

          <h3 className="text-lg font-display font-bold text-white/80 mt-4">Usage Information</h3>
          <p>We collect information about how you use the Platform, including pages visited, search queries, listings viewed, and device/browser information.</p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-white">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Process transactions and facilitate communication between buyers and sellers</li>
            <li>Send order confirmations, shipping updates, and dispute notifications</li>
            <li>Improve and personalize your experience on the Platform</li>
            <li>Detect and prevent fraud, abuse, and violations of our Terms</li>
            <li>Comply with legal obligations</li>
            <li>Send marketing communications (with your consent; you may opt out at any time)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-white">3. Information Sharing</h2>
          <p>We do not sell your personal information. We share information only as follows:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>With other users:</strong> Your username, display name, rating, and listing information are visible to other users. Shipping address is shared with sellers when you make a purchase.</li>
            <li><strong>With Stripe:</strong> Payment and identity verification data is processed by Stripe under their <a href="https://stripe.com/privacy" className="text-hex hover:text-hex-light" target="_blank" rel="noopener">Privacy Policy</a>.</li>
            <li><strong>Legal requirements:</strong> We may disclose information when required by law or to protect our rights.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-white">4. Data Security</h2>
          <p>We use industry-standard security measures including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>HTTPS encryption for all data in transit</li>
            <li>Bcrypt password hashing</li>
            <li>JWT-based authentication with short-lived access tokens</li>
            <li>Stripe handles all payment card data (we never see or store card numbers)</li>
          </ul>
          <p>No system is 100% secure. We cannot guarantee the absolute security of your information.</p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-white">5. Your Rights</h2>
          <p>You may:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access and update your account information at any time</li>
            <li>Request deletion of your account and associated data</li>
            <li>Opt out of marketing communications</li>
            <li>Request a copy of your data</li>
          </ul>
          <p>To exercise these rights, contact us at <span className="text-hex">privacy@bobatrader.com</span></p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-white">6. Cookies</h2>
          <p>We use localStorage (not cookies) to maintain your session and cart. We may use analytics cookies in the future, at which point this policy will be updated.</p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-white">7. Children&apos;s Privacy</h2>
          <p>The Platform is not intended for users under 13. We do not knowingly collect information from children under 13. If you believe a child has provided us with personal information, contact us and we will delete it.</p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-white">8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on the Platform and updating the &quot;Last updated&quot; date.</p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-white">9. Contact</h2>
          <p>Questions about this Privacy Policy? Contact us at <span className="text-hex">privacy@bobatrader.com</span></p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-white/10 flex gap-4">
        <Link href="/terms" className="text-hex hover:text-hex-light font-display uppercase tracking-wider text-sm">Terms of Service →</Link>
        <Link href="/seller-agreement" className="text-hex hover:text-hex-light font-display uppercase tracking-wider text-sm">Seller Agreement →</Link>
      </div>
    </div>
  );
}
