import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Docs — BoBA Trader",
  description: "Transparency documentation for BoBA Trader. Fees, tiers, protections, and how it all works.",
};

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-display font-black text-white mb-2">Documentation</h1>
      <p className="text-xl text-white/50 font-body mb-10">Full transparency on how BoBA Trader works — fees, tiers, protections, and policies.</p>

      {/* Fee Structure */}
      <section className="mb-12">
        <h2 className="text-3xl font-display font-bold text-white mb-4">💰 Fee Structure</h2>
        <p className="text-white/60 mb-6">
          BoBA Trader charges a simple fee on each sale. The fee depends on your seller tier. There are no listing fees, no monthly subscriptions, and no hidden charges.
        </p>
        <div className="card border border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 font-display text-white/60 text-sm uppercase tracking-wider">Tier</th>
                <th className="px-4 py-3 font-display text-white/60 text-sm uppercase tracking-wider">Fee</th>
                <th className="px-4 py-3 font-display text-white/60 text-sm uppercase tracking-wider">Volume</th>
                <th className="px-4 py-3 font-display text-white/60 text-sm uppercase tracking-wider">Listing Slots</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr><td className="px-4 py-3 font-display font-bold" style={{color: "#71717A"}}>🔩 Steel</td><td className="px-4 py-3 text-white">8%</td><td className="px-4 py-3 text-white/60">$0-$99/mo</td><td className="px-4 py-3 text-white/60">10</td></tr>
              <tr><td className="px-4 py-3 font-display font-bold" style={{color: "#EF4444"}}>🔥 Fire</td><td className="px-4 py-3 text-white">7%</td><td className="px-4 py-3 text-white/60">$100-$499/mo</td><td className="px-4 py-3 text-white/60">25</td></tr>
              <tr><td className="px-4 py-3 font-display font-bold" style={{color: "#38BDF8"}}>🧊 Ice</td><td className="px-4 py-3 text-white">7%</td><td className="px-4 py-3 text-white/60">$500-$1,999/mo</td><td className="px-4 py-3 text-white/60">50</td></tr>
              <tr><td className="px-4 py-3 font-display font-bold" style={{color: "#79F528"}}>✨ Glow</td><td className="px-4 py-3 text-white">6.5%</td><td className="px-4 py-3 text-white/60">$2,000-$4,999/mo</td><td className="px-4 py-3 text-white/60">100</td></tr>
              <tr><td className="px-4 py-3 font-display font-bold" style={{color: "#A855F7"}}>🔮 Hex</td><td className="px-4 py-3 text-white">6%</td><td className="px-4 py-3 text-white/60">$5,000-$9,999/mo</td><td className="px-4 py-3 text-white/60">300</td></tr>
              <tr><td className="px-4 py-3 font-display font-bold" style={{color: "#FBBF24"}}>⚡ Super</td><td className="px-4 py-3 text-white">5%</td><td className="px-4 py-3 text-white/60">$10,000+/mo</td><td className="px-4 py-3 text-white/60">Unlimited</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-white/40 text-sm mt-3">Plus a flat $0.25 per-order fee. All fees are deducted from the seller payout automatically.</p>
      </section>

      {/* How Selling Works */}
      <section className="mb-12">
        <h2 className="text-3xl font-display font-bold text-white mb-4">🏷️ How Selling Works</h2>
        <div className="space-y-4">
          {[
            { step: "1", title: "List Your Card", desc: "Search for your card, set a price, choose condition. Free to list." },
            { step: "2", title: "Buyer Purchases", desc: "Buyer checks out via Stripe. Payment is authorized but not captured yet." },
            { step: "3", title: "Ship the Card", desc: "Mark as shipped, add tracking. Payment is captured. Funds hit your Stripe account." },
            { step: "4", title: "Buyer Confirms", desc: "Buyer confirms delivery. Payout is released to your bank within 2 business days." },
          ].map((item) => (
            <div key={item.step} className="card border border-white/10 p-5 flex gap-4 items-start">
              <span className="text-3xl font-display font-black text-hex">{item.step}</span>
              <div>
                <h3 className="font-display font-bold text-white text-lg">{item.title}</h3>
                <p className="text-white/50">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Buyer Protection */}
      <section className="mb-12">
        <h2 className="text-3xl font-display font-bold text-white mb-4">🛡️ Buyer Protection</h2>
        <div className="card border border-super/20 p-6 bg-super/5 space-y-3">
          <p className="text-white/70">Every purchase on BoBA Trader is protected:</p>
          <ul className="text-white/60 space-y-2">
            <li>✅ <strong className="text-white">Authorization-first payments</strong> — your card isn't charged until the seller ships</li>
            <li>✅ <strong className="text-white">7-day dispute window</strong> after delivery for condition/accuracy issues</li>
            <li>✅ <strong className="text-white">Full refund</strong> if the card isn't as described or arrives damaged</li>
            <li>✅ <strong className="text-white">Auto-refund</strong> if the seller never ships within 7 days</li>
          </ul>
          <p className="text-white/40 text-sm mt-4">See our <Link href="/terms" className="text-hex hover:text-super">Terms of Service</Link> for full details.</p>
        </div>
      </section>

      {/* Seller Tiers */}
      <section className="mb-12">
        <h2 className="text-3xl font-display font-bold text-white mb-4">📊 Seller Tiers</h2>
        <p className="text-white/60 mb-6">
          Sellers automatically tier up based on 30-day sales volume and ratings. Tiers are evaluated daily — no manual upgrades needed.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card border border-white/10 p-5">
            <h3 className="font-display font-bold text-white text-lg mb-2">🔩 → 🔥 Steel to Fire</h3>
            <p className="text-white/50 text-sm">$100+ in 30-day volume</p>
            <p className="text-white/40 text-xs mt-1">Fee drops to 7%, 25 listing slots</p>
          </div>
          <div className="card border border-white/10 p-5">
            <h3 className="font-display font-bold text-white text-lg mb-2">🔥 → 🧊 Fire to Ice</h3>
            <p className="text-white/50 text-sm">$500+ in 30-day volume</p>
            <p className="text-white/40 text-xs mt-1">50 listing slots, custom storefront</p>
          </div>
          <div className="card border border-white/10 p-5">
            <h3 className="font-display font-bold text-super text-lg mb-2">🔮 → ⚡ Hex to Super</h3>
            <p className="text-white/50 text-sm">$10,000+ in 30-day volume</p>
            <p className="text-white/40 text-xs mt-1">5% fee, unlimited slots, homepage spotlight</p>
          </div>
        </div>
      </section>

      {/* API / Dev */}
      <section className="mb-12">
        <h2 className="text-3xl font-display font-bold text-white mb-4">🔧 For Developers</h2>
        <div className="card border border-white/10 p-6">
          <p className="text-white/60 mb-4">
            BoBA Trader is built on open standards. Our API is available for integrations, price tracking, and market analysis.
          </p>
          <p className="text-white/40 text-sm">API documentation coming soon. Contact <a href="mailto:info@bobatrader.com" className="text-hex hover:text-super">info@bobatrader.com</a> for early access.</p>
        </div>
      </section>
    </div>
  );
}