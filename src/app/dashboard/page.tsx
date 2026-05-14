"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE, apiFetch } from "@/lib/api-client";

interface DashboardStats {
  active_listings: number;
  total_sales: number;
  total_revenue_cents: number;
  pending_shipments: number;
  pending_delivery_confirmations: number;
  stripe_onboarded: boolean;
  role: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("boba-token");
    if (!t) return;
    loadStats(t);
  }, []);

  const loadStats = async (token: string) => {
    try {
      const res = await apiFetch(`${API_BASE}/api/seller/dashboard`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // Not a seller yet, stats will show defaults
    } finally {
      setLoading(false);
    }
  };

  const activeListings = stats?.active_listings ?? 0;
  const totalSales = stats?.total_sales ?? 0;
  const revenue = stats?.total_revenue_cents ? `$${(stats.total_revenue_cents / 100).toFixed(2)}` : "$0.00";
  const pendingOrders = (stats?.pending_shipments ?? 0) + (stats?.pending_delivery_confirmations ?? 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-5xl font-display font-black text-white mb-2">Dashboard</h1>
      <p className="text-xl text-white/70 font-body mb-10">Manage your listings, orders, and sales</p>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Active Listings", value: String(activeListings), icon: "📦", color: "border-hex/40" },
          { label: "Total Sales", value: revenue, icon: "💰", color: "border-super/40" },
          { label: "Pending Orders", value: String(pendingOrders), icon: "🔄", color: "border-brawl/40" },
          { label: "Seller Rating", value: "—", icon: "⭐", color: "border-glow/40" },
        ].map((stat) => (
          <div key={stat.label} className={`card border ${stat.color} p-6`}>
            <span className="text-3xl block mb-2">{stat.icon}</span>
            <p className="text-3xl font-display font-black text-white">
              {loading ? (
                <span className="inline-block w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              ) : (
                stat.value
              )}
            </p>
            <p className="text-sm text-white/70 font-display uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Link href="/sell" className="card border border-hex/30 p-6 group hover:border-hex/60 transition-all">
          <span className="text-3xl block mb-3">➕</span>
          <h3 className="text-xl font-display font-bold text-white group-hover:text-hex transition-colors">List a Card</h3>
          <p className="text-base text-white/70 mt-1">Create a new listing</p>
        </Link>
        <Link href="/dashboard/sell" className="card border border-glow/30 p-6 group hover:border-glow/60 transition-all">
          <span className="text-3xl block mb-3">📋</span>
          <h3 className="text-xl font-display font-bold text-white group-hover:text-glow transition-colors">My Listings</h3>
          <p className="text-base text-white/70 mt-1">Manage active & sold listings</p>
        </Link>
        <Link href="/dashboard/orders" className="card border border-super/30 p-6 group hover:border-super/60 transition-all">
          <span className="text-3xl block mb-3">📬</span>
          <h3 className="text-xl font-display font-bold text-white group-hover:text-super transition-colors">Sales</h3>
          <p className="text-base text-white/70 mt-1">Manage orders & shipments</p>
        </Link>
        <Link href="/dashboard/purchases" className="card border border-hex/30 p-6 group hover:border-hex/60 transition-all">
          <span className="text-3xl block mb-3">🛒</span>
          <h3 className="text-xl font-display font-bold text-white group-hover:text-hex transition-colors">My Purchases</h3>
          <p className="text-base text-white/70 mt-1">Track your buying activity</p>
        </Link>
        <Link href="/dashboard/profile" className="card border border-super/30 p-6 group hover:border-super/60 transition-all">
          <span className="text-3xl block mb-3">👤</span>
          <h3 className="text-xl font-display font-bold text-white group-hover:text-super transition-colors">Profile</h3>
          <p className="text-base text-white/70 mt-1">Edit username, bio & display name</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="card border border-white/10 p-6">
        <h2 className="text-2xl font-display font-bold text-white mb-6 uppercase tracking-wider">Recent Activity</h2>
        <div className="text-center py-12">
          <span className="text-5xl block mb-4">📭</span>
          <p className="text-white/70 font-display text-lg">No activity yet</p>
          <p className="text-white/20 text-sm mt-1">Your sales, purchases, and listing updates will appear here</p>
          <Link href="/sell" className="btn-primary mt-6 inline-block">List Your First Card</Link>
        </div>
      </div>
    </div>
  );
}