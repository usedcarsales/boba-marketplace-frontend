"use client";

import Link from "next/link";

const TIERS = [
  { name: "Steel", emoji: "🔩", fee: "8%", volume: "$0–$99", rating: "—", slots: "10", color: "#71717A", perks: "Basic profile" },
  { name: "Fire", emoji: "🔥", fee: "8%", volume: "$100–$499", rating: "4.0★", slots: "25", color: "#EF4444", perks: "Verified badge, Bulk listing tool" },
  { name: "Ice", emoji: "🧊", fee: "8%", volume: "$500–$1,999", rating: "4.2★", slots: "75", color: "#38BDF8", perks: "Priority search, Custom bio" },
  { name: "Glow", emoji: "✨", fee: "7%", volume: "$2,000–$4,999", rating: "4.5★", slots: "150", color: "#79F528", perks: "Fee reduction, Flash Sale access" },
  { name: "Hex", emoji: "🔮", fee: "6%", volume: "$5,000–$9,999", rating: "4.5★", slots: "300", color: "#A855F7", perks: "Custom storefront, Early features" },
  { name: "Super", emoji: "⚡", fee: "5%", volume: "$10,000+", rating: "4.7★", slots: "Unlimited", color: "#FBBF24", perks: "Homepage spotlight, Partner eligible" },
];

export default function SellerAgreementPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-display font-black text-white mb-2">Seller Agreement</h1>
      <p className="text-white/40 mb-8">Last updated: March 20, 2026 · Version 2.0</p>

      <div className="card border border-hex/30 bg-hex/5 p-6 mb-8">
        <p className="text-white/80 text-lg">This Seller Agreement (&quot;Agreement&quot;) is a binding contract between you (&quot;Seller&quot;) and BoBA Market (&quot;Platform,&quot; &quot;we,&quot; &quot;us&quot;). By completing seller onboarding and listing cards for sale, you agree to all terms below in addition to our <Link href="/terms" className="text-hex hover:text-hex-light font-bold">Terms of Service</Link> and <Link href="/privacy" className="text-hex hover:text-hex-light font-bold">Privacy Policy</Link>.</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-10 text-white/70 text-base leading-relaxed">

        {/* 1. ELIGIBILITY */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white">1. Seller Eligibility</h2>
          <p>To sell on BoBA Market, you must:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Be at least 18 years old (or the age of majority in your jurisdiction)</li>
            <li>Reside in a country supported by Stripe Connect</li>
            <li>Complete identity verification through Stripe</li>
            <li>Provide a valid bank account for payouts</li>
            <li>Comply with all applicable local, state, and federal laws regarding online sales, tax obligations, and consumer protection</li>
            <li>Maintain only one seller account (no duplicate or shill accounts)</li>
          </ul>
          <p>You are not required to be a registered business. Individuals may sell as sole proprietors. You are responsible for any business licenses or tax registrations required in your jurisdiction.</p>
        </section>

        {/* 2. LISTING STANDARDS */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white">2. Listing Standards</h2>

          <h3 className="text-lg font-display font-bold text-white/80 mt-4">2.1 Accuracy</h3>
          <p>All listings must accurately represent the card being sold. You must:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Select the correct card from our database (name, set, year, parallel)</li>
            <li>Accurately grade the condition using our standard scale</li>
            <li>Upload clear, actual photos of the specific card you are selling</li>
            <li>Disclose any defects, damage, or characteristics not captured by the condition grade</li>
            <li>For graded cards: accurately report the grading company, grade, and certification number</li>
          </ul>

          <h3 className="text-lg font-display font-bold text-white/80 mt-4">2.2 Condition Grading Scale</h3>
          <p>BoBA Market uses the industry-standard TCG grading scale:</p>
          <div className="space-y-3 mt-3">
            <div className="card border border-white/10 p-3">
              <span className="font-display font-bold text-glow">NM — Near Mint</span>
              <p className="text-sm mt-1">Perfect or near-perfect condition. No visible wear, scratches, or whitening. Corners are sharp. Expected condition for cards fresh from a pack.</p>
            </div>
            <div className="card border border-white/10 p-3">
              <span className="font-display font-bold text-ice">LP — Lightly Played</span>
              <p className="text-sm mt-1">Minor edge wear, light scratches visible at an angle, or slight corner whitening. Card is still in very good condition and fully playable.</p>
            </div>
            <div className="card border border-white/10 p-3">
              <span className="font-display font-bold text-super">MP — Moderately Played</span>
              <p className="text-sm mt-1">Noticeable wear including edge wear, scratches visible from arm&apos;s length, minor creasing, or moderate whitening. Structurally sound.</p>
            </div>
            <div className="card border border-white/10 p-3">
              <span className="font-display font-bold text-brawl">HP — Heavily Played</span>
              <p className="text-sm mt-1">Significant wear including major creases, heavy whitening, bent corners, or scuffing. Card is identifiable and complete.</p>
            </div>
            <div className="card border border-white/10 p-3">
              <span className="font-display font-bold text-fire">DMG — Damaged</span>
              <p className="text-sm mt-1">Major damage: tears, water damage, significant bends, missing pieces, or writing/stickers on the card.</p>
            </div>
          </div>

          <h3 className="text-lg font-display font-bold text-white/80 mt-4">2.3 Prohibited Listings</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Counterfeit, proxy, or reproduction cards</strong> — zero tolerance (see Section 11)</li>
            <li>Cards you do not own or physically possess</li>
            <li>Pre-sale listings for unreleased products</li>
            <li>Listings with misleading photos, descriptions, or condition grades</li>
            <li>Trimmed, altered, or tampered cards not disclosed as such</li>
            <li>Counterfeit graded slabs or altered certification labels</li>
            <li>Non-Bo Jackson Battle Arena items</li>
            <li>Listings designed to manipulate search results or pricing data</li>
          </ul>
        </section>

        {/* 3. PRICING */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white">3. Pricing</h2>
          <p>You set your own prices. We recommend checking recent sales data on the Platform for competitive pricing. We do not impose minimum or maximum prices.</p>
          <p className="mt-2"><strong>Prohibited pricing conduct:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Artificially inflating prices through fake or coordinated purchases</li>
            <li>Shill bidding or shill buying to manipulate market data</li>
            <li>Coordinated pricing schemes with other sellers</li>
            <li>Listing at unreasonably high prices to reserve card slots without intent to sell</li>
          </ul>
        </section>

        {/* 4. FEES & PAYMENT */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white">4. Fees & Payment</h2>

          <h3 className="text-lg font-display font-bold text-white/80 mt-4">4.1 Fee Structure</h3>
          <div className="card border border-white/10 p-4 mt-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Listing fee</span>
                <span className="font-display font-bold text-glow">Free — always</span>
              </div>
              <div className="flex justify-between">
                <span>Platform fee (on sale)</span>
                <span className="font-display font-bold text-white">8% of sale price (varies by tier)</span>
              </div>
              <div className="flex justify-between">
                <span>Per-order fee</span>
                <span className="font-display font-bold text-white">$0.25 per order</span>
              </div>
              <div className="flex justify-between">
                <span>Payment processing (Stripe)</span>
                <span className="font-display font-bold text-white">~2.9% + $0.30</span>
              </div>
              <div className="border-t border-white/10 pt-2 mt-2 flex justify-between">
                <span className="font-bold">Example: $10.00 sale (Steel tier)</span>
                <span className="font-display font-bold text-super">You receive: $8.16</span>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-display font-bold text-white/80 mt-4">4.2 Fee Changes</h3>
          <p>We will provide at least <strong>30 days advance written notice</strong> before any fee increase. Fee reductions take effect immediately. Notice will be sent via email and displayed on the Platform.</p>

          <h3 className="text-lg font-display font-bold text-white/80 mt-4">4.3 Payouts</h3>
          <p>Payouts are processed by Stripe to your connected bank account. Standard payout schedule is <strong>2 business days</strong> after a sale is confirmed delivered. Stripe may impose additional holds per their terms.</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>New sellers may experience an initial hold of up to <strong>7 days</strong> during account verification</li>
            <li>Holds for open disputes are limited to the <strong>disputed transaction amount only</strong> — we will not freeze your entire balance</li>
            <li>If your account is suspended, pending payouts are held for <strong>90 days</strong> to cover potential refunds, then released</li>
          </ul>
        </section>

        {/* 5. SELLER TIER SYSTEM */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white">5. Seller Tier System</h2>
          <p>BoBA Market operates a 6-tier seller progression system based on your trailing 30-day sales volume and buyer feedback rating. Higher tiers unlock lower fees, more listing slots, and additional tools.</p>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-2 font-display text-white/60 uppercase text-xs">Tier</th>
                  <th className="text-left p-2 font-display text-white/60 uppercase text-xs">Fee</th>
                  <th className="text-left p-2 font-display text-white/60 uppercase text-xs">30-Day Volume</th>
                  <th className="text-left p-2 font-display text-white/60 uppercase text-xs">Min Rating</th>
                  <th className="text-right p-2 font-display text-white/60 uppercase text-xs">Slots</th>
                  <th className="text-left p-2 font-display text-white/60 uppercase text-xs">Key Perks</th>
                </tr>
              </thead>
              <tbody>
                {TIERS.map((t) => (
                  <tr key={t.name} className="border-b border-white/5">
                    <td className="p-2 font-display font-bold" style={{ color: t.color }}>{t.emoji} {t.name}</td>
                    <td className="p-2 font-display font-bold text-white">{t.fee}</td>
                    <td className="p-2 text-white/60">{t.volume}</td>
                    <td className="p-2 text-white/60">{t.rating}</td>
                    <td className="p-2 text-right text-white/60">{t.slots}</td>
                    <td className="p-2 text-white/40 text-xs">{t.perks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <p><strong>Evaluation:</strong> Tiers are recalculated daily using a rolling 30-day window. Both volume AND rating requirements must be met.</p>
            <p><strong>Upgrades:</strong> Immediate upon meeting both thresholds.</p>
            <p><strong>Downgrades:</strong> 7-day grace period before tier drops. If you recover within 7 days, your tier is maintained.</p>
            <p><strong>Rating gate:</strong> Minimum 10 ratings required before rating is evaluated (new seller grace period).</p>
            <p><strong>Bulk Listing Tool:</strong> Available to Fire tier and above. Allows batch creation of up to 50 listings at once.</p>
          </div>
        </section>

        {/* 6. SHIPPING */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white">6. Shipping Requirements</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Ship within 48 hours</strong> of a confirmed sale. Failure to ship may result in automatic cancellation and a shipping violation.</li>
            <li><strong>Upload tracking</strong> within 48 hours of shipment.</li>
            <li><strong>Package securely</strong> — use top loaders, penny sleeves, team bags, or similar protection. Cards damaged in transit due to inadequate packaging are the seller&apos;s responsibility.</li>
            <li><strong>Ship to the address provided</strong> — do not ship to alternate addresses. Shipping to an unverified address voids seller protection.</li>
          </ul>

          <h3 className="text-lg font-display font-bold text-white/80 mt-4">6.1 Tracking & Signature Requirements</h3>
          <div className="card border border-white/10 p-4 mt-3">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Orders <strong>$20 – $49.99</strong></span>
                <span className="font-display text-sm text-super">Tracking SHOULD be included</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Orders <strong>$50 and above</strong></span>
                <span className="font-display text-sm text-fire font-bold">Tracking MUST be included</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Orders <strong>$250 and above</strong></span>
                <span className="font-display text-sm text-hex font-bold">Signature Confirmation MUST be included</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm"><strong>⚠️ Important:</strong> Sellers who choose not to follow these guidelines waive the ability to win disputes where the buyer claims non-delivery. Insurance is recommended for orders $50+.</p>

          <h3 className="text-lg font-display font-bold text-white/80 mt-4">6.2 Shipping Violations</h3>
          <p>Three shipping violations (late shipment, failure to ship, missing tracking) within 90 days may result in temporary account suspension. Chronic violations will result in permanent removal from the Platform.</p>
        </section>

        {/* 7. RETURNS & DISPUTES */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white">7. Returns & Disputes</h2>
          <p>Buyers may open a dispute within <strong>7 days of confirmed delivery</strong> if:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>The card received does not match the listing description</li>
            <li>The card condition is significantly worse than described</li>
            <li>The wrong card was shipped</li>
            <li>The card was damaged in transit and was not packaged adequately</li>
            <li>The order was not received (non-delivery claim)</li>
          </ul>

          <h3 className="text-lg font-display font-bold text-white/80 mt-4">7.1 Resolution Process</h3>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Buyer opens dispute with description and photo evidence</li>
            <li>Seller is notified and has <strong>72 hours</strong> to respond with their evidence</li>
            <li>BoBA Market reviews both sides and makes a decision within <strong>5 business days</strong></li>
            <li>If found in buyer&apos;s favor: seller must accept return and full refund is issued</li>
            <li>If found in seller&apos;s favor: dispute is closed, no refund</li>
          </ol>
          <p className="mt-2">Repeated valid disputes will negatively impact your seller rating and may trigger account review.</p>
        </section>

        {/* 8. SELLER FEEDBACK & RATINGS */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white">8. Seller Feedback & Ratings</h2>
          <p>After delivery, buyers may leave feedback consisting of:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Overall rating</strong> (1–5 stars, required)</li>
            <li><strong>Sub-ratings</strong> (optional): Shipping Speed, Item Condition, Communication, Accuracy</li>
            <li><strong>Written comment</strong> (optional, 500 characters max)</li>
          </ul>

          <h3 className="text-lg font-display font-bold text-white/80 mt-4">8.1 Feedback Rules</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Feedback opens <strong>48 hours after delivery</strong> and closes <strong>60 days after delivery</strong></li>
            <li>One feedback per order — no stacking</li>
            <li>Only verified purchasers may leave feedback</li>
            <li>Accounts less than 7 days old cannot leave feedback</li>
            <li>Sellers may post one public response per feedback (300 characters, within 30 days)</li>
          </ul>

          <h3 className="text-lg font-display font-bold text-white/80 mt-4">8.2 Feedback Manipulation</h3>
          <p>The following are strictly prohibited and may result in immediate suspension:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Offering incentives (discounts, free items) in exchange for positive feedback</li>
            <li>Using alternate accounts to leave self-reviews</li>
            <li>Coordinated negative feedback against competitors</li>
            <li>Threatening or harassing buyers who leave negative feedback</li>
          </ul>
        </section>

        {/* 9. SELLER PERFORMANCE STANDARDS */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white">9. Performance Standards</h2>
          <p>To maintain good standing on BoBA Market, sellers should aim to maintain:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Overall rating:</strong> 4.0★ or above</li>
            <li><strong>On-time shipping rate:</strong> 95% or above (shipped within 48 hours)</li>
            <li><strong>Dispute rate:</strong> Below 3% of total transactions</li>
            <li><strong>Cancellation rate:</strong> Below 2% of total transactions</li>
          </ul>
          <p className="mt-2">Sellers below 3.5★ may have listings de-prioritized in search results. Sellers below 3.0★ are subject to account review and potential suspension.</p>
        </section>

        {/* 10. TAX OBLIGATIONS */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white">10. Tax Obligations</h2>
          <p>You are solely responsible for reporting and paying all taxes owed on your sales, including income tax and any applicable sales tax in your jurisdiction.</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>BoBA Market may be required to issue <strong>1099-K forms</strong> if your gross sales exceed IRS reporting thresholds ($600/year)</li>
            <li>Stripe may collect tax identification information (SSN/EIN) as required by law</li>
            <li>BoBA Market collects and remits sales tax in states where marketplace facilitator laws apply</li>
            <li>We do not provide tax advice — consult a qualified tax professional</li>
          </ul>
        </section>

        {/* 11. COUNTERFEIT & AUTHENTICITY */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white">11. Counterfeit & Authenticity Policy</h2>
          <div className="card border border-fire/30 bg-fire/5 p-4 mt-3">
            <p className="text-white font-display font-bold text-lg">⚠️ ZERO TOLERANCE FOR COUNTERFEITS</p>
            <p className="text-white/70 mt-2">Listing counterfeit, proxy, reproduction, or altered cards represented as authentic originals will result in <strong>immediate permanent account termination</strong> with no appeal. Pending payouts will be held for 90 days.</p>
          </div>
          <p className="mt-3">This includes but is not limited to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Counterfeit Bo Jackson Battle Arena cards</li>
            <li>Proxy or reproduction cards listed as originals</li>
            <li>Cards with altered or counterfeit grading labels/slabs</li>
            <li>Trimmed or chemically altered cards not disclosed as such</li>
            <li>Re-sealed or tampered sealed product</li>
          </ul>
          <p className="mt-3">We reserve the right to report counterfeit activity to law enforcement and the affected IP rights holders.</p>
        </section>

        {/* 12. INTELLECTUAL PROPERTY */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white">12. Intellectual Property</h2>

          <h3 className="text-lg font-display font-bold text-white/80 mt-4">12.1 Your Content</h3>
          <p>You retain ownership of all content you create (listing descriptions, photos, store branding). By listing on BoBA Market, you grant us a <strong>limited, non-exclusive, revocable license</strong> to display your content on the Platform for the purpose of facilitating sales. This license terminates when you remove your listing or close your account.</p>
          <p className="mt-2">We will <strong>not</strong> use your content for any purpose unrelated to the marketplace. We do not claim perpetual or irrevocable rights to your content.</p>

          <h3 className="text-lg font-display font-bold text-white/80 mt-4">12.2 DMCA & Takedowns</h3>
          <p>If you believe content on BoBA Market infringes your intellectual property, contact us at <strong>legal@bobamarket.gg</strong> with a DMCA-compliant takedown notice. We will respond within 5 business days.</p>

          <h3 className="text-lg font-display font-bold text-white/80 mt-4">12.3 Third-Party IP</h3>
          <p>Card images, names, and game data are the property of their respective rights holders. BoBA Market displays this information under nominative fair use for the purpose of facilitating secondary market sales.</p>
        </section>

        {/* 13. PROHIBITED CONDUCT */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white">13. Prohibited Conduct</h2>
          <p>The following actions are prohibited and may result in account suspension or termination:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Listing counterfeit, proxy, or altered cards (see Section 11)</li>
            <li>Completing transactions off-platform to circumvent BoBA Market fees</li>
            <li>Feedback or rating manipulation, including shill accounts</li>
            <li>Using unauthorized bots, scrapers, or automated tools without BoBA API approval</li>
            <li>Harassment, threats, or abusive communication toward buyers or staff</li>
            <li>Providing false identity information during onboarding</li>
            <li>Operating multiple seller accounts</li>
            <li>Interfering with other sellers&apos; listings or operations</li>
            <li>Any activity that violates applicable law</li>
          </ul>
        </section>

        {/* 14. ACCOUNT SUSPENSION & TERMINATION */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white">14. Account Suspension & Termination</h2>

          <h3 className="text-lg font-display font-bold text-white/80 mt-4">14.1 Graduated Enforcement</h3>
          <p>For non-counterfeit violations, we follow a graduated enforcement process:</p>
          <ol className="list-decimal pl-6 space-y-1">
            <li><strong>Written Warning</strong> — specific violation cited, corrective action required</li>
            <li><strong>Temporary Suspension</strong> (7–30 days) — listings hidden, payouts held</li>
            <li><strong>Permanent Ban</strong> — account terminated, 90-day payout hold</li>
          </ol>
          <p className="mt-2">Counterfeit violations skip directly to permanent ban (Section 11).</p>

          <h3 className="text-lg font-display font-bold text-white/80 mt-4">14.2 Appeal Process</h3>
          <p>For non-counterfeit suspensions, you may appeal within <strong>30 days</strong> by contacting <strong>appeals@bobamarket.gg</strong>. Appeals are reviewed within 10 business days. You will receive a written decision with specific reasoning.</p>

          <h3 className="text-lg font-display font-bold text-white/80 mt-4">14.3 Payout on Termination</h3>
          <p>Pending payouts at termination are held for 90 days to cover potential refunds and disputes. After 90 days, remaining funds are released to your bank account. We will <strong>not</strong> report delinquent accounts to credit bureaus.</p>
        </section>

        {/* 15. DATA & PRIVACY */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white">15. Data & Privacy</h2>
          <p>We collect and process seller data as described in our <Link href="/privacy" className="text-hex hover:text-hex-light font-bold">Privacy Policy</Link>. Key points for sellers:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Your public store name, rating, and tier badge are visible to all users</li>
            <li>Your identity verification data is processed by Stripe, not stored by BoBA Market</li>
            <li>Sales data and analytics are used to improve the Platform and may be displayed in aggregate</li>
            <li>We will not sell your personal information to third parties</li>
            <li>You may request data export or deletion by contacting <strong>privacy@bobamarket.gg</strong></li>
          </ul>
        </section>

        {/* 16. INDEMNIFICATION & LIABILITY */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white">16. Indemnification & Liability</h2>
          <p>You agree to indemnify and hold harmless BoBA Market, its owners, employees, and agents from any claims, damages, or expenses arising from:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Your use of the Platform as a seller</li>
            <li>Disputes with buyers arising from your listings</li>
            <li>Your tax obligations</li>
            <li>Shipping issues caused by your packaging or carrier choice</li>
            <li>Any violation of this Agreement</li>
          </ul>
          <p className="mt-2"><strong>Limitation of liability:</strong> BoBA Market&apos;s total liability to you shall not exceed the fees you paid to us in the 12 months preceding the claim, or $100, whichever is greater.</p>
        </section>

        {/* 17. DISPUTE RESOLUTION (PLATFORM VS SELLER) */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white">17. Dispute Resolution</h2>
          <p>If you have a dispute with BoBA Market (not a buyer-seller dispute):</p>
          <ol className="list-decimal pl-6 space-y-1">
            <li><strong>Informal resolution first</strong> — contact <strong>support@bobamarket.gg</strong>. We will attempt to resolve within 30 days.</li>
            <li><strong>Disputes under $500:</strong> Resolved through small claims court in the state of our incorporation (New Jersey).</li>
            <li><strong>Disputes over $500:</strong> Resolved through binding arbitration under AAA Commercial Rules, conducted in New Jersey. Each party bears their own costs.</li>
          </ol>
          <p className="mt-2">You agree to resolve disputes individually and waive the right to participate in class action lawsuits or class-wide arbitration against BoBA Market.</p>
        </section>

        {/* 18. GOVERNING LAW */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white">18. Governing Law</h2>
          <p>This Agreement is governed by the laws of the <strong>State of New Jersey</strong>, without regard to conflict of law provisions. Any legal proceedings shall be conducted in the state or federal courts located in New Jersey.</p>
        </section>

        {/* 19. MODIFICATIONS */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white">19. Modifications to This Agreement</h2>
          <p>We may update this Agreement from time to time. For <strong>material changes</strong> (fee increases, new restrictions, changes to dispute resolution):</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>We will provide at least <strong>30 days advance notice</strong> via email and Platform notification</li>
            <li>The updated date will be reflected at the top of this page</li>
            <li>Continued use of the Platform after the effective date constitutes acceptance</li>
            <li>If you do not agree with changes, you may close your account and withdraw pending payouts</li>
          </ul>
          <p className="mt-2">Non-material changes (typos, clarifications, formatting) may be made without notice.</p>
        </section>

        {/* 20. CONTACT */}
        <section>
          <h2 className="text-2xl font-display font-bold text-white">20. Contact</h2>
          <div className="card border border-white/10 p-4 mt-3">
            <p><strong>General support:</strong> support@bobamarket.gg</p>
            <p><strong>Legal / DMCA:</strong> legal@bobamarket.gg</p>
            <p><strong>Appeals:</strong> appeals@bobamarket.gg</p>
            <p><strong>Privacy / Data:</strong> privacy@bobamarket.gg</p>
          </div>
        </section>

      </div>

      <div className="mt-12 pt-8 border-t border-white/10 flex gap-4">
        <Link href="/terms" className="text-hex hover:text-hex-light font-display uppercase tracking-wider text-sm">Terms of Service →</Link>
        <Link href="/privacy" className="text-hex hover:text-hex-light font-display uppercase tracking-wider text-sm">Privacy Policy →</Link>
      </div>
    </div>
  );
}
