import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — BoBA Market",
  description:
    "The #1 independent marketplace for Bo Jackson Battle Arena trading cards. Built by collectors, for collectors.",
};

const stats = [
  { value: "17,236+", label: "Cards Listed" },
  { value: "8%", label: "Max Seller Fee" },
  { value: "Free", label: "To List" },
  { value: "100%", label: "Independent" },
];

const buySteps = [
  {
    icon: "🔍",
    title: "Browse",
    desc: "Search 17,000+ cards by name, set, condition, weapon type, and price. Real market data — no inflated listings.",
    color: "border-hex/40 hover:border-hex/70",
    accent: "text-hex",
  },
  {
    icon: "🛒",
    title: "Add to Cart",
    desc: "Buy from multiple sellers in one checkout. Select your shipping preference and review order details.",
    color: "border-ice/40 hover:border-ice/70",
    accent: "text-ice",
  },
  {
    icon: "✅",
    title: "Checkout",
    desc: "Secure payment via Stripe. Your funds are held in escrow until delivery is confirmed.",
    color: "border-glow/40 hover:border-glow/70",
    accent: "text-glow",
  },
];

const sellSteps = [
  {
    icon: "📷",
    title: "List",
    desc: "Free to list. Add photos, set your price, select condition using our standardized grading scale.",
    color: "border-brawl/40 hover:border-brawl/70",
    accent: "text-brawl",
  },
  {
    icon: "💰",
    title: "Sell",
    desc: "Buyer pays and you get notified instantly. One flat fee — 8% (drops to 5% for top sellers). No surprise charges.",
    color: "border-super/40 hover:border-super/70",
    accent: "text-super",
  },
  {
    icon: "📦",
    title: "Ship",
    desc: "Package and ship within 48 hours. Add tracking — we&apos;ll notify your buyer automatically.",
    color: "border-fire/40 hover:border-fire/70",
    accent: "text-fire",
  },
  {
    icon: "💸",
    title: "Get Paid",
    desc: "Funds release to your Stripe account once the buyer confirms delivery. Weekly payouts, no holds.",
    color: "border-glow/40 hover:border-glow/70",
    accent: "text-glow",
  },
];

const commitments = [
  {
    icon: "⚖️",
    title: "Fair Fees",
    desc: "8% flat — drops to 5% for top sellers. No insertion fees, no listing upgrades, no hidden charges. eBay charges 13.25%. We don&apos;t.",
  },
  {
    icon: "🛡️",
    title: "Seller-First Policies",
    desc: "Graduated suspension policy. Written notice for violations. 30-day appeal window. We built our seller agreement to be fair — read it.",
  },
  {
    icon: "🔍",
    title: "Transparent Disputes",
    desc: "Defined resolution steps, appeal rights, written decisions. No &apos;sole discretion&apos; black boxes. You always know where you stand.",
  },
  {
    icon: "🃏",
    title: "Community Standards",
    desc: "Grading scale built around the BoBA collector community. Authenticity verification for high-value cards. Zero tolerance for counterfeits.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-hex/10 border border-hex/30 rounded-full px-4 py-2 mb-6">
          <span className="text-hex text-sm font-display font-bold uppercase tracking-wider">
            Built by Collectors
          </span>
        </div>
        <h1 className="text-6xl sm:text-7xl font-display font-black text-white mb-4 leading-none">
          ABOUT BOBA MARKET
        </h1>
        <p className="text-xl text-white/50 font-body max-w-2xl mx-auto leading-relaxed">
          The <span className="text-white font-semibold">#1 independent marketplace</span> for Bo Jackson Battle Arena trading cards.
          No corporate nonsense. Just a clean, fair place to buy and sell the cards you love.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="card border border-white/10 p-6 text-center"
          >
            <p className="text-4xl font-display font-black text-white mb-1">{stat.value}</p>
            <p className="text-sm text-white/40 font-display uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="card border border-hex/30 bg-hex/5 p-8 mb-16 text-center">
        <span className="text-4xl block mb-4">🃏</span>
        <h2 className="text-4xl font-display font-black text-white mb-4">OUR MISSION</h2>
        <p className="text-lg text-white/60 font-body max-w-3xl mx-auto leading-relaxed">
          BoBA Market exists because Bo Jackson Battle Arena deserves a dedicated home.
          Not a footnote on eBay. Not a category buried in TCGPlayer.
          A purpose-built marketplace with real market data, fair fees, and policies
          that actually make sense for collectors and sellers.
        </p>
      </div>

      {/* How It Works — Buy */}
      <div className="mb-16">
        <h2 className="text-4xl font-display font-black text-white mb-2">HOW IT WORKS</h2>
        <p className="text-white/40 mb-8 font-body">Simple for buyers. Profitable for sellers.</p>

        <h3 className="text-xl font-display font-bold text-white/60 uppercase tracking-wider mb-4">
          🛒 Buying
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {buySteps.map((step, i) => (
            <div
              key={step.title}
              className={`card border ${step.color} p-6 transition-all`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{step.icon}</span>
                <div>
                  <span className="text-white/30 text-xs font-display uppercase tracking-widest">
                    Step {i + 1}
                  </span>
                  <h4 className={`text-xl font-display font-black ${step.accent}`}>
                    {step.title}
                  </h4>
                </div>
              </div>
              <p className="text-sm text-white/50 font-body leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-display font-bold text-white/60 uppercase tracking-wider mb-4">
          📦 Selling
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sellSteps.map((step, i) => (
            <div
              key={step.title}
              className={`card border ${step.color} p-6 transition-all`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{step.icon}</span>
                <div>
                  <span className="text-white/30 text-xs font-display uppercase tracking-widest">
                    Step {i + 1}
                  </span>
                  <h4 className={`text-xl font-display font-black ${step.accent}`}>
                    {step.title}
                  </h4>
                </div>
              </div>
              <p className="text-sm text-white/50 font-body leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Commitment */}
      <div className="mb-16">
        <h2 className="text-4xl font-display font-black text-white mb-2">OUR COMMITMENT</h2>
        <p className="text-white/40 mb-8 font-body">What makes BoBA Market different.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {commitments.map((item) => (
            <div
              key={item.title}
              className="card border border-white/10 hover:border-white/20 p-6 transition-all"
            >
              <span className="text-3xl block mb-3">{item.icon}</span>
              <h4 className="text-xl font-display font-bold text-white mb-2">{item.title}</h4>
              <p className="text-sm text-white/50 font-body leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="card border border-white/10 p-8 mb-16 text-center">
        <span className="text-5xl block mb-4">⚡</span>
        <h2 className="text-3xl font-display font-black text-white mb-3">
          BUILT BY COLLECTORS, FOR COLLECTORS
        </h2>
        <p className="text-white/50 font-body max-w-2xl mx-auto leading-relaxed">
          BoBA Market was built by people who actually play the game and buy the cards.
          We know what it feels like to get a card in worse condition than listed.
          We know what it feels like to wait three weeks for a sale to clear.
          We built the platform we wanted — and we&apos;re sharing it with the community.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center mb-12">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/browse" className="btn-primary text-lg px-8 py-3">
            Browse Cards
          </Link>
          <Link href="/sell" className="btn-secondary text-lg px-8 py-3">
            Start Selling
          </Link>
        </div>
      </div>

      {/* Footer links */}
      <div className="border-t border-white/10 pt-8 flex flex-wrap gap-6 justify-center text-sm text-white/30">
        <Link href="/terms" className="hover:text-white transition-colors font-display uppercase tracking-wider">
          Terms of Service
        </Link>
        <Link href="/privacy" className="hover:text-white transition-colors font-display uppercase tracking-wider">
          Privacy Policy
        </Link>
        <Link href="/seller-agreement" className="hover:text-white transition-colors font-display uppercase tracking-wider">
          Seller Agreement
        </Link>
        <Link href="/faq" className="hover:text-white transition-colors font-display uppercase tracking-wider">
          FAQ
        </Link>
      </div>
    </div>
  );
}
