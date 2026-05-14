"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE, apiFetch } from "@/lib/api-client";

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
  card?: { name: string; image_url?: string; set_name?: string };
  images?: { image_url: string }[];
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-glow/15 text-glow",
  paused: "bg-ice/15 text-ice",
  sold: "bg-super/15 text-super",
  removed: "bg-fire/15 text-fire",
  draft: "bg-brawl/15 text-brawl",
};

const STATUS_FILTERS = [
  { key: "active", label: "Active" },
  { key: "paused", label: "Paused" },
  { key: "sold", label: "Sold" },
  { key: "removed", label: "Removed" },
];

export default function SellerListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("active");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editCondition, setEditCondition] = useState("");
  const [editQty, setEditQty] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("boba-token");
    if (!t) {
      window.location.href = "/auth?redirect=/dashboard/sell";
      return;
    }
    loadListings();
  }, [activeFilter]);

  async function loadListings() {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch(`${API_BASE}/api/listings?seller_id=me&status=${activeFilter}&limit=100`);
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings || []);
      } else {
        const err = await res.json().catch(() => ({ detail: "Failed to load" }));
        setError(err.detail || "Failed to load listings");
      }
    } catch {
      setError("Network error — check your connection and try again");
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(listing: Listing) {
    setEditingId(listing.id);
    setEditPrice((listing.price_cents / 100).toFixed(2));
    setEditCondition(listing.condition);
    setEditQty(String(listing.quantity_available));
    setActionMsg("");
  }

  async function saveEdit() {
    if (!editingId) return;
    try {
      const res = await apiFetch(`${API_BASE}/api/listings/${editingId}`, {
        method: "PUT",
        body: JSON.stringify({
          price_cents: Math.round(parseFloat(editPrice) * 100),
          condition: editCondition,
          quantity: parseInt(editQty) || 1,
        }),
      });
      if (res.ok) {
        setActionMsg("✅ Listing updated");
        setEditingId(null);
        loadListings();
      } else {
        const err = await res.json().catch(() => ({ detail: "Update failed" }));
        setActionMsg(`❌ ${err.detail || "Update failed"}`);
      }
    } catch {
      setActionMsg("❌ Network error");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this listing? It will be marked as removed.")) return;
    try {
      const res = await apiFetch(`${API_BASE}/api/listings/${id}`, { method: "DELETE" });
      if (res.ok || res.status === 204) {
        setActionMsg("✅ Listing removed");
        loadListings();
      } else {
        setActionMsg("❌ Delete failed");
      }
    } catch {
      setActionMsg("❌ Network error");
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl font-display font-black text-white">My Listings</h1>
          <p className="text-xl text-white/70 font-body mt-1">Manage your card inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/inventory" className="btn-secondary text-lg px-6 py-3">
            📦 Inventory Manager
          </Link>
          <Link href="/dashboard/sell/import-ebay" className="btn-secondary text-lg px-6 py-3">
            📥 Import eBay
          </Link>
          <Link href="/sell" className="btn-primary text-lg px-8 py-3">
            ➕ New Listing
          </Link>
        </div>
      </div>

      {actionMsg && (
        <div className="mb-4 p-3 rounded-lg bg-white/5 text-sm font-display">{actionMsg}</div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-5 py-2 rounded-full font-display text-sm uppercase tracking-wider font-bold transition-all cursor-pointer ${
              activeFilter === f.key
                ? "bg-gradient-to-r from-hex to-glow text-white"
                : "bg-boba-gray border border-white/15 text-white hover:text-super hover:border-hex/30 font-bold"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-fire/10 border border-fire/30 text-fire font-display">
          {error}
        </div>
      )}

      {/* Listings Table */}
      <div className="card border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-boba-panel">
                <th className="text-left p-4 text-sm text-white/70 font-display font-bold uppercase tracking-wider">Card</th>
                <th className="text-center p-4 text-sm text-white/70 font-display font-bold uppercase tracking-wider">Condition</th>
                <th className="text-center p-4 text-sm text-white/70 font-display font-bold uppercase tracking-wider">Qty</th>
                <th className="text-right p-4 text-sm text-white/70 font-display font-bold uppercase tracking-wider">Price</th>
                <th className="text-center p-4 text-sm text-white/70 font-display font-bold uppercase tracking-wider">Status</th>
                <th className="text-center p-4 text-sm text-white/70 font-display font-bold uppercase tracking-wider">Views</th>
                <th className="text-right p-4 text-sm text-white/70 font-display font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-white/80 font-display">Loading...</td></tr>
              ) : listings.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-white/60 font-display">
                  No {activeFilter} listings — <Link href="/sell" className="text-hex hover:underline">create one</Link> or <Link href="/dashboard/sell/import-ebay" className="text-hex hover:underline">import from eBay</Link>
                </td></tr>
              ) : (
                listings.map((listing) => (
                  editingId === listing.id ? (
                    <tr key={listing.id} className="border-b border-white/5 bg-hex/5">
                      <td className="p-4 font-display font-bold text-white">{listing.title}</td>
                      <td className="p-4 text-center">
                        <select value={editCondition} onChange={(e) => setEditCondition(e.target.value)} className="bg-white/5 border border-white/20 rounded px-2 py-1 text-white text-sm">
                          {["Mint","Near Mint","Lightly Played","Moderately Played","Heavily Played","Damaged","NM","LP","MP","HP"].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        <input type="number" value={editQty} onChange={(e) => setEditQty(e.target.value)} className="bg-white/5 border border-white/20 rounded px-2 py-1 text-white text-sm w-16 text-center" min="1" />
                      </td>
                      <td className="p-4 text-right">
                        <input type="text" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="bg-white/5 border border-white/20 rounded px-2 py-1 text-white text-sm w-24 text-right" />
                      </td>
                      <td className="p-4 text-center">
                        <span className={`badge text-xs ${STATUS_STYLES[listing.status] || "bg-white/10 text-white/40"}`}>
                          {listing.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-center text-white/80 font-display">{listing.views}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={saveEdit} className="text-sm text-glow hover:text-glow/80 font-display font-bold uppercase tracking-wider">Save</button>
                          <button onClick={() => setEditingId(null)} className="text-sm text-white hover:text-super font-display font-bold uppercase tracking-wider">Cancel</button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={listing.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {listing.images?.[0]?.image_url || listing.card?.image_url ? (
                            <img src={listing.images?.[0]?.image_url || listing.card?.image_url} alt="" className="w-10 h-14 object-cover rounded" />
                          ) : (
                            <div className="w-10 h-14 bg-white/5 rounded flex items-center justify-center text-white/20 text-xs">No img</div>
                          )}
                          <div>
                            <p className="text-base font-display font-bold text-white">{listing.card?.name || listing.title}</p>
                            {listing.card?.set_name && <p className="text-xs text-white/30">{listing.card.set_name}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="badge bg-white/10 text-white/90">{listing.condition}</span>
                      </td>
                      <td className="p-4 text-center text-white/80 font-display">{listing.quantity_available}</td>
                      <td className="p-4 text-right">
                        <span className="text-lg font-display font-black text-super">
                          ${(listing.price_cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`badge text-xs ${STATUS_STYLES[listing.status] || "bg-white/10 text-white/40"}`}>
                          {listing.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-center text-white/80 font-display">{listing.views}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(listing)} className="text-sm text-white hover:text-super font-display font-bold uppercase tracking-wider">Edit</button>
                          <button onClick={() => handleDelete(listing.id)} className="text-sm text-fire/70 hover:text-fire font-display font-bold uppercase tracking-wider">Delete</button>
                        </div>
                      </td>
                    </tr>
                  )
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-white/20 font-display">
          Showing {listings.length} {activeFilter} listing{listings.length !== 1 ? "s" : ""}
        </p>
        <Link href="/dashboard/inventory" className="btn-secondary text-sm px-4 py-2">
          📦 Bulk Actions →
        </Link>
      </div>
    </div>
  );
}