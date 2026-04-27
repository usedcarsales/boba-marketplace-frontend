"use client";

import { useState } from "react";

interface CryptoCheckoutButtonProps {
  orderId: string;
  totalCents: number;
  disabled?: boolean;
}

import { API_BASE } from "@/lib/api";

export function CryptoCheckoutButton({ orderId, totalCents, disabled }: CryptoCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCryptoCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("boba-token");

      const res = await fetch(`${API_BASE}/api/orders/${orderId}/crypto-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          price_amount: totalCents / 100,
          price_currency: "usd",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to create crypto payment");
      }

      const { checkout_url } = await res.json();

      // Redirect to NOWPayments hosted checkout
      window.location.href = checkout_url;
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleCryptoCheckout}
        disabled={disabled || loading}
        className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-4 py-3 transition-colors"
        type="button"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Creating crypto payment...
          </>
        ) : (
          <>
            <BitcoinIcon className="w-5 h-5" />
            Pay with Crypto
          </>
        )}
      </button>

      {error && (
        <p className="text-red-400 text-xs text-center">{error}</p>
      )}

      <p className="text-xs text-gray-500 text-center">
        BTC, ETH, SOL, USDC, and 300+ coins via NOWPayments
      </p>
    </div>
  );
}

function BitcoinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.974.445.955.463c.537.243.63.558.615.88l-1.477 5.92c-.075.166-.24.415-.625.32.015.02-.955-.24-.955-.24l-.65 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
    </svg>
  );
}
