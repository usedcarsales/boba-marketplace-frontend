"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { API_BASE } from "@/lib/api";

export default function SellerOnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [onboardStatus, setOnboardStatus] = useState<{
    stripe_account_id: string | null;
    onboarding_complete: boolean;
    charges_enabled?: boolean;
    payouts_enabled?: boolean;
  } | null>(null);

  // Check existing onboarding status
  useEffect(() => {
    const token = localStorage.getItem("boba-token");
    if (!token) {
      router.push("/auth?redirect=/dashboard/sell/onboard");
      return;
    }

    // If returning from Stripe with ?complete=1, force a refresh from Stripe
    const params = new URLSearchParams(window.location.search);
    const isReturningFromStripe = params.get("complete") === "1";
    const isRetry = params.get("retry") === "1";
    const endpoint = (isReturningFromStripe || isRetry)
      ? `${API_BASE}/api/seller/onboard/refresh`  // Force Stripe check
      : `${API_BASE}/api/seller/onboard/status`;

    fetch(endpoint, {
      method: isReturningFromStripe || isRetry ? "POST" : "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) {
          router.push("/auth?redirect=/dashboard/sell/onboard");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) {
          setOnboardStatus(data);
          if (data.onboarding_complete) {
            setStep(4); // Already onboarded
          } else if (data.stripe_account_id) {
            setStep(3); // Started but not finished
          } else {
            setStep(1); // Haven't started yet
          }
          // Clean up URL params after processing
          if (isReturningFromStripe || isRetry) {
            window.history.replaceState({}, '', '/dashboard/sell/onboard');
          }
        }
      })
      .catch((err) => {
        console.error('Onboard status check failed:', err);
      });
  }, [router]);

  const startStripeOnboarding = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("boba-token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/seller/onboard`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          setError("Session expired — please log in again");
          router.push("/auth?redirect=/dashboard/sell/onboard");
          return;
        }
        setError(data.detail || data.message || `Error ${res.status}: ${res.statusText}`);
        return;
      }
      
      const data = await res.json();
      
      if (data.url) {
        // Redirect to Stripe onboarding
        window.location.href = data.url;
      } else if (data.status === "complete") {
        setStep(4);
      } else {
        setError(data.message || "Failed to start onboarding");
      }
    } catch (err: any) {
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('Network error — server may be waking up. Please try again in 30 seconds.');
      } else {
        setError(err?.message || 'Network error — please try again');
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-display font-black text-white mb-2">Start Selling</h1>
      <p className="text-xl text-white/40 font-body mb-10">
        Set up your seller account in a few simple steps
      </p>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {["Agreement", "Identity", "Payment", "Ready"].map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg ${
              i + 1 < step ? "gradient-hex-glow text-white"
                : i + 1 === step ? "bg-boba-red text-white"
                : "bg-boba-gray border border-white/10 text-white/30"
            }`}>
              {i + 1 < step ? "✓" : i + 1}
            </div>
            <span className={`text-sm font-display uppercase tracking-wider hidden sm:inline ${
              i + 1 <= step ? "text-white" : "text-white/20"
            }`}>{label}</span>
            {i < 3 && <div className={`flex-1 h-0.5 ${i + 1 < step ? "gradient-hex-glow" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Seller Agreement */}
      {step === 1 && (
        <div className="card border border-white/10 p-8">
          <h2 className="text-2xl font-display font-bold text-white mb-4">Seller Agreement</h2>
          <p className="text-white/50 mb-6">Please review and accept our seller terms before continuing.</p>

          <div className="card border border-white/10 bg-boba-dark p-6 max-h-80 overflow-y-auto mb-6 text-sm text-white/60 space-y-4">
            <p className="font-bold text-white/80">Key Terms Summary:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white">Fees:</strong> 8% platform fee + $0.25 per order + ~2.9% + $0.30 Stripe processing fee per sale. Listing is free.</li>
              <li><strong className="text-white">Shipping:</strong> You must ship within 48 hours of sale and provide tracking. Three late shipments in 90 days = account suspension.</li>
              <li><strong className="text-white">Accuracy:</strong> Cards must be accurately graded. Misrepresented cards may be returned at your expense.</li>
              <li><strong className="text-white">Payouts:</strong> Processed via Stripe to your bank account, typically within 2 business days of delivery confirmation.</li>
              <li><strong className="text-white">Disputes:</strong> Buyers have 48 hours after delivery to report issues. We review evidence from both sides.</li>
              <li><strong className="text-white">Prohibited:</strong> No counterfeits, pre-sales, or items you don&apos;t physically possess.</li>
              <li><strong className="text-white">Taxes:</strong> You are responsible for reporting and paying taxes on your sales.</li>
              <li><strong className="text-white">Rating:</strong> Maintain a 4.0+ rating. Below 3.5 may affect search visibility.</li>
            </ul>
          </div>

          <div className="flex items-start gap-3 mb-6">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-white/30 bg-boba-panel text-hex focus:ring-hex"
            />
            <label htmlFor="agree" className="text-white/70 text-sm">
              I have read and agree to the{" "}
              <Link href="/seller-agreement" target="_blank" className="text-hex hover:text-hex-light font-bold">Seller Agreement</Link>,{" "}
              <Link href="/terms" target="_blank" className="text-hex hover:text-hex-light font-bold">Terms of Service</Link>, and{" "}
              <Link href="/privacy" target="_blank" className="text-hex hover:text-hex-light font-bold">Privacy Policy</Link>.
            </label>
          </div>

          <button
            onClick={() => agreed && setStep(2)}
            disabled={!agreed}
            className="btn-primary w-full text-lg py-3 disabled:opacity-30"
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step 2: What to Expect */}
      {step === 2 && (
        <div className="card border border-white/10 p-8">
          <h2 className="text-2xl font-display font-bold text-white mb-4">Identity & Payment Setup</h2>
          <p className="text-white/50 mb-6">
            You&apos;ll be redirected to Stripe to verify your identity and connect your bank account. This is required by law for marketplace payments.
          </p>

          <div className="space-y-4 mb-8">
            <div className="card border border-white/10 p-4 flex items-start gap-4">
              <span className="text-2xl">🪪</span>
              <div>
                <p className="font-display font-bold text-white">Identity Verification</p>
                <p className="text-sm text-white/40">Legal name, date of birth, and last 4 of SSN (or EIN for businesses). This is handled securely by Stripe — we never see this information.</p>
              </div>
            </div>
            <div className="card border border-white/10 p-4 flex items-start gap-4">
              <span className="text-2xl">🏦</span>
              <div>
                <p className="font-display font-bold text-white">Bank Account</p>
                <p className="text-sm text-white/40">Connect a bank account or debit card where you&apos;ll receive payouts. Typically 2 business days after a sale.</p>
              </div>
            </div>
            <div className="card border border-white/10 p-4 flex items-start gap-4">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="font-display font-bold text-white">Secure & Private</p>
                <p className="text-sm text-white/40">All sensitive data is handled by Stripe, a PCI Level 1 certified payment processor trusted by millions of businesses.</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-boba p-3 text-red-400 text-sm mb-4">
              ❌ {error}
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">← Back</button>
            <button
              onClick={startStripeOnboarding}
              disabled={loading}
              className="btn-primary flex-1 text-lg py-3 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </span>
              ) : (
                "Connect with Stripe →"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Waiting / Continue */}
      {step === 3 && (
        <div className="card border border-white/10 p-8 text-center">
          <span className="text-5xl block mb-4">⏳</span>
          <h2 className="text-2xl font-display font-bold text-white mb-4">Almost There!</h2>
          <p className="text-white/50 mb-6">
            {onboardStatus?.charges_enabled === false
              ? "Your Stripe account setup is incomplete. Click below to continue where you left off."
              : "We're verifying your information with Stripe. This usually takes just a few minutes."}
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-boba p-3 text-red-400 text-sm mb-4">
              ❌ {error}
            </div>
          )}

          <button onClick={startStripeOnboarding} disabled={loading} className="btn-primary text-lg px-8 py-3 disabled:opacity-50">
            {loading ? "Loading..." : "Continue Stripe Setup →"}
          </button>
        </div>
      )}

      {/* Step 4: Done! */}
      {step === 4 && (
        <div className="card border border-glow/30 bg-glow/5 p-8 text-center">
          <span className="text-6xl block mb-4">🎉</span>
          <h2 className="text-3xl font-display font-black text-white mb-4">You&apos;re Ready to Sell!</h2>
          <p className="text-white/50 mb-8 text-lg">
            Your seller account is verified and your bank account is connected. Start listing cards now!
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/sell" className="btn-primary text-lg px-8 py-3">
              🚀 List Your First Card
            </Link>
            <Link href="/dashboard/sell" className="btn-secondary text-lg px-8 py-3">
              📋 Seller Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
