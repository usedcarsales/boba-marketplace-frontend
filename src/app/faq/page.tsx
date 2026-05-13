"use client";

import { useState } from "react";
import Link from "next/link";

interface FAQItem {
  q: string;
  a: React.ReactNode;
}

interface FAQSection {
  title: string;
  icon: string;
  color: string;
  items: FAQItem[];
}

const faqSections: FAQSection[] = [
  {
    title: "General",
    icon: "🃏",
    color: "text-hex",
    items: [
      {
        q: "What is BoBA Trader?",
        a: "BoBA Trader is the #1 independent marketplace dedicated exclusively to Bo Jackson Battle Arena (BoBA) trading cards. We connect buyers and sellers with real market pricing data, fair fees, and policies built for collectors.",
      },
      {
        q: "Do I need an account to browse?",
        a: "No — browsing is open to everyone. You only need an account to buy, sell, or save cards to your watchlist.",
      },
      {
        q: "Is BoBA Trader affiliated with the official Bo Jackson Battle Arena game?",
        a: "BoBA Trader is an independent third-party marketplace. We are not affiliated with, endorsed by, or sponsored by the creators of the Bo Jackson Battle Arena game.",
      },
      {
        q: "What cards are listed on BoBA Trader?",
        a: (
          <>
            We focus exclusively on Bo Jackson Battle Arena cards — Heroes, Plays, Hot Dogs, Special editions, and related accessories. We do not list other TCG products (like Pokémon or Magic) — this keeps our market data clean and our community focused.
          </>
        ),
      },
    ],
  },
  {
    title: "Buying",
    icon: "🛒",
    color: "text-ice",
    items: [
      {
        q: "How do I buy a card?",
        a: "Browse listings, add cards to your cart, enter your shipping address, and check out securely via Stripe. You can buy from multiple sellers in one checkout.",
      },
      {
        q: "What payment methods are accepted?",
        a: "We accept all major credit/debit cards and ACH bank transfers through Stripe. We do not accept PayPal, Venmo, crypto, or gift cards.",
      },
      {
        q: "Is my payment secure?",
        a: "Yes. All payments are processed through Stripe, a PCI Level-1 certified payment processor. BoBA Trader never stores your card details.",
      },
      {
        q: "What is buyer protection?",
        a: (
          <>
            If your order doesn&apos;t arrive, arrives damaged, or is not as described, you have <strong className="text-white">7 days after delivery</strong> to open a dispute. We investigate and refund or reship as appropriate. See our{" "}
            <Link href="/terms" className="text-ice hover:text-ice-light underline">
              Terms of Service
            </Link>{" "}
            for full details.
          </>
        ),
      },
      {
        q: "How long does shipping take?",
        a: "Sellers are required to ship within 48 hours of a confirmed sale. Most buyers receive their cards within 3–7 business days depending on the seller's location and chosen shipping method.",
      },
      {
        q: "Can I cancel an order after placing it?",
        a: "Cancellation requests must be made before the seller ships. Once shipped, the order cannot be canceled. If you receive an item and have an issue, open a dispute within 7 days of delivery.",
      },
      {
        q: "What do I do if my card arrives damaged?",
        a: (
          <>
            Open a dispute within 7 days of delivery through your{" "}
            <Link href="/dashboard/purchases" className="text-ice hover:text-ice-light underline">
              My Purchases
            </Link>{" "}
            dashboard. Include photos of the packaging and the card. We&apos;ll work with the seller to resolve it.
          </>
        ),
      },
      {
        q: "What if the card condition is not as described?",
        a: (
          <>
            Condition misrepresentation is taken seriously on BoBA Trader. File a dispute within 7 days. Sellers who repeatedly misrepresent condition face account suspension. See our grading standards for the full condition scale (NM / LP / MP / HP / Damaged).
          </>
        ),
      },
    ],
  },
  {
    title: "Selling",
    icon: "💰",
    color: "text-glow",
    items: [
      {
        q: "How do I start selling?",
        a: (
          <>
            Create an account, complete Stripe Connect onboarding (required to receive payouts), and read our{" "}
            <Link href="/seller-agreement" className="text-glow hover:text-glow-light underline">
              Seller Agreement
            </Link>
            . Then click &quot;List a Card&quot; to create your first listing. It&apos;s free.
          </>
        ),
      },
      {
        q: "What are the fees for sellers?",
        a: (
          <>
            <strong className="text-white">Platform fee: 8%</strong> of the sale price (drops to 5% for top sellers).
            <br />
            <strong className="text-white">Order fee: $0.25</strong> per transaction.
            <br />
            Payment processing fees (Stripe) also apply and are deducted from your payout.
            <br />
            <strong className="text-white">Listing is always free.</strong> No insertion fees, no listing upgrades.
            <br /><br />
            Example: A $50 card → $4.00 platform fee + $0.25 order fee + ~$1.75 Stripe = ~$44.00 payout.
          </>
        ),
      },
      {
        q: "When do I get paid?",
        a: "Payouts are released within 7 days after the buyer confirms delivery (or after the delivery window closes without a dispute). Payments go directly to your Stripe Connect account via ACH. Most banks process within 1–2 business days.",
      },
      {
        q: "How do I grade card condition accurately?",
        a: (
          <>
            We use the standard TCG grading scale:
            <ul className="mt-2 space-y-1 text-white/60">
              <li><strong className="text-white">NM (Near Mint):</strong> No visible wear. Fresh from pack.</li>
              <li><strong className="text-white">LP (Lightly Played):</strong> Minor edge wear, minimal scuffs.</li>
              <li><strong className="text-white">MP (Moderately Played):</strong> Visible wear, creasing possible.</li>
              <li><strong className="text-white">HP (Heavily Played):</strong> Heavy wear, may affect playability.</li>
              <li><strong className="text-white">Damaged:</strong> Tears, water damage, severe creases.</li>
            </ul>
            <p className="mt-2">When in doubt, grade lower — condition disputes are the #1 cause of negative feedback.</p>
          </>
        ),
      },
      {
        q: "How fast do I need to ship?",
        a: "You must ship within 48 hours of a confirmed sale. Tracking information (for orders over $20) must be entered in your seller dashboard. Consistent late shipping will affect your seller rating and can result in account restrictions.",
      },
      {
        q: "Can I sell PSA/BGS graded cards?",
        a: "Yes. Graded cards should be listed with the exact grade, certification number, and photos of both the card and the slab. Misrepresenting a graded card is grounds for immediate account suspension.",
      },
      {
        q: "What can I NOT sell on BoBA Trader?",
        a: (
          <>
            The following are strictly prohibited:
            <ul className="mt-2 space-y-1 text-white/60 list-disc pl-4">
              <li>Counterfeit, proxy, or altered cards</li>
              <li>Cards you don&apos;t physically possess</li>
              <li>Cards misrepresented as to condition, edition, or authenticity</li>
              <li>Tampered graded slabs</li>
              <li>Non-BoBA products</li>
            </ul>
            Violations result in immediate permanent ban. See our{" "}
            <Link href="/seller-agreement" className="text-glow hover:text-glow-light underline">
              Seller Agreement
            </Link>{" "}
            for the full prohibited items list.
          </>
        ),
      },
      {
        q: "What happens if I get a dispute filed against me?",
        a: "You'll be notified immediately and have the opportunity to respond. BoBA Trader investigates all disputes. If the buyer's claim is valid, you may be responsible for a refund or replacement. Repeat violations result in graduated enforcement: warning → temporary suspension → permanent ban.",
      },
      {
        q: "Can I appeal a suspension?",
        a: "Yes. For non-counterfeit suspensions, you have a 30-day appeal window. Submit your appeal in writing through your account dashboard or by contacting support. Counterfeit violations carry zero-tolerance permanent bans with no appeal path.",
      },
    ],
  },
  {
    title: "Accounts & Security",
    icon: "🔐",
    color: "text-super",
    items: [
      {
        q: "How do I create an account?",
        a: (
          <>
            Click{" "}
            <Link href="/auth" className="text-super hover:text-super-light underline">
              Sign Up
            </Link>{" "}
            and register with your email address. No social login required. You&apos;ll need to verify your email before buying or selling.
          </>
        ),
      },
      {
        q: "Is my personal information safe?",
        a: (
          <>
            Yes. We use industry-standard 256-bit SSL encryption for all data transmission. Payment information is handled exclusively by Stripe and never stored on our servers. See our{" "}
            <Link href="/privacy" className="text-super hover:text-super-light underline">
              Privacy Policy
            </Link>{" "}
            for full details.
          </>
        ),
      },
      {
        q: "Can I have multiple accounts?",
        a: "No. Multiple accounts for the same person are prohibited and may result in all accounts being suspended. If you need a separate business account, contact support.",
      },
      {
        q: "What do I do if my account is compromised?",
        a: "Contact support immediately at support@bobatrader.com. Reset your password and review recent transactions. We will assist with any fraudulent activity on your account.",
      },
    ],
  },
  {
    title: "Fees & Payments",
    icon: "💸",
    color: "text-brawl",
    items: [
      {
        q: "Is it free to list cards?",
        a: "Yes. Listing is always free. You only pay when a card sells.",
      },
      {
        q: "What is the 'BoBA Verified' badge?",
        a: "The BoBA Verified badge is earned by sellers who consistently receive high feedback, accurate condition grading, and fast shipping. Verified sellers benefit from improved search visibility and chargeback protection on authenticated listings.",
      },
      {
        q: "Why is there a fee at all?",
        a: "Fees cover server costs, Stripe processing, dispute resolution, customer support, and platform development. Our 8% fee is significantly lower than eBay (13.25%) and TCGPlayer (10.25%). We don't inflate fees to subsidize features you don't need.",
      },
      {
        q: "What are the tiered fee rates?",
        a: (
          <>
            <ul className="space-y-1 text-white/60">
              <li><strong className="text-white">Standard seller:</strong> 8% platform fee</li>
              <li><strong className="text-white">Top sellers (high volume + high rating):</strong> 7%</li>
              <li><strong className="text-white">BoBA Verified sellers:</strong> 5%</li>
            </ul>
            <p className="mt-2">Fee tier details and qualification criteria are in our Seller Agreement.</p>
          </>
        ),
      },
      {
        q: "How do I set up my payout account?",
        a: "During seller onboarding, you'll connect your bank account through Stripe Connect. This typically takes 2–5 minutes. You'll need a valid US bank account and SSN/EIN for tax reporting.",
      },
    ],
  },
  {
    title: "Disputes & Returns",
    icon: "⚖️",
    color: "text-fire",
    items: [
      {
        q: "How do I open a dispute?",
        a: (
          <>
            Go to{" "}
            <Link href="/dashboard/purchases" className="text-fire hover:text-fire-light underline">
              My Purchases
            </Link>
            , find the order, and click &quot;Open Dispute.&quot; You must open disputes within <strong className="text-white">7 days of delivery</strong>. After 7 days, the order is considered complete and funds are released to the seller.
          </>
        ),
      },
      {
        q: "What qualifies for a refund?",
        a: (
          <>
            <ul className="space-y-1 text-white/60 list-disc pl-4">
              <li>Item not received</li>
              <li>Item significantly not as described (condition misrepresentation)</li>
              <li>Wrong card sent</li>
              <li>Card arrived damaged due to inadequate packaging</li>
              <li>Counterfeit or altered card</li>
            </ul>
            <p className="mt-2">Change of mind, buyer&apos;s remorse, or disagreement with a fair listing description do not qualify for refunds.</p>
          </>
        ),
      },
      {
        q: "How long does dispute resolution take?",
        a: "Standard disputes are resolved within 3–5 business days. Complex cases (e.g., authenticity disputes on high-value cards) may take up to 14 days. You'll receive updates throughout the process.",
      },
      {
        q: "Can sellers appeal a dispute decision?",
        a: "Yes. Sellers can appeal within 30 days of the dispute decision. Submit supporting evidence (photos, tracking information, correspondence) through the appeal form in your seller dashboard.",
      },
    ],
  },
];

function FAQAccordionItem({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-4 flex items-center justify-between gap-4 group"
      >
        <span className="text-white font-display font-bold text-base group-hover:text-hex transition-colors pr-4">
          {item.q}
        </span>
        <svg
          className={`w-5 h-5 text-white/30 flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pb-4 text-sm text-white/60 font-body leading-relaxed">
          {item.a}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-6xl font-display font-black text-white mb-2">FAQ</h1>
        <p className="text-white/40 font-body text-lg">
          Everything you need to know about BoBA Trader.
        </p>
      </div>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveSection(null)}
          className={`px-4 py-2 rounded-full font-display uppercase tracking-wider text-sm font-bold transition-all ${
            activeSection === null
              ? "bg-hex text-white"
              : "bg-white/5 text-white/40 hover:bg-white/10"
          }`}
        >
          All
        </button>
        {faqSections.map((section) => (
          <button
            key={section.title}
            onClick={() =>
              setActiveSection(
                activeSection === section.title ? null : section.title
              )
            }
            className={`px-4 py-2 rounded-full font-display uppercase tracking-wider text-sm font-bold transition-all ${
              activeSection === section.title
                ? "bg-hex text-white"
                : "bg-white/5 text-white/40 hover:bg-white/10"
            }`}
          >
            {section.icon} {section.title}
          </button>
        ))}
      </div>

      {/* FAQ Sections */}
      <div className="space-y-6">
        {faqSections
          .filter((s) => activeSection === null || s.title === activeSection)
          .map((section) => (
            <div
              key={section.title}
              className="card border border-white/10 overflow-hidden"
            >
              {/* Section header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                <span className="text-2xl">{section.icon}</span>
                <h2
                  className={`text-xl font-display font-black uppercase tracking-wider ${section.color}`}
                >
                  {section.title}
                </h2>
                <span className="ml-auto text-white/20 text-sm font-display">
                  {section.items.length} questions
                </span>
              </div>

              {/* Items */}
              <div className="px-6">
                {section.items.map((item, i) => (
                  <FAQAccordionItem key={i} item={item} />
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Still have questions */}
      <div className="mt-12 card border border-hex/30 bg-hex/5 p-8 text-center">
        <span className="text-4xl block mb-3">💬</span>
        <h3 className="text-2xl font-display font-black text-white mb-2">
          STILL HAVE QUESTIONS?
        </h3>
        <p className="text-white/50 font-body mb-6">
          Can&apos;t find what you&apos;re looking for? Our team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="mailto:support@bobatrader.com"
            className="btn-primary"
          >
            Contact Support
          </a>
          <Link href="/about" className="btn-secondary">
            About BoBA Trader
          </Link>
        </div>
      </div>

      {/* Footer links */}
      <div className="mt-8 border-t border-white/10 pt-8 flex flex-wrap gap-6 justify-center text-sm text-white/30">
        <Link
          href="/terms"
          className="hover:text-white transition-colors font-display uppercase tracking-wider"
        >
          Terms of Service
        </Link>
        <Link
          href="/privacy"
          className="hover:text-white transition-colors font-display uppercase tracking-wider"
        >
          Privacy Policy
        </Link>
        <Link
          href="/seller-agreement"
          className="hover:text-white transition-colors font-display uppercase tracking-wider"
        >
          Seller Agreement
        </Link>
        <Link
          href="/about"
          className="hover:text-white transition-colors font-display uppercase tracking-wider"
        >
          About
        </Link>
      </div>
    </div>
  );
}
