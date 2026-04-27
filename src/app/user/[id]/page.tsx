"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { API_BASE } from "@/lib/api";

const TIER_COLORS: Record<string, string> = {
  steel: "#71717A",
  fire: "#EF4444",
  ice: "#38BDF8",
  glow: "#79F528",
  hex: "#A855F7",
  super: "#FBBF24",
};

const TIER_EMOJIS: Record<string, string> = {
  steel: "🔩",
  fire: "🔥",
  ice: "🧊",
  glow: "✨",
  hex: "🔮",
  super: "⚡",
};

interface SellerProfile {
  user_id: string;
  username: string;
  tier: string;
  tier_display: string;
  tier_emoji: string;
  tier_color: string;
  fee_percent: number;
  rolling_30d_volume_cents: number;
  total_sales_count: number;
  total_sales_volume_cents: number;
  active_listing_count: number;
  avg_rating: number | null;
  total_ratings: number;
  avg_shipping_stars: number | null;
  avg_condition_stars: number | null;
  avg_comms_stars: number | null;
  avg_accuracy_stars: number | null;
  bio: string | null;
  banner_url: string | null;
  stripe_onboarded: boolean;
  member_since: string | null;
  perks: string[];
  max_listing_slots: number | null;
  next_tier: string | null;
  next_tier_volume_needed_cents: number | null;
}

interface FeedbackItem {
  id: string;
  buyer_username: string;
  overall_stars: number;
  shipping_stars: number | null;
  condition_stars: number | null;
  comms_stars: number | null;
  accuracy_stars: number | null;
  comment: string | null;
  seller_response: string | null;
  response_at: string | null;
  created_at: string;
}

interface RatingSummary {
  avg_overall: number | null;
  avg_shipping: number | null;
  avg_condition: number | null;
  avg_comms: number | null;
  avg_accuracy: number | null;
  total_ratings: number;
  positive_count: number;
  neutral_count: number;
  negative_count: number;
}

function Stars({ rating, size = "text-lg" }: { rating: number; size?: string }) {
  return (
    <span className={`${size} text-boba-gold`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(rating) ? "text-boba-gold" : "text-white/20"}>★</span>
      ))}
    </span>
  );
}

function RatingBar({ label, icon, value }: { label: string; icon: string; value: number | null }) {
  if (value === null) return null;
  const pct = (value / 5) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <span className="text-white/60 w-28 text-sm">{label}</span>
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: pct >= 80 ? "#79F528" : pct >= 60 ? "#FBBF24" : "#EF4444" }} />
      </div>
      <span className="text-white font-display font-bold w-8 text-right">{value.toFixed(1)}</span>
    </div>
  );
}

export default function SellerProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [ratings, setRatings] = useState<RatingSummary | null>(null);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [activeTab, setActiveTab] = useState<"listings" | "feedback" | "about">("listings");
  const [feedbackFilter, setFeedbackFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, ratingsRes, feedbackRes] = await Promise.all([
          fetch(`${API_BASE}/api/seller/profile/${userId}`),
          fetch(`${API_BASE}/api/feedback/seller/${userId}/summary`),
          fetch(`${API_BASE}/api/feedback/seller/${userId}?limit=20`),
        ]);

        if (profileRes.ok) setProfile(await profileRes.json());
        if (ratingsRes.ok) setRatings(await ratingsRes.json());
        if (feedbackRes.ok) setFeedback(await feedbackRes.json());
      } catch (e) {
        console.error("Failed to load seller profile:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-boba-dark flex items-center justify-center">
        <div className="animate-pulse text-white/40 font-display text-2xl">Loading seller profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-boba-dark flex items-center justify-center">
        <div className="text-white/60 font-display text-2xl">Seller not found</div>
      </div>
    );
  }

  const tierColor = TIER_COLORS[profile.tier] || "#71717A";

  return (
    <div className="min-h-screen bg-boba-dark">
      {/* Banner */}
      <div
        className="h-48 md:h-64 w-full relative"
        style={{
          background: profile.banner_url
            ? `url(${profile.banner_url}) center/cover`
            : `linear-gradient(135deg, ${tierColor}33 0%, #0E0E0E 50%, ${tierColor}22 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-boba-dark to-transparent" />
      </div>

      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
          <div
            className="w-24 h-24 md:w-32 md:h-32 rounded-boba border-4 flex items-center justify-center text-4xl md:text-5xl font-display font-black"
            style={{ borderColor: tierColor, backgroundColor: `${tierColor}22` }}
          >
            {profile.username?.[0]?.toUpperCase() || "?"}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="font-display font-black text-4xl md:text-5xl text-white">{profile.username}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {/* Tier badge */}
              <span
                className="px-3 py-1 rounded-full font-display font-bold text-sm uppercase tracking-wider"
                style={{ backgroundColor: `${tierColor}22`, color: tierColor, border: `1px solid ${tierColor}` }}
              >
                {profile.tier_emoji} {profile.tier_display}
              </span>

              {/* Rating */}
              {profile.avg_rating && (
                <span className="flex items-center gap-1">
                  <Stars rating={profile.avg_rating} size="text-base" />
                  <span className="text-white font-bold">{profile.avg_rating.toFixed(1)}</span>
                  <span className="text-white/40">({profile.total_ratings})</span>
                </span>
              )}

              {/* Verified */}
              {["fire", "ice", "glow", "hex", "super"].includes(profile.tier) && (
                <span className="text-super text-sm font-display">✅ Verified</span>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mt-3 text-white/60 text-sm">
              <span>📦 {profile.total_sales_count.toLocaleString()} sales</span>
              <span>📋 {profile.active_listing_count} active listings</span>
              {profile.member_since && (
                <span>📅 Member since {new Date(profile.member_since).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-8 border-b border-white/10">
          {(["listings", "feedback", "about"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-display font-bold text-sm uppercase tracking-wider transition-all
                ${activeTab === tab ? "text-white border-b-2" : "text-white/40 hover:text-white/60"}`}
              style={activeTab === tab ? { borderColor: tierColor } : {}}
            >
              {tab === "feedback" ? `Feedback (${profile.total_ratings})` : tab === "listings" ? `Listings (${profile.active_listing_count})` : "About"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === "listings" && (
            <div className="text-center text-white/40 py-12">
              <p className="font-display text-xl">No active listings yet</p>
              <p className="text-sm mt-2">When this seller lists cards, they&apos;ll appear here.</p>
            </div>
          )}

          {activeTab === "feedback" && (
            <div className="space-y-8">
              {/* Rating Summary */}
              {ratings && ratings.total_ratings > 0 && (
                <div className="bg-boba-panel rounded-boba p-6 border border-white/10">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Overall */}
                    <div className="text-center">
                      <div className="text-5xl font-display font-black text-white">
                        {ratings.avg_overall?.toFixed(1) || "—"}
                      </div>
                      <Stars rating={ratings.avg_overall || 0} />
                      <div className="text-white/40 text-sm mt-1">{ratings.total_ratings} ratings</div>
                      <div className="flex gap-4 mt-3 text-xs">
                        <span className="text-super">👍 {ratings.positive_count}</span>
                        <span className="text-white/40">😐 {ratings.neutral_count}</span>
                        <span className="text-fire">👎 {ratings.negative_count}</span>
                      </div>
                    </div>

                    {/* Sub-ratings */}
                    <div className="flex-1 space-y-3">
                      <RatingBar label="Shipping" icon="🚚" value={ratings.avg_shipping} />
                      <RatingBar label="Condition" icon="🃏" value={ratings.avg_condition} />
                      <RatingBar label="Communication" icon="💬" value={ratings.avg_comms} />
                      <RatingBar label="Accuracy" icon="📋" value={ratings.avg_accuracy} />
                    </div>
                  </div>
                </div>
              )}

              {/* Filter */}
              <div className="flex gap-2">
                {["all", "positive", "neutral", "negative"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFeedbackFilter(f)}
                    className={`px-4 py-2 rounded-full font-display text-xs uppercase tracking-wider transition-all
                      ${feedbackFilter === f ? "bg-white/20 text-white" : "bg-white/5 text-white/40 hover:bg-white/10"}`}
                  >
                    {f === "positive" ? "4-5★" : f === "neutral" ? "3★" : f === "negative" ? "1-2★" : "All"}
                  </button>
                ))}
              </div>

              {/* Feedback list */}
              {feedback.length === 0 ? (
                <div className="text-center text-white/40 py-8">
                  <p className="font-display text-xl">No feedback yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feedback
                    .filter((fb) => {
                      if (feedbackFilter === "positive") return fb.overall_stars >= 4;
                      if (feedbackFilter === "neutral") return fb.overall_stars === 3;
                      if (feedbackFilter === "negative") return fb.overall_stars <= 2;
                      return true;
                    })
                    .map((fb) => (
                      <div key={fb.id} className="bg-boba-panel rounded-boba p-4 border border-white/10">
                        <div className="flex items-center gap-3">
                          <Stars rating={fb.overall_stars} size="text-sm" />
                          <span className="text-white font-display font-bold">{fb.buyer_username}</span>
                          <span className="text-white/30 text-xs">
                            {new Date(fb.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        {fb.comment && <p className="text-white/70 mt-2 text-sm">{fb.comment}</p>}
                        {fb.seller_response && (
                          <div className="mt-3 pl-4 border-l-2 border-white/10">
                            <p className="text-white/50 text-xs font-display">Seller Response:</p>
                            <p className="text-white/60 text-sm">{fb.seller_response}</p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "about" && (
            <div className="bg-boba-panel rounded-boba p-6 border border-white/10 max-w-2xl">
              {profile.bio ? (
                <p className="text-white/70">{profile.bio}</p>
              ) : (
                <p className="text-white/30 italic">This seller hasn&apos;t added a bio yet.</p>
              )}
              <div className="mt-6 space-y-2">
                <h3 className="font-display font-bold text-white uppercase text-sm tracking-wider">Tier Perks</h3>
                <ul className="space-y-1">
                  {profile.perks.map((perk, i) => (
                    <li key={i} className="text-white/60 text-sm flex items-center gap-2">
                      <span style={{ color: tierColor }}>●</span> {perk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
