"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE, apiFetch } from "@/lib/api";

interface User {
  id: string;
  username: string;
  display_name: string | null;
  email: string;
  role: string;
  discord_id: string | null;
  google_id: boolean;
  created_at: string;
  last_login: string | null;
}

interface Order {
  id: string;
  status: string;
  buyer_username: string | null;
  seller_username: string | null;
  listing_title: string | null;
  total_cents: number;
  created_at: string;
}

interface Stats {
  total_users: number;
  total_sellers: number;
  total_listings: number;
  total_orders: number;
  completed_orders: number;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem("boba-token");
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    try {
      // Fetch users
      const usersRes = await apiFetch(`${API_BASE}/api/admin/users?limit=100`);
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      // Fetch orders
      const ordersRes = await apiFetch(`${API_BASE}/api/admin/orders?limit=50`);
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }

      // Fetch stats
      const statsRes = await apiFetch(`${API_BASE}/api/marketplace/stats`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats({
          total_users: statsData.total_users || 0,
          total_sellers: statsData.sellers?.total || 0,
          total_listings: statsData.listings?.total || 0,
          total_orders: statsData.orders?.total || 0,
          completed_orders: statsData.orders?.completed || 0,
        });
      }
    } catch (e) {
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center">
        <div className="animate-spin h-12 w-12 border-4 border-white/20 border-t-super rounded-full mx-auto" />
        <p className="text-white/60 mt-4 font-display">Loading admin dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center">
        <p className="text-red-400 font-display text-xl">{error}</p>
        <p className="text-white/40 mt-2">Admin access required</p>
      </div>
    );
  }

  const realUsers = users.filter(u => 
    !u.email.includes("test") && 
    !u.email.includes("clawd.") &&
    !u.email.includes("servius") &&
    !u.email.includes("audit") &&
    !u.email.includes("smoketest") &&
    !u.email.includes("@example.com") &&
    !u.email.includes("@t.com") &&
    !u.email.includes("@x.com")
  );

  const sellers = users.filter(u => u.role === "seller" || u.role === "admin");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-5xl font-display font-black text-white">Admin Dashboard</h1>
          <p className="text-xl text-white/70 font-body mt-2">BoBA Trader Operations Center</p>
        </div>
        <Link href="/" className="btn-secondary">← Back to Home</Link>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
          {[
            { label: "Total Users", value: stats.total_users, color: "border-super/40" },
            { label: "Sellers", value: stats.total_sellers, color: "border-hex/40" },
            { label: "Listings", value: stats.total_listings, color: "border-glow/40" },
            { label: "Orders", value: stats.total_orders, color: "border-brawl/40" },
            { label: "Completed", value: stats.completed_orders, color: "border-ice/40" },
          ].map((stat) => (
            <div key={stat.label} className={`card border ${stat.color} p-6 text-center`}>
              <p className="text-3xl font-display font-black text-white">{stat.value}</p>
              <p className="text-sm text-white/50 font-display uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Real Users Table */}
      <div className="card border border-white/10 p-6 mb-10">
        <h2 className="text-2xl font-display font-bold text-white mb-6 uppercase tracking-wider">
          Real Users ({realUsers.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-3 text-white/60 font-display uppercase text-sm">Username</th>
                <th className="pb-3 text-white/60 font-display uppercase text-sm">Email</th>
                <th className="pb-3 text-white/60 font-display uppercase text-sm">Display Name</th>
                <th className="pb-3 text-white/60 font-display uppercase text-sm">Role</th>
                <th className="pb-3 text-white/60 font-display uppercase text-sm">Joined</th>
                <th className="pb-3 text-white/60 font-display uppercase text-sm">Auth</th>
              </tr>
            </thead>
            <tbody>
              {realUsers.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 text-white font-mono">{u.username}</td>
                  <td className="py-3 text-white/70">{u.email}</td>
                  <td className="py-3 text-white/70">{u.display_name || "—"}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs font-display uppercase ${
                      u.role === "admin" ? "bg-super/20 text-super" :
                      u.role === "seller" ? "bg-hex/20 text-hex" :
                      "bg-white/10 text-white/60"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-white/50 text-sm">{u.created_at?.slice(0, 10)}</td>
                  <td className="py-3 text-white/50 text-sm">
                    {u.discord_id ? "Discord" : ""}
                    {u.google_id ? " Google" : ""}
                    {!u.discord_id && !u.google_id ? "Password" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Users Table (collapsible) */}
      <div className="card border border-white/10 p-6 mb-10">
        <h2 className="text-2xl font-display font-bold text-white mb-6 uppercase tracking-wider">
          All Users Including Test Accounts ({users.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-3 text-white/60 font-display uppercase text-sm">Username</th>
                <th className="pb-3 text-white/60 font-display uppercase text-sm">Email</th>
                <th className="pb-3 text-white/60 font-display uppercase text-sm">Role</th>
                <th className="pb-3 text-white/60 font-display uppercase text-sm">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 text-white font-mono">{u.username}</td>
                  <td className="py-3 text-white/70">{u.email}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs font-display uppercase ${
                      u.role === "admin" ? "bg-super/20 text-super" :
                      u.role === "seller" ? "bg-hex/20 text-hex" :
                      "bg-white/10 text-white/60"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-white/50 text-sm">{u.created_at?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card border border-white/10 p-6">
        <h2 className="text-2xl font-display font-bold text-white mb-6 uppercase tracking-wider">
          Recent Orders ({orders.length})
        </h2>
        {orders.length === 0 ? (
          <p className="text-white/40 text-center py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 text-white/60 font-display uppercase text-sm">ID</th>
                  <th className="pb-3 text-white/60 font-display uppercase text-sm">Status</th>
                  <th className="pb-3 text-white/60 font-display uppercase text-sm">Buyer</th>
                  <th className="pb-3 text-white/60 font-display uppercase text-sm">Seller</th>
                  <th className="pb-3 text-white/60 font-display uppercase text-sm">Listing</th>
                  <th className="pb-3 text-white/60 font-display uppercase text-sm">Total</th>
                  <th className="pb-3 text-white/60 font-display uppercase text-sm">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 text-white font-mono">{o.id.slice(0, 8)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-display uppercase ${
                        o.status === "paid" ? "bg-glow/20 text-glow" :
                        o.status === "shipped" ? "bg-hex/20 text-hex" :
                        o.status === "pending" ? "bg-brawl/20 text-brawl" :
                        "bg-white/10 text-white/60"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 text-white/70">{o.buyer_username || "?"}</td>
                    <td className="py-3 text-white/70">{o.seller_username || "?"}</td>
                    <td className="py-3 text-white/70">{o.listing_title || "?"}</td>
                    <td className="py-3 text-white font-display">${(o.total_cents / 100).toFixed(2)}</td>
                    <td className="py-3 text-white/50 text-sm">{o.created_at?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
