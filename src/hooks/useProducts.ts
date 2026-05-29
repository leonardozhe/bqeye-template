// src/hooks/useProducts.ts — Medusa-backed products hook
import { useState, useEffect, useCallback } from 'react';
import { medusaProducts } from '@/api/medusa';
import type { FrontendProduct } from '@/api/medusa-mappers';

interface UseProductsOptions {
  limit?: number;
  offset?: number;
  order?: string;
  categoryId?: string;
  tag?: string;
  search?: string;
}

interface UseProductsReturn {
  products: FrontendProduct[];
  loading: boolean;
  error: Error | null;
  count: number;
  hasMore: boolean;
  refresh: () => Promise<void>;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [count, setCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await medusaProducts.list({
        limit: options.limit || 20,
        offset: options.offset || 0,
        order: options.order || '-created_at',
        category_id: options.categoryId,
        tag: options.tag,
        q: options.search,
      });
      setProducts(result.products);
      setCount(result.count);
      setHasMore(result.hasMore);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [options.limit, options.offset, options.order, options.categoryId, options.tag, options.search]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { products, loading, error, count, hasMore, refresh };
}

export function useProductByHandle(handle: string) {
  const [product, setProduct] = useState<FrontendProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!handle) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    medusaProducts
      .getByHandle(handle)
      .then((p) => {
        if (!cancelled) {
          setProduct(p);
          setError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [handle]);

  return { product, loading, error };
}

export function useNewArrivals(limit = 8) {
  return useProducts({ order: '-created_at', limit });
}

export function useBestSellers(limit = 8) {
  return useProducts({ tag: 'best-seller', limit });
}
