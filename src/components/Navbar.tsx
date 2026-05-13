"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";

interface UserData {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  role: string;
}

import { API_BASE } from "@/lib/api";

interface SearchSuggestion {
  id: string;
  name: string;
  set_name: string;
  parallel: string | null;
  weapon: string | null;
  image_url: string | null;
  last_sale_price: number | null;
  card_number: string;
}

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for stored user
    const stored = localStorage.getItem("boba-user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }

    // Listen for auth changes
    const handleStorage = () => {
      const s = localStorage.getItem("boba-user");
      if (s) { try { setUser(JSON.parse(s)); } catch {} }
      else { setUser(null); }
    };
    window.addEventListener("storage", handleStorage);
    
    // Also listen for custom auth event
    const handleAuth = () => handleStorage();
    window.addEventListener("boba-auth-change", handleAuth);
    
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("boba-auth-change", handleAuth);
    };
  }, []);

  // Autocomplete search with debounce
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/cards/autocomplete?q=${encodeURIComponent(searchQuery.trim())}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.cards || data || []);
          setShowSuggestions(true);
        }
      } catch {}
      setSearchLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      router.push(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (card: SearchSuggestion) => {
    setShowSuggestions(false);
    setSearchQuery("");
    router.push(`/card/${card.id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("boba-token");
    localStorage.removeItem("boba-refresh-token");
    localStorage.removeItem("boba-user");
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50" style={{ backgroundColor: "#992E24" }}>
      <div className="h-0.5 bg-gradient-to-r from-hex via-super to-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            {/* BoBA Trader own brand logo — SVG wordmark */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-hex via-boba-red to-super flex items-center justify-center shadow-lg shadow-hex/20">
              <span className="text-white font-display font-black text-lg leading-none">B</span>
            </div>
            <span className="text-2xl font-display font-black text-white uppercase tracking-wider">
              BoBA <span className="text-super">Trader</span>
            </span>
          </Link>

          {/* Search Bar — Desktop with Autocomplete */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search cards, heroes, plays..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full bg-black/30 border border-white/20 rounded-full px-5 py-2 pl-10 text-white placeholder-white/40 focus:outline-none focus:border-super/50 transition-colors text-sm"
                autoComplete="off"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchLoading && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-white/20 border-t-super rounded-full animate-spin" />
              )}

              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-boba-panel border border-white/10 rounded-boba shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                  {suggestions.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      onMouseDown={() => handleSuggestionClick(card)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition text-left"
                    >
                      {card.image_url ? (
                        <img src={card.image_url} alt="" className="w-8 h-11 object-cover rounded flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-11 bg-white/5 rounded flex items-center justify-center text-xs flex-shrink-0">🃏</div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-display font-bold truncate">{card.name}</p>
                        <p className="text-white/30 text-xs truncate">
                          {card.set_name} {card.parallel ? `· ${card.parallel}` : ""} {card.weapon ? `· ${card.weapon}` : ""}
                        </p>
                      </div>
                      {card.last_sale_price && (
                        <span className="text-super font-display font-bold text-sm flex-shrink-0">
                          ${card.last_sale_price.toFixed(2)}
                        </span>
                      )}
                    </button>
                  ))}
                  <button
                    type="button"
                    onMouseDown={() => { setShowSuggestions(false); router.push(`/browse?q=${encodeURIComponent(searchQuery)}`); }}
                    className="w-full px-4 py-3 text-center text-hex text-sm font-display font-bold hover:bg-white/5 border-t border-white/10"
                  >
                    View all results for &quot;{searchQuery}&quot; →
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Nav Links — Desktop */}
          <div className="hidden md:flex items-center gap-5">
            <Link href="/browse" className="text-white/80 hover:text-white transition-colors font-display text-base uppercase tracking-wider font-bold">
              Browse
            </Link>
            <Link href="/sell" className="text-white/80 hover:text-white transition-colors font-display text-base uppercase tracking-wider font-bold">
              Sell
            </Link>
            <Link href="/cart" className="text-white/80 hover:text-white transition-colors font-display text-base uppercase tracking-wider font-bold relative">
              🛒
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-hex to-glow flex items-center justify-center text-white font-display font-bold text-sm">
                    {(user.display_name || user.username || "?")[0].toUpperCase()}
                  </div>
                  <span className="text-white font-display text-sm font-bold uppercase tracking-wider">
                    {user.display_name || user.username}
                  </span>
                  <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-boba-panel border border-white/10 rounded-boba shadow-2xl overflow-hidden z-50">
                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="block px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white font-display uppercase tracking-wider">
                      📊 Dashboard
                    </Link>
                    <Link href="/dashboard/sell" onClick={() => setUserMenuOpen(false)} className="block px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white font-display uppercase tracking-wider">
                      📋 My Listings
                    </Link>
                    <Link href="/dashboard/inventory" onClick={() => setUserMenuOpen(false)} className="block px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white font-display uppercase tracking-wider">
                      📋 Inventory Manager
                    </Link>
                    <Link href="/dashboard/purchases" onClick={() => setUserMenuOpen(false)} className="block px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white font-display uppercase tracking-wider">
                      🛍️ My Purchases
                    </Link>
                    <Link href="/dashboard/orders" onClick={() => setUserMenuOpen(false)} className="block px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white font-display uppercase tracking-wider">
                      📦 Sales / Orders
                    </Link>
                    <Link href="/dashboard/profile" onClick={() => setUserMenuOpen(false)} className="block px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white font-display uppercase tracking-wider">
                      👤 Profile
                    </Link>
                    <div className="border-t border-white/10" />
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 font-display uppercase tracking-wider">
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ConnectWalletButton compact />
                <Link
                  href="/auth"
                  className="bg-super hover:bg-super-dark text-boba-dark font-display font-black text-base uppercase tracking-wider px-6 py-2 rounded-full transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white/60 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 mt-2 pt-4">
            <form onSubmit={handleSearch} className="mb-4">
              <input
                type="text"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-full px-5 py-2 text-white placeholder-white/40 focus:outline-none focus:border-super/50 text-sm"
              />
            </form>
            <div className="flex flex-col gap-3">
              <Link href="/browse" className="text-white/80 hover:text-white font-display uppercase tracking-wider font-bold text-sm">Browse</Link>
              <Link href="/sell" className="text-white/80 hover:text-white font-display uppercase tracking-wider font-bold text-sm">Sell</Link>
              <Link href="/cart" className="text-white/80 hover:text-white font-display uppercase tracking-wider font-bold text-sm">🛒 Cart</Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-white/80 hover:text-white font-display uppercase tracking-wider font-bold text-sm">📊 Dashboard</Link>
                  <button onClick={handleLogout} className="text-left text-red-400 font-display uppercase tracking-wider font-bold text-sm">🚪 Sign Out</button>
                </>
              ) : (
                <Link href="/auth" className="bg-super text-boba-dark font-display font-black text-sm uppercase tracking-wider text-center px-5 py-1.5 rounded-full">Sign In</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
