"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

import { API_BASE } from "@/lib/api";

interface ListingData {
  id: string;
  title: string;
  condition: string;
  price_cents: number;
  quantity: number;
  quantity_available: number;
  description: string | null;
  views: number;
  source: string;
  created_at: string;
  seller: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    rating: number;
    total_sales: number;
  } | null;
  card: {
    id: string;
    name: string;
    card_number: string;
    card_type: string;
    set_name: string;
    year: string | null;
    parallel: string | null;
    weapon: string | null;
    image_url: string | null;
    last_sale_image: string | null;
  } | null;
  images: { id: string; image_url: string; display_order: number }[];
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

const WEAPON_COLORS: Record<string, string> = {
  Fire: "border-fire/40 bg-fire/10",
  Ice: "border-ice/40 bg-ice/10",
  Steel: "border-steel/40 bg-steel/10",
  Glow: "border-glow/40 bg-glow/10",
  Hex: "border-hex/40 bg-hex/10",
  Gum: "border-gum/40 bg-gum/10",
  Brawl: "border-brawl/40 bg-brawl/10",
  Super: "border-super/40 bg-super/10",
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const [listing, setListing] = useState<ListingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("boba-token") : null;

  useEffect(() => {
    fetch(`${API_BASE}/api/listings/${listingId}`)
      .then((r) => {
        if (!r.ok) throw new Error(r.status === 404 ? "Listing not found" : `Failed to load listing (${r.status})`);
        return r.json();
      })
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [listingId]);

  const addToCart = () => {
    if (!listing || !listing.card) return;
    try {
      const saved = localStorage.getItem("boba-cart");
      const cart = saved ? JSON.parse(saved) : [];
      cart.push({
        listingId: listing.id,
        cardId: listing.card.id,
        name: listing.card.name,
        set: listing.card.set_name,
        parallel: listing.card.parallel,
        weapon: listing.card.weapon,
        condition: listing.condition,
        price: listing.price_cents / 100,
        priceCents: listing.price_cents,
        qty: 1,
        seller: listing.seller?.username || "Seller",
        sellerId: listing.seller?.id,
        img: listing.card.image_url || listing.images?.[0]?.image_url || listing.card.last_sale_image,
      });
      localStorage.setItem("boba-cart", JSON.stringify(cart));
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch {}
  };

  const buyNow = () => {
    if (!token) {
      router.push(`/auth?redirect=/checkout/${listingId}`);
      return;
    }
    router.push(`/checkout/${listingId}`);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 aspect-square bg-gray-700 rounded-2xl" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-700 rounded w-1/2" />
            <div className="h-24 bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-4">🃏</span>
        <h1 className="text-3xl font-display font-black text-white mb-2">{error || "Listing not found"}</h1>
        <Link href="/browse" className="btn-primary mt-4 inline-block">Browse Cards</Link>
      </div>
    );
  }

  const card = listing.card;
  const seller = listing.seller;
  const weaponClass = WEAPON_COLORS[card?.weapon || ""] || "border-white/20 bg-white/5";
  const imageUrl = listing.images?.[0]?.image_url || card?.image_url || card?.last_sale_image;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/browse" className="hover:text-white">Browse</Link>
        <span className="mx-2">→</span>
        {card && (
          <>
            <Link href={`/browse?set_name=${encodeURIComponent(card.set_name)}`} className="hover:text-white">{card.set_name}</Link>
            <span className="mx-2">→</span>
            <Link href={`/card/${card.id}`} className="hover:text-white">{card.name}</Link>
            <span className="mx-2">→</span>
          </>
        )}
        <span className="text-white">Listing</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className={`card overflow-hidden border-2 ${weaponClass}`}>
            <div className="aspect-square bg-gray-800 flex items-center justify-center relative">
              {imageUrl ? (
                <img src={imageUrl} alt={listing.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl">🃏</span>
              )}
            </div>
          </div>
          {listing.images.length > 1 && (
            <div className="flex gap-2 mt-2">
              {listing.images.map((img) => (
                <div key={img.id} className="w-16 h-16 rounded-lg bg-gray-700 border-2 border-transparent hover:border-boba-red cursor-pointer overflow-hidden">
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Listing Info */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{listing.title}</h1>
          <p className="text-gray-400 mb-4">
            Listed by{" "}
            <Link href={`/user/${seller?.id}`} className="text-hex hover:underline">
              @{seller?.username || "seller"}
            </Link>
            {" · "}{formatDate(listing.created_at)}
            {" · "}{listing.views} views
          </p>

          <div className="card p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-boba-gold">{formatPrice(listing.price_cents)}</span>
              <span className="badge bg-green-500/20 text-green-400">{listing.condition}</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              {listing.quantity_available} of {listing.quantity} available
            </p>
            <div className="flex gap-2">
              <button
                onClick={buyNow}
                className="btn-primary flex-1 text-lg py-3"
              >
                🛒 Buy Now
              </button>
              <button
                onClick={addToCart}
                className={`px-4 py-3 rounded-xl font-display font-bold text-base border transition-all ${
                  addedToCart
                    ? "bg-green-500/20 border-green-500/50 text-green-400"
                    : "bg-boba-panel border-white/20 text-white hover:bg-white/10"
                }`}
              >
                {addedToCart ? "✓ Added" : "Add to Cart"}
              </button>
            </div>
          </div>

          {listing.description && (
            <div className="card p-4 mb-4">
              <h2 className="font-semibold text-white mb-2">Description</h2>
              <p className="text-gray-400 text-sm">{listing.description}</p>
            </div>
          )}

          {/* Seller Info */}
          <div className="card p-4">
            <h2 className="font-semibold text-white mb-2">Seller</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                {seller?.avatar_url ? (
                  <img src={seller.avatar_url} alt={seller.username} className="w-full h-full object-cover" />
                ) : (
                  <span>👤</span>
                )}
              </div>
              <div>
                <Link href={`/user/${seller?.id}`}>
                  <p className="text-white font-semibold hover:text-hex transition">@{seller?.username || "seller"}</p>
                </Link>
                <p className="text-sm text-gray-400">
                  ⭐ {seller?.rating?.toFixed(1) || "5.0"} · {seller?.total_sales || 0} sales
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Info */}
      {card && (
        <div className="mt-8 card p-6">
          <h2 className="font-display font-bold text-white mb-4 uppercase tracking-wider">Card Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Name", value: card.name },
              { label: "Set", value: card.set_name },
              { label: "Number", value: card.card_number },
              { label: "Type", value: card.card_type },
              { label: "Weapon", value: card.weapon || "—" },
              { label: "Parallel", value: card.parallel || "—" },
              { label: "Year", value: card.year || "—" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-white/30 font-display uppercase tracking-wider">{item.label}</p>
                <p className="text-base text-white mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link href={`/card/${card.id}`} className="text-hex hover:underline text-sm">
              View full card details →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
