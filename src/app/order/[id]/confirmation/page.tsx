"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { API_BASE } from "@/lib/api";

interface OrderDetail {
  id: string;
  status: string;
  created_at: string;
  paid_at: string | null;
  ship_by: string | null;
  tracking_number: string | null;
  tracking_carrier: string | null;
  quantity: number;
  subtotal_cents: number;
  shipping_cents: number;
  platform_fee_cents: number;
  total_cents: number;
  shipping_method: string;
  requires_insurance: boolean;
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
  seller: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

const WEAPON_COLORS: Record<string, string> = {
  fire: "text-fire border-fire/40 shadow-weapon-fire",
  ice: "text-ice border-ice/40 shadow-weapon-ice",
  glow: "text-glow border-glow/40 shadow-weapon-glow",
  hex: "text-hex border-hex/40 shadow-weapon-hex",
  brawl: "text-brawl border-brawl/40 shadow-weapon-brawl",
  super: "text-super border-super/40 shadow-weapon-super",
  steel: "text-steel border-steel/40",
  gum: "text-gum border-gum/40 shadow-weapon-gum",
};

const SHIPPING_LABELS: Record<string, string> = {
  pwe: "PWE (Plain White Envelope)",
  bubble_mailer: "Bubble Mailer w/ Tracking",
  box: "Box w/ Tracking + Insurance",
};

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confettiDone, setConfettiDone] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("boba-token");
    if (!token) {
      router.push("/auth?redirect=/dashboard/purchases");
      return;
    }

    fetch(`${API_BASE}/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Order not found");
        return r.json();
      })
      .then((data) => {
        setOrder(data);
        setLoading(false);
        // Fire confetti animation after mount
        setTimeout(() => setConfettiDone(true), 3000);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-hex border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <p className="text-white/40 font-display uppercase tracking-wider">Loading your order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-4">⚠️</span>
        <h1 className="text-3xl font-display font-black text-white mb-2">Order Not Found</h1>
        <p className="text-white/40 mb-6">{error || "We couldn't find this order."}</p>
        <Link href="/dashboard/purchases" className="btn-primary">View My Purchases</Link>
      </div>
    );
  }

  const weapon = order.card?.weapon || "hex";
  const weaponStyle = WEAPON_COLORS[weapon] || WEAPON_COLORS.hex;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className={`w-20 h-20 mx-auto rounded-full border-2 ${weaponStyle} flex items-center justify-center mb-4 animate-pulse`}>
          <span className="text-4xl">✅</span>
        </div>
        <h1 className="text-6xl font-display font-black text-white mb-2">ORDER CONFIRMED</h1>
        <p className="text-white/40 text-lg font-body">
          Your payment was received. The seller has been notified.
        </p>
        <p className="text-white/20 text-sm mt-2 font-mono">Order #{order.id.slice(0, 8).toUpperCase()}</p>
      </div>

      {/* Card preview */}
      <div className={`card border p-6 mb-6 ${weaponStyle.includes("border") ? weaponStyle : "border-white/10"}`}>
        <div className="flex items-center gap-4">
          {order.card?.image_url ? (
            <img
              src={order.card.image_url}
              alt={order.card.name}
              className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-28 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-4xl">🃏</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-display font-black text-white truncate">
              {order.card?.name || order.listing_title}
            </h2>
            <p className="text-white/50 text-sm mt-1">
              {order.card?.set_name} · {order.listing_condition}
            </p>
            {order.card?.parallel && order.card.parallel !== "base" && (
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-display font-bold uppercase border ${weaponStyle}`}>
                {order.card.parallel}
              </span>
            )}
            <p className="text-white/30 text-sm mt-2">
              Sold by{" "}
              <span className="text-white font-display font-bold">
                {order.seller?.display_name || order.seller?.username || "Unknown Seller"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Order summary */}
      <div className="card border border-white/10 p-6 mb-6">
        <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/50">Subtotal</span>
            <span className="text-white">${(order.subtotal_cents / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">
              Shipping ({SHIPPING_LABELS[order.shipping_method] || order.shipping_method})
            </span>
            <span className="text-white">${(order.shipping_cents / 100).toFixed(2)}</span>
          </div>
          {order.requires_insurance && (
            <div className="flex justify-between">
              <span className="text-white/50">Insurance</span>
              <span className="text-white">Included</span>
            </div>
          )}
          <div className="border-t border-white/10 pt-2 mt-2 flex justify-between">
            <span className="text-white font-display font-bold uppercase">Total Paid</span>
            <span className="text-super font-display font-black text-lg">
              ${(order.total_cents / 100).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Ship to */}
      <div className="card border border-white/10 p-6 mb-6">
        <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider mb-3">Shipping To</h3>
        <div className="text-sm text-white/70 space-y-1">
          <p className="text-white font-bold">{order.ship_to.name}</p>
          <p>{order.ship_to.address1}</p>
          {order.ship_to.address2 && <p>{order.ship_to.address2}</p>}
          <p>
            {order.ship_to.city}, {order.ship_to.state} {order.ship_to.zip}
          </p>
        </div>
        {order.ship_by && (
          <div className="mt-4 flex items-center gap-2 bg-super/5 border border-super/20 rounded-boba px-4 py-2">
            <span className="text-super">⏰</span>
            <p className="text-sm text-white/70">
              Seller must ship by{" "}
              <span className="text-super font-bold">
                {new Date(order.ship_by).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* What happens next */}
      <div className="card border border-white/10 p-6 mb-8">
        <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider mb-4">What Happens Next</h3>
        <div className="space-y-4">
          {[
            {
              icon: "📨",
              title: "Seller ships your card",
              desc: order.ship_by
                ? `They have until ${new Date(order.ship_by).toLocaleDateString("en-US", { month: "short", day: "numeric" })} to ship.`
                : "The seller will package and ship your card.",
              color: "text-ice",
            },
            {
              icon: "📦",
              title: "Track your package",
              desc: "You'll see tracking info in My Purchases once the seller marks it shipped.",
              color: "text-super",
            },
            {
              icon: "✅",
              title: "Confirm delivery",
              desc: "Once it arrives, confirm delivery to release payment to the seller.",
              color: "text-glow",
            },
            {
              icon: "⭐",
              title: "Leave feedback",
              desc: "Rate your experience — it helps the community know who to trust.",
              color: "text-hex",
            },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">{step.icon}</span>
              </div>
              <div>
                <p className={`font-display font-bold ${step.color}`}>{step.title}</p>
                <p className="text-sm text-white/40 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/dashboard/purchases" className="btn-primary flex-1 text-center">
          📦 Track My Order
        </Link>
        <Link href="/browse" className="btn-secondary flex-1 text-center">
          Keep Shopping
        </Link>
      </div>
    </div>
  );
}
