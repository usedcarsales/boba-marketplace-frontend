import { NextRequest, NextResponse } from "next/server";

// eBay Browse API — client credentials flow
const EBAY_APP_ID = process.env.EBAY_APP_ID || "";
const EBAY_CERT_ID = process.env.EBAY_CERT_ID || "";
const EBAY_TOKEN_URL = "https://api.ebay.com/identity/v1/oauth2/token";
const EBAY_SEARCH_URL = "https://api.ebay.com/buy/browse/v1/item_summary/search";
const BOBATRADER_API = process.env.NEXT_PUBLIC_API_URL || "https://boba-api.onrender.com";

interface PriceAlertSubscription {
  cardName: string;
  email: string;
  targetPrice: number;
  condition?: string;
}

interface eBayTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface eBayItemSummary {
  itemId: string;
  title: string;
  price: { value: string; currency: string };
  thumbnailImages?: { imageUrl: string }[];
  itemWebUrl: string;
  condition?: string;
  seller?: { username: string };
}

interface eBaySearchResponse {
  itemSummaries?: eBayItemSummary[];
  total?: number;
}

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getEBayToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry - 60000) {
    return cachedToken;
  }
  const auth = Buffer.from(`${EBAY_APP_ID}:${EBAY_CERT_ID}`).toString("base64");
  const res = await fetch(EBAY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
  });
  if (!res.ok) throw new Error(`eBay auth failed: ${res.status}`);
  const data: eBayTokenResponse = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;
  return data.access_token;
}

async function searchEBayListings(
  query: string,
  limit = 5
): Promise<eBayItemSummary[]> {
  const token = await getEBayToken();
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
    filter: "buyingOptions:{FIXED_PRICE|BEST_OFFER}",
    sort: "price",
  });
  const res = await fetch(`${EBAY_SEARCH_URL}?${params}`, {
    headers: { Authorization: `Bearer ${token}`, "X-EBAY-C-MARKETPLACE-ID": "EBAY_US" },
  });
  if (!res.ok) {
    console.error("eBay search failed:", res.status);
    return [];
  }
  const data: eBaySearchResponse = await res.json();
  return data.itemSummaries || [];
}

function priceStats(items: eBayItemSummary[]) {
  const prices = items.map((i) => parseFloat(i.price.value)).filter((p) => p > 0);
  if (prices.length === 0) return { low: 0, high: 0, avg: 0, count: 0 };
  const sorted = [...prices].sort((a, b) => a - b);
  return {
    low: sorted[0],
    high: sorted[sorted.length - 1],
    avg: prices.reduce((s, p) => s + p, 0) / prices.length,
    count: prices.length,
  };
}

// POST: Subscribe to price alert
export async function POST(req: NextRequest) {
  try {
    const body: PriceAlertSubscription = await req.json();
    const { cardName, email, targetPrice, condition } = body;

    if (!cardName || !email || !targetPrice) {
      return NextResponse.json(
        { error: "cardName, email, and targetPrice are required" },
        { status: 400 }
      );
    }

    // Store subscription via backend API
    const subRes = await fetch(`${BOBATRADER_API}/api/price-alerts/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardName, email, targetPrice, condition }),
    });

    if (!subRes.ok) {
      const err = await subRes.text();
      return NextResponse.json(
        { error: `Backend error: ${err}` },
        { status: subRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Price alert set for "${cardName}" at $${targetPrice.toFixed(2)}`,
      subscription: { cardName, email, targetPrice },
    });
  } catch (err: any) {
    console.error("Price alert subscription error:", err);
    return NextResponse.json(
      { error: "Internal server error", detail: err.message },
      { status: 500 }
    );
  }
}

// GET: Check prices for a card (used by price alert poller)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cardName = searchParams.get("cardName");
  const limit = parseInt(searchParams.get("limit") || "10");

  if (!cardName) {
    return NextResponse.json(
      { error: "cardName query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const query = `"Bo Jackson Battle Arena" ${cardName}`;
    const items = await searchEBayListings(query, limit);
    const stats = priceStats(items);

    return NextResponse.json({
      cardName,
      query,
      timestamp: new Date().toISOString(),
      stats: {
        low: stats.low,
        high: stats.high,
        average: Math.round(stats.avg * 100) / 100,
        listingsFound: stats.count,
      },
      listings: items.slice(0, 5).map((i) => ({
        id: i.itemId,
        title: i.title,
        price: parseFloat(i.price.value),
        currency: i.price.currency,
        url: i.itemWebUrl,
        image: i.thumbnailImages?.[0]?.imageUrl || null,
        condition: i.condition || "Unknown",
        seller: i.seller?.username || "Unknown",
      })),
    });
  } catch (err: any) {
    console.error("Price alert check error:", err);
    return NextResponse.json(
      { error: "Failed to check prices", detail: err.message },
      { status: 500 }
    );
  }
}
