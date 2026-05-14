"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

import { API_BASE } from "@/lib/api";

interface CardData {
  id: string;
  name: string;
  card_number: string;
  card_type: string;
  set_name: string;
  year: string | null;
  parallel: string | null;
  treatment: string | null;
  variation: string | null;
  notation: string | null;
  weapon: string | null;
  power: number | null;
  athlete: string | null;
  play_cost: number | null;
  play_ability: string | null;
  radish_id: number | null;
  last_sale_price: number | null;
  last_sale_date: string | null;
  avg_price_30d: number | null;
  total_sales: number | null;
  sales_last_30d: number | null;
  image_url: string | null;
  last_sale_image: string | null;
  created_at: string;
}

const WEAPON_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  Fire: { text: "text-fire", bg: "bg-fire/15", border: "border-fire/50" },
  Ice: { text: "text-ice", bg: "bg-ice/15", border: "border-ice/50" },
  Steel: { text: "text-steel", bg: "bg-steel/15", border: "border-steel/50" },
  Glow: { text: "text-glow", bg: "bg-glow/15", border: "border-glow/50" },
  Hex: { text: "text-hex", bg: "bg-hex/15", border: "border-hex/50" },
  Gum: { text: "text-gum", bg: "bg-gum/15", border: "border-gum/50" },
  Brawl: { text: "text-brawl", bg: "bg-brawl/15", border: "border-brawl/50" },
  Super: { text: "text-super", bg: "bg-super/15", border: "border-super/50" },
  Alt: { text: "text-alt", bg: "bg-alt/15", border: "border-alt/50" },
  Cyber: { text: "text-cyber", bg: "bg-cyber/15", border: "border-cyber/50" },
};

const CONDITIONS = [
  { label: "Near Mint", abbr: "NM", desc: "Card is in perfect or near-perfect condition" },
  { label: "Lightly Played", abbr: "LP", desc: "Minor edge wear or light scratches" },
  { label: "Moderately Played", abbr: "MP", desc: "Noticeable wear, creases, or whitening" },
  { label: "Heavily Played", abbr: "HP", desc: "Significant wear, major creases" },
  { label: "Damaged", abbr: "DMG", desc: "Major damage — tears, water damage, etc." },
];

interface RealListing {
  id: string;
  seller_id: string;
  title: string;
  condition: string;
  price_cents: number;
  quantity_available: number;
  views: number;
  source: string;
  seller?: { username: string; id: string };
}

function formatPrice(price: number | null | undefined) {
  if (!price) return "—";
  return price >= 1 ? `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `$${price.toFixed(2)}`;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function CardDetailPage() {
  const params = useParams();
  const cardId = params.id as string;

  const [card, setCard] = useState<CardData | null>(null);
  const [relatedCards, setRelatedCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realListings, setRealListings] = useState<RealListing[]>([]);
  const [selectedCondition, setSelectedCondition] = useState("NM");
  const [activeTab, setActiveTab] = useState<"listings" | "history" | "details">("listings");
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  const addToCart = (listing: RealListing) => {
    if (!card) return;
    try {
      const saved = localStorage.getItem("boba-cart");
      const cart = saved ? JSON.parse(saved) : [];
      cart.push({
        listingId: listing.id,
        cardId: card.id,
        name: card.name,
        set: card.set_name,
        parallel: card.parallel,
        weapon: card.weapon,
        condition: listing.condition,
        price: listing.price_cents / 100,
        priceCents: listing.price_cents,
        qty: 1,
        seller: listing.seller?.username || "Seller",
        sellerId: listing.seller_id,
        img: card.image_url,
      });
      localStorage.setItem("boba-cart", JSON.stringify(cart));
      setAddedToCart(listing.id);
      setTimeout(() => setAddedToCart(null), 2000);
    } catch {}
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch the card from the live API
    fetch(`${API_BASE}/api/cards/${cardId}`)
      .then((r) => {
        if (!r.ok) throw new Error(r.status === 404 ? "Card not found" : "Failed to load card");
        return r.json();
      })
      .then((cardData: CardData) => {
        setCard(cardData);
        setLoading(false);

        // Fetch real listings for this card
        fetch(`${API_BASE}/api/listings?card_id=${cardData.id}&limit=20`)
          .then((r) => r.json())
          .then((data) => {
            setRealListings(data.listings || []);
          })
          .catch(() => {});

        // Fetch related cards (same name, different parallels)
        fetch(`${API_BASE}/api/cards?q=${encodeURIComponent(cardData.name)}&limit=9`)
          .then((r) => r.json())
          .then((data) => {
            const related = (data.cards || []).filter((c: CardData) => c.id !== cardData.id);
            setRelatedCards(related.slice(0, 8));
          })
          .catch(() => {});
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [cardId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-96 aspect-[2.5/3.5] bg-boba-gray rounded-boba" />
          <div className="flex-1 space-y-4">
            <div className="h-10 bg-boba-gray rounded w-2/3" />
            <div className="h-6 bg-boba-gray rounded w-1/3" />
            <div className="h-40 bg-boba-gray rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-4">🃏</span>
        <h1 className="text-3xl font-display font-black text-white mb-2">Card Not Found</h1>
        <p className="text-white/40 mb-6">{error || "This card doesn't exist or has been removed."}</p>
        <Link href="/browse" className="btn-primary">Browse All Cards</Link>
      </div>
    );
  }

  const wc = WEAPON_COLORS[card.weapon || ""] || { text: "text-white/50", bg: "bg-white/5", border: "border-white/20" };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-white/40 mb-6 font-display uppercase tracking-wider">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/browse" className="hover:text-white transition-colors">Browse</Link>
        <span>/</span>
        <Link href={`/browse?set_name=${encodeURIComponent(card.set_name)}`} className="hover:text-white transition-colors">{card.set_name}</Link>
        <span>/</span>
        <span className="text-white/60">{card.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Card Image */}
        <div className="w-full lg:w-[380px] flex-shrink-0">
          <div className={`relative aspect-[2.5/3.5] rounded-boba overflow-hidden border-2 ${wc.border} ${wc.bg}`}>
            {card.image_url ? (
              <img src={card.image_url} alt={card.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl text-white/10">🃏</span>
              </div>
            )}
          </div>
          {card.last_sale_image && (
            <div className="mt-4">
              <p className="text-xs text-white/30 font-display uppercase tracking-wider mb-2">Last Sale Photo</p>
              <img src={card.last_sale_image} alt="Last sale" className="w-24 h-24 object-cover rounded-lg border border-white/10" />
            </div>
          )}
        </div>

        {/* Right: Card Details */}
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-display font-black text-white leading-none mb-2">
              {card.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <Link href={`/browse?set_name=${encodeURIComponent(card.set_name)}`}>
                <span className="badge bg-white/10 text-white/70 hover:bg-white/20 transition-colors cursor-pointer text-sm px-3 py-1">
                  {card.set_name}
                </span>
              </Link>
              {card.weapon && (
                <span className={`badge ${wc.bg} ${wc.text} text-sm px-3 py-1`}>
                  {card.weapon}
                </span>
              )}
              {card.parallel && (
                <span className={`badge ${wc.bg} ${wc.text} text-lg px-3 py-1 border ${wc.border}`}>
                  {card.parallel}
                </span>
              )}
              <span className="text-sm text-white/30 font-mono">#{card.card_number}</span>
              {card.card_type && (
                <span className="badge bg-white/5 text-white/40 text-xs px-2 py-0.5">
                  {card.card_type}
                </span>
              )}
            </div>
          </div>

          {/* Price Block */}
          <div className={`card border ${wc.border} p-6 mb-6`}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-white/30 font-display uppercase tracking-wider mb-1">Market Price</p>
                <p className="text-3xl font-display font-black text-super">
                  {formatPrice(card.last_sale_price)}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/30 font-display uppercase tracking-wider mb-1">Last Sale</p>
                <p className="text-xl font-display font-bold text-white">
                  {formatPrice(card.last_sale_price)}
                </p>
                <p className="text-xs text-white/30 mt-0.5">{formatDate(card.last_sale_date)}</p>
              </div>
              <div>
                <p className="text-xs text-white/30 font-display uppercase tracking-wider mb-1">30-Day Avg</p>
                <p className="text-xl font-display font-bold text-white">
                  {formatPrice(card.avg_price_30d)}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/30 font-display uppercase tracking-wider mb-1">Total Sales</p>
                <p className="text-xl font-display font-bold text-white">
                  {card.total_sales || "—"}
                </p>
                <p className="text-xs text-white/30 mt-0.5">{card.sales_last_30d || 0} in 30 days</p>
              </div>
            </div>
          </div>

          {/* Hero Stats */}
          {card.power && card.power > 0 && (
            <div className="card border border-white/10 p-4 mb-6">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-white/30 font-display uppercase tracking-wider">Power</p>
                  <p className="text-2xl font-display font-black text-glow">{card.power}</p>
                </div>
                {card.athlete && (
                  <div>
                    <p className="text-xs text-white/30 font-display uppercase tracking-wider">Athlete</p>
                    <p className="text-lg font-display font-bold text-white">{card.athlete}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Play Info */}
          {card.play_ability && (
            <div className="card border border-white/10 p-4 mb-6">
              <div className="flex items-start gap-4">
                {card.play_cost !== null && (
                  <div className="flex-shrink-0">
                    <p className="text-xs text-white/30 font-display uppercase tracking-wider">Cost</p>
                    <p className="text-2xl font-display font-black text-brawl">🌭 {card.play_cost}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-white/30 font-display uppercase tracking-wider">Ability</p>
                  <p className="text-sm text-white/70 mt-1">{card.play_ability}</p>
                </div>
              </div>
            </div>
          )}

          {/* Condition Selector */}
          <div className="mb-6">
            <p className="text-sm text-white/40 font-display uppercase tracking-wider mb-3">Condition</p>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((c) => (
                <button
                  key={c.abbr}
                  onClick={() => setSelectedCondition(c.abbr)}
                  className={`px-4 py-2 rounded-full font-display text-sm uppercase tracking-wider font-bold transition-all ${
                    selectedCondition === c.abbr
                      ? "bg-gradient-to-r from-hex to-glow text-white shadow-neon"
                      : "bg-boba-gray border border-white/10 text-white/50 hover:text-white hover:border-white/30"
                  }`}
                  title={c.desc}
                >
                  {c.abbr}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-white/10 mb-6">
            <div className="flex gap-6">
              {[
                { key: "listings" as const, label: "Seller Listings", count: realListings.length },
                { key: "history" as const, label: "Price History", count: card.total_sales },
                { key: "details" as const, label: "Card Details", count: null },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-3 font-display text-base uppercase tracking-wider font-bold transition-colors relative ${
                    activeTab === tab.key ? "text-white" : "text-white/30 hover:text-white/60"
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className="ml-1.5 text-xs text-white/30">({tab.count})</span>
                  )}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 gradient-hex-glow" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "listings" && (
            <div>
              {realListings.length > 0 ? (
                <div className="space-y-3">
                  {realListings
                    .filter((l) => !selectedCondition || l.condition === selectedCondition || selectedCondition === "NM")
                    .map((listing) => (
                    <div key={listing.id} className="card border border-white/10 p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <Link href={`/user/${listing.seller_id}`} className="flex-shrink-0 w-10 h-10 rounded-full bg-boba-panel flex items-center justify-center text-lg hover:ring-2 ring-hex/50 transition">
                          👤
                        </Link>
                        <div className="min-w-0">
                          <Link href={`/user/${listing.seller_id}`}>
                            <p className="text-base font-display font-bold text-white truncate hover:text-hex transition">{listing.seller?.username || "Seller"}</p>
                          </Link>
                          <p className="text-xs text-white/30">
                            {listing.views} views · {listing.source === "discord_pipeline" ? "🤖 Bot Listed" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="badge bg-white/5 text-white/50 text-xs">{listing.condition}</span>
                          <p className="text-xs text-white/30 mt-1">Qty: {listing.quantity_available}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-display font-black text-super">${(listing.price_cents / 100).toFixed(2)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => addToCart(listing)}
                            className="bg-boba-panel border border-white/20 text-white text-sm px-3 py-2 rounded-full font-display hover:bg-white/10 transition"
                          >
                            {addedToCart === listing.id ? "✓ Added!" : "Add to Cart"}
                          </button>
                          <Link
                            href={`/checkout/${listing.id}`}
                            className="btn-primary text-sm px-4 py-2"
                          >
                            Buy Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <span className="text-4xl block mb-3">📭</span>
                  <p className="text-white/40 font-display text-lg">No listings yet for this card</p>
                  <p className="text-white/20 text-sm mt-1">Be the first to list it and set the market price!</p>
                  <Link href="/sell" className="btn-primary mt-4 inline-block">List This Card</Link>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <div className="card border border-white/10 p-6 mb-6">
                <div className="h-48 flex items-center justify-center border border-dashed border-white/10 rounded-lg">
                  <div className="text-center">
                    <span className="text-4xl block mb-2">📊</span>
                    <p className="text-white/40 font-display">Price History Chart</p>
                    <p className="text-xs text-white/20 mt-1">Coming soon — historical sale data will be displayed here</p>
                  </div>
                </div>
              </div>
              {card.last_sale_price && (
                <div>
                  <h3 className="text-lg font-display font-bold text-white mb-3 uppercase tracking-wider">Recent Sales</h3>
                  <div className="card border border-white/10 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left p-3 text-xs text-white/30 font-display uppercase tracking-wider">Date</th>
                          <th className="text-left p-3 text-xs text-white/30 font-display uppercase tracking-wider">Condition</th>
                          <th className="text-right p-3 text-xs text-white/30 font-display uppercase tracking-wider">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/5">
                          <td className="p-3 text-sm text-white/60">{formatDate(card.last_sale_date)}</td>
                          <td className="p-3"><span className="badge bg-white/5 text-white/50 text-xs">NM</span></td>
                          <td className="p-3 text-right text-base font-display font-bold text-super">{formatPrice(card.last_sale_price)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="card border border-white/10 p-6">
                <h3 className="text-lg font-display font-bold text-white mb-4 uppercase tracking-wider">Card Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Name", value: card.name },
                    { label: "Set", value: card.set_name },
                    { label: "Card Number", value: card.card_number },
                    { label: "Type", value: card.card_type },
                    { label: "Weapon", value: card.weapon || "—" },
                    { label: "Parallel", value: card.parallel || "—" },
                    { label: "Treatment", value: card.treatment || "—" },
                    { label: "Notation", value: card.notation || "—" },
                    { label: "Year", value: card.year || "—" },
                    { label: "Power", value: card.power && card.power > 0 ? String(card.power) : "—" },
                    { label: "Athlete", value: card.athlete || "—" },
                    { label: "Radish ID", value: card.radish_id ? String(card.radish_id) : "—" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-white/30 font-display uppercase tracking-wider">{item.label}</p>
                      <p className="text-base text-white font-body mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card border border-white/10 p-6">
                <h3 className="text-lg font-display font-bold text-white mb-4 uppercase tracking-wider">Condition Guide</h3>
                <div className="space-y-3">
                  {CONDITIONS.map((c) => (
                    <div key={c.abbr} className="flex items-start gap-3">
                      <span className="badge bg-white/5 text-white/50 text-xs flex-shrink-0 mt-0.5">{c.abbr}</span>
                      <div>
                        <p className="text-sm text-white font-semibold">{c.label}</p>
                        <p className="text-xs text-white/30">{c.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Cards */}
      {relatedCards.length > 0 && (
        <section className="mt-16 border-t border-white/10 pt-12">
          <h2 className="text-4xl font-display font-black text-white mb-6">
            More {card.name} Cards
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {relatedCards.map((rc) => {
              const rwc = WEAPON_COLORS[rc.weapon || ""] || { text: "text-white/50", bg: "bg-white/5", border: "border-white/20" };
              return (
                <Link key={rc.id} href={`/card/${rc.id}`}>
                  <div className={`card border ${rwc.border} group cursor-pointer`}>
                    <div className={`relative aspect-[2.5/3.5] ${rwc.bg} overflow-hidden flex items-center justify-center`}>
                      {rc.image_url ? (
                        <img src={rc.image_url} alt={rc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <span className="text-3xl text-white/10">🃏</span>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-display font-bold text-white/60 truncate group-hover:text-hex transition-colors uppercase">{rc.parallel}</p>
                      <p className={`text-[10px] font-display ${rwc.text}`}>{rc.weapon}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
