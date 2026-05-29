// src/hooks/useProducts.ts — Products hook following frontend standards
import { useState, useEffect, useCallback } from 'react';
import {
  products,
  getProductBySlug,
  getProducts,
  getRelatedProducts,
  getNewArrivals,
  getBestSellers,
  type Product,
} from '@/lib/products';

interface UseProductsOptions {
  category?: string;
  limit?: number;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Product[]>([]);

  const refresh = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      const filtered = getProducts(options.category);
      setData(options.limit ? filtered.slice(0, options.limit) : filtered);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [options.category, options.limit]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { products: data, loading, error, refresh };
}

export function useProductBySlug(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      const found = getProductBySlug(slug);
      if (found) {
        setProduct(found);
      } else {
        setError(new Error('Product not found'));
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  return { product, loading, error, related: product ? getRelatedProducts(slug) : [] };
}

export function useNewArrivals() {
  return getNewArrivals();
}

export function useBestSellers() {
  return getBestSellers();
}
