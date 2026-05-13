"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { API_BASE } from "@/lib/api";

interface PurchaseItem {
  id: string;
  status: string;
  created_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  tracking_number: string | null;
  tracking_carrier: string | null;
  quantity: number;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  buyer_note: string | null;
  card: {
    name: string;
    set_name: string;
    card_number: string;
    parallel: string;
    weapon: string;
    image_url: string | null;
  } | null;
  listing_title: string;
  listing_condition: string;
  seller: {
    username: string;
    display_name: string | null;
  } | null;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-white/10 text-white/50",
  authorized: "bg-hex/20 text-hex",
  paid: "bg-super/20 text-super",
  shipped: "bg-ice/20 text-ice",
  delivered: "bg-glow/20 text-glow",
  completed: "bg-glow/20 text-glow",
  cancelled: "bg-white/10 text-white/30",
  disputed: "bg-fire/20 text-fire",
  refunded: "bg-brawl/20 text-brawl",
};

const TRACKING_URLS: Record<string, string> = {
  usps: "https://tools.usps.com/go/TrackConfirmAction?tLabels=",
  ups: "https://www.ups.com/track?tracknum=",
  fedex: "https://www.fedex.com/fedextrack/?tracknumbers=",
};

function getTrackingUrl(carrier: string | null, tracking: string | null): string | null {
  if (!carrier || !tracking) return null;
  const base = TRACKING_URLS[carrier.toLowerCase()];
  return base ? `${base}${tracking}` : null;
}

function daysSince(dateStr: string | null): number {
  if (!dateStr) return 0;
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff / (1000 * 60 * 60 * 24);
}

export default function PurchasesDashboard() {
  const router = useRouter();
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  const fetchPurchases = (token: string, status?: string) => {
    const statusParam = status && status !== "all" ? `?status=${status}` : "";
    fetch(`${API_BASE}/api/orders/my-purchases${statusParam}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load purchases");
        return r.json();
      })
      .then((data) => {
        setPurchases(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("boba-token");
    if (!token) {
      router.push("/auth?redirect=/dashboard/purchases");
      return;
    }
    setLoading(true);
    setError(null);
    fetchPurchases(token, filter);
  }, [filter, router]);

  const handleConfirmDelivery = async (orderId: string) => {
    const token = localStorage.getItem("boba-token");
    if (!token) return;
    setConfirming(orderId);
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/confirm-delivery`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPurchases((prev) =>
          prev.map((p) => (p.id === orderId ? { ...p, status: "delivered" } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
    setConfirming(null);
  };

  const filteredPurchases =
    filter === "all" ? purchases : purchases.filter((p) => p.status === filter);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link
          href="/dashboard"
          className="text-white/30 hover:text-white transition-colors font-display uppercase tracking-wider text-sm"
        >
          ← Dashboard
        </Link>
      </div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl font-display font-black text-white">My Purchases</h1>
          <p className="text-white/40 text-lg font-body">Track your orders and manage your buying activity</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-display font-black text-super">{purchases.length}</p>
          <p className="text-white/30 text-sm font-display uppercase tracking-wider">Total Orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["all", "paid", "shipped", "delivered", "completed", "disputed"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full font-display uppercase tracking-wider text-sm font-bold whitespace-nowrap transition-all ${
              filter === s
                ? "bg-hex text-white"
                : "bg-white/5 text-white/40 hover:bg-white/10"
            }`}
          >
            {s === "all" ? "All Orders" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* States */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card border border-white/10 p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-16 bg-white/10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-white/10 rounded w-1/2" />
                  <div className="h-4 bg-white/5 rounded w-1/3" />
                </div>
                <div className="w-20 h-8 bg-white/10 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="card border border-fire/30 bg-fire/5 p-12 text-center">
          <span className="text-5xl block mb-4">⚠️</span>
          <h2 className="text-2xl font-display font-bold text-white mb-2">Failed to Load Orders</h2>
          <p className="text-white/40 mb-6">{error}</p>
          <button
            onClick={() => {
              const token = localStorage.getItem("boba-token");
              if (token) { setLoading(true); setError(null); fetchPurchases(token, filter); }
            }}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : filteredPurchases.length === 0 ? (
        <div className="card border border-white/10 p-12 text-center">
          <span className="text-5xl block mb-4">🛒</span>
          <h2 className="text-2xl font-display font-bold text-white mb-2">No purchases yet</h2>
          <p className="text-white/40 mb-6">
            {filter === "all"
              ? "Browse the marketplace to find Bo Jackson cards."
              : `No orders with status "${filter}".`}
          </p>
          <Link href="/browse" className="btn-primary">
            Browse Cards
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 mb-2 text-xs font-display font-bold uppercase tracking-wider text-white/30">
            <div className="col-span-1">Date</div>
            <div className="col-span-4">Card</div>
            <div className="col-span-2">Seller</div>
            <div className="col-span-1">Price</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Tracking</div>
            <div className="col-span-1">Actions</div>
          </div>

          <div className="space-y-3">
            {filteredPurchases.map((purchase) => {
              const trackingUrl = getTrackingUrl(purchase.tracking_carrier, purchase.tracking_number);
              const canConfirmDelivery = purchase.status === "shipped";
              const canDispute =
                (purchase.status === "delivered" || purchase.status === "completed") &&
                daysSince(purchase.delivered_at || purchase.shipped_at) <= 7;
              const canFeedback =
                (purchase.status === "delivered" || purchase.status === "completed") &&
                daysSince(purchase.shipped_at) > 2; // >48hr proxy

              return (
                <div
                  key={purchase.id}
                  className="card border border-white/10 hover:border-white/20 transition-all p-5"
                >
                  {/* Mobile layout */}
                  <div className="md:hidden space-y-3">
                    <div className="flex items-center gap-3">
                      {purchase.card?.image_url ? (
                        <img
                          src={purchase.card.image_url}
                          alt={purchase.card.name}
                          className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-16 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white/20 text-xl">🃏</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-display font-bold text-white truncate">
                          {purchase.card?.name || purchase.listing_title}
                        </h3>
                        <p className="text-sm text-white/40">
                          {purchase.card?.set_name} · {purchase.listing_condition}
                        </p>
                        <p className="text-xs text-white/30 mt-0.5">
                          {new Date(purchase.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/40">
                          Seller: <span className="text-white">{purchase.seller?.display_name || purchase.seller?.username || "—"}</span>
                        </p>
                        <p className="text-lg font-display font-black text-super">
                          ${(purchase.total_cents / 100).toFixed(2)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-display font-bold uppercase ${
                          STATUS_COLORS[purchase.status] || "bg-white/10 text-white/50"
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </div>
                    {trackingUrl && (
                      <a
                        href={trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ice text-sm font-display uppercase tracking-wider hover:text-ice-light transition-colors"
                      >
                        📦 Track Package →
                      </a>
                    )}
                    {/* Mobile actions */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {canConfirmDelivery && (
                        <button
                          onClick={() => handleConfirmDelivery(purchase.id)}
                          disabled={confirming === purchase.id}
                          className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-50"
                        >
                          {confirming === purchase.id ? "Confirming..." : "✅ Confirm Delivery"}
                        </button>
                      )}
                      {canDispute && (
                        <Link
                          href={`/dashboard/disputes/new?order=${purchase.id}`}
                          className="px-3 py-1.5 rounded-full font-display uppercase tracking-wider text-sm font-bold bg-fire/20 text-fire hover:bg-fire/30 transition-all"
                        >
                          ⚠️ Dispute
                        </Link>
                      )}
                      {canFeedback && (
                        <Link
                          href={`/dashboard/feedback/new?order=${purchase.id}`}
                          className="btn-secondary text-sm py-1.5 px-3"
                        >
                          ⭐ Feedback
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                    {/* Date */}
                    <div className="col-span-1 text-sm text-white/40">
                      {new Date(purchase.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>

                    {/* Card */}
                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                      {purchase.card?.image_url ? (
                        <img
                          src={purchase.card.image_url}
                          alt={purchase.card.name}
                          className="w-10 h-14 object-cover rounded flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-14 bg-white/5 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-white/20">🃏</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-display font-bold text-white truncate">
                          {purchase.card?.name || purchase.listing_title}
                        </p>
                        <p className="text-xs text-white/40 truncate">
                          {purchase.card?.set_name} · {purchase.listing_condition}
                        </p>
                      </div>
                    </div>

                    {/* Seller */}
                    <div className="col-span-2 text-sm text-white/70 truncate">
                      {purchase.seller?.display_name || purchase.seller?.username || "—"}
                    </div>

                    {/* Price */}
                    <div className="col-span-1 text-sm font-display font-black text-super">
                      ${(purchase.total_cents / 100).toFixed(2)}
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-display font-bold uppercase whitespace-nowrap ${
                          STATUS_COLORS[purchase.status] || "bg-white/10 text-white/50"
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </div>

                    {/* Tracking */}
                    <div className="col-span-2">
                      {trackingUrl ? (
                        <a
                          href={trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ice text-xs font-display uppercase tracking-wider hover:text-ice-light transition-colors"
                        >
                          📦 Track →
                        </a>
                      ) : purchase.status === "shipped" ? (
                        <span className="text-white/20 text-xs">No tracking</span>
                      ) : (
                        <span className="text-white/20 text-xs">—</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex flex-col gap-1.5">
                      {canConfirmDelivery && (
                        <button
                          onClick={() => handleConfirmDelivery(purchase.id)}
                          disabled={confirming === purchase.id}
                          className="btn-secondary text-xs py-1 px-2 disabled:opacity-50 whitespace-nowrap"
                        >
                          {confirming === purchase.id ? "..." : "✅ Delivered"}
                        </button>
                      )}
                      {canDispute && (
                        <Link
                          href={`/dashboard/disputes/new?order=${purchase.id}`}
                          className="px-2 py-1 rounded-full font-display uppercase tracking-wider text-xs font-bold bg-fire/20 text-fire hover:bg-fire/30 transition-all text-center whitespace-nowrap"
                        >
                          ⚠️ Dispute
                        </Link>
                      )}
                      {canFeedback && (
                        <Link
                          href={`/dashboard/feedback/new?order=${purchase.id}`}
                          className="btn-secondary text-xs py-1 px-2 whitespace-nowrap"
                        >
                          ⭐ Rate
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
