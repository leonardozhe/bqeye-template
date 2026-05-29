// src/api/medusa.ts — Medusa Store API 封装
import {
  MEDUSA_URL,
  medusaHeaders,
  MEDUSA_REGION,
} from '@/lib/medusa-config';
import type {
  MedusaProduct,
  MedusaProductListResponse,
  FrontendProduct,
} from './medusa-mappers';
import { mapMedusaProduct, mapMedusaProductList } from './medusa-mappers';

// ─── 内部 fetch 封装 ───

async function medusaFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${MEDUSA_URL}${path}`;
  const headers = medusaHeaders();

  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options?.headers || {}) },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Medusa API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// ─── 查询参数构建 ───

function qs(params: Record<string, string | number | boolean | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return '';
  return '?' + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}

// ─── Products API ───

export interface ListProductsParams {
  limit?: number;
  offset?: number;
  order?: string;              // created_at, -created_at, price_asc, price_desc
  category_id?: string;
  collection_id?: string;
  tag?: string;
  q?: string;                  // search query
  is_giftcard?: boolean;
  fields?: string;             // expand fields
}

export const medusaProducts = {
  /**
   * 获取产品列表
   * GET /store/products
   */
  list: async (params: ListProductsParams = {}) => {
    const {
      limit = 20,
      offset = 0,
      order = '-created_at',
      category_id,
      collection_id,
      tag,
      q,
      is_giftcard = false,
      fields = 'id,title,subtitle,handle,description,thumbnail,images,variants,variants.calculated_price,categories,tags,options,collection,created_at,updated_at,metadata',
    } = params;

    const path = `/store/products${qs({
      limit,
      offset,
      order,
      category_id,
      collection_id,
      tag,
      q,
      is_giftcard,
      fields,
    })}`;

    const resp = await medusaFetch<MedusaProductListResponse>(path);
    return mapMedusaProductList(resp);
  },

  /**
   * 获取单个产品
   * GET /store/products/:id
   */
  retrieve: async (idOrHandle: string): Promise<FrontendProduct> => {
    const path = `/store/products/${idOrHandle}?fields=id,title,subtitle,handle,description,thumbnail,images,variants,variants.calculated_price,categories,tags,options,collection,created_at,updated_at,metadata`;
    const resp = await medusaFetch<{ product: MedusaProduct }>(path);
    return mapMedusaProduct(resp.product);
  },

  /**
   * 按 handle（slug）获取产品
   * 内部使用 retrieve，因为 Medusa 支持 handle 查询
   */
  getByHandle: async (handle: string): Promise<FrontendProduct> => {
    return medusaProducts.retrieve(handle);
  },
};

// ─── Cart API ───

export interface CartLineItem {
  id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
  title: string;
  description?: string;
  thumbnail?: string;
  metadata?: Record<string, unknown>;
}

export interface MedusaCart {
  id: string;
  email?: string;
  items: CartLineItem[];
  region_id: string;
  shipping_address?: Record<string, unknown>;
  billing_address?: Record<string, unknown>;
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  total: number;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export const medusaCart = {
  /**
   * 创建购物车
   * POST /store/carts
   */
  create: async (data?: {
    region_id?: string;
    sales_channel_id?: string;
    metadata?: Record<string, unknown>;
  }): Promise<MedusaCart> => {
    const resp = await medusaFetch<{ cart: MedusaCart }>('/store/carts', {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
    return resp.cart;
  },

  /**
   * 获取购物车
   * GET /store/carts/:id
   */
  retrieve: async (cartId: string): Promise<MedusaCart> => {
    const resp = await medusaFetch<{ cart: MedusaCart }>(`/store/carts/${cartId}`);
    return resp.cart;
  },

  /**
   * 添加商品到购物车
   * POST /store/carts/:id/line-items
   */
  addLineItem: async (cartId: string, data: {
    variant_id: string;
    quantity: number;
    metadata?: Record<string, unknown>;
  }): Promise<MedusaCart> => {
    const resp = await medusaFetch<{ cart: MedusaCart }>(
      `/store/carts/${cartId}/line-items`,
      { method: 'POST', body: JSON.stringify(data) }
    );
    return resp.cart;
  },

  /**
   * 更新购物车行项目
   * POST /store/carts/:id/line-items/:lineId
   */
  updateLineItem: async (cartId: string, lineId: string, data: {
    quantity: number;
    metadata?: Record<string, unknown>;
  }): Promise<MedusaCart> => {
    const resp = await medusaFetch<{ cart: MedusaCart }>(
      `/store/carts/${cartId}/line-items/${lineId}`,
      { method: 'POST', body: JSON.stringify(data) }
    );
    return resp.cart;
  },

  /**
   * 删除购物车行项目
   * DELETE /store/carts/:id/line-items/:lineId
   */
  deleteLineItem: async (cartId: string, lineId: string): Promise<MedusaCart> => {
    const resp = await medusaFetch<{ cart: MedusaCart }>(
      `/store/carts/${cartId}/line-items/${lineId}`,
      { method: 'DELETE' }
    );
    return resp.cart;
  },

  /**
   * 完成结账
   * POST /store/carts/:id/complete
   */
  complete: async (cartId: string): Promise<{
    type: 'order' | 'cart';
    order?: Record<string, unknown>;
    cart?: MedusaCart;
  }> => {
    const resp = await medusaFetch<
      { type: 'order'; order: Record<string, unknown> } |
      { type: 'cart'; cart: MedusaCart }
    >(`/store/carts/${cartId}/complete`, { method: 'POST' });
    return resp;
  },

  /**
   * 设置购物车邮箱
   * POST /store/carts/:id
   */
  setEmail: async (cartId: string, email: string): Promise<MedusaCart> => {
    return medusaCart.retrieve(cartId);
  },

  /**
   * 设置收货地址
   * POST /store/carts/:id
   */
  setAddress: async (cartId: string, address: Record<string, unknown>): Promise<MedusaCart> => {
    return medusaCart.retrieve(cartId);
  },
};

// ─── Categories API ───

export interface MedusaCategory {
  id: string;
  name: string;
  handle: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export const medusaCategories = {
  list: async (): Promise<MedusaCategory[]> => {
    const resp = await medusaFetch<{ product_categories: MedusaCategory[] }>(
      '/store/product-categories?fields=id,name,handle,description'
    );
    return resp.product_categories;
  },
};

// ─── Collections API ───

export interface MedusaCollection {
  id: string;
  title: string;
  handle: string;
  created_at: string;
  updated_at: string;
}

export const medusaCollections = {
  list: async (): Promise<MedusaCollection[]> => {
    const resp = await medusaFetch<{ collections: MedusaCollection[] }>(
      '/store/collections?fields=id,title,handle'
    );
    return resp.collections;
  },
};

// ─── GeoSEO API (existing, re-export) ───

export { geoSeoAdmin, geoSeoStore } from './geo-seo';
