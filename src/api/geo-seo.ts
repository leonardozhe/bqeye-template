// src/api/geo-seo.ts — GeoSEO module API
// Uses Medusa backend URL from medusa-config
import { MEDUSA_URL, medusaHeaders } from '@/lib/medusa-config';
import type { ApiResponse, GeoSeoConfig, ScoreBreakdown } from './types';

class GeoSeoApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'GeoSeoApiError';
  }
}

async function geoSeoFetch<T>(path: string, options?: { method?: string; body?: unknown; admin?: boolean }): Promise<T> {
  const { method = 'GET', body, admin = false } = options || {};

  const headers: Record<string, string> = {
    ...medusaHeaders(),
  };

  if (admin) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (!token) throw new GeoSeoApiError(401, 'Not authenticated');
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${MEDUSA_URL}${path.startsWith('/') ? path : `/${path}`}`;

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new GeoSeoApiError(response.status, error.message || response.statusText);
  }

  return response.json() as Promise<T>;
}

// ===== 管理端 API (需要认证) =====

export const geoSeoAdmin = {
  getConfig: () =>
    geoSeoFetch<ApiResponse<GeoSeoConfig>>('/admin/geo-seo/config', { admin: true }),

  updateConfig: (data: Partial<GeoSeoConfig>) =>
    geoSeoFetch<ApiResponse<GeoSeoConfig>>('/admin/geo-seo/config', { method: 'POST', body: data, admin: true }),

  runCheck: (url: string) =>
    geoSeoFetch<ApiResponse<unknown>>('/admin/geo-seo/run-check', { method: 'POST', body: { url }, admin: true }),

  getResults: (params?: { limit?: number; offset?: number }) => {
    const qs = params ? `?limit=${params.limit || 20}&offset=${params.offset || 0}` : '';
    return geoSeoFetch<ApiResponse<unknown>>(`/admin/geo-seo/results${qs}`, { admin: true });
  },

  getMetrics: () =>
    geoSeoFetch<ApiResponse<unknown>>('/admin/geo-seo/metrics', { admin: true }),

  getBotVisits: (params?: { limit?: number }) => {
    const qs = params ? `?limit=${params.limit || 50}` : '';
    return geoSeoFetch<ApiResponse<unknown>>(`/admin/geo-seo/bot-visits${qs}`, { admin: true });
  },
};

// ===== 公开端 API (无需认证) =====

export const geoSeoStore = {
  getStatus: () =>
    geoSeoFetch<ApiResponse<ScoreBreakdown>>('/store/geo-seo/status'),

  getSitemapData: () =>
    geoSeoFetch<ApiResponse<unknown>>('/store/geo-seo/sitemap-data'),

  getJsonLd: (type: string) =>
    geoSeoFetch<ApiResponse<unknown>>(`/store/geo-seo/jsonld/${type}`),

  getLlmsData: () =>
    geoSeoFetch<ApiResponse<unknown>>('/store/geo-seo/llms-data'),
};
