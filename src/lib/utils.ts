import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getWeaponColor(weapon: string): string {
  const colors: Record<string, string> = {
    Fire: "text-red-400",
    Ice: "text-blue-400",
    Steel: "text-gray-400",
    Glow: "text-purple-400",
    Hex: "text-emerald-400",
    Gum: "text-pink-400",
    Super: "text-yellow-400",
    Alt: "text-orange-400",
    Brawl: "text-amber-400",
    Cyber: "text-cyan-400",
  };
  return colors[weapon] || "text-gray-400";
}

export function getConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    mint: "Mint (M)",
    near_mint: "Near Mint (NM)",
    lightly_played: "Lightly Played (LP)",
    moderately_played: "Moderately Played (MP)",
    heavily_played: "Heavily Played (HP)",
    damaged: "Damaged (D)",
  };
  return labels[condition] || condition;
}

export const CONDITIONS = [
  "Mint",
  "Near Mint",
  "Lightly Played",
  "Moderately Played",
  "Heavily Played",
  "Damaged",
];
