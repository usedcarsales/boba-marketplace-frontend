import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs — BoBA Trader",
  description: "Transparency documentation for BoBA Trader. Fees, protections, policies.",
};

export default function DocsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-center">
      <h1 className="text-6xl font-display font-black text-white mb-6">Documentation</h1>
      <p className="text-xl text-white/50 font-body">Coming soon — full transparency docs on how we operate.</p>
    </div>
  );
}
