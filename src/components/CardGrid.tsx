"use client";

import Image from "next/image";
import Link from "next/link";
import type { Card } from "@/types";

function WeaponBadge({ weapon }: { weapon: string }) {
  const colorMap: Record<string, string> = {
    Fire: "badge-fire",
    Ice: "badge-ice",
    Steel: "badge-steel",
    Glow: "badge-glow",
    Hex: "badge-hex",
    Gum: "badge-gum",
    Super: "bg-yellow-500/20 text-yellow-400",
    Alt: "bg-orange-500/20 text-orange-400",
    Brawl: "bg-amber-500/20 text-amber-400",
    Cyber: "bg-cyan-500/20 text-cyan-400",
  };

  return (
    <span className={`badge ${colorMap[weapon] || "bg-gray-500/20 text-gray-400"}`}>
      {weapon}
    </span>
  );
}

function CardItem({ card }: { card: Card }) {
  const price = card.last_sale_price
    ? `$${card.last_sale_price.toFixed(2)}`
    : "No sales";

  return (
    <Link href={`/card/${card.id}`}>
      <div className="card hover:border-boba-red/50 transition-all duration-200 group cursor-pointer">
        {/* Image */}
        <div className="relative aspect-[2.5/3.5] bg-gray-800 overflow-hidden">
          {card.image_url ? (
            <Image
              src={card.image_url}
              alt={card.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : card.last_sale_image ? (
            <Image
              src={card.last_sale_image}
              alt={card.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
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
            {card.name}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{card.set_name}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-bold text-boba-gold">{price}</span>
            {card.weapon && <WeaponBadge weapon={card.weapon} />}
          </div>
          {card.power && (
            <p className="text-xs text-gray-500 mt-1">Power: {card.power}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function CardGrid({ cards }: { cards: Card[] }) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-6xl">🃏</span>
        <p className="text-gray-400 mt-4">No cards found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  );
}
