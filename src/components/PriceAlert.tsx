"use client";

import { useState } from "react";

interface PriceAlertProps {
  cardName: string;
  currentPrice: number;
  ebayPrice?: number;
}

export default function PriceAlert({ cardName, currentPrice, ebayPrice }: PriceAlertProps) {
  const [email, setEmail] = useState("");
  const [targetPrice, setTargetPrice] = useState<number>(
    Math.floor((ebayPrice || currentPrice) * 0.7)
  );
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email || !targetPrice) {
      setStatus("error");
      setMessage("Email and target price are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/ebay/price-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardName, email, targetPrice }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Alert set! We'll email you when the price drops.");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to set alert.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div style={{
      background: "var(--card-bg, #1a1a2e)",
      border: "1px solid var(--border, #2a2a3e)",
      borderRadius: 12,
      padding: "1.5rem",
      marginTop: "1rem",
    }}>
      <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.1rem", color: "var(--accent, #a78bfa)" }}>
        🔔 Price Alert
      </h3>
      <p style={{ margin: "0 0 1rem", fontSize: "0.85rem", color: "var(--muted, #888)" }}>
        Get notified when this card drops below your target price on eBay.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", marginBottom: "0.25rem", color: "var(--muted, #888)" }}>
            Your Email
          </label>
          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              borderRadius: 8,
              border: "1px solid var(--border, #2a2a3e)",
              background: "var(--bg, #0a0a1a)",
              color: "var(--text, #e0e0f0)",
              fontSize: "0.9rem",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.8rem", marginBottom: "0.25rem", color: "var(--muted, #888)" }}>
            Target Price (USD)
          </label>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {[0.6, 0.7, 0.8, 0.9].map((factor) => {
              const p = Math.floor((ebayPrice || currentPrice) * factor);
              return (
                <button
                  key={factor}
                  onClick={() => setTargetPrice(p)}
                  style={{
                    padding: "0.3rem 0.6rem",
                    borderRadius: 6,
                    border: targetPrice === p ? "2px solid var(--accent, #a78bfa)" : "1px solid var(--border, #2a2a3e)",
                    background: targetPrice === p ? "rgba(139,92,246,0.2)" : "var(--bg, #0a0a1a)",
                    color: "var(--text, #e0e0f0)",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  ${p} ({Math.round(factor * 100)}%)
                </button>
              );
            })}
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(Number(e.target.value))}
              min={1}
              style={{
                width: 80,
                padding: "0.3rem 0.5rem",
                borderRadius: 6,
                border: "1px solid var(--border, #2a2a3e)",
                background: "var(--bg, #0a0a1a)",
                color: "var(--text, #e0e0f0)",
                fontSize: "0.8rem",
              }}
            />
          </div>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={status === "loading"}
          style={{
            padding: "0.6rem 1rem",
            borderRadius: 8,
            border: "none",
            background: status === "loading" ? "var(--muted, #666)" : "var(--accent, #8b5cf6)",
            color: "white",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: status === "loading" ? "not-allowed" : "pointer",
          }}
        >
          {status === "loading" ? "Setting up..." : "Set Price Alert"}
        </button>

        {message && (
          <p style={{
            fontSize: "0.85rem",
            color: status === "success" ? "#4ade80" : "#f87171",
            margin: 0,
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
