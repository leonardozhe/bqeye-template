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
  id: string;                // Medusa id (string, not number)
  handle: string;            // URL slug
  title: string;             // name
  description: string;
  thumbnail: string;         // main image
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
}

// ─── 映射函数 ───

export function mapMedusaProduct(m: MedusaProduct): FrontendProduct {
  // 取第一个 variant 的价格作为展示价
  const variants = (m.variants || []).map(v => ({
    id: v.id,
    title: v.title,
    price: v.calculated_price?.calculated_amount || v.prices?.[0]?.amount || 0,
    currencyCode: v.calculated_price?.currency_code || v.prices?.[0]?.currency_code || 'usd',
    inventoryQuantity: v.inventory_quantity,
  }));

  // 从 tags 判断是否 new / best-seller
  const tagValues = (m.tags || []).map(t => t.value);

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
