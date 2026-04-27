"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { API_BASE } from "@/lib/api";

interface OrderSummary {
  id: string;
  status: string;
  listing_title: string;
  listing_condition: string;
  total_cents: number;
  shipped_at: string | null;
  delivered_at: string | null;
  card: {
    name: string;
    set_name: string;
    image_url: string | null;
    weapon: string;
  } | null;
  seller: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    positive_feedback_count: number;
    total_feedback_count: number;
  } | null;
  feedback_submitted: boolean;
}

interface FeedbackPayload {
  rating: number;
  condition_match: boolean;
  shipping_speed: "fast" | "ok" | "slow";
  comment: string;
}

const WEAPON_COLORS: Record<string, string> = {
  fire: "border-fire/40 shadow-weapon-fire",
  ice: "border-ice/40 shadow-weapon-ice",
  glow: "border-glow/40 shadow-weapon-glow",
  hex: "border-hex/40 shadow-weapon-hex",
  brawl: "border-brawl/40 shadow-weapon-brawl",
  super: "border-super/40 shadow-weapon-super",
  steel: "border-steel/40",
  gum: "border-gum/40 shadow-weapon-gum",
};

const STAR_LABELS = ["", "Terrible", "Poor", "Okay", "Good", "Excellent"];

export default function LeaveFeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [conditionMatch, setConditionMatch] = useState<boolean | null>(null);
  const [shippingSpeed, setShippingSpeed] = useState<"fast" | "ok" | "slow" | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("boba-token");
    if (!token) {
      router.push("/auth?redirect=/order/" + orderId + "/feedback");
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
        if (data.feedback_submitted) setSubmitted(true);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [orderId, router]);

  const handleSubmit = async () => {
    if (!rating || conditionMatch === null || !shippingSpeed) return;

    const token = localStorage.getItem("boba-token");
    if (!token) return;

    setSubmitting(true);

    const payload: FeedbackPayload = {
      rating,
      condition_match: conditionMatch,
      shipping_speed: shippingSpeed,
      comment: comment.trim(),
    };

    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit feedback. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    }

    setSubmitting(false);
  };

  const isValid = rating > 0 && conditionMatch !== null && shippingSpeed !== null;

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-hex border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <p className="text-white/40 font-display uppercase tracking-wider">Loading order...</p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-4">⚠️</span>
        <h1 className="text-3xl font-display font-black text-white mb-2">Order Not Found</h1>
        <p className="text-white/40 mb-6">{error}</p>
        <Link href="/dashboard/purchases" className="btn-primary">Back to Purchases</Link>
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto rounded-full border-2 border-glow/50 shadow-weapon-glow flex items-center justify-center mb-6">
          <span className="text-4xl">⭐</span>
        </div>
        <h1 className="text-5xl font-display font-black text-white mb-2">FEEDBACK SENT</h1>
        <p className="text-white/40 text-lg mb-2">
          Thanks for rating{" "}
          <span className="text-white font-display font-bold">
            {order?.seller?.display_name || order?.seller?.username || "this seller"}
          </span>.
        </p>
        <p className="text-white/30 text-sm mb-8">Your review helps the BoBA community.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/purchases" className="btn-primary">
            My Purchases
          </Link>
          <Link href="/browse" className="btn-secondary">
            Browse More Cards
          </Link>
        </div>
      </div>
    );
  }

  const weapon = order?.card?.weapon || "hex";
  const weaponBorder = WEAPON_COLORS[weapon] || WEAPON_COLORS.hex;
  const displayRating = hoverRating || rating;

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      {/* Back link */}
      <Link
        href="/dashboard/purchases"
        className="text-white/30 hover:text-white transition-colors font-display uppercase tracking-wider text-sm mb-6 block"
      >
        ← My Purchases
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-display font-black text-white">Leave Feedback</h1>
        <p className="text-white/40 font-body mt-1">Rate your experience with this seller</p>
      </div>

      {/* Order card */}
      {order && (
        <div className={`card border p-5 mb-8 ${weaponBorder}`}>
          <div className="flex items-center gap-4">
            {order.card?.image_url ? (
              <img
                src={order.card.image_url}
                alt={order.card.name}
                className="w-14 h-20 object-cover rounded-lg flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-20 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">🃏</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-display font-bold text-white truncate">
                {order.card?.name || order.listing_title}
              </h3>
              <p className="text-sm text-white/40">
                {order.card?.set_name} · {order.listing_condition}
              </p>
              <p className="text-super font-display font-black text-lg mt-1">
                ${(order.total_cents / 100).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Seller info */}
          {order.seller && (
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
              {order.seller.avatar_url ? (
                <img
                  src={order.seller.avatar_url}
                  alt={order.seller.username}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-hex/20 flex items-center justify-center">
                  <span className="text-hex font-display font-black text-sm">
                    {(order.seller.display_name || order.seller.username).charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="text-white font-display font-bold text-sm">
                  {order.seller.display_name || order.seller.username}
                </p>
                {order.seller.total_feedback_count > 0 && (
                  <p className="text-white/30 text-xs">
                    {order.seller.positive_feedback_count}/{order.seller.total_feedback_count} positive ratings
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="bg-fire/10 border border-fire/30 rounded-boba px-4 py-3 mb-6 text-fire text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Star rating */}
      <div className="card border border-white/10 p-6 mb-4">
        <h3 className="text-sm font-display font-bold text-white/50 uppercase tracking-wider mb-4">
          Overall Rating <span className="text-fire">*</span>
        </h3>
        <div className="flex items-center gap-3 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110 focus:outline-none"
            >
              <span
                className={`text-4xl ${
                  star <= displayRating ? "opacity-100" : "opacity-20"
                } transition-opacity`}
              >
                ⭐
              </span>
            </button>
          ))}
        </div>
        {displayRating > 0 && (
          <p className={`text-sm font-display font-bold uppercase tracking-wider ${
            displayRating >= 4 ? "text-glow" : displayRating === 3 ? "text-super" : "text-fire"
          }`}>
            {STAR_LABELS[displayRating]}
          </p>
        )}
      </div>

      {/* Condition match */}
      <div className="card border border-white/10 p-6 mb-4">
        <h3 className="text-sm font-display font-bold text-white/50 uppercase tracking-wider mb-4">
          Was the card condition as described? <span className="text-fire">*</span>
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => setConditionMatch(true)}
            className={`flex-1 py-3 px-4 rounded-boba font-display font-bold uppercase tracking-wider text-sm transition-all border ${
              conditionMatch === true
                ? "bg-glow/20 border-glow/50 text-glow"
                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
            }`}
          >
            ✅ Yes, as described
          </button>
          <button
            onClick={() => setConditionMatch(false)}
            className={`flex-1 py-3 px-4 rounded-boba font-display font-bold uppercase tracking-wider text-sm transition-all border ${
              conditionMatch === false
                ? "bg-fire/20 border-fire/50 text-fire"
                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
            }`}
          >
            ❌ Not as described
          </button>
        </div>
      </div>

      {/* Shipping speed */}
      <div className="card border border-white/10 p-6 mb-4">
        <h3 className="text-sm font-display font-bold text-white/50 uppercase tracking-wider mb-4">
          How was the shipping speed? <span className="text-fire">*</span>
        </h3>
        <div className="flex gap-3">
          {[
            { value: "fast", label: "🚀 Fast", active: "bg-glow/20 border-glow/50 text-glow" },
            { value: "ok", label: "👍 Okay", active: "bg-super/20 border-super/50 text-super" },
            { value: "slow", label: "🐢 Slow", active: "bg-fire/20 border-fire/50 text-fire" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setShippingSpeed(opt.value as "fast" | "ok" | "slow")}
              className={`flex-1 py-3 px-2 rounded-boba font-display font-bold uppercase tracking-wider text-sm transition-all border ${
                shippingSpeed === opt.value
                  ? opt.active
                  : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="card border border-white/10 p-6 mb-6">
        <h3 className="text-sm font-display font-bold text-white/50 uppercase tracking-wider mb-3">
          Comments <span className="text-white/20">(optional)</span>
        </h3>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 500))}
          placeholder="Tell other buyers about this transaction..."
          rows={4}
          className="w-full bg-boba-dark border border-white/10 rounded-boba px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-hex/50 placeholder-white/20 transition-colors"
        />
        <p className="text-xs text-white/20 text-right mt-1">{comment.length}/500</p>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!isValid || submitting}
        className={`w-full btn-primary text-lg py-4 disabled:opacity-40 disabled:cursor-not-allowed transition-all ${
          isValid && !submitting ? "hover:shadow-neon" : ""
        }`}
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting...
          </span>
        ) : (
          "⭐ Submit Feedback"
        )}
      </button>

      {!isValid && (
        <p className="text-white/30 text-sm text-center mt-3">
          Please complete all required fields to submit.
        </p>
      )}
    </div>
  );
}
