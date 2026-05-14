"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CryptoCheckoutButton } from "@/components/CryptoCheckoutButton";

import { API_BASE } from "@/lib/api";

// Use live key for production, fallback to env var
const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_live_51TB62iFCjIsAzbKc3N4sb0Lox13aM81B8wZ1Fy5jE2dX88xyygC0KIPxt1spwxbnrFl3Mjb1JI3ZG1pTu0BpYz2y00tthYqsmS";

interface ListingData {
  id: string;
  title: string;
  condition: string;
  price_cents: number;
  quantity_available: number;
  seller?: { username: string; id: string };
  card?: { name: string; image_url: string; set_name: string; weapon: string };
}

interface OrderData {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string;
  quantity: number;
  subtotal_cents: number;
  platform_fee_cents: number;
  stripe_fee_cents: number;
  seller_payout_cents: number;
  status: string;
}

interface StripeCheckoutData {
  client_secret: string;
  order_id: string;
  escrow_hold: boolean;
  amount_cents: number;
}

const SHIPPING_METHODS = [
  { value: "pwe", label: "PWE (Plain White Envelope)", price: 100, priceLabel: "$1.00", desc: "No tracking, cards under $20" },
  { value: "bubble_mailer", label: "Bubble Mailer w/ Tracking", price: 400, priceLabel: "$4.00", desc: "USPS tracking included" },
  { value: "box", label: "Box w/ Tracking + Insurance", price: 800, priceLabel: "$8.00", desc: "High-value cards, full protection" },
];

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const [listing, setListing] = useState<ListingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"review" | "payment" | "processing" | "done">("review");
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [checkoutData, setCheckoutData] = useState<StripeCheckoutData | null>(null);
  const [shippingMethod, setShippingMethod] = useState("bubble_mailer");
  const [quantity, setQuantity] = useState(1);

  // Stripe
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("boba-token") : null;

  // Load Stripe.js
  useEffect(() => {
    if (!STRIPE_PK) return;
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.async = true;
    script.onload = () => {
      const s = (window as any).Stripe(STRIPE_PK);
      setStripe(s);
    };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  // Fetch listing
  useEffect(() => {
    fetch(`${API_BASE}/api/listings/${listingId}`)
      .then((r) => { if (!r.ok) throw new Error("Listing not found"); return r.json(); })
      .then((data) => { setListing(data); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [listingId]);

  // Step 1: Create the order
  async function createOrder() {
    if (!token) { router.push("/auth?redirect=/checkout/" + listingId); return; }
    if (!listing) return;

    setError(null);
    setStep("processing");

    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: listingId,
          quantity,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Failed to create order" }));
        // Make seller onboarding errors user-friendly
        const detail = err.detail || "";
        if (detail.includes("Cannot buy your own")) {
          throw new Error("You can't buy your own listing!");
        } else if (detail.includes("not available") || detail.includes("not found")) {
          throw new Error("This listing is no longer available. It may have been sold or removed.");
        } else if (detail.includes("Insufficient quantity")) {
          throw new Error("Not enough copies available. Try a lower quantity.");
        } else if (detail) {
          throw new Error(detail);
        } else {
          throw new Error(`Order creation failed (${res.status})`);
        }
      }

      const order: OrderData = await res.json();
      setOrderData(order);

      // Step 2: Create Stripe PaymentIntent
      const checkoutRes = await fetch(`${API_BASE}/api/orders/${order.id}/stripe-checkout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (!checkoutRes.ok) {
        const err = await checkoutRes.json().catch(() => ({ detail: "Payment setup failed" }));
        // Make payment errors user-friendly
        const detail = err.detail || "";
        if (detail.includes("Stripe onboarding") || detail.includes("has not completed") || detail.includes("stripe_account")) {
          throw new Error("The seller hasn't completed their payment setup yet. We've notified them — please try again later.");
        } else if (detail.includes("Stripe not configured")) {
          throw new Error("Payments are temporarily unavailable. Please try again later.");
        } else if (detail.includes("pending")) {
          throw new Error("Your order is still being processed. Please wait a moment and try again.");
        } else if (detail) {
          throw new Error(detail);
        } else {
          throw new Error(`Payment setup failed (${checkoutRes.status})`);
        }
      }

      const checkout: StripeCheckoutData = await checkoutRes.json();
      setCheckoutData(checkout);
      setStep("payment");

      // Mount Stripe Payment Element
      if (stripe && checkout.client_secret) {
        const elems = stripe.elements({
          clientSecret: checkout.client_secret,
          appearance: {
            theme: "night",
            variables: {
              colorPrimary: "#D1493D",
              colorBackground: "#242424",
              colorText: "#ffffff",
              colorDanger: "#EF4444",
              fontFamily: "'Saira Extra Condensed', sans-serif",
              borderRadius: "16px",
            },
          },
        });
        const paymentElement = elems.create("payment");
        paymentElement.mount("#payment-element");
        setElements(elems);
      }
    } catch (e: any) {
      setError(e.message);
      setStep("review");
    }
  }

  async function confirmPayment() {
    if (!stripe || !elements || !checkoutData) return;
    setPaymentProcessing(true);
    setError(null);

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order/${checkoutData.order_id}/confirmation`,
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
        setPaymentProcessing(false);
      }
      // If successful, Stripe redirects to return_url
    } catch (e: any) {
      setError(e.message);
      setPaymentProcessing(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-boba-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 font-display text-xl mb-4">Sign in to checkout</p>
          <Link href={`/auth?redirect=/checkout/${listingId}`} className="btn-primary text-lg px-8 py-3">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-boba-dark flex items-center justify-center">
        <div className="animate-pulse text-white/40 font-display text-2xl">Loading checkout...</div>
      </div>
    );
  }

  if (error && !listing) {
    return (
      <div className="min-h-screen bg-boba-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-fire font-display text-xl">{error}</p>
          <Link href="/browse" className="text-hex mt-4 inline-block hover:underline">← Back to Browse</Link>
        </div>
      </div>
    );
  }

  const subtotal = listing ? listing.price_cents * quantity : 0;
  const shippingCents = SHIPPING_METHODS.find(m => m.value === shippingMethod)?.price || 400;

  return (
    <div className="min-h-screen bg-boba-dark">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <h1 className="font-display font-black text-5xl text-white mb-10 uppercase">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Form */}
          <div className="flex-1 space-y-6">
            {/* Progress */}
            <div className="flex items-center gap-4 mb-6">
              {["review", "payment"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-base
                    ${step === s || (s === "review" && step === "payment") ? "bg-boba-red text-white" : "bg-white/10 text-white/30"}`}>
                    {i + 1}
                  </div>
                  <span className={`font-display text-base uppercase ${step === s ? "text-white" : "text-white/30"}`}>
                    {s === "review" ? "Review & Shipping" : "Payment"}
                  </span>
                  {i < 1 && <span className="text-white/10 mx-2 text-lg">→</span>}
                </div>
              ))}
            </div>

            {/* Step 1: Review & Shipping */}
            {step === "review" && (
              <div className="card border border-white/10 p-6 space-y-6">
                <h2 className="font-display font-black text-2xl text-white uppercase">Shipping Method</h2>
                <div className="space-y-3">
                  {SHIPPING_METHODS.map((m) => (
                    <label
                      key={m.value}
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition
                        ${shippingMethod === m.value ? "border-boba-red bg-boba-red/10" : "border-white/10 hover:border-white/20"}`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio" name="shipping" value={m.value}
                          checked={shippingMethod === m.value}
                          onChange={() => setShippingMethod(m.value)}
                          className="accent-boba-red w-5 h-5"
                        />
                        <div>
                          <p className="text-white font-display font-bold text-base">{m.label}</p>
                          <p className="text-white/40 text-sm">{m.desc}</p>
                        </div>
                      </div>
                      <span className="text-super font-display font-black text-xl">{m.priceLabel}</span>
                    </label>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <label className="text-white font-display font-bold text-base">Qty:</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="bg-boba-dark border border-white/20 rounded-lg px-4 py-2 text-white text-lg"
                  >
                    {Array.from({ length: Math.min(listing?.quantity_available || 1, 10) }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <span className="text-white/40 text-sm">of {listing?.quantity_available} available</span>
                </div>

                {error && <p className="text-fire text-base font-display font-bold">{error}</p>}

                <button
                  onClick={createOrder}
                  className="w-full btn-primary text-lg py-4"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Processing */}
            {step === "processing" && (
              <div className="card border border-white/10 p-12 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-boba-red border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-white font-display font-bold text-xl">Creating your order...</p>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === "payment" && (
              <div className="card border border-white/10 p-6 space-y-6">
                <h2 className="font-display font-black text-2xl text-white uppercase">Payment</h2>
                <div id="payment-element" className="min-h-[250px]" />

                {error && <p className="text-fire text-base font-display font-bold mt-2">{error}</p>}

                <button
                  onClick={confirmPayment}
                  disabled={paymentProcessing || !elements}
                  className="w-full bg-super text-black py-4 rounded-full font-display font-bold text-xl uppercase hover:brightness-110 transition disabled:opacity-50"
                >
                  {paymentProcessing ? "Processing..." : checkoutData ? `Pay $${((checkoutData.amount_cents + shippingCents) / 100).toFixed(2)}` : "Pay"}
                </button>

                {/* Crypto payment alternative */}
                {checkoutData && (
                  <div className="pt-2">
                    <div className="flex items-center gap-3 my-3">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-white/30 text-sm font-display uppercase">or pay with crypto</span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>
                    <CryptoCheckoutButton
                      orderId={checkoutData.order_id}
                      totalCents={checkoutData.amount_cents + shippingCents}
                      disabled={paymentProcessing}
                    />
                  </div>
                )}

                <button onClick={() => setStep("review")} className="text-white/40 text-base font-display hover:text-white transition">
                  ← Back to Shipping
                </button>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:w-96">
            <div className="card border border-white/10 p-6 sticky top-24">
              <h2 className="font-display font-black text-xl text-white uppercase mb-6">Order Summary</h2>

              {listing && (
                <div className="flex gap-5 mb-6 pb-6 border-b border-white/10">
                  {listing.card?.image_url ? (
                    <img src={listing.card.image_url} alt={listing.card.name} className="w-20 h-28 object-cover rounded-lg shadow-md" />
                  ) : (
                    <div className="w-20 h-28 bg-white/5 rounded-lg flex items-center justify-center text-4xl">🃏</div>
                  )}
                  <div className="min-w-0">
                    <p className="text-lg font-display font-black text-white">{listing.card?.name || listing.title}</p>
                    <p className="text-base text-white/50">{listing.card?.set_name}</p>
                    <p className="text-white/40 text-sm mt-1">Condition: {listing.condition}</p>
                    <p className="text-white/40 text-sm">Seller: {listing.seller?.username}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3 text-base">
                <div className="flex justify-between">
                  <span className="text-white/50">Subtotal ({quantity}x)</span>
                  <span className="text-white font-display font-bold">${(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Shipping</span>
                  <span className="text-white font-display font-bold">{SHIPPING_METHODS.find(m => m.value === shippingMethod)?.priceLabel}</span>
                </div>
                {orderData && (
                  <>
                    <div className="flex justify-between text-white/40 text-sm">
                      <span>Platform fee (8% + $0.25)</span>
                      <span>${((orderData.platform_fee_cents) / 100).toFixed(2)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between border-t border-white/10 pt-3 mt-3">
                  <span className="text-white font-display font-black text-lg">Total</span>
                  <span className="text-super font-display font-black text-2xl">
                    ${((subtotal + shippingCents) / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-2 text-sm text-white/40">
                <p>🔒 Payments secured by Stripe</p>
                <p>📦 Seller has 48 hours to ship after payment</p>
                <p>🛡️ 7-day dispute window after delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}