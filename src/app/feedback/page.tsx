import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Feedback — BoBA Trader",
  description: "Help shape BoBA Trader. Submit feedback, feature requests, and bug reports.",
};

export default function FeedbackPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-display font-black text-white mb-2">Community Feedback</h1>
      <p className="text-xl text-white/50 font-body mb-10">Help us build the best card marketplace. Your ideas matter.</p>

      {/* Submit Feedback */}
      <section className="mb-12">
        <div className="card border border-hex/30 p-6">
          <h2 className="text-2xl font-display font-bold text-white mb-4">💡 Share Your Ideas</h2>
          <form action="https://formspree.io/f/xpwdlbkg" method="POST" className="space-y-4">
            <input type="hidden" name="subject" value="feedback" />
            <div>
              <label className="block text-sm font-display text-white/60 mb-1">Name</label>
              <input
                type="text"
                name="name"
                className="w-full bg-boba-dark border border-white/20 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-hex transition-colors"
                placeholder="Your name (optional)"
              />
            </div>
            <div>
              <label className="block text-sm font-display text-white/60 mb-1">Email</label>
              <input
                type="email"
                name="email"
                className="w-full bg-boba-dark border border-white/20 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-hex transition-colors"
                placeholder="you@example.com (optional, for follow-up)"
              />
            </div>
            <div>
              <label className="block text-sm font-display text-white/60 mb-1">Category</label>
              <select
                name="category"
                className="w-full bg-boba-dark border border-white/20 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-hex transition-colors"
              >
                <option value="feature">Feature Request</option>
                <option value="bug">Bug Report</option>
                <option value="improvement">Improvement</option>
                <option value="design">Design / UX</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-display text-white/60 mb-1">Your Feedback *</label>
              <textarea
                name="message"
                required
                rows={5}
                className="w-full bg-boba-dark border border-white/20 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-hex transition-colors resize-y"
                placeholder="Describe your idea, bug, or improvement..."
              />
            </div>
            <button
              type="submit"
              className="btn-primary px-8 py-3 font-display font-bold text-lg"
            >
              Submit Feedback →
            </button>
          </form>
        </div>
      </section>

      {/* What we're working on */}
      <section className="mb-12">
        <h2 className="text-3xl font-display font-bold text-white mb-4">🚧 Coming Soon</h2>
        <div className="space-y-3">
          {[
            { icon: "📦", title: "Inventory Management", desc: "Bulk listing tools and inventory dashboard" },
            { icon: "🔔", title: "Price Alerts", desc: "Get notified when cards you want drop in price" },
            { icon: "💬", title: "Direct Messages", desc: "Chat with buyers and sellers in-app" },
            { icon: "📊", title: "Market Trends", desc: "Price history charts and market analytics" },
            { icon: "🎯", title: "Offer System", desc: "Make and accept offers below listing price" },
            { icon: "📱", title: "Mobile App", desc: "Native iOS and Android apps for trading on the go" },
          ].map((item) => (
            <div key={item.title} className="card border border-white/10 p-4 flex gap-4 items-center">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="font-display font-bold text-white">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community links */}
      <section>
        <div className="card border border-white/10 p-6 text-center">
          <h2 className="text-2xl font-display font-bold text-white mb-2">Join the Community</h2>
          <p className="text-white/50 mb-4">Discuss features, share ideas, and connect with other collectors.</p>
          <div className="flex justify-center gap-4">
            <a href="https://discord.gg/bobattlearena" target="_blank" rel="noopener noreferrer" className="btn-primary px-6 py-2 font-display font-bold">
              Discord →
            </a>
            <Link href="/contact" className="btn-secondary px-6 py-2 font-display font-bold">
              Contact Us →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}