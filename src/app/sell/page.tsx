"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { API_BASE } from "@/lib/api";

interface CardEntry {
  id: string;
  n: string;
  s: string;
  cn: string;
  w: string;
  p: string;
  img?: string;
  lsp?: number;
  radish_id?: number;
}

const CONDITIONS = [
  { abbr: "NM", label: "Near Mint", desc: "Perfect or near-perfect condition" },
  { abbr: "LP", label: "Lightly Played", desc: "Minor edge wear or light scratches" },
  { abbr: "MP", label: "Moderately Played", desc: "Noticeable wear, creases, or whitening" },
  { abbr: "HP", label: "Heavily Played", desc: "Significant wear, major creases" },
  { abbr: "DMG", label: "Damaged", desc: "Major damage — tears, water damage, etc." },
];

const WEAPON_COLORS: Record<string, string> = {
  Fire: "border-fire/50", Ice: "border-ice/50", Steel: "border-steel/50",
  Glow: "border-glow/50", Hex: "border-hex/50", Gum: "border-gum/50",
  Brawl: "border-brawl/50", Super: "border-super/50",
};

export default function SellPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<CardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState<CardEntry | null>(null);
  const [condition, setCondition] = useState("NM");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishError, setPublishError] = useState("");

  // Check auth state
  useEffect(() => {
    const token = localStorage.getItem("boba-token");
    setIsLoggedIn(!!token);
  }, []);

  const handlePublish = async () => {
    const token = localStorage.getItem("boba-token");
    if (!token || !selectedCard) return;

    setPublishing(true);
    setPublishError("");

    try {
      const res = await fetch(`${API_BASE}/api/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          card_id: selectedCard.id,
          condition,
          price_cents: Math.round(priceNum * 100),
          quantity,
          description: description || undefined,
        }),
      });

      if (res.status === 401) {
        // Token expired
        localStorage.removeItem("boba-token");
        localStorage.removeItem("boba-user");
        setIsLoggedIn(false);
        setPublishError("Session expired. Please sign in again.");
        setPublishing(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setPublishError(data.detail || "Failed to publish listing");
        setPublishing(false);
        return;
      }

      setPublished(true);
      setPublishing(false);
    } catch {
      setPublishError("Network error — please try again");
      setPublishing(false);
    }
  };

  // Debounced search via live API
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2 || selectedCard) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    const timer = setTimeout(() => {
      fetch(`${API_BASE}/api/cards?q=${encodeURIComponent(searchQuery)}&limit=20`)
        .then((r) => r.json())
        .then((data) => {
          const cards = (data.cards || []).map((c: { id: string; name: string; set_name: string; card_number: string; weapon: string; parallel: string; image_url: string; last_sale_price: number }) => ({
            id: c.id,
            n: c.name,
            s: c.set_name,
            cn: c.card_number,
            w: c.weapon || "",
            p: c.parallel || "",
            img: c.image_url || undefined,
            lsp: c.last_sale_price || undefined,
          }));
          setSearchResults(cards);
          setSearchLoading(false);
        })
        .catch(() => setSearchLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCard]);

  const priceNum = parseFloat(price) || 0;
  const platformFee = priceNum * 0.08 + 0.25;
  const stripeFee = priceNum > 0 ? priceNum * 0.029 + 0.3 : 0;
  const youReceive = Math.max(0, priceNum - platformFee - stripeFee);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-5xl font-display font-black text-white mb-2">List a Card</h1>
      <p className="text-xl text-white/40 font-body mb-10">
        Free to list. We only charge 8% + $0.25 when you sell.
      </p>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-10">
        {["Select Card", "Details", "Price", "Review"].map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg ${
              i + 1 < step ? "gradient-hex-glow text-white"
                : i + 1 === step ? "bg-boba-red text-white"
                : "bg-boba-gray border border-white/10 text-white/30"
            }`}>
              {i + 1 < step ? "✓" : i + 1}
            </div>
            <span className={`text-sm font-display uppercase tracking-wider hidden sm:inline ${
              i + 1 <= step ? "text-white" : "text-white/20"
            }`}>{label}</span>
            {i < 3 && <div className={`flex-1 h-0.5 ${i + 1 < step ? "gradient-hex-glow" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Select Card */}
      {step === 1 && (
        <div className="card border border-white/10 p-8">
          <h2 className="text-2xl font-display font-bold text-white mb-4">Which card are you selling?</h2>
          <input
            type="text"
            placeholder="Search by card name or number..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setSelectedCard(null); }}
            className="input w-full text-lg mb-4"
          />

          {/* Search Results */}
          {searchResults.length > 0 && !selectedCard && (
            <div className="max-h-80 overflow-y-auto space-y-2 mb-4">
              {searchResults.map((card) => (
                <button
                  key={`${card.id}-${card.p}`}
                  onClick={() => { setSelectedCard(card); setSearchQuery(card.n); }}
                  className={`w-full text-left p-3 rounded-boba border transition-all flex items-center gap-3 ${
                    WEAPON_COLORS[card.w] || "border-white/10"
                  } bg-boba-panel hover:bg-white/5`}
                >
                  {card.img ? (
                    <img src={card.img} alt={card.n} className="w-12 h-16 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-16 bg-boba-gray rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl text-white/10">🃏</span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-display font-bold text-white truncate">{card.n}</p>
                    <p className="text-xs text-white/40">{card.s} · {card.p} · {card.w}</p>
                  </div>
                  {card.lsp && (
                    <span className="text-sm font-display font-bold text-super flex-shrink-0">
                      ${card.lsp.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Selected Card Preview */}
          {selectedCard && (
            <div className={`card border ${WEAPON_COLORS[selectedCard.w] || "border-white/10"} p-4 flex items-center gap-4 mb-4`}>
              {selectedCard.img ? (
                <img src={selectedCard.img} alt={selectedCard.n} className="w-20 h-28 object-cover rounded-boba" />
              ) : (
                <div className="w-20 h-28 bg-boba-panel rounded-boba flex items-center justify-center">
                  <span className="text-3xl text-white/10">🃏</span>
                </div>
              )}
              <div>
                <h3 className="text-xl font-display font-bold text-white">{selectedCard.n}</h3>
                <p className="text-sm text-white/40">{selectedCard.s} · {selectedCard.p}</p>
                <p className="text-sm text-white/30">{selectedCard.w} · #{selectedCard.cn}</p>
                {selectedCard.lsp && (
                  <p className="text-base font-display font-bold text-super mt-1">
                    Market: ${selectedCard.lsp.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => selectedCard && setStep(2)}
              disabled={!selectedCard}
              className="btn-primary disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Condition & Description */}
      {step === 2 && (
        <div className="card border border-white/10 p-8">
          <h2 className="text-2xl font-display font-bold text-white mb-6">Card Details</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-white/40 font-display uppercase tracking-wider mb-3">Condition *</label>
              <div className="grid grid-cols-5 gap-2">
                {CONDITIONS.map((c) => (
                  <button
                    key={c.abbr}
                    onClick={() => setCondition(c.abbr)}
                    className={`p-3 rounded-boba border text-center transition-all ${
                      condition === c.abbr
                        ? "border-hex bg-hex/10 text-hex"
                        : "border-white/10 bg-boba-panel text-white/40 hover:border-white/30"
                    }`}
                  >
                    <span className="block font-display font-bold text-lg">{c.abbr}</span>
                    <span className="block text-[10px] mt-0.5 opacity-60">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/40 font-display uppercase tracking-wider mb-2">Description (optional)</label>
              <textarea
                className="input w-full h-28 resize-none"
                placeholder="Any details about condition, centering, or notable features..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-white/40 font-display uppercase tracking-wider mb-2">Photos (up to 5)</label>
              <div className="border-2 border-dashed border-white/15 rounded-boba p-10 text-center cursor-pointer hover:border-hex/30 transition-colors">
                <span className="text-4xl block mb-2">📸</span>
                <p className="text-white/40 font-display">Click to upload or drag and drop</p>
                <p className="text-xs text-white/20 mt-1">JPG, PNG up to 5MB each</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(1)} className="btn-secondary">← Back</button>
            <button onClick={() => setStep(3)} className="btn-primary">Next →</button>
          </div>
        </div>
      )}

      {/* Step 3: Pricing */}
      {step === 3 && (
        <div className="card border border-white/10 p-8">
          <h2 className="text-2xl font-display font-bold text-white mb-6">Set Your Price</h2>

          <div className="space-y-6">
            {selectedCard?.lsp && (
              <div className="card border border-super/30 bg-super/5 p-4">
                <p className="text-sm text-white/40 font-display uppercase tracking-wider">Market Reference</p>
                <p className="text-2xl font-display font-black text-super">
                  ${selectedCard.lsp.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-white/30">Last sale price for this card</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/40 font-display uppercase tracking-wider mb-2">Price (USD) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xl font-display">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.50"
                    className="input w-full pl-10 text-2xl font-display font-bold"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/40 font-display uppercase tracking-wider mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  className="input w-full text-2xl font-display font-bold"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="card border border-white/10 p-6">
              <h3 className="text-base font-display font-bold text-white mb-4 uppercase tracking-wider">Fee Breakdown</h3>
              <div className="space-y-3 text-base">
                <div className="flex justify-between">
                  <span className="text-white/40">Sale price</span>
                  <span className="text-white font-display font-bold">${priceNum.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Platform fee (8% + $0.25)</span>
                  <span className="text-fire font-display">-${platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Payment processing (~2.9% + 30¢)</span>
                  <span className="text-fire font-display">-${stripeFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-3 mt-3 flex justify-between">
                  <span className="text-white font-display font-bold text-lg">You Receive</span>
                  <span className="text-3xl font-display font-black text-super">${youReceive.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(2)} className="btn-secondary">← Back</button>
            <button onClick={() => priceNum > 0 && setStep(4)} disabled={priceNum <= 0} className="btn-primary disabled:opacity-30">
              Review Listing →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && selectedCard && (
        <div className="card border border-white/10 p-8">
          <h2 className="text-2xl font-display font-bold text-white mb-6">Review Your Listing</h2>

          <div className="flex gap-6 mb-6">
            {selectedCard.img ? (
              <img src={selectedCard.img} alt={selectedCard.n} className="w-32 h-44 object-cover rounded-boba border border-white/10" />
            ) : (
              <div className="w-32 h-44 bg-boba-panel rounded-boba flex items-center justify-center border border-white/10">
                <span className="text-4xl text-white/10">🃏</span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-2xl font-display font-bold text-white">{selectedCard.n}</h3>
              <p className="text-base text-white/40 mt-1">{selectedCard.s} · {selectedCard.p}</p>
              <p className="text-sm text-white/30 mt-0.5">{selectedCard.w} · #{selectedCard.cn}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Condition</span>
                  <span className="text-white font-display font-bold">{condition}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Quantity</span>
                  <span className="text-white font-display font-bold">{quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Price</span>
                  <span className="text-super font-display font-black text-xl">${priceNum.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">You receive</span>
                  <span className="text-glow font-display font-bold">${youReceive.toFixed(2)}</span>
                </div>
              </div>
              {description && (
                <div className="mt-3">
                  <p className="text-xs text-white/30">Description:</p>
                  <p className="text-sm text-white/50">{description}</p>
                </div>
              )}
            </div>
          </div>

          <div className="card border border-white/10 bg-boba-panel p-4 mb-6">
            <p className="text-sm text-white/40">⚠️ By publishing, you agree to ship within 48 hours of sale and provide tracking information.</p>
          </div>

          {publishError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-boba p-3 text-red-400 text-sm mb-4">
              ❌ {publishError}
            </div>
          )}

          {published ? (
            <div className="text-center py-6">
              <span className="text-5xl block mb-3">🎉</span>
              <h3 className="text-2xl font-display font-bold text-white mb-2">Listing Published!</h3>
              <p className="text-white/40 mb-6">Your card is now live on BoBA Trader.</p>
              <div className="flex gap-4 justify-center">
                <Link href="/dashboard/sell" className="btn-primary">View My Listings</Link>
                <button onClick={() => { setStep(1); setSelectedCard(null); setPrice(""); setPublished(false); }} className="btn-secondary">
                  List Another Card
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex justify-between">
              <button onClick={() => setStep(3)} className="btn-secondary">← Back</button>
              {isLoggedIn ? (
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="btn-primary text-lg px-8 py-3 disabled:opacity-50"
                >
                  {publishing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Publishing...
                    </span>
                  ) : (
                    "🚀 Publish Listing"
                  )}
                </button>
              ) : (
                <Link href="/auth?redirect=/sell" className="btn-primary text-lg px-8 py-3">
                  🔐 Sign In to Publish
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
