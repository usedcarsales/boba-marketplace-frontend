import Link from "next/link";

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/browse" className="hover:text-white">Browse</Link>
        <span className="mx-2">→</span>
        <span className="text-white">Listing Detail</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="card overflow-hidden">
            <div className="aspect-square bg-gray-700 flex items-center justify-center">
              <span className="text-6xl">🃏</span>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-16 h-16 rounded-lg bg-gray-700 border-2 border-transparent hover:border-boba-red cursor-pointer" />
            ))}
          </div>
        </div>

        {/* Listing Info */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Listing Title</h1>
          <p className="text-gray-400 mb-4">Listed by @seller · 2 days ago</p>

          <div className="card p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-boba-gold">$25.00</span>
              <span className="badge bg-green-500/20 text-green-400">Near Mint</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">1 available</p>
            <button className="btn-primary w-full text-lg py-3">
              🛒 Buy Now
            </button>
          </div>

          <div className="card p-4">
            <h2 className="font-semibold text-white mb-2">Description</h2>
            <p className="text-gray-400 text-sm">
              Seller description will appear here.
            </p>
          </div>

          {/* Seller Info */}
          <div className="card p-4 mt-4">
            <h2 className="font-semibold text-white mb-2">Seller</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                <span>👤</span>
              </div>
              <div>
                <p className="text-white font-semibold">@seller</p>
                <p className="text-sm text-gray-400">⭐ 5.0 · 42 sales</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
