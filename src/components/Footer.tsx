import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto" style={{ backgroundColor: "#D1493D" }}>
      <div className="h-1.5 bg-gradient-to-r from-hex via-super to-glow" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-display font-black text-white uppercase tracking-wider">
                BoBA <span className="text-super">Trader</span>
              </span>
            </div>
            <p className="text-white/70 text-sm">
              The #1 marketplace for Bo Jackson Battle Arena cards and collectibles.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://discord.gg/bobattlearena" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-super transition-colors text-base">Discord</a>
              <a href="https://x.com/BoBattleArena" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-super transition-colors text-base">X/Twitter</a>
              <a href="https://bobattlearena.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-super transition-colors text-base">Official Site</a>
            </div>
          </div>

          {/* Browse */}
          <div>
            <h3 className="text-white font-display font-bold uppercase tracking-wider mb-3">Browse</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/browse" className="text-white/90 hover:text-super">All Cards</Link></li>
              <li><Link href="/browse?set_name=Alpha+Edition" className="text-white/90 hover:text-super">Alpha Edition</Link></li>
              <li><Link href="/browse?set_name=Griffey+Edition" className="text-white/90 hover:text-super">Griffey Edition</Link></li>
              <li><Link href="/browse?weapon=Fire" className="text-white/90 hover:text-super">🔥 Fire</Link></li>
              <li><Link href="/browse?weapon=Ice" className="text-white/90 hover:text-super">❄️ Ice</Link></li>
            </ul>
          </div>

          {/* Sell */}
          <div>
            <h3 className="text-white font-display font-bold uppercase tracking-wider mb-3">Sell</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sell" className="text-white/90 hover:text-super">List a Card</Link></li>
              <li><Link href="/dashboard/sell" className="text-white/90 hover:text-super">Seller Dashboard</Link></li>
              <li><Link href="/faq" className="text-white/90 hover:text-super">Seller FAQ</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-display font-bold uppercase tracking-wider mb-3">Info</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-white/90 hover:text-super">About</Link></li>
              <li><Link href="/faq" className="text-white/90 hover:text-super">FAQ</Link></li>
              <li><Link href="/docs" className="text-white/90 hover:text-super">Docs</Link></li>
              <li><Link href="/feedback" className="text-white/90 hover:text-super">Feedback</Link></li>
              <li><Link href="/shipping" className="text-white/90 hover:text-super">Shipping</Link></li>
              <li><Link href="/contact" className="text-white/90 hover:text-super">Contact Us</Link></li>
              <li><Link href="/terms" className="text-white/90 hover:text-super">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-white/90 hover:text-super">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 space-y-3">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/70 text-base">
              © {new Date().getFullYear()} BoBA Trader. All rights reserved.
            </p>
            <p className="text-white/70 text-base mt-2 md:mt-0 font-display uppercase tracking-wider">
              8% Fee + $0.25/order · Powered by Stripe · Free Listings
            </p>
          </div>
          <p className="text-white/30 text-xs text-center">
            Card pricing and market data provided by <a href="https://radishdijital.com/" target="_blank" rel="noopener noreferrer" className="text-super hover:underline">Radish Dijital</a>. Card images from eBay sales data.
          </p>
          <p className="text-white/30 text-xs text-center">
            BoBA Trader is an independent third-party marketplace. We are not affiliated with, endorsed by, or sponsored by Bo Jackson Battle Arena, Inc., Blokpax, or any of their subsidiaries. Bo Jackson Battle Arena™ and all related characters, names, and artwork are the property of their respective owners. Card images are used for product identification purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
