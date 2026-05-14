import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us — BoBA Trader",
  description: "Get in touch with BoBA Trader. Questions, support, partnerships — we are here to help.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-display font-black text-white mb-2">Contact Us</h1>
      <p className="text-xl text-white/50 font-body mb-10">Questions, support, or partnership inquiries — we reply within 24 hours.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Contact Form */}
        <div className="card border border-white/10 p-6">
          <h2 className="text-2xl font-display font-bold text-white mb-4">Send a Message</h2>
          <form action="https://formspree.io/f/xpwdlbkg" method="POST" className="space-y-4">
            <div>
              <label className="block text-sm font-display text-white/60 mb-1">Name *</label>
              <input
                type="text"
                name="name"
                required
                className="w-full bg-boba-dark border border-white/20 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-hex transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-display text-white/60 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-boba-dark border border-white/20 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-hex transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-display text-white/60 mb-1">Subject</label>
              <select
                name="subject"
                className="w-full bg-boba-dark border border-white/20 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-hex transition-colors"
              >
                <option value="general">General Question</option>
                <option value="support">Buying / Selling Support</option>
                <option value="shipping">Shipping & Tracking</option>
                <option value="payment">Payment & Refunds</option>
                <option value="partnership">Partnership Inquiry</option>
                <option value="bug">Bug Report</option>
                <option value="feedback">Feature Request</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-display text-white/60 mb-1">Message *</label>
              <textarea
                name="message"
                required
                rows={5}
                className="w-full bg-boba-dark border border-white/20 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-hex transition-colors resize-y"
                placeholder="How can we help?"
              />
            </div>
            <button
              type="submit"
              className="btn-primary px-8 py-3 w-full font-display font-bold text-lg"
            >
              Send Message →
            </button>
          </form>
        </div>

        {/* Quick Contact */}
        <div className="space-y-6">
          <div className="card border border-white/10 p-6">
            <h3 className="text-xl font-display font-bold text-white mb-3">📧 Email</h3>
            <a href="mailto:info@bobatrader.com" className="text-hex hover:text-super transition-colors font-body text-lg">
              info@bobatrader.com
            </a>
            <p className="text-white/40 text-sm mt-1">We respond within 24 hours</p>
          </div>

          <div className="card border border-white/10 p-6">
            <h3 className="text-xl font-display font-bold text-white mb-3">💬 Discord</h3>
            <a href="https://discord.gg/bobattlearena" target="_blank" rel="noopener noreferrer" className="text-hex hover:text-super transition-colors font-body text-lg">
              Join our Discord →
            </a>
            <p className="text-white/40 text-sm mt-1">Fastest way to get help</p>
          </div>

          <div className="card border border-white/10 p-6">
            <h3 className="text-xl font-display font-bold text-white mb-3">📋 FAQ</h3>
            <a href="/faq" className="text-hex hover:text-super transition-colors font-body text-lg">
              Check our FAQ →
            </a>
            <p className="text-white/40 text-sm mt-1">Common questions answered</p>
          </div>

          <div className="card border border-super/20 p-6 bg-super/5">
            <h3 className="text-xl font-display font-bold text-super mb-3">⚡ Seller Support</h3>
            <p className="text-white/70 text-sm">
              Lancer tier and above get priority support. <Link href="/dashboard/sell" className="text-hex hover:text-super transition-colors">View your tier →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

