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
    <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
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
        <div className="mb-4 p-3 rounded-lg bg-white/5 text-base font-display font-bold">{actionMsg}</div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-6 py-2.5 rounded-full font-display text-base font-bold uppercase tracking-wider transition-all cursor-pointer ${
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

      {/* Listings Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="card border border-white/10 p-8 text-center text-white/80 font-display font-bold text-lg">Loading...</div>
        ) : listings.length === 0 ? (
          <div className="card border border-white/10 p-8 text-center">
            <p className="text-white/80 font-display font-bold text-lg">No {activeFilter} listings</p>
            <p className="text-white/60 mt-2">
              <Link href="/sell" className="text-hex hover:underline">Create one</Link> or <Link href="/dashboard/sell/import-ebay" className="text-hex hover:underline">import from eBay</Link>
            </p>
          </div>
        ) : (
          listings.map((listing) => (
            editingId === listing.id ? (
              <div key={listing.id} className="card border border-hex/30 p-6 bg-hex/5">
                <div className="flex flex-wrap items-center gap-5">
                  <p className="font-display font-black text-white text-2xl flex-1 min-w-[240px]">{listing.title}</p>
                  <div className="flex items-center gap-3">
                    <label className="text-white/80 text-base font-display font-bold">Condition:</label>
                    <select value={editCondition} onChange={(e) => setEditCondition(e.target.value)} className="bg-boba-dark border border-white/20 rounded-lg px-4 py-2.5 text-white text-lg">
                      {["Mint","Near Mint","Lightly Played","Moderately Played","Heavily Played","Damaged","NM","LP","MP","HP"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-white/80 text-base font-display font-bold">Qty:</label>
                    <input type="number" value={editQty} onChange={(e) => setEditQty(e.target.value)} className="bg-boba-dark border border-white/20 rounded-lg px-4 py-2.5 text-white text-lg w-24 text-center" min="1" />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-white/80 text-base font-display font-bold">Price:</label>
                    <input type="text" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="bg-boba-dark border border-white/20 rounded-lg px-4 py-2.5 text-white text-lg w-32 text-right" />
                  </div>
                  <div className="flex items-center gap-3 ml-auto">
                    <button onClick={saveEdit} className="btn-primary text-base px-6 py-2.5">Save</button>
                    <button onClick={() => setEditingId(null)} className="btn-secondary text-base px-6 py-2.5">Cancel</button>
                  </div>
                </div>
              </div>
            ) : (
              <div key={listing.id} className="card border border-white/10 hover:border-hex/30 transition-all">
                <div className="flex items-center gap-6 p-6">
                  {/* Card image + name */}
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    {listing.images?.[0]?.image_url || listing.card?.image_url ? (
                      <img src={listing.images?.[0]?.image_url || listing.card?.image_url} alt="" className="w-16 h-22 object-cover rounded-lg flex-shrink-0 shadow-md" />
                    ) : (
                      <div className="w-16 h-22 bg-white/5 rounded-lg flex items-center justify-center text-white/50 text-base flex-shrink-0">No img</div>
                    )}
                    <div className="min-w-0">
                      <p className="text-2xl font-display font-black text-white truncate leading-tight">{listing.card?.name || listing.title}</p>
                      {listing.card?.set_name && <p className="text-base text-white/60 truncate mt-0.5">{listing.card.set_name}</p>}
                    </div>
                  </div>

                  {/* Condition */}
                  <div className="flex-shrink-0 text-center w-32">
                    <p className="text-sm text-white/50 font-display font-bold uppercase tracking-wider mb-1">Condition</p>
                    <span className="badge bg-white/10 text-white/90 text-base px-4 py-1.5">{listing.condition}</span>
                  </div>

                  {/* Status */}
                  <div className="flex-shrink-0 text-center w-32">
                    <p className="text-sm text-white/50 font-display font-bold uppercase tracking-wider mb-1">Status</p>
                    <span className={`badge text-base px-4 py-1.5 ${STATUS_STYLES[listing.status] || "bg-white/10 text-white/40"}`}>
                      {listing.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex-shrink-0 text-right w-32">
                    <p className="text-sm text-white/50 font-display font-bold uppercase tracking-wider mb-1">Price</p>
                    <span className="text-2xl font-display font-black text-super">
                      ${(listing.price_cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Views */}
                  <div className="flex-shrink-0 text-center w-24">
                    <p className="text-sm text-white/50 font-display font-bold uppercase tracking-wider mb-1">Views</p>
                    <p className="text-xl text-white/90 font-display font-bold">{listing.views}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex items-center gap-3 ml-2">
                    <button onClick={() => handleEdit(listing)} className="text-base text-white hover:text-super font-display font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg border border-white/20 hover:border-super/50 transition-colors">Edit</button>
                    <button onClick={() => handleDelete(listing.id)} className="text-base text-fire hover:text-fire-light font-display font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg border border-white/20 hover:border-fire/50 transition-colors">Delete</button>
                  </div>
                </div>
              </div>
            )
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-white/20 font-display">
          Showing {listings.length} {activeFilter} listing{listings.length !== 1 ? "s" : ""}
        </p>
        <Link href="/dashboard/inventory" className="btn-secondary text-base px-5 py-2.5">
          📦 Bulk Actions →
        </Link>
      </div>
    </div>
  );
}