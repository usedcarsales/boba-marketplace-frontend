"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CryptoCheckoutButton } from "@/components/CryptoCheckoutButton";

import { API_BASE } from "@/lib/api";
const STRIPE_PK = "pk_test_51TB632JzWn4qd9fYYcjynhhj1rvCex9tew5TohrBHVSXku4h8ypajv0CDhaCcL0jQMQeMMkM1IUPAcph9CFgZhDd00g6cGsyuC";

interface ListingData {
  id: string;
  title: string;
  condition: string;
  price_cents: number;
  quantity_available: number;
  seller?: { username: string; id: string };
  card?: { name: string; image_url: string; set_name: string; weapon: string };
}

interface CheckoutResponse {
  order_id: string;
  client_secret: string;
  subtotal_cents: number;
  shipping_cents: number;
  platform_fee_cents: number;
  order_fee_cents: number;
  stripe_fee_cents: number;
  total_cents: number;
  seller_payout_cents: number;
  shipping_method: string;
  requires_insurance: boolean;
  requires_signature: boolean;
  tracking_required: boolean;
}

const SHIPPING_METHODS = [
  { value: "pwe", label: "PWE (Plain White Envelope)", price: "$1.00", desc: "No tracking, cards under $20" },
  { value: "bubble_mailer", label: "Bubble Mailer w/ Tracking", price: "$4.00", desc: "USPS tracking included" },
  { value: "box", label: "Box w/ Tracking + Insurance", price: "$8.00", desc: "High-value cards, full protection" },
];

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const [listing, setListing] = useState<ListingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"address" | "payment" | "processing" | "done">("address");
  const [error, setError] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutResponse | null>(null);
  const [shippingMethod, setShippingMethod] = useState("bubble_mailer");
  const [quantity, setQuantity] = useState(1);

  // Address form
  const [name, setName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  // Stripe
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("boba-token") : null;

  // Load Stripe.js
  useEffect(() => {
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

  // Create checkout when moving to payment step
  async function createCheckout() {
    if (!token) { router.push("/auth?redirect=/checkout/" + listingId); return; }
    if (!name || !address1 || !city || !state || !zip) {
      setError("Please fill in all required address fields");
      return;
    }

    setError(null);
    setStep("payment");

    try {
      const res = await fetch(`${API_BASE}/api/orders/checkout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: listingId,
          quantity,
          shipping_method: shippingMethod,
          ship_to_name: name,
          ship_to_address1: address1,
          ship_to_address2: address2,
          ship_to_city: city,
          ship_to_state: state,
          ship_to_zip: zip,
          ship_to_country: "US",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Checkout failed");
      }

      const data: CheckoutResponse = await res.json();
      setCheckoutData(data);

      // Mount Stripe Payment Element
      if (stripe && data.client_secret) {
        const elems = stripe.elements({
          clientSecret: data.client_secret,
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
      setStep("address");
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
          <Link href={`/auth?redirect=/checkout/${listingId}`} className="bg-boba-red text-white px-6 py-3 rounded-full font-display font-bold uppercase">
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
          <Link href="/browse" className="text-hex mt-4 inline-block">← Back to Browse</Link>
        </div>
      </div>
    );
  }

  const subtotal = listing ? listing.price_cents * quantity : 0;

  return (
    <div className="min-h-screen bg-boba-dark">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-display font-black text-4xl text-white mb-8 uppercase">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Form */}
          <div className="flex-1 space-y-6">
            {/* Progress */}
            <div className="flex items-center gap-4 mb-6">
              {["address", "payment"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm
                    ${step === s || (s === "address" && step === "payment") ? "bg-boba-red text-white" : "bg-white/10 text-white/30"}`}>
                    {i + 1}
                  </div>
                  <span className={`font-display text-sm uppercase ${step === s ? "text-white" : "text-white/30"}`}>
                    {s === "address" ? "Shipping" : "Payment"}
                  </span>
                  {i < 1 && <span className="text-white/10 mx-2">→</span>}
                </div>
              ))}
            </div>

            {/* Step 1: Address */}
            {step === "address" && (
              <div className="bg-boba-panel rounded-boba p-6 border border-white/10 space-y-4">
                <h2 className="font-display font-bold text-xl text-white uppercase">Shipping Address</h2>
                <input
                  type="text" placeholder="Full Name *" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-boba px-4 py-3 text-white placeholder:text-white/30 focus:border-boba-red outline-none"
                />
                <input
                  type="text" placeholder="Address Line 1 *" value={address1} onChange={(e) => setAddress1(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-boba px-4 py-3 text-white placeholder:text-white/30 focus:border-boba-red outline-none"
                />
                <input
                  type="text" placeholder="Address Line 2 (Apt, Suite)" value={address2} onChange={(e) => setAddress2(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-boba px-4 py-3 text-white placeholder:text-white/30 focus:border-boba-red outline-none"
                />
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text" placeholder="City *" value={city} onChange={(e) => setCity(e.target.value)}
                    className="bg-white/5 border border-white/15 rounded-boba px-4 py-3 text-white placeholder:text-white/30 focus:border-boba-red outline-none"
                  />
                  <input
                    type="text" placeholder="State *" value={state} onChange={(e) => setState(e.target.value)}
                    className="bg-white/5 border border-white/15 rounded-boba px-4 py-3 text-white placeholder:text-white/30 focus:border-boba-red outline-none"
                  />
                  <input
                    type="text" placeholder="ZIP *" value={zip} onChange={(e) => setZip(e.target.value)}
                    className="bg-white/5 border border-white/15 rounded-boba px-4 py-3 text-white placeholder:text-white/30 focus:border-boba-red outline-none"
                  />
                </div>

                <h3 className="font-display font-bold text-lg text-white uppercase mt-6">Shipping Method</h3>
                <div className="space-y-2">
                  {SHIPPING_METHODS.map((m) => (
                    <label
                      key={m.value}
                      className={`flex items-center justify-between p-3 rounded-boba border cursor-pointer transition
                        ${shippingMethod === m.value ? "border-boba-red bg-boba-red/10" : "border-white/10 hover:border-white/20"}`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio" name="shipping" value={m.value}
                          checked={shippingMethod === m.value}
                          onChange={() => setShippingMethod(m.value)}
                          className="accent-boba-red"
                        />
                        <div>
                          <p className="text-white font-display font-bold text-sm">{m.label}</p>
                          <p className="text-white/30 text-xs">{m.desc}</p>
                        </div>
                      </div>
                      <span className="text-super font-display font-bold">{m.price}</span>
                    </label>
                  ))}
                </div>

                {error && <p className="text-fire text-sm">{error}</p>}

                <button
                  onClick={createCheckout}
                  className="w-full bg-boba-red text-white py-4 rounded-full font-display font-bold text-lg uppercase hover:brightness-110 transition mt-4"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === "payment" && (
              <div className="bg-boba-panel rounded-boba p-6 border border-white/10 space-y-4">
                <h2 className="font-display font-bold text-xl text-white uppercase">Payment</h2>
                <div id="payment-element" className="min-h-[200px]" />

                {error && <p className="text-fire text-sm mt-2">{error}</p>}

                <button
                  onClick={confirmPayment}
                  disabled={paymentProcessing || !elements}
                  className="w-full bg-super text-black py-4 rounded-full font-display font-bold text-lg uppercase hover:brightness-110 transition mt-4 disabled:opacity-50"
                >
                  {paymentProcessing ? "Processing..." : `Pay $${checkoutData ? (checkoutData.total_cents / 100).toFixed(2) : "..."}`}
                </button>

                {/* Crypto payment alternative */}
                {checkoutData && (
                  <div className="pt-2">
                    <div className="flex items-center gap-3 my-3">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-white/30 text-xs font-display uppercase">or</span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>
                    <CryptoCheckoutButton
                      orderId={checkoutData.order_id}
                      totalCents={checkoutData.total_cents}
                      disabled={paymentProcessing}
                    />
                  </div>
                )}

                <button onClick={() => setStep("address")} className="text-white/40 text-sm font-display hover:text-white transition">
                  ← Back to Shipping
                </button>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:w-96">
            <div className="bg-boba-panel rounded-boba p-6 border border-white/10 sticky top-24">
              <h2 className="font-display font-bold text-lg text-white uppercase mb-4">Order Summary</h2>

              {listing && (
                <div className="flex gap-4 mb-6 pb-4 border-b border-white/10">
                  {listing.card?.image_url ? (
                    <img src={listing.card.image_url} alt={listing.card.name} className="w-20 h-28 object-cover rounded-lg" />
                  ) : (
                    <div className="w-20 h-28 bg-white/5 rounded-lg flex items-center justify-center text-3xl">🃏</div>
                  )}
                  <div>
                    <p className="text-white font-display font-bold">{listing.card?.name || listing.title}</p>
                    <p className="text-white/40 text-sm">{listing.card?.set_name}</p>
                    <p className="text-white/30 text-xs mt-1">Condition: {listing.condition}</p>
                    <p className="text-white/30 text-xs">Seller: {listing.seller?.username}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">Subtotal ({quantity}x)</span>
                  <span className="text-white font-display">${(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Shipping</span>
                  <span className="text-white font-display">
                    {shippingMethod === "pwe" ? "$1.00" : shippingMethod === "bubble_mailer" ? "$4.00" : "$8.00"}
                  </span>
                </div>
                {checkoutData && (
                  <>
                    <div className="flex justify-between text-white/30">
                      <span>Platform fee (8% + $0.25)</span>
                      <span>${((checkoutData.platform_fee_cents + checkoutData.order_fee_cents) / 100).toFixed(2)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                  <span className="text-white font-display font-bold">Total</span>
                  <span className="text-super font-display font-black text-xl">
                    {checkoutData
                      ? `$${(checkoutData.total_cents / 100).toFixed(2)}`
                      : `$${((subtotal + (shippingMethod === "pwe" ? 100 : shippingMethod === "bubble_mailer" ? 400 : 800)) / 100).toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs text-white/30">
                <p>🔒 Payments secured by Stripe</p>
                <p>💳 Platform fee (8% + $0.25) is included in the price</p>
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
