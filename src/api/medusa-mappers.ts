// src/api/medusa-mappers.ts — Medusa Product → 前端 Product 类型映射

export interface MedusaProduct {
  id: string;
  title: string;
  subtitle?: string | null;
  handle: string;
  description?: string | null;
  thumbnail?: string | null;
  images: Array<{ id: string; url: string }>;
  variants: Array<{
    id: string;
    title: string;
    prices: Array<{
      amount: number;
      currency_code: string;
    }>;
    calculated_price?: {
      calculated_amount: number;
      currency_code: string;
    };
    inventory_quantity?: number;
  }>;
  categories?: Array<{ id: string; name: string; handle: string }>;
  tags?: Array<{ id: string; value: string }>;
  options?: Array<{
    id: string;
    title: string;
    values: Array<{ id: string; value: string }>;
  }>;
  collection?: { id: string; title: string; handle: string } | null;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface MedusaProductListResponse {
  products: MedusaProduct[];
  count: number;
  offset: number;
  limit: number;
}

export interface FrontendProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
  variants: Array<{
    id: string;
    title: string;
    price: number;
    currencyCode: string;
    inventoryQuantity?: number;
  }>;
  categories: string[];
  tags: string[];
  collection: string | null;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;

  // ─── Compatibility aliases (for existing components) ───
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  colors: { name: string; hex: string }[];
  discount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

// ─── 映射函数 ───

export function mapMedusaProduct(m: MedusaProduct): FrontendProduct {
  const variants = (m.variants || []).map(v => {
    const cp = v.calculated_price;
    return {
      id: v.id,
      title: v.title,
      price: cp?.calculated_amount || 0,
      currencyCode: cp?.currency_code || 'usd',
      inventoryQuantity: v.inventory_quantity,
    };
  });

  const tagValues = (m.tags || []).map(t => t.value);
  const price = (m.variants?.[0]?.calculated_price?.calculated_amount) || 0;
  const currency = m.variants?.[0]?.calculated_price?.currency_code || 'usd';

  return {
    id: m.id,
    handle: m.handle,
    title: m.title,
    description: m.description || '',
    thumbnail: m.thumbnail || m.images?.[0]?.url || '',
    images: (m.images || []).map(img => img.url),
    variants,
    categories: (m.categories || []).map(c => c.handle),
    tags: tagValues,
    collection: m.collection?.handle || null,
    createdAt: m.created_at,
    updatedAt: m.updated_at,
    metadata: m.metadata,
    // Compatibility aliases
    name: m.title,
    slug: m.handle,
    price,
    originalPrice: price,
    image: m.thumbnail || m.images?.[0]?.url || '',
    rating: 0,
    reviews: 0,
    colors: [],
    discount: 0,
    isNew: tagValues.includes('new'),
    isBestSeller: tagValues.includes('best-seller'),
  };
}

export function mapMedusaProductList(resp: MedusaProductListResponse): {
  products: FrontendProduct[];
  count: number;
  hasMore: boolean;
} {
  return {
    products: resp.products.map(mapMedusaProduct),
    count: resp.count,
    hasMore: resp.offset + resp.products.length < resp.count,
  };
}
