"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { API_BASE, apiFetch } from "@/lib/api-client";

const TIER_COLORS: Record<string, string> = {
  Steel: "#71717A", Fire: "#EF4444", Ice: "#38BDF8",
  Glow: "#79F528", Hex: "#A855F7", Super: "#FBBF24",
};

interface InventoryStats {
  active_listings: number;
  paused_listings: number;
  sold_listings: number;
  total_inventory_value_cents: number;
  total_views: number;
  listing_slot_limit: number | null;
  listing_slots_used: number;
  seller_tier: string;
  seller_tier_emoji: string;
}

interface Listing {
  id: string;
  title: string;
  condition: string;
  price_cents: number;
  quantity_available: number;
  status: string;
  views: number;
  source: string;
  created_at: string;
  card?: { name: string; image_url: string; set_name: string };
}

export default function InventoryPage() {
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState("active");
  const [loading, setLoading] = useState(true);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [bulkValue, setBulkValue] = useState("");
  const [actionResult, setActionResult] = useState<string>("");

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("boba-token");
    setToken(t);
  }, []);

  useEffect(() => {
    if (token !== null) loadData();
  }, [statusFilter, token]);

  async function loadData() {
    if (!token) { setLoading(false); return; }
    try {
      const [statsRes, listingsRes] = await Promise.all([
        apiFetch(`${API_BASE}/api/listings/inventory/stats`),
        apiFetch(`${API_BASE}/api/listings?seller_id=me&status=${statusFilter}&limit=100`),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (listingsRes.ok) {
        const data = await listingsRes.json();
        setListings(data.listings || []);
      }
      // If both fail with 401, apiFetch will auto-refresh and redirect
      if (!statsRes.ok && !listingsRes.ok) {
        const errData = await listingsRes.json().catch(() => ({}));
        console.error("Inventory load failed:", errData);
      }
    } catch (e) {
      console.error("Failed to load inventory:", e);
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectAll() {
    if (selected.size === listings.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(listings.map((l) => l.id)));
    }
  }

  async function executeBulkAction() {
    if (selected.size === 0) return;
    const ids = Array.from(selected);

    try {
      if (["active", "paused", "removed"].includes(bulkAction)) {
        const res = await apiFetch(`${API_BASE}/api/listings/inventory/bulk-status`, {
          method: "POST",
          body: JSON.stringify({ listing_ids: ids, status: bulkAction }),
        });
        const data = await res.json();
        if (res.ok) {
          setActionResult(`✅ ${data.updated} listings updated to "${bulkAction}"`);
        } else {
          setActionResult(`❌ ${data.detail || "Update failed"}`);
        }
      } else if (bulkAction.startsWith("price_")) {
        const type = bulkAction.replace("price_", "");
        const val = parseInt(bulkValue);
        if (isNaN(val)) { setActionResult("❌ Enter a valid number"); return; }
        const res = await apiFetch(`${API_BASE}/api/listings/inventory/bulk-price`, {
          method: "POST",
          body: JSON.stringify({ listing_ids: ids, adjustment_type: type, value: val }),
        });
        const data = await res.json();
        if (res.ok) {
          setActionResult(`✅ ${data.updated} prices updated`);
        } else {
          setActionResult(`❌ ${data.detail || "Update failed"}`);
        }
      }
      setSelected(new Set());
      loadData();
    } catch (e) {
      setActionResult(`❌ Error: ${e}`);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-boba-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 font-display text-xl mb-4">Sign in to manage your inventory</p>
          <Link href="/auth" className="bg-boba-red text-white px-6 py-3 rounded-full font-display font-bold uppercase">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const tierColor = stats ? TIER_COLORS[stats.seller_tier] || "#71717A" : "#71717A";
  const slotPct = stats && stats.listing_slot_limit ? (stats.listing_slots_used / stats.listing_slot_limit) * 100 : 0;

  return (
    <div className="min-h-screen bg-boba-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-black text-4xl text-white uppercase">Inventory Manager</h1>
            <p className="text-white/40 mt-1">Manage your listings, prices, and inventory</p>
          </div>
          <Link href="/sell" className="bg-super text-black px-6 py-3 rounded-full font-display font-bold uppercase hover:brightness-110 transition">
            + New Listing
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-boba-panel rounded-boba p-4 border border-white/10">
              <p className="text-white/40 text-xs font-display uppercase">Active</p>
              <p className="text-3xl font-display font-black text-super">{stats.active_listings}</p>
            </div>
            <div className="bg-boba-panel rounded-boba p-4 border border-white/10">
              <p className="text-white/40 text-xs font-display uppercase">Paused</p>
              <p className="text-3xl font-display font-black text-white/60">{stats.paused_listings}</p>
            </div>
            <div className="bg-boba-panel rounded-boba p-4 border border-white/10">
              <p className="text-white/40 text-xs font-display uppercase">Sold</p>
              <p className="text-3xl font-display font-black text-boba-gold">{stats.sold_listings}</p>
            </div>
            <div className="bg-boba-panel rounded-boba p-4 border border-white/10">
              <p className="text-white/40 text-xs font-display uppercase">Inventory Value</p>
              <p className="text-3xl font-display font-black text-white">${(stats.total_inventory_value_cents / 100).toFixed(0)}</p>
            </div>
            <div className="bg-boba-panel rounded-boba p-4 border border-white/10">
              <p className="text-white/40 text-xs font-display uppercase">Total Views</p>
              <p className="text-3xl font-display font-black text-white">{stats.total_views.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Tier & Slot Usage */}
        {stats && (
          <div className="bg-boba-panel rounded-boba p-4 border border-white/10 mb-8 flex flex-col md:flex-row items-center gap-4">
            <span className="text-2xl">{stats.seller_tier_emoji}</span>
            <span className="font-display font-bold uppercase" style={{ color: tierColor }}>{stats.seller_tier} Tier</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <span>Slots: {stats.listing_slots_used} / {stats.listing_slot_limit ?? "∞"}</span>
              </div>
              {stats.listing_slot_limit && (
                <div className="h-2 bg-white/10 rounded-full mt-1 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(slotPct, 100)}%`, backgroundColor: slotPct > 90 ? "#EF4444" : tierColor }} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bulk Actions Bar */}
        <div className="bg-boba-panel rounded-boba p-4 border border-white/10 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-white/70 text-sm font-display">{selected.size} selected</span>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="bg-white/5 border border-white/15 rounded-boba px-3 py-2 text-white text-sm focus:border-boba-red outline-none"
            >
              <option value="">Bulk Action...</option>
              <optgroup label="Status">
                <option value="active">Activate</option>
                <option value="paused">Pause</option>
                <option value="removed">Remove</option>
              </optgroup>
              <optgroup label="Price">
                <option value="price_increase_percent">Increase Price %</option>
                <option value="price_decrease_percent">Decrease Price %</option>
                <option value="price_increase_cents">Increase Price $</option>
                <option value="price_decrease_cents">Decrease Price $</option>
                <option value="price_set">Set Price To</option>
              </optgroup>
            </select>

            {bulkAction.startsWith("price_") && (
              <input
                type="number"
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
                placeholder={bulkAction.includes("percent") ? "e.g., 1000 = 10%" : "cents"}
                className="bg-white/5 border border-white/15 rounded-boba px-3 py-2 text-white text-sm w-40 focus:border-boba-red outline-none"
              />
            )}

            <button
              onClick={executeBulkAction}
              disabled={selected.size === 0 || !bulkAction}
              className="bg-boba-red text-white px-4 py-2 rounded-full font-display text-sm uppercase disabled:opacity-30 hover:brightness-110 transition"
            >
              Apply
            </button>

            {actionResult && <span className="text-sm text-super">{actionResult}</span>}
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {["active", "paused", "sold", "removed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-full font-display text-xs uppercase tracking-wider transition-all
                ${statusFilter === s ? "bg-white/20 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Listings Table */}
        <div className="bg-boba-panel rounded-boba border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-3 text-left">
                  <input type="checkbox" checked={selected.size === listings.length && listings.length > 0} onChange={selectAll} className="accent-boba-red" />
                </th>
                <th className="p-3 text-left text-white/70 font-display text-xs uppercase">Card</th>
                <th className="p-3 text-left text-white/70 font-display text-xs uppercase">Condition</th>
                <th className="p-3 text-right text-white/70 font-display text-xs uppercase">Price</th>
                <th className="p-3 text-right text-white/70 font-display text-xs uppercase">Qty</th>
                <th className="p-3 text-right text-white/70 font-display text-xs uppercase">Views</th>
                <th className="p-3 text-left text-white/70 font-display text-xs uppercase">Source</th>
                <th className="p-3 text-left text-white/70 font-display text-xs uppercase">Listed</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-white/30">Loading...</td></tr>
              ) : listings.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-white/60 font-display">No {statusFilter} listings</td></tr>
              ) : (
                listings.map((listing) => (
                  <tr key={listing.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="p-3">
                      <input type="checkbox" checked={selected.has(listing.id)} onChange={() => toggleSelect(listing.id)} className="accent-boba-red" />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {listing.card?.image_url && (
                          <img src={listing.card.image_url} alt="" className="w-10 h-14 object-cover rounded" />
                        )}
                        <div>
                          <p className="text-white text-sm font-display font-bold">{listing.title}</p>
                          {listing.card?.set_name && (
                            <p className="text-white/30 text-xs">{listing.card.set_name}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-white/60 text-sm">{listing.condition}</td>
                    <td className="p-3 text-right text-boba-gold font-display font-bold">${(listing.price_cents / 100).toFixed(2)}</td>
                    <td className="p-3 text-right text-white/60 text-sm">{listing.quantity_available}</td>
                    <td className="p-3 text-right text-white/70 text-sm">{listing.views}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${listing.source === "discord_pipeline" ? "bg-hex/20 text-hex" : "bg-white/10 text-white/40"}`}>
                        {listing.source === "discord_pipeline" ? "🤖 Bot" : listing.source === "bulk_import" ? "📦 Bulk" : "✍️ Manual"}
                      </span>
                    </td>
                    <td className="p-3 text-white/30 text-xs">{new Date(listing.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
