"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE, apiFetch } from "@/lib/api-client";

interface UserProfile {
  id: string;
  email: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string;
  rating: number;
  total_sales: number;
  total_purchases: number;
  stripe_onboarding_complete: boolean;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Editable fields
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("boba-token");
    if (!t) {
      router.push("/auth?redirect=/dashboard/profile");
      return;
    }
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const loadProfile = async () => {
    try {
      const res = await apiFetch(`${API_BASE}/api/users/me`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setUsername(data.username || "");
        setDisplayName(data.display_name || "");
        setBio(data.bio || "");
      } else {
        setError("Failed to load profile");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const updates: Record<string, string> = {};
      if (username !== profile?.username) updates.username = username;
      if (displayName !== (profile?.display_name || "")) updates.display_name = displayName;
      if (bio !== (profile?.bio || "")) updates.bio = bio;

      if (Object.keys(updates).length === 0) {
        setMessage("No changes to save.");
        setSaving(false);
        return;
      }

      const res = await apiFetch(`${API_BASE}/api/users/me`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setUsername(updated.username || "");
        setDisplayName(updated.display_name || "");
        setBio(updated.bio || "");
        setMessage("✅ Profile updated!");
        // Update localStorage user data
        localStorage.setItem("boba-user", JSON.stringify(updated));
      } else {
        const err = await res.json().catch(() => ({ detail: "Update failed" }));
        if (res.status === 409) {
          setError("That username is already taken. Try another.");
        } else {
          setError(err.detail || "Update failed");
        }
      }
    } catch {
      setError("Network error — check your connection");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse text-white/70 font-display text-2xl">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-fire font-display text-2xl">{error || "Failed to load profile"}</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-white/70 mb-6">
        <a href="/dashboard" className="hover:text-hex transition-colors">
          ← Dashboard
        </a>
        <span>/</span>
        <span className="text-white/60">Profile</span>
      </div>

      <h1 className="text-4xl font-display font-black text-white mb-2">
        Your Profile
      </h1>
      <p className="text-white/70 font-body mb-8">
        Manage your username, bio, and public profile.
      </p>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-glow/10 border border-glow/30 text-glow text-sm font-display">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-fire/10 border border-fire/30 text-fire text-sm font-display">
          {error}
        </div>
      )}

      {/* Profile Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-boba bg-gradient-to-br from-hex to-glow flex items-center justify-center text-3xl font-display font-black text-white">
            {(profile.display_name || profile.username || "?")[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-display font-black text-white">
              {profile.display_name || profile.username}
            </h2>
            <p className="text-white/70 text-sm">@{profile.username}</p>
            <p className="text-white/70 text-sm mt-1">
              Member since {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              {" · "}{profile.total_sales} sales · ★ {profile.rating.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-boba-panel rounded-lg p-3 text-center">
            <p className="text-xl font-display font-black text-glow">{profile.total_sales}</p>
            <p className="text-sm text-white/70 font-display font-bold uppercase tracking-wider">Sales</p>
          </div>
          <div className="bg-boba-panel rounded-lg p-3 text-center">
            <p className="text-xl font-display font-black text-ice">{profile.total_purchases}</p>
            <p className="text-sm text-white/70 font-display font-bold uppercase tracking-wider">Purchases</p>
          </div>
          <div className="bg-boba-panel rounded-lg p-3 text-center">
            <p className="text-xl font-display font-black text-super">★ {profile.rating.toFixed(1)}</p>
            <p className="text-sm text-white/70 font-display font-bold uppercase tracking-wider">Rating</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="card p-6 mb-6">
        <h3 className="text-xl font-display font-bold text-white mb-4 uppercase tracking-wider">
          Edit Profile
        </h3>

        {/* Username */}
        <div className="mb-5">
          <label className="block text-sm text-white/70 font-display font-bold uppercase tracking-wider mb-1">
            Username
          </label>
          <div className="flex items-center gap-2">
            <span className="text-white/80">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              maxLength={30}
              className="flex-1 bg-boba-panel border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-hex"
              placeholder="your_username"
            />
          </div>
          <p className="text-xs text-white/30 mt-1">
            Letters, numbers, and underscores only. This is your public handle.
          </p>
        </div>

        {/* Display Name */}
        <div className="mb-5">
          <label className="block text-sm text-white/70 font-display font-bold uppercase tracking-wider mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={50}
            className="w-full bg-boba-panel border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-hex"
            placeholder="How others see you"
          />
        </div>

        {/* Bio */}
        <div className="mb-5">
          <label className="block text-sm text-white/70 font-display font-bold uppercase tracking-wider mb-1">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
            rows={4}
            className="w-full bg-boba-panel border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-hex resize-none"
            placeholder="Tell other collectors about yourself..."
          />
          <p className="text-xs text-white/30 mt-1">
            {bio.length}/500 characters
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary px-8 py-3 disabled:opacity-50"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

      {/* Seller Onboarding (if not onboarded) */}
      {!profile.stripe_onboarding_complete && (
        <div className="card p-6 border border-brawl/30">
          <h3 className="text-xl font-display font-bold text-brawl mb-2 uppercase tracking-wider">
            🏪 Seller Setup Required
          </h3>
          <p className="text-white/80 text-sm mb-4">
            Complete Stripe onboarding to start selling cards on BoBA.
          </p>
          <a href="/dashboard/sell/onboard" className="btn-primary px-6 py-2 inline-block">
            Start Onboarding →
          </a>
        </div>
      )}

      {/* Danger Zone */}
      <div className="card p-6 border border-fire/20 mt-6">
        <h3 className="text-xl font-display font-bold text-fire/60 mb-2 uppercase tracking-wider">
          ⚠️ Account
        </h3>
        <p className="text-white/60 text-sm">
          Email: {profile.email}
        </p>
        <p className="text-white/60 text-sm mt-1">
          Role: <span className="text-white/50 capitalize">{profile.role}</span>
        </p>
      </div>
    </div>
  );
}