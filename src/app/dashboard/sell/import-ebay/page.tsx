"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE, apiFetch } from "@/lib/api-client";

interface Draft {
  id: string;
  title: string;
  condition: string;
  price_cents: number;
  images: { image_url: string }[];
  import_status: string;
  card?: { id: string; name: string; card_number?: string } | null;
  ebay_item_id?: string | null;
}

interface CardOption {
  id: string;
  name: string;
  card_number: string;
  set_name: string;
}

const CONDITION_OPTIONS = [
  "Mint", "Near Mint", "Lightly Played", "Moderately Played", "Heavily Played", "Damaged"
];

const STATUS_STYLES: Record<string, string> = {
  pending_match: "bg-brawl/15 text-brawl",
  matched: "bg-ice/15 text-ice",
  published: "bg-glow/15 text-glow",
  rejected: "bg-fire/15 text-fire",
};

export default function ImportEbayPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [ebayUsername, setEbayUsername] = useState("");
  const [importing, setImporting] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [cards, setCards] = useState<CardOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("boba-token");
    if (!t) {
      router.push("/auth?redirect=/dashboard/sell/import-ebay");
      return;
    }
    setToken(t);
    loadDrafts(t);
    loadCards(t);
  }, [router]);

  const loadDrafts = async (t: string) => {
    try {
      const res = await apiFetch(`${API_BASE}/api/import/ebay`);
      if (res.ok) {
        const data = await res.json();
        setDrafts(data || []);
      }
    } catch {
      setError("Failed to load drafts");
    } finally {
      setLoading(false);
    }
  };

  const loadCards = async (t: string) => {
    try {
      const res = await apiFetch(`${API_BASE}/api/cards?limit=1000`);
      if (res.ok) {
        const data = await res.json();
        setCards(data?.items || []);
      }
    } catch {
      // silent — cards just won't show in dropdown
    }
  };

  const handleImport = async () => {
    if (!ebayUsername.trim()) return;
    setImporting(true);
    setError("");
    setMessage("");

    try {
      const res = await apiFetch(`${API_BASE}/api/import/ebay`, {
        method: "POST",
        body: JSON.stringify({
          ebay_username: ebayUsername.trim(),
          limit: 50,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDrafts((prev) => [...data.drafts, ...prev]);
        setMessage(`Imported ${data.imported} listings${data.skipped > 0 ? ` (${data.skipped} already existed)` : ""}`);
        setEbayUsername("");
      } else if (res.status === 401) {
        // apiFetch already handles refresh, if we're here refresh also failed
        setError("Session expired — please sign in again");
      } else {
        const err = await res.json();
        setError(err.detail || "Import failed");
      }
    } catch {
      setError("Network error during import");
    } finally {
      setImporting(false);
    }
  };

  const updateDraft = async (draftId: string, updates: Partial<Draft> & { publish?: boolean }) => {
    setMessage("");
    setError("");

    try {
      const res = await apiFetch(`${API_BASE}/api/import/ebay/${draftId}`, {
        method: "PATCH",
        body: JSON.stringify({
          card_id: updates.card?.id || null,
          condition: updates.condition,
          price_cents: updates.price_cents,
          publish: updates.publish || false,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setDrafts((prev) =>
          prev.map((d) => (d.id === draftId ? updated : d))
        );
        if (updates.publish) {
          setMessage("Published!");
        } else {
          setMessage("Saved.");
        }
      } else {
        const err = await res.json();
        setError(err.detail || "Update failed");
      }
    } catch {
      setError("Network error");
    }
  };

  const removeDraft = async (draftId: string) => {
    if (!confirm("Remove this draft?")) return;
    try {
      const res = await apiFetch(`${API_BASE}/api/import/ebay/${draftId}`, {
        method: "DELETE",
      });
      if (res.ok || res.status === 204) {
        setDrafts((prev) => prev.filter((d) => d.id !== draftId));
        setMessage("Draft removed.");
      }
    } catch {
      setError("Failed to remove draft");
    }
  };

  const matched = drafts.filter((d) => d.import_status === "matched").length;
  const published = drafts.filter((d) => d.import_status === "published").length;
  const pending = drafts.filter((d) => d.import_status === "pending_match").length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
        <Link href="/dashboard/sell" className="hover:text-hex transition-colors">
          ← Sell
        </Link>
        <span>/</span>
        <span className="text-white/60">Import from eBay</span>
      </div>

      <h1 className="text-4xl font-display font-black text-white mb-2">
        Import from eBay
      </h1>
      <p className="text-white/40 font-body mb-8">
        Pull your existing eBay listings and publish them on BoBA in seconds.
      </p>

      {/* Import input */}
      <div className="card p-6 mb-8">
        <label className="block text-sm font-display text-white/60 uppercase tracking-wider mb-2">
          eBay Seller Username
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={ebayUsername}
            onChange={(e) => setEbayUsername(e.target.value)}
            placeholder="e.g. vindomgames"
            className="flex-1 bg-boba-panel border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-hex"
            onKeyDown={(e) => e.key === "Enter" && handleImport()}
          />
          <button
            onClick={handleImport}
            disabled={importing || !ebayUsername.trim()}
            className="btn-primary px-6 py-3 disabled:opacity-50"
          >
            {importing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Fetching...
              </span>
            ) : (
              "Import"
            )}
          </button>
        </div>
        {message && <p className="mt-3 text-glow text-sm">{message}</p>}
        {error && <p className="mt-3 text-fire text-sm">{error}</p>}
      </div>

      {/* Stats */}
      {drafts.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card p-4 text-center">
            <p className="text-2xl font-display font-black text-brawl">{pending}</p>
            <p className="text-xs text-white/40 uppercase tracking-wider">Needs Matching</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-display font-black text-ice">{matched}</p>
            <p className="text-xs text-white/40 uppercase tracking-wider">Matched</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-display font-black text-glow">{published}</p>
            <p className="text-xs text-white/40 uppercase tracking-wider">Published</p>
          </div>
        </div>
      )}

      {/* Drafts table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-2 border-hex border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40">Loading drafts...</p>
        </div>
      ) : drafts.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-white/40 text-lg mb-2">No imported drafts yet.</p>
          <p className="text-white/20 text-sm">Enter your eBay username above to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <DraftRow
              key={draft.id}
              draft={draft}
              cards={cards}
              onUpdate={(updates) => updateDraft(draft.id, updates)}
              onRemove={() => removeDraft(draft.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Draft row component ───────────────────────────────────────────────────────

function DraftRow({
  draft,
  cards,
  onUpdate,
  onRemove,
}: {
  draft: Draft;
  cards: CardOption[];
  onUpdate: (updates: Partial<Draft> & { publish?: boolean }) => void;
  onRemove: () => void;
}) {
  const [selectedCardId, setSelectedCardId] = useState(draft.card?.id || "");
  const [condition, setCondition] = useState(draft.condition);
  const [price, setPrice] = useState((draft.price_cents / 100).toFixed(2));
  const [saving, setSaving] = useState(false);

  const matchedCard = cards.find((c) => c.id === selectedCardId);

  const handleSave = (publish = false) => {
    setSaving(true);
    const card = matchedCard ? { id: matchedCard.id, name: matchedCard.name } : null;
    onUpdate({
      card: card as any,
      condition,
      price_cents: Math.round(parseFloat(price || "0") * 100),
      publish,
    });
    setTimeout(() => setSaving(false), 500);
  };

  return (
    <div className="card p-4 flex flex-col md:flex-row gap-4">
      {/* Image */}
      <div className="flex-shrink-0">
        <div className="w-32 h-44 rounded-lg overflow-hidden bg-boba-panel border border-white/10">
          {draft.images?.[0]?.image_url ? (
            <img
              src={draft.images[0].image_url}
              alt={draft.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No image</div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-display font-bold text-white truncate">{draft.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wider ${STATUS_STYLES[draft.import_status] || "bg-white/10 text-white/40"}`}>
            {draft.import_status.replace("_", " ")}
          </span>
        </div>

        {/* eBay link */}
        {draft.ebay_item_id && (
          <a
            href={`https://www.ebay.com/itm/${draft.ebay_item_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-hex/60 hover:text-hex mb-3 inline-block"
          >
            View on eBay →
          </a>
        )}

        {/* Match card */}
        <div className="mb-3">
          <label className="block text-xs text-white/40 uppercase tracking-wider mb-1">Match Card</label>
          <select
            value={selectedCardId}
            onChange={(e) => setSelectedCardId(e.target.value)}
            className="w-full bg-boba-panel border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-hex"
          >
            <option value="">— Select a BoBA card —</option>
            {cards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.card_number}) — {c.set_name}
              </option>
            ))}
          </select>
        </div>

        {/* Condition + Price */}
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-1">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full bg-boba-panel border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-hex"
            >
              {CONDITION_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-boba-panel border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-hex"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="btn-secondary text-sm px-4 py-2 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving || !selectedCardId}
            className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
          >
            Publish
          </button>
          <button
            onClick={onRemove}
            className="text-sm text-fire/60 hover:text-fire ml-auto"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
