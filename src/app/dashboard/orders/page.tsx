"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { API_BASE } from "@/lib/api";

interface OrderItem {
  id: string;
  status: string;
  created_at: string;
  paid_at: string | null;
  ship_by: string | null;
  shipped_at: string | null;
  tracking_number: string | null;
  tracking_carrier: string | null;
  shipping_method: string | null;
  requires_insurance: boolean;
  quantity: number;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  seller_payout_cents: number;
  payout_released: boolean;
  buyer_note: string | null;
  ship_to: {
    name: string;
    address1: string;
    address2: string | null;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
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
  buyer: {
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

export default function SellerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Ship form state
  const [shipForm, setShipForm] = useState<{ orderId: string; tracking: string; carrier: string; note: string } | null>(null);
  const [shipping, setShipping] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("boba-token");
    if (!token) {
      router.push("/auth?redirect=/dashboard/orders");
      return;
    }

    const statusParam = filter !== "all" ? `?status=${filter}` : "";
    fetch(`${API_BASE}/api/seller/orders${statusParam}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter, router]);

  const handleShip = async () => {
    if (!shipForm) return;
    setShipping(true);
    const token = localStorage.getItem("boba-token");

    try {
      const res = await fetch(`${API_BASE}/api/orders/${shipForm.orderId}/ship`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tracking_number: shipForm.tracking || null,
          carrier: shipForm.carrier || "usps",
          seller_note: shipForm.note || null,
        }),
      });

      if (res.ok) {
        // Refresh orders
        setOrders((prev) =>
          prev.map((o) =>
            o.id === shipForm.orderId
              ? { ...o, status: "shipped", tracking_number: shipForm.tracking, tracking_carrier: shipForm.carrier }
              : o
          )
        );
        setShipForm(null);
      }
    } catch (err) {
      console.error(err);
    }
    setShipping(false);
  };

  const pendingCount = orders.filter((o) => o.status === "paid" || o.status === "authorized").length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl font-display font-black text-white">Sales</h1>
          <p className="text-white/70 text-lg">Manage your orders and shipments</p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-fire/20 border border-fire/40 rounded-full px-4 py-2">
            <span className="text-fire font-display font-bold">
              ⚠️ {pendingCount} order{pendingCount > 1 ? "s" : ""} need{pendingCount === 1 ? "s" : ""} shipping
            </span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["all", "authorized", "paid", "shipped", "delivered", "completed", "disputed"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full font-display uppercase tracking-wider text-sm font-bold whitespace-nowrap transition-all ${
              filter === s ? "bg-hex text-white" : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            {s === "all" ? "All Orders" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-3 border-hex border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : orders.length === 0 ? (
        <div className="card border border-white/10 p-12 text-center">
          <span className="text-5xl block mb-4">📭</span>
          <h2 className="text-2xl font-display font-bold text-white mb-2">No orders yet</h2>
          <p className="text-white/70 mb-6">When buyers purchase your cards, orders will appear here.</p>
          <Link href="/sell" className="btn-primary">List a Card</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const shipDeadline = order.ship_by ? new Date(order.ship_by) : null;
            const isOverdue = shipDeadline && new Date() > shipDeadline && (order.status === "paid" || order.status === "authorized");

            return (
              <div
                key={order.id}
                className={`card border p-5 transition-all ${
                  isOverdue ? "border-fire/50 bg-fire/5" : "border-white/10"
                }`}
              >
                {/* Header row */}
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  {order.card?.image_url && (
                    <img src={order.card.image_url} alt="" className="w-12 h-16 object-cover rounded-lg" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-display font-bold text-white truncate">
                      {order.card?.name || order.listing_title}
                    </h3>
                    <p className="text-sm text-white/40">
                      {order.card?.set_name} · {order.listing_condition} · Qty: {order.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-display font-bold uppercase ${STATUS_COLORS[order.status] || "bg-white/10 text-white/50"}`}>
                      {order.status}
                    </span>
                    <p className="text-lg font-display font-black text-super mt-1">
                      +${(order.seller_payout_cents / 100).toFixed(2)}
                    </p>
                  </div>
                  <svg className={`w-5 h-5 text-white/30 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                    {/* Timestamps */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-white/60 block">Ordered</span>
                        <span className="text-white">{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      {order.paid_at && (
                        <div>
                          <span className="text-white/60 block">Paid</span>
                          <span className="text-glow">{new Date(order.paid_at).toLocaleDateString()}</span>
                        </div>
                      )}
                      {order.ship_by && (
                        <div>
                          <span className="text-white/60 block">Ship By</span>
                          <span className={isOverdue ? "text-fire font-bold" : "text-white"}>
                            {new Date(order.ship_by).toLocaleString()}
                            {isOverdue && " ⚠️ OVERDUE"}
                          </span>
                        </div>
                      )}
                      {order.shipped_at && (
                        <div>
                          <span className="text-white/60 block">Shipped</span>
                          <span className="text-ice">{new Date(order.shipped_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Ship To Address */}
                    <div className="card border border-white/10 p-4">
                      <h4 className="text-sm font-display font-bold text-white/50 uppercase tracking-wider mb-2">Ship To</h4>
                      <p className="text-white font-bold">{order.ship_to.name}</p>
                      <p className="text-white/90">{order.ship_to.address1}</p>
                      {order.ship_to.address2 && <p className="text-white/90">{order.ship_to.address2}</p>}
                      <p className="text-white/90">
                        {order.ship_to.city}, {order.ship_to.state} {order.ship_to.zip}
                      </p>
                    </div>

                    {/* Buyer note */}
                    {order.buyer_note && (
                      <div className="bg-ice/5 border border-ice/20 rounded-boba p-3">
                        <span className="text-ice text-sm font-display font-bold">Buyer Note: </span>
                        <span className="text-white/70 text-sm">{order.buyer_note}</span>
                      </div>
                    )}

                    {/* Tracking info */}
                    {order.tracking_number && (
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 text-sm">Tracking:</span>
                        <span className="text-white font-mono">{order.tracking_number}</span>
                        <span className="text-white/60 text-sm">({order.tracking_carrier?.toUpperCase()})</span>
                      </div>
                    )}

                    {/* Payout status */}
                    <div className="flex items-center gap-2">
                      <span className="text-white/60 text-sm">Payout:</span>
                      {order.payout_released ? (
                        <span className="text-glow text-sm">✅ Released — ${(order.seller_payout_cents / 100).toFixed(2)}</span>
                      ) : (
                        <span className="text-white/70 text-sm">⏳ Held until delivery confirmed</span>
                      )}
                    </div>

                    {/* Ship button — for authorized or paid orders */}
                    {(order.status === "paid" || order.status === "authorized") && !shipForm && (
                      <button
                        onClick={() => setShipForm({ orderId: order.id, tracking: "", carrier: "usps", note: "" })}
                        className="btn-primary w-full"
                      >
                        📦 Mark as Shipped
                      </button>
                    )}

                    {/* Ship form */}
                    {shipForm?.orderId === order.id && (
                      <div className="card border border-hex/30 bg-hex/5 p-4 space-y-3">
                        <h4 className="font-display font-bold text-white">Enter Shipping Details</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm text-white/70 block mb-1">Carrier</label>
                            <select
                              value={shipForm.carrier}
                              onChange={(e) => setShipForm({ ...shipForm, carrier: e.target.value })}
                              className="w-full bg-boba-dark border border-white/15 rounded-boba px-3 py-2 text-white text-sm"
                            >
                              <option value="usps">USPS</option>
                              <option value="ups">UPS</option>
                              <option value="fedex">FedEx</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm text-white/70 block mb-1">
                              Tracking # {order.subtotal_cents >= 2000 ? "(required)" : "(optional)"}
                            </label>
                            <input
                              type="text"
                              value={shipForm.tracking}
                              onChange={(e) => setShipForm({ ...shipForm, tracking: e.target.value })}
                              className="w-full bg-boba-dark border border-white/15 rounded-boba px-3 py-2 text-white text-sm"
                              placeholder="9400..."
                            />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={handleShip} disabled={shipping} className="btn-primary flex-1 disabled:opacity-50">
                            {shipping ? "Shipping..." : "✅ Confirm Shipped"}
                          </button>
                          <button onClick={() => setShipForm(null)} className="btn-secondary">Cancel</button>
                        </div>
                      </div>
                    )}

                    {/* Print packing slip link */}
                    {(order.status === "paid" || order.status === "authorized") && (
                      <button
                        onClick={() => window.print()}
                        className="text-sm text-hex hover:text-hex-light font-display uppercase tracking-wider"
                      >
                        🖨️ Print Packing Slip
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
