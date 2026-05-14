"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Stats {
  total_cards: number;
  total_users: number;
  completed_orders: number;
  active_listings: number;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`.replace(/\.0K$/, "K");
  return n.toLocaleString();
}

export default function StatsBanner() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .getMarketplaceStats()
      .then((data) =>
        setStats({
          total_cards: data.total_cards ?? 0,
          total_users: data.total_users ?? 0,
          completed_orders: data.completed_orders ?? 0,
          active_listings: data.active_listings ?? 0,
        }),
      )
      .catch(() => setError(true));
  }, []);

  if (error) return null;

  // Skeleton while loading
  if (!stats) {
    return (
      <section className="border-y border-white/5 bg-boba-panel/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="h-8 w-20 mx-auto bg-white/10 rounded mb-2" />
                <div className="h-4 w-16 mx-auto bg-white/5 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-y border-white/5 bg-boba-panel/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-display font-black text-super">
              {fmt(stats.active_listings)}
            </p>
            <p className="text-sm text-white/40 font-display uppercase tracking-wider mt-1">
              Cards Listed
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-display font-black text-hex">
              {fmt(stats.completed_orders)}
            </p>
            <p className="text-sm text-white/40 font-display uppercase tracking-wider mt-1">
              Cards Sold
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-display font-black text-glow">
              {fmt(stats.total_users)}
            </p>
            <p className="text-sm text-white/40 font-display uppercase tracking-wider mt-1">
              Active Users
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-display font-black text-ice">
              {fmt(stats.total_cards)}
            </p>
            <p className="text-sm text-white/40 font-display uppercase tracking-wider mt-1">
              Total Cards
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}