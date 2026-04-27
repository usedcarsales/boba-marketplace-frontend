"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    const userId = searchParams.get("user_id");
    const username = searchParams.get("username");
    const displayName = searchParams.get("display_name");
    const avatarUrl = searchParams.get("avatar_url");

    if (!accessToken || !refreshToken) {
      setError("Authentication failed — missing tokens. Please try again.");
      return;
    }

    // Store tokens
    localStorage.setItem("boba-token", accessToken);
    localStorage.setItem("boba-refresh-token", refreshToken);
    localStorage.setItem(
      "boba-user",
      JSON.stringify({
        id: userId,
        username: username,
        display_name: displayName || username,
        avatar_url: avatarUrl || null,
        role: "user",
      })
    );

    // Dispatch auth change event for Navbar
    window.dispatchEvent(new Event("boba-auth-change"));

    // Redirect to dashboard
    router.push("/dashboard");
  }, [searchParams, router]);

  if (error) {
    return (
      <main className="min-h-screen bg-boba-dark flex items-center justify-center">
        <div className="card p-8 max-w-md text-center">
          <p className="text-red-400 text-xl font-display mb-4">⚠️ {error}</p>
          <a href="/auth" className="btn-primary px-6 py-2">
            Try Again
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-boba-dark flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-super rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/60 font-display text-xl">Signing you in...</p>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-boba-dark flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-super rounded-full animate-spin" />
        </main>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
