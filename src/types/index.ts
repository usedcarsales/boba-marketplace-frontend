export interface Card {
  id: string;
  card_number: string;
  name: string;
  card_type: string;
  set_name: string;
  year: string | null;
  parallel: string | null;
  treatment: string | null;
  variation: string | null;
  notation: string | null;
  weapon: string | null;
  power: number | null;
  athlete: string | null;
  play_cost: number | null;
  play_ability: string | null;
  radish_id: number | null;
  last_sale_price: number | null;
  last_sale_date: string | null;
  avg_price_30d: number | null;
  total_sales: number | null;
  sales_last_30d: number | null;
  image_url: string | null;
  last_sale_image: string | null;
  created_at: string;
}

export interface CardListResponse {
  cards: Card[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string;
  rating: number;
  total_sales: number;
  total_purchases: number;
  stripe_onboarding_complete: boolean;
  created_at: string;
}

export interface UserPublic {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  rating: number;
  total_sales: number;
  created_at: string;
}

export interface ListingImage {
  id: string;
  image_url: string;
  display_order: number;
}

export interface Listing {
  id: string;
  seller_id: string;
  card_id: string;
  title: string;
  description: string | null;
  condition: string;
  price_cents: number;
  quantity: number;
  quantity_available: number;
  is_featured: boolean;
  status: string;
  views: number;
  created_at: string;
  updated_at: string;
  seller: UserPublic | null;
  card: Card | null;
  images: ListingImage[];
}

export interface ListingListResponse {
  listings: Listing[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string;
  quantity: number;
  subtotal_cents: number;
  platform_fee_cents: number;
  stripe_fee_cents: number;
  seller_payout_cents: number;
  stripe_payment_intent_id: string | null;
  status: string;
  tracking_number: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface CardFilterOptions {
  sets: string[];
  weapons: string[];
  parallels: string[];
  card_types: string[];
  years: string[];
  notations: string[];
}
