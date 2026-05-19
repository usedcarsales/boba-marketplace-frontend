'use client';

import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/api';

interface CardData {
  id: string;
  card_number: string;
  name: string;
  card_type: string | null;
  set_name: string | null;
  parallel: string | null;
  weapon: string | null;
  image_url: string | null;
  last_sale_image: string | null;
  last_sale_price: number | null;
  last_sale_date: string | null;
  avg_price_30d: number | null;
  total_sales: number;
  sales_last_30d: number;
}

const IMG_FALLBACK = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="56"%3E%3Crect width="40" height="56" fill="%232a3a4a"/%3E%3C/svg%3E';

function imgUrl(c: CardData): string { return c.image_url || c.last_sale_image || IMG_FALLBACK; }
function fmt$(n: number | null): string { return n == null ? '—' : `$${n.toFixed(2)}`; }

export default function MarketIntelPage() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState('');

  useEffect(() => {
    const dt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    setNow(dt);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/cards?page=1&limit=200`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => { setCards(data.cards || []); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-boba-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-super/20 border-t-super rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 font-display">Loading market data…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-boba-dark flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-boba max-w-md text-center">
          <p className="font-display font-bold mb-2">Failed to load market data</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const total = cards.length;
  const withImg = cards.filter(c => c.image_url && c.image_url.length > 5).length;
  const withSales = cards.filter(c => c.total_sales > 0).length;
  const with30d = cards.filter(c => c.sales_last_30d > 0).length;
  const priced = cards.filter(c => c.last_sale_price);
  const avgPrice = priced.reduce((a, c) => a + c.last_sale_price!, 0) / (priced.length || 1);
  const highSale = cards.reduce((m, c) => Math.max(m, c.last_sale_price || 0), 0);
  const sets = Array.from(new Set(cards.map(c => c.set_name).filter(Boolean) as string[]));

  const trending = cards.filter(c => c.sales_last_30d > 0).sort((a, b) => b.sales_last_30d - a.sales_last_30d).slice(0, 10);

  const movers = cards
    .filter(c => c.last_sale_price && c.avg_price_30d && c.total_sales >= 2)
    .map(c => ({ ...c, gap: c.avg_price_30d! - c.last_sale_price!, gapPct: ((c.avg_price_30d! - c.last_sale_price!) / c.last_sale_price! * 100) }))
    .sort((a, b) => b.gapPct - a.gapPct).slice(0, 10);

  const liquid = cards.filter(c => c.total_sales > 0).sort((a, b) => b.total_sales - a.total_sales).slice(0, 10);
  const recent = cards.filter(c => c.last_sale_date).sort((a, b) => new Date(b.last_sale_date!).getTime() - new Date(a.last_sale_date!).getTime()).slice(0, 10);

  return (
    <div className="min-h-screen bg-boba-dark pb-20">
      {/* Header */}
      <div className="border-b border-white/5 bg-gradient-to-b from-boba-panel to-boba-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <h1 className="text-4xl font-display font-black text-white uppercase tracking-wider mb-2">🃏 Market Intelligence</h1>
          <p className="text-white/40 font-display">Real-time analytics for the Bo Jackson Battle Arena card market</p>
          <p className="text-white/30 text-sm mt-2">Report generated: {now} ET</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <StatCard label="Total Cards" value={total.toLocaleString()} sub={`Across ${sets.length} sets`} />
          <StatCard label="With Sales" value={withSales.toLocaleString()} sub={`${((withSales / total) * 100).toFixed(1)}% of catalog`} />
          <StatCard label="30-Day Active" value={with30d.toLocaleString()} sub="Recently traded" />
          <StatCard label="Avg Last Sale" value={fmt$(avgPrice)} sub="Mean of cards sold" />
          <StatCard label="Image Coverage" value={`${((withImg / total) * 100).toFixed(1)}%`} sub={`${withImg.toLocaleString()} cards`} />
          <StatCard label="Highest Sale" value={fmt$(highSale)} sub="Top transaction" />
        </div>

        {/* Trending */}
        <Section title="🔥 Trending — Most Active (30d)" />
        <div className="overflow-x-auto mb-10">
          <table className="w-full">
            <thead><tr className="text-left text-white/30 text-xs uppercase tracking-wider border-b border-white/10">
              <th className="pb-3 font-display">Card</th>
              <th className="pb-3 font-display">Type</th>
              <th className="pb-3 font-display">Last Sale</th>
              <th className="pb-3 font-display">30d Sales</th>
              <th className="pb-3 font-display">Total Sales</th>
            </tr></thead>
            <tbody>
              {trending.map(c => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img src={imgUrl(c)} alt="" className="w-10 h-14 object-cover rounded flex-shrink-0 bg-white/5" onError={e => (e.currentTarget.src = IMG_FALLBACK)} />
                      <div>
                        <p className="text-white font-display font-bold text-sm">{c.name}</p>
                        <p className="text-white/30 text-xs">{c.card_number} · {c.set_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3"><span className="px-2 py-0.5 rounded bg-white/5 text-white/50 text-xs font-bold">{c.card_type || '—'}</span></td>
                  <td className="py-3 text-super font-display font-bold">{fmt$(c.last_sale_price)}</td>
                  <td className="py-3 text-white font-display font-bold">{c.sales_last_30d}</td>
                  <td className="py-3 text-white/50">{c.total_sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Movers */}
        <Section title="💰 Price Movers — vs 30d Average" />
        <div className="overflow-x-auto mb-10">
          <table className="w-full">
            <thead><tr className="text-left text-white/30 text-xs uppercase tracking-wider border-b border-white/10">
              <th className="pb-3 font-display">Card</th>
              <th className="pb-3 font-display">Last Sale</th>
              <th className="pb-3 font-display">30d Avg</th>
              <th className="pb-3 font-display">Gap</th>
              <th className="pb-3 font-display">Status</th>
            </tr></thead>
            <tbody>
              {movers.map(c => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img src={imgUrl(c)} alt="" className="w-10 h-14 object-cover rounded flex-shrink-0 bg-white/5" onError={e => (e.currentTarget.src = IMG_FALLBACK)} />
                      <div>
                        <p className="text-white font-display font-bold text-sm">{c.name}</p>
                        <p className="text-white/30 text-xs">{c.card_number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-white font-display">{fmt$(c.last_sale_price)}</td>
                  <td className="py-3 text-white/70 font-display">{fmt$(c.avg_price_30d)}</td>
                  <td className={`py-3 font-display font-bold ${c.gap > 0 ? 'text-green-400' : 'text-red-400'}`}>{c.gap > 0 ? '+' : ''}{c.gapPct.toFixed(1)}%</td>
                  <td className="py-3">
                    {c.gap > 0
                      ? <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-xs font-bold">Undervalued</span>
                      : <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-xs font-bold">Overvalued</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Liquid */}
        <Section title="🌊 Most Liquid — All-Time Volume" />
        <div className="overflow-x-auto mb-10">
          <table className="w-full">
            <thead><tr className="text-left text-white/30 text-xs uppercase tracking-wider border-b border-white/10">
              <th className="pb-3 font-display">Card</th>
              <th className="pb-3 font-display">Total Sales</th>
              <th className="pb-3 font-display">Last Sale</th>
              <th className="pb-3 font-display">30d Sales</th>
            </tr></thead>
            <tbody>
              {liquid.map(c => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img src={imgUrl(c)} alt="" className="w-10 h-14 object-cover rounded flex-shrink-0 bg-white/5" onError={e => (e.currentTarget.src = IMG_FALLBACK)} />
                      <div>
                        <p className="text-white font-display font-bold text-sm">{c.name}</p>
                        <p className="text-white/30 text-xs">{c.set_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-white font-display font-bold">{c.total_sales}</td>
                  <td className="py-3 text-super font-display font-bold">{fmt$(c.last_sale_price)}</td>
                  <td className="py-3 text-white/50">{c.sales_last_30d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent */}
        <Section title="🆕 Recent Sales" />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-left text-white/30 text-xs uppercase tracking-wider border-b border-white/10">
              <th className="pb-3 font-display">Card</th>
              <th className="pb-3 font-display">Date</th>
              <th className="pb-3 font-display">Price</th>
              <th className="pb-3 font-display">Set</th>
            </tr></thead>
            <tbody>
              {recent.map(c => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img src={imgUrl(c)} alt="" className="w-10 h-14 object-cover rounded flex-shrink-0 bg-white/5" onError={e => (e.currentTarget.src = IMG_FALLBACK)} />
                      <div>
                        <p className="text-white font-display font-bold text-sm">{c.name}</p>
                        <p className="text-white/30 text-xs">{c.card_number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-white/50">{c.last_sale_date ? new Date(c.last_sale_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                  <td className="py-3 text-super font-display font-bold">{fmt$(c.last_sale_price)}</td>
                  <td className="py-3 text-white/50">{c.set_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Radish Attribution */}
      <div className="text-center py-8 border-t border-white/10">
        <p className="text-white/40 text-sm">
          📊 Market data and card images provided by{" "}
          <a href="https://radishdijital.com/" target="_blank" rel="noopener noreferrer" className="text-super hover:underline font-display">
            Radish Dijital
          </a>
          {" "}· Price tracking via eBay sales data
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-boba-panel border border-white/5 rounded-boba p-4 hover:border-super/20 transition-colors">
      <p className="text-white/30 text-xs uppercase tracking-wider font-display mb-1">{label}</p>
      <p className="text-2xl font-display font-black text-white mb-1">{value}</p>
      <p className="text-white/30 text-xs">{sub}</p>
    </div>
  );
}

function Section({ title }: { title: string }) {
  return (
    <h2 className="text-xl font-display font-black text-super uppercase tracking-wider mb-4 flex items-center gap-2">
      {title}
    </h2>
  );
}
