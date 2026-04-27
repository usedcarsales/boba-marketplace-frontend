"use client";

/**
 * Price history chart component.
 * Post-MVP: Will use a charting library (recharts or chart.js).
 * For now, renders a simple text-based price summary.
 */

interface PricePoint {
  date: string;
  price: number;
}

export function PriceChart({
  data,
  cardName,
}: {
  data: PricePoint[];
  cardName: string;
}) {
  if (data.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-gray-400">No price history available for {cardName}</p>
      </div>
    );
  }

  const latest = data[data.length - 1];
  const oldest = data[0];
  const high = Math.max(...data.map((d) => d.price));
  const low = Math.min(...data.map((d) => d.price));
  const avg = data.reduce((sum, d) => sum + d.price, 0) / data.length;
  const change = latest.price - oldest.price;
  const changePercent = oldest.price > 0 ? (change / oldest.price) * 100 : 0;

  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold text-white mb-3">📈 Price History</h3>

      {/* Simple bar visualization */}
      <div className="flex items-end gap-1 h-24 mb-4">
        {data.slice(-20).map((point, i) => {
          const height = high > 0 ? (point.price / high) * 100 : 0;
          return (
            <div
              key={i}
              className="flex-1 bg-boba-red/60 hover:bg-boba-red rounded-t transition-colors cursor-pointer"
              style={{ height: `${Math.max(height, 4)}%` }}
              title={`${point.date}: $${point.price.toFixed(2)}`}
            />
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div>
          <p className="text-gray-400">High</p>
          <p className="text-white font-semibold">${high.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-400">Low</p>
          <p className="text-white font-semibold">${low.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-400">Average</p>
          <p className="text-white font-semibold">${avg.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-400">Change</p>
          <p className={`font-semibold ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
            {change >= 0 ? "+" : ""}
            {changePercent.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
