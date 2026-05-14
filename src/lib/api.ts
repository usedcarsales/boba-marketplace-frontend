const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Re-export API_BASE so pages can use the same constant without hardcoding
export const API_BASE = API_URL;

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    if (response.status === 204) return undefined as T;
    return response.json();
  }

  // Auth
  async register(email: string, username: string, password: string) {
    return this.request<{ access_token: string; refresh_token: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, username, password }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ access_token: string; refresh_token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  // Cards
  async getCards(params: Record<string, string | number> = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.set(key, String(val));
      }
    });
    const query = searchParams.toString();
    return this.request<import("@/types").CardListResponse>(`/api/cards${query ? `?${query}` : ""}`);
  }

  async getCard(id: string) {
    return this.request<import("@/types").Card>(`/api/cards/${id}`);
  }

  async getCardFilters() {
    return this.request<import("@/types").CardFilterOptions>("/api/cards/filters");
  }

  async getCardSets() {
    return this.request<string[]>("/api/cards/sets");
  }

  async searchCards(query: string) {
    return this.request<Array<{ id: string; name: string; set: string; number: string }>>(
      `/api/cards/autocomplete?q=${encodeURIComponent(query)}`
    );
  }

  // Listings
  async getListings(params: Record<string, string | number> = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") searchParams.set(key, String(val));
    });
    const query = searchParams.toString();
    return this.request<import("@/types").ListingListResponse>(`/api/listings${query ? `?${query}` : ""}`);
  }

  async getListing(id: string) {
    return this.request<import("@/types").Listing>(`/api/listings/${id}`);
  }

  async getFeaturedListings() {
    return this.request<import("@/types").Listing[]>("/api/listings/featured");
  }

  async getRecentListings(limit = 20) {
    return this.request<import("@/types").Listing[]>(`/api/listings/recent?limit=${limit}`);
  }

  async createListing(data: {
    card_id: string;
    title: string;
    description?: string;
    condition: string;
    price_cents: number;
    quantity?: number;
  }) {
    return this.request<import("@/types").Listing>("/api/listings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Orders
  async createOrder(listing_id: string, quantity = 1) {
    return this.request<import("@/types").Order>("/api/orders", {
      method: "POST",
      body: JSON.stringify({ listing_id, quantity }),
    });
  }

  // User
  async getMe() {
    return this.request<import("@/types").User>("/api/users/me");
  }

  async getMyListings(status = "active") {
    return this.request<import("@/types").Listing[]>(`/api/users/me/listings?status=${status}`);
  }

  async getMyOrders() {
    return this.request<import("@/types").Order[]>("/api/users/me/orders");
  }

  async getMySales() {
    return this.request<import("@/types").Order[]>("/api/users/me/sales");
  }

  // Marketplace
  async getMarketplaceStats() {
    return this.request<{
      total_cards: number;
      sets: number;
      weapons: number;
      total_listings: number;
      active_listings: number;
      total_sellers: number;
      total_users: number;
      total_orders: number;
      completed_orders: number;
      est_gmv_cents: number;
      recent_sales: number;
      recent_gmv_cents: number;
      avg_listing_price_cents: number;
    }>("/api/marketplace/stats");
  }
}

export const api = new ApiClient(API_URL);
export default api;
