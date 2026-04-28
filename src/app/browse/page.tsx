"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { API_BASE } from "@/lib/api";

interface CardEntry {
  id: string;
  name: string;
  card_number: string;
  set_name: string;
  weapon: string | null;
  parallel: string | null;
  image_url: string | null;
  last_sale_price: number | null;
  power: number | null;
}

interface FilterOptions {
  sets: string[];
  weapons: string[];
  parallels: string[];
  card_types: string[];
  years: string[];
  notations: string[];
}

interface CardsResponse {
  cards: CardEntry[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

const WEAPON_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  Fire:  { bg: "bg-fire/15", text: "text-fire-light", border: "border-fire/40", glow: "hover:shadow-weapon-fire" },
  Ice:   { bg: "bg-ice/15", text: "text-ice-light", border: "border-ice/40", glow: "hover:shadow-weapon-ice" },
  Steel: { bg: "bg-steel/15", text: "text-steel-light", border: "border-steel/40", glow: "hover:shadow-weapon-steel" },
  Glow:  { bg: "bg-glow/15", text: "text-glow", border: "border-glow/40", glow: "hover:shadow-weapon-glow" },
  Hex:   { bg: "bg-hex/15", text: "text-hex-light", border: "border-hex/40", glow: "hover:shadow-weapon-hex" },
  Gum:   { bg: "bg-gum/15", text: "text-gum-light", border: "border-gum/40", glow: "hover:shadow-weapon-gum" },
  Super: { bg: "bg-super/15", text: "text-super", border: "border-super/40", glow: "hover:shadow-weapon-super" },
  Brawl: { bg: "bg-brawl/15", text: "text-brawl-light", border: "border-brawl/40", glow: "hover:shadow-weapon-brawl" },
  Alt:   { bg: "bg-alt/15", text: "text-alt-light", border: "border-alt/40", glow: "hover:shadow-weapon-fire" },
  Cyber: { bg: "bg-cyber/15", text: "text-cyber-light", border: "border-cyber/40", glow: "hover:shadow-weapon-ice" },
};

const PAGE_SIZE = 48;

// Map frontend sort names to API sort/order
function mapSort(sortBy: string): { sort: string; order: string } {
  switch (sortBy) {
    case "price-high": return { sort: "last_sale_price", order: "desc" };
    case "price-low": return { sort: "last_sale_price", order: "asc" };
    case "newest": return { sort: "created_at", order: "desc" };
    default: return { sort: "name", order: "asc" };
  }
}

function BrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [cards, setCards] = useState<CardEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get("page") || "1");
  const query = searchParams.get("q") || "";
  const setFilter = searchParams.get("set_name") || "";
  const weaponFilter = searchParams.get("weapon") || "";
  const parallelFilter = searchParams.get("parallel") || "";
  const sortBy = searchParams.get("sort") || "name";

  // Fetch filters once
  useEffect(() => {
    fetch(`${API_BASE}/api/cards/filters`)
      .then((r) => r.json())
      .then(setFilters)
      .catch(console.error);
  }, []);

  // Fetch cards whenever params change
  useEffect(() => {
    setLoading(true);
    const { sort, order } = mapSort(sortBy);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));
    params.set("sort", sort);
    params.set("order", order);
    if (query) params.set("q", query);
    if (setFilter) params.set("set_name", setFilter);
    if (weaponFilter) params.set("weapon", weaponFilter);
    if (parallelFilter) params.set("parallel", parallelFilter);

    fetch(`${API_BASE}/api/cards?${params.toString()}`)
      .then((r) => r.json())
      .then((data: CardsResponse) => {
        setCards(data.cards);
        setTotal(data.total);
        setTotalPages(data.total_pages);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [page, query, setFilter, weaponFilter, parallelFilter, sortBy]);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) { params.set(key, value); } else { params.delete(key); }
      params.set("page", "1");
      router.push(`/browse?${params.toString()}`);
    },
    [searchParams, router]
  );

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-black text-white">
            {query ? `Results for "${query}"` : setFilter || (weaponFilter ? `${weaponFilter} Cards` : "Browse All Cards")}
          </h1>
          <p className="text-white/40 font-display text-lg mt-1">
            {total.toLocaleString()} cards · Page {page}/{totalPages || 1}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-white/40 font-display uppercase tracking-wider">Sort:</label>
          <select
            className="input text-sm py-1.5 px-3"
            value={sortBy}
            onChange={(e) => updateParam("sort", e.target.value)}
          >
            <option value="name">Name A→Z</option>
            <option value="price-high">Price High→Low</option>
            <option value="price-low">Price Low→High</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <h2 className="text-lg font-display font-bold text-white mb-4 uppercase tracking-wider">Filters</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-xs text-white/40 mb-1 font-display uppercase tracking-wider">Search</label>
              <input
                type="text"
                placeholder="Card name..."
                defaultValue={query}
                onKeyDown={(e) => { if (e.key === "Enter") updateParam("q", (e.target as HTMLInputElement).value); }}
                onBlur={(e) => updateParam("q", e.target.value)}
                className="input w-full text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1 font-display uppercase tracking-wider">Set</label>
              <select className="input w-full text-sm" value={setFilter} onChange={(e) => updateParam("set_name", e.target.value)}>
                <option value="">All Sets</option>
                {filters?.sets.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1 font-display uppercase tracking-wider">Weapon</label>
              <select className="input w-full text-sm" value={weaponFilter} onChange={(e) => updateParam("weapon", e.target.value)}>
                <option value="">All Weapons</option>
                {filters?.weapons.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1 font-display uppercase tracking-wider">Parallel</label>
              <select className="input w-full text-sm" value={parallelFilter} onChange={(e) => updateParam("parallel", e.target.value)}>
                <option value="">All Parallels</option>
                {filters?.parallels.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            {(query || setFilter || weaponFilter || parallelFilter) && (
              <button onClick={() => router.push("/browse")} className="text-sm text-hex hover:text-hex-light font-display uppercase tracking-wider">
                ✕ Clear All Filters
              </button>
            )}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-[2.5/3.5] bg-boba-panel" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-boba-panel rounded w-3/4" />
                    <div className="h-3 bg-boba-panel rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-6xl">🃏</span>
              <p className="text-white/40 mt-4 font-display text-xl uppercase">No cards match your filters</p>
              <button onClick={() => router.push("/browse")} className="btn-secondary mt-4">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {cards.map((card) => {
                const wc = WEAPON_COLORS[card.weapon || ""] || { bg: "bg-white/5", text: "text-white/50", border: "border-white/10", glow: "" };
                return (
                  <Link key={card.id} href={`/card/${card.id}`}>
                    <div className={`card ${wc.glow} border ${wc.border} group cursor-pointer transition-all duration-300`}>
                      <div className={`relative aspect-[2.5/3.5] ${wc.bg} overflow-hidden flex items-center justify-center`}>
                        {card.image_url ? (
                          <img
                            src={card.image_url}
                            alt={card.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : card.last_sale_image ? (
                          <img
                            src={card.last_sale_image}
                            alt={card.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-5xl text-white/20 group-hover:scale-110 transition-transform duration-300">🃏</span>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-display font-bold text-white truncate group-hover:text-hex transition-colors uppercase">
                          {card.name}
                        </h3>
                        <p className="text-xs text-white/30 mt-0.5 truncate">
                          {card.set_name} · {card.parallel || card.card_number}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          {card.last_sale_price ? (
                            <span className="text-sm font-display font-black text-super">
                              ${card.last_sale_price >= 1
                                ? card.last_sale_price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                : card.last_sale_price.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-xs text-white/20 font-mono">{card.card_number}</span>
                          )}
                          {card.weapon && (
                            <span className={`badge text-[10px] ${wc.bg} ${wc.text}`}>
                              {card.weapon}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => goToPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="btn-secondary text-sm disabled:opacity-30 px-4 py-2"
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                let p: number;
                if (totalPages <= 7) p = i + 1;
                else if (page <= 4) p = i + 1;
                else if (page >= totalPages - 3) p = totalPages - 6 + i;
                else p = page - 3 + i;
                return (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`w-10 h-10 rounded-full text-sm font-display font-bold transition-all duration-200 ${
                      p === page
                        ? "bg-gradient-to-r from-hex to-glow text-white shadow-neon"
                        : "bg-boba-gray text-white/40 hover:text-white border border-white/10"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => goToPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="btn-secondary text-sm disabled:opacity-30 px-4 py-2"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="text-center py-20">
        <div className="inline-block w-8 h-8 border-2 border-hex border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 mt-4 font-display uppercase tracking-wider">Loading cards...</p>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
