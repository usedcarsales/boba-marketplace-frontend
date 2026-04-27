"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-display font-black text-white mb-2">Terms of Service</h1>
      <p className="text-white/40 mb-8">Last updated: March 17, 2026</p>

      <div className="prose prose-invert max-w-none space-y-8 text-white/70 text-base leading-relaxed">
        <section>
          <h2 className="text-2xl font-display font-bold text-white">1. Acceptance of Terms</h2>
          <p>By accessing or using BoBA Market (&quot;the Platform&quot;), operated by BoBA Market (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the Platform.</p>
          <p>We reserve the right to modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the modified Terms.</p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-white">2. Description of Service</h2>
          <p>BoBA Market is an online marketplace for buying and selling Bo Jackson Battle Arena (BoBA) trading cards. We provide a platform that connects buyers and sellers — we do not own, possess, or inspect the cards listed on our Platform.</p>
          <p>We are a marketplace facilitator, not a party to transactions between buyers and sellers.</p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-white">3. Account Registration</h2>
          <p>To use certain features, you must create an account. You agree to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain the security of your password and account</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Be at least 18 years old or have parental/guardian consent</li>
            <li>Not create multiple accounts for deceptive purposes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-white">4. Buying on BoBA Market</h2>
          <p>When you purchase a card through our Platform:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>You are entering into a transaction with the seller, not with BoBA Market</li>
            <li>Payment is processed through Stripe, our third-party payment processor</li>
            <li>Your payment is held until delivery is confirmed or the delivery window closes</li>
            <li>You have 7 days after delivery to report any issues with your order</li>
            <li>Refund eligibility is subject to our <Link href="/buyer-protection" className="text-hex hover:text-hex-light">Buyer Protection Policy</Link></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-white">5. Selling on BoBA Market</h2>
          <p>Sellers must agree to our <Link href="/seller-agreement" className="text-hex hover:text-hex-light">Seller Agreement</Link> and complete Stripe Connect onboarding. By listing cards, you agree to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Only list cards you physically possess and own</li>
            <li>Accurately describe card condition using our grading standards</li>
            <li>Ship within 48 hours of a confirmed sale</li>
            <li>Provide valid tracking information</li>
            <li>Accept our fee structure (8% platform fee + $0.25 per order + payment processing fees)</li>
            <li>Not engage in price manipulation, shill bidding, or self-dealing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-white">6. Fees</h2>
          <p><strong>Buyers:</strong> No platform fees. You pay the listed price plus any applicable shipping.</p>
          <p><strong>Sellers:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Listing fee:</strong> Free</li>
            <li><strong>Platform fee:</strong> 8% of the sale price + $0.25 per order, deducted at time of sale</li>
            <li><strong>Payment processing:</strong> ~2.9% + $0.30 per transaction (Stripe fees), deducted at time of sale</li>
            <li><strong>Featured listings:</strong> Optional — $1.00/week for enhanced visibility</li>
          </ul>
          <p>All fees are subject to change with 30 days&apos; notice.</p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-white">7. Prohibited Conduct</h2>
          <p>You may not:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>List counterfeit, stolen, or misrepresented cards</li>
            <li>Manipulate prices, ratings, or search results</li>
            <li>Harass, threaten, or abuse other users</li>
            <li>Circumvent our fee structure or payment system</li>
            <li>Use automated tools to scrape data or create listings</li>
            <li>Violate any applicable law or regulation</li>
            <li>Create false or misleading listings</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-white">8. Dispute Resolution</h2>
          <p>If a dispute arises between a buyer and seller:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>We encourage users to resolve disputes directly first</li>
            <li>Either party may open a dispute through the Platform within 7 days of delivery</li>
            <li>We will review evidence from both parties and make a determination</li>
            <li>Our determination is final and binding for transactions on the Platform</li>
            <li>Repeated disputes may result in account restrictions or termination</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-white">9. Intellectual Property</h2>
          <p>Bo Jackson Battle Arena, BoBA, and related card images and names are trademarks of their respective owners. BoBA Market is an independent third-party marketplace and is not affiliated with, endorsed by, or sponsored by the creators of Bo Jackson Battle Arena.</p>
          <p>Card images displayed on our Platform are sourced from publicly available databases for reference purposes.</p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-white">10. Limitation of Liability</h2>
          <p>THE PLATFORM IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>We are not liable for the quality, safety, or legality of cards listed</li>
            <li>We are not liable for the ability of sellers to sell or buyers to pay</li>
            <li>We are not liable for any indirect, incidental, or consequential damages</li>
            <li>Our total liability shall not exceed the fees you paid to us in the preceding 12 months</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-white">11. Account Termination</h2>
          <p>We may suspend or terminate your account at our sole discretion for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Violation of these Terms or the Seller Agreement</li>
            <li>Fraudulent or illegal activity</li>
            <li>Excessive disputes or chargebacks</li>
            <li>Extended inactivity (12+ months)</li>
          </ul>
          <p>You may close your account at any time, subject to completing any pending transactions.</p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-white">12. Governing Law</h2>
          <p>These Terms are governed by the laws of the State of New Jersey, without regard to conflict of law provisions. Any disputes shall be resolved in the courts of New Jersey.</p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-white">13. Contact</h2>
          <p>Questions about these Terms? Contact us at <span className="text-hex">support@bobamarket.gg</span></p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-white/10 flex gap-4">
        <Link href="/privacy" className="text-hex hover:text-hex-light font-display uppercase tracking-wider text-sm">Privacy Policy →</Link>
        <Link href="/seller-agreement" className="text-hex hover:text-hex-light font-display uppercase tracking-wider text-sm">Seller Agreement →</Link>
      </div>
    </div>
  );
}
