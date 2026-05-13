"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useSignMessage, useConnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";

import { API_BASE } from "@/lib/api";

export default function WalletAuthPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [status, setStatus] = useState<"idle" | "signing" | "verifying" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!address) return;
    setError(null);
    setStatus("signing");

    try {
      // 1. Fetch nonce from backend
      const nonceRes = await fetch(`${API_BASE}/api/auth/wallet/nonce`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!nonceRes.ok) throw new Error("Failed to get nonce");
      const { nonce } = await nonceRes.json();

      // 2. Build SIWE message
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in to BoBA Trader — the Bo Jackson Battle Arena™ card marketplace.",
        uri: window.location.origin,
        version: "1",
        chainId: 1,
        nonce,
      }).prepareMessage();

      // 3. Request signature from wallet
      const signature = await signMessageAsync({ message });
      setStatus("verifying");

      // 4. Send to backend for verification
      const verifyRes = await fetch(`${API_BASE}/api/auth/wallet/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, signature }),
      });

      if (!verifyRes.ok) {
        const err = await verifyRes.json();
        throw new Error(err.detail || "Verification failed");
      }

      const { token, user } = await verifyRes.json();

      // 5. Store JWT + user data
      localStorage.setItem("boba-token", token);
      localStorage.setItem("boba-user", JSON.stringify(user));
      window.dispatchEvent(new Event("boba-auth-change"));

      setStatus("done");

      // 6. Redirect to previous page or home
      const returnTo = new URLSearchParams(window.location.search).get("returnTo") || "/";
      router.push(returnTo);
    } catch (err: any) {
      setError(err.message || "Sign-in failed. Please try again.");
      setStatus("error");
    }
  };

  // Auto-trigger sign-in once wallet is connected
  useEffect(() => {
    if (isConnected && address && status === "idle") {
      handleSignIn();
    }
  }, [isConnected, address]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
        {/* Logo */}
        <div className="w-16 h-16 bg-boba-red rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-black text-3xl">B</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Sign in with Ethereum</h1>
        <p className="text-gray-400 text-sm mb-8">
          Connect your wallet and sign a message to authenticate with BoBA Trader.
          No password required — your keys, your account.
        </p>

        {/* Status display */}
        {status === "idle" && !isConnected && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <ConnectButton label="Connect Wallet" />
            </div>
            <p className="text-xs text-gray-500">
              Supports MetaMask, Coinbase Wallet, Rainbow, WalletConnect, and more
            </p>
          </div>
        )}

        {status === "signing" && (
          <div className="space-y-3">
            <div className="animate-pulse flex justify-center">
              <div className="w-12 h-12 border-4 border-boba-red border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-gray-300 font-medium">Check your wallet</p>
            <p className="text-gray-500 text-sm">Please sign the message in your wallet to continue.</p>
          </div>
        )}

        {status === "verifying" && (
          <div className="space-y-3">
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-boba-red border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-gray-300 font-medium">Verifying signature...</p>
          </div>
        )}

        {status === "done" && (
          <div className="space-y-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-400 font-medium">Signed in successfully!</p>
            <p className="text-gray-500 text-sm">Redirecting...</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
            <button
              onClick={() => { setStatus("idle"); setError(null); }}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg px-4 py-2.5 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Already connected, not yet signing */}
        {isConnected && address && status === "idle" && (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm font-mono">
              Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </p>
            <button
              onClick={handleSignIn}
              className="w-full bg-boba-red hover:bg-boba-red/90 text-white font-semibold rounded-lg px-4 py-3 transition-colors"
            >
              Sign In with This Wallet
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-boba-red hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="/privacy" className="text-boba-red hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
