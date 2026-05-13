import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping — BoBA Trader",
  description: "Shipping guidelines for BoBA Trader buyers and sellers.",
};

export default function ShippingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-center">
      <h1 className="text-6xl font-display font-black text-white mb-6">Shipping Guidelines</h1>
      <p className="text-xl text-white/50 font-body">Coming soon — packaging standards, tracking rules, and delivery expectations.</p>
    </div>
  );
}
