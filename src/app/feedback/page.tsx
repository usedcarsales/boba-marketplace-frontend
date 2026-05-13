import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback — BoBA Trader",
  description: "Help build BoBA Trader. Submit feedback, feature requests, and bug reports.",
};

export default function FeedbackPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-center">
      <h1 className="text-6xl font-display font-black text-white mb-6">Community Feedback</h1>
      <p className="text-xl text-white/50 font-body">Coming soon — share your ideas to shape the marketplace.</p>
    </div>
  );
}
