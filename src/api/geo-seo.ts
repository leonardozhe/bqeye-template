// src/api/geo-seo.ts — GeoSEO module API following frontend standards
import apiClient from './client';
import type { ApiResponse, GeoSeoConfig, ScoreBreakdown } from './types';

// ===== 管理端 API (需要认证) =====

export const geoSeoAdmin = {
  getConfig: () =>
    apiClient.get<ApiResponse<GeoSeoConfig>>('/admin/geo-seo/config', { admin: true }),

  updateConfig: (data: Partial<GeoSeoConfig>) =>
    apiClient.post<ApiResponse<GeoSeoConfig>>('/admin/geo-seo/config', data, { admin: true }),

  runCheck: (url: string) =>
    apiClient.post<ApiResponse<unknown>>('/admin/geo-seo/run-check', { url }, { admin: true }),

  getResults: (params?: { limit?: number; offset?: number }) => {
    const qs = params ? `?limit=${params.limit || 20}&offset=${params.offset || 0}` : '';
    return apiClient.get<ApiResponse<unknown>>(`/admin/geo-seo/results${qs}`, { admin: true });
  },

  getMetrics: () =>
    apiClient.get<ApiResponse<unknown>>('/admin/geo-seo/metrics', { admin: true }),

  getBotVisits: (params?: { limit?: number }) => {
    const qs = params ? `?limit=${params.limit || 50}` : '';
    return apiClient.get<ApiResponse<unknown>>(`/admin/geo-seo/bot-visits${qs}`, { admin: true });
  },
};

// ===== 公开端 API (无需认证) =====

export const geoSeoStore = {
  getStatus: () =>
    apiClient.get<ApiResponse<ScoreBreakdown>>('/store/geo-seo/status'),

  getSitemapData: () =>
    apiClient.get<ApiResponse<unknown>>('/store/geo-seo/sitemap-data'),

  getJsonLd: (type: string) =>
    apiClient.get<ApiResponse<unknown>>(`/store/geo-seo/jsonld/${type}`),

  getLlmsData: () =>
    apiClient.get<ApiResponse<unknown>>('/store/geo-seo/llms-data'),
};
