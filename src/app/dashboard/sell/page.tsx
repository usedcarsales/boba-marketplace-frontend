"use client";

import Link from "next/link";

const SAMPLE_LISTINGS = [
  { id: 1, name: "Bojax", set: "Alpha Edition", parallel: "Battlefoil", weapon: "Fire", condition: "NM", price: 45.00, qty: 1, status: "active", views: 23 },
  { id: 2, name: "The Kid", set: "Griffey Edition", parallel: "Paper", weapon: "Glow", condition: "LP", price: 12.50, qty: 2, status: "active", views: 15 },
  { id: 3, name: "Dr. J", set: "Griffey Edition", parallel: "Superfoil", weapon: "Super", condition: "NM", price: 4800.00, qty: 1, status: "active", views: 89 },
];

const STATUS_STYLES: Record<string, string> = {
  active: "bg-glow/15 text-glow",
  sold: "bg-super/15 text-super",
  pending: "bg-brawl/15 text-brawl",
  cancelled: "bg-fire/15 text-fire",
};

export default function SellerListingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl font-display font-black text-white">My Listings</h1>
          <p className="text-xl text-white/40 font-body mt-1">Manage your card inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/sell/import-ebay" className="btn-secondary text-lg px-6 py-3">
            📥 Import eBay
          </Link>
          <Link href="/sell" className="btn-primary text-lg px-8 py-3">
            ➕ New Listing
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["All", "Active", "Sold", "Pending"].map((filter) => (
          <button
            key={filter}
            className={`px-5 py-2 rounded-full font-display text-sm uppercase tracking-wider font-bold transition-all ${
              filter === "All"
                ? "bg-gradient-to-r from-hex to-glow text-white"
                : "bg-boba-gray border border-white/10 text-white/40 hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Listings Table */}
      <div className="card border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-boba-panel">
                <th className="text-left p-4 text-xs text-white/30 font-display uppercase tracking-wider">Card</th>
                <th className="text-left p-4 text-xs text-white/30 font-display uppercase tracking-wider">Set / Parallel</th>
                <th className="text-center p-4 text-xs text-white/30 font-display uppercase tracking-wider">Condition</th>
                <th className="text-center p-4 text-xs text-white/30 font-display uppercase tracking-wider">Qty</th>
                <th className="text-right p-4 text-xs text-white/30 font-display uppercase tracking-wider">Price</th>
                <th className="text-center p-4 text-xs text-white/30 font-display uppercase tracking-wider">Status</th>
                <th className="text-center p-4 text-xs text-white/30 font-display uppercase tracking-wider">Views</th>
                <th className="text-right p-4 text-xs text-white/30 font-display uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_LISTINGS.map((listing) => (
                <tr key={listing.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <p className="text-base font-display font-bold text-white">{listing.name}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-white/50">{listing.set}</p>
                    <p className="text-xs text-white/30">{listing.parallel}</p>
                  </td>
                  <td className="p-4 text-center">
                    <span className="badge bg-white/5 text-white/50">{listing.condition}</span>
                  </td>
                  <td className="p-4 text-center text-white/50 font-display">{listing.qty}</td>
                  <td className="p-4 text-right">
                    <span className="text-lg font-display font-black text-super">
                      ${listing.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`badge text-xs ${STATUS_STYLES[listing.status] || ""}`}>
                      {listing.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-center text-white/30 font-display">{listing.views}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-xs text-white/30 hover:text-white font-display uppercase tracking-wider">Edit</button>
                      <button className="text-xs text-fire/50 hover:text-fire font-display uppercase tracking-wider">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="btn-secondary text-sm px-4 py-2">📥 Import CSV</button>
          <button className="btn-secondary text-sm px-4 py-2">📤 Export</button>
        </div>
        <p className="text-sm text-white/20 font-display">
          Showing {SAMPLE_LISTINGS.length} listings
        </p>
      </div>
    </div>
  );
}
