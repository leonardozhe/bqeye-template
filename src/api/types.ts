// src/api/types.ts — Unified type definitions

// ---- Error handling ----
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ---- Generic response ----
export interface ApiResponse<T> {
  [key: string]: T | T[] | unknown;
}

// ---- Product types ----
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  category: 'colored-contacts' | 'cosplay' | 'accessories';
  rating: number;
  reviews: number;
  images: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  discount?: number;
  colors?: { name: string; hex: string }[];
}

// ---- Cart types ----
export interface LensConfiguration {
  step1: { lensType: string };
  step4: { lensIndex: { priceExtra: number } };
  step5: { coatingIds: string[] };
}

export interface CartItem extends Product {
  quantity: number;
  lensConfig?: LensConfiguration;
  cartItemId?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// ---- GeoSEO types ----
export interface GeoSeoConfig {
  id: string;
  siteName: string;
  siteUrl: string;
  organizationName?: string;
  siteDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScoreBreakdown {
  totalScore: number;
  grade: string;
  discoverabilityScore: number;
  aiProtocolScore: number;
  seoScore: number;
  securityScore: number;
}
