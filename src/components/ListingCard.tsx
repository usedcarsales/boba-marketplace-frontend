"use client";

import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/types";

function ConditionBadge({ condition }: { condition: string }) {
  const colorMap: Record<string, string> = {
    Mint: "bg-emerald-500/20 text-emerald-400",
    "Near Mint": "bg-green-500/20 text-green-400",
    "Lightly Played": "bg-yellow-500/20 text-yellow-400",
    "Moderately Played": "bg-orange-500/20 text-orange-400",
    "Heavily Played": "bg-red-500/20 text-red-400",
    Damaged: "bg-red-700/20 text-red-500",
  };

  return (
    <span className={`badge ${colorMap[condition] || "bg-gray-500/20 text-gray-400"}`}>
      {condition}
    </span>
  );
}

export function ListingCard({ listing }: { listing: Listing }) {
  const price = (listing.price_cents / 100).toFixed(2);

  return (
    <Link href={`/listing/${listing.id}`}>
      <div className="card hover:border-boba-red/50 transition-all duration-200 group cursor-pointer">
        {/* Image */}
        <div className="relative aspect-[2.5/3.5] bg-gray-800 overflow-hidden">
          {listing.images?.[0]?.image_url ? (
            <Image
              src={listing.images[0].image_url}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : listing.card?.image_url ? (
            <Image
              src={listing.card.image_url}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-600">
              <span className="text-4xl">🃏</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-white truncate group-hover:text-boba-red transition-colors">
            {listing.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <ConditionBadge condition={listing.condition} />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-boba-gold">${price}</span>
            {listing.quantity_available > 1 && (
              <span className="text-xs text-gray-400">
                {listing.quantity_available} available
              </span>
            )}
          </div>
          {listing.seller && (
            <p className="text-xs text-gray-500 mt-1">
              by @{listing.seller.username}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
