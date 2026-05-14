import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping — BoBA Trader",
  description: "Shipping guidelines for BoBA Trader. Tracking rules, packaging standards, and delivery expectations.",
};

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-display font-black text-white mb-2">Shipping Guidelines</h1>
      <p className="text-xl text-white/50 font-body mb-10">How we handle shipping, tracking, and delivery on BoBA Trader.</p>

      {/* Shipping Methods */}
      <section className="mb-12">
        <h2 className="text-3xl font-display font-bold text-white mb-4">📦 Shipping Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card border border-white/10 p-6">
            <h3 className="text-xl font-display font-bold text-white mb-2">Plain White Envelope</h3>
            <p className="text-super font-display font-black text-3xl mb-2">$1.00</p>
            <ul className="text-white/60 text-sm space-y-1">
              <li>✅ Cards under $20</li>
              <li>❌ No tracking</li>
              <li>❌ No insurance</li>
              <li>⏱ 3-10 business days</li>
            </ul>
          </div>
          <div className="card border border-ice/30 p-6">
            <h3 className="text-xl font-display font-bold text-ice mb-2">Bubble Mailer w/ Tracking</h3>
            <p className="text-super font-display font-black text-3xl mb-2">$4.00</p>
            <ul className="text-white/60 text-sm space-y-1">
              <li>✅ Cards $20-$500</li>
              <li>✅ Tracking included</li>
              <li>✅ Insurance over $50</li>
              <li>⏱ 3-7 business days</li>
            </ul>
          </div>
          <div className="card border border-super/30 p-6">
            <h3 className="text-xl font-display font-bold text-super mb-2">Small Box w/ Insurance</h3>
            <p className="text-super font-display font-black text-3xl mb-2">$8.00</p>
            <ul className="text-white/60 text-sm space-y-1">
              <li>✅ Cards $500+</li>
              <li>✅ Tracking + insurance</li>
              <li>✅ Signature confirmation</li>
              <li>⏱ 2-5 business days</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tracking Rules */}
      <section className="mb-12">
        <h2 className="text-3xl font-display font-bold text-white mb-4">🔍 Tracking Requirements</h2>
        <div className="card border border-white/10 p-6 space-y-4">
          <div className="flex gap-4 items-start">
            <span className="text-2xl">💵</span>
            <div>
              <h3 className="font-display font-bold text-white">Under $20 — PWE OK</h3>
              <p className="text-white/50">Plain white envelope is fine. No tracking required but recommended.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-2xl">📋</span>
            <div>
              <h3 className="font-display font-bold text-white">$20-$50 — Tracking Recommended</h3>
              <p className="text-white/50">We strongly recommend tracking. Sellers who ship without tracking accept risk of loss claims.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-display font-bold text-white">$50+ — Tracking Required</h3>
              <p className="text-white/50">Tracking is mandatory for orders $50 and up. You cannot ship these via PWE.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-2xl">🔒</span>
            <div>
              <h3 className="font-display font-bold text-white">$250+ — Signature Confirmation</h3>
              <p className="text-white/50">High-value orders require signature confirmation for buyer and seller protection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Capture */}
      <section className="mb-12">
        <h2 className="text-3xl font-display font-bold text-white mb-4">💳 How Payments Work</h2>
        <div className="card border border-hex/30 p-6 space-y-4">
          <div className="flex gap-4 items-start">
            <span className="text-2xl">1️⃣</span>
            <div>
              <h3 className="font-display font-bold text-white">Authorization</h3>
              <p className="text-white/50">When you buy a card, your payment is <strong className="text-white">authorized</strong> but not yet charged. Funds are held by your bank.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-2xl">2️⃣</span>
            <div>
              <h3 className="font-display font-bold text-white">Capture on Ship</h3>
              <p className="text-white/50">When the seller marks the order as shipped or adds tracking, your payment is <strong className="text-white">captured</strong> and the charge completes.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-2xl">3️⃣</span>
            <div>
              <h3 className="font-display font-bold text-white">Auto-Release</h3>
              <p className="text-white/50">If the seller never ships, the authorization expires within 7 days and you are <strong className="text-white">never charged</strong>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dispute Window */}
      <section className="mb-12">
        <h2 className="text-3xl font-display font-bold text-white mb-4">🛡️ Buyer Protection</h2>
        <div className="card border border-super/20 p-6">
          <p className="text-white/70 mb-4">
            All purchases are protected by our <strong className="text-white">7-day dispute window</strong>. After delivery confirmation, you have 7 days to report any issues with condition, authenticity, or accuracy.
          </p>
          <ul className="text-white/60 space-y-2">
            <li>✅ Card not as described — full refund</li>
            <li>✅ Card damaged in transit — full refund</li>
            <li>✅ Seller never ships — auto-refund after 7 days</li>
            <li>✅ Wrong card sent — return + refund</li>
          </ul>
        </div>
      </section>
    </div>
  );
}