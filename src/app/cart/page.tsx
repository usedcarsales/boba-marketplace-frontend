"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface CartItem {
  cardId: number;
  name: string;
  set: string;
  parallel: string;
  weapon: string;
  condition: string;
  price: number;
  qty: number;
  seller: string;
  img?: string;
}

const WEAPON_COLORS: Record<string, string> = {
  Fire: "border-fire/40", Ice: "border-ice/40", Steel: "border-steel/40",
  Glow: "border-glow/40", Hex: "border-hex/40", Gum: "border-gum/40",
  Brawl: "border-brawl/40", Super: "border-super/40",
};

function formatPrice(price: number) {
  return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage
    try {
      const saved = localStorage.getItem("boba-cart");
      if (saved) setCartItems(JSON.parse(saved));
    } catch {}
  }, []);

  const updateCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("boba-cart", JSON.stringify(items));
  };

  const removeItem = (index: number) => {
    const updated = cartItems.filter((_, i) => i !== index);
    updateCart(updated);
  };

  const updateQty = (index: number, qty: number) => {
    if (qty < 1) return;
    const updated = [...cartItems];
    updated[index] = { ...updated[index], qty };
    updateCart(updated);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const platformFee = subtotal * 0.06;
  const stripeFee = subtotal > 0 ? subtotal * 0.029 + 0.3 : 0;
  const total = subtotal;

  // Group items by seller
  const sellerGroups = cartItems.reduce((groups, item) => {
    if (!groups[item.seller]) groups[item.seller] = [];
    groups[item.seller].push(item);
    return groups;
  }, {} as Record<string, CartItem[]>);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <span className="text-7xl block mb-6">🛒</span>
        <h1 className="text-5xl font-display font-black text-white mb-3">Your Cart is Empty</h1>
        <p className="text-xl text-white/40 font-body mb-8">Find cards to add to your cart</p>
        <Link href="/browse" className="btn-primary text-lg px-10 py-3.5">Browse Cards</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-5xl font-display font-black text-white mb-2">Shopping Cart</h1>
      <p className="text-xl text-white/40 font-body mb-8">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} from {Object.keys(sellerGroups).length} seller{Object.keys(sellerGroups).length !== 1 ? "s" : ""}</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-6">
          {Object.entries(sellerGroups).map(([seller, items]) => (
            <div key={seller} className="card border border-white/10">
              <div className="px-5 py-3 border-b border-white/10 bg-boba-panel flex items-center gap-2">
                <span className="text-lg">👤</span>
                <span className="font-display font-bold text-white text-base uppercase tracking-wider">{seller}</span>
                <span className="text-xs text-white/30">· {items.length} item{items.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="divide-y divide-white/5">
                {items.map((item, i) => {
                  const globalIndex = cartItems.indexOf(item);
                  return (
                    <div key={i} className="p-5 flex items-center gap-4">
                      {/* Card Image */}
                      <div className={`w-16 h-22 rounded-lg overflow-hidden border ${WEAPON_COLORS[item.weapon] || "border-white/10"} flex-shrink-0`}>
                        {item.img ? (
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-boba-panel flex items-center justify-center">
                            <span className="text-2xl text-white/10">🃏</span>
                          </div>
                        )}
                      </div>

                      {/* Card Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/card/${item.cardId}`}>
                          <h3 className="text-lg font-display font-bold text-white hover:text-hex transition-colors truncate">{item.name}</h3>
                        </Link>
                        <p className="text-sm text-white/30">{item.set} · {item.parallel}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="badge bg-white/5 text-white/40 text-xs">{item.condition}</span>
                          <span className="badge bg-white/5 text-white/40 text-xs">{item.weapon}</span>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(globalIndex, item.qty - 1)}
                          className="w-8 h-8 rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 flex items-center justify-center transition-colors"
                        >
                          −
                        </button>
                        <span className="text-base font-display font-bold text-white w-8 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(globalIndex, item.qty + 1)}
                          className="w-8 h-8 rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl font-display font-black text-super">{formatPrice(item.price * item.qty)}</p>
                        {item.qty > 1 && (
                          <p className="text-xs text-white/20">{formatPrice(item.price)} each</p>
                        )}
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(globalIndex)}
                        className="text-fire/40 hover:text-fire transition-colors text-lg flex-shrink-0"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="card border border-white/10 p-6 sticky top-24">
            <h2 className="text-xl font-display font-bold text-white mb-6 uppercase tracking-wider">Order Summary</h2>

            <div className="space-y-3 text-base mb-6">
              <div className="flex justify-between">
                <span className="text-white/40">Subtotal ({cartItems.length} items)</span>
                <span className="text-white font-display font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Shipping</span>
                <span className="text-white/40 text-sm">Calculated at checkout</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="text-white font-display font-bold text-lg">Total</span>
                <span className="text-3xl font-display font-black text-super">{formatPrice(total)}</span>
              </div>
            </div>

            <Link href="/auth" className="btn-primary w-full text-lg py-3 text-center block">
              Sign In to Checkout
            </Link>

            <div className="mt-4 space-y-2 text-center">
              <p className="text-xs text-white/20">🔒 Secure checkout powered by Stripe</p>
              <p className="text-xs text-white/20">Payment held until delivery confirmed</p>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4">
              <Link href="/browse" className="text-sm text-hex hover:text-hex-light font-display uppercase tracking-wider">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
