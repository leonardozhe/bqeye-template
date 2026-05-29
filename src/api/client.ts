// src/api/client.ts — API request layer (unified entry point)
// Following frontend standards: fetch-based, unified interceptor

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

const API_BASE =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000')
    : 'http://localhost:9000';

async function request<T>(
  endpoint: string,
  options: { method?: string; body?: unknown; admin?: boolean; timeout?: number } = {}
): Promise<T> {
  const { method = 'GET', body, admin = false, timeout = 30000 } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Admin endpoints require auth token
  if (admin) {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (!token) {
      throw new ApiError(401, 'Not authenticated');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(response.status, error.message || response.statusText);
    }

    return response.json() as Promise<T>;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout');
    }
    throw new ApiError(500, err instanceof Error ? err.message : 'Unknown error');
  }
}

export const apiClient = {
  request,

  get: <T>(endpoint: string, opts?: object) =>
    request<T>(endpoint, { ...opts, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, opts?: object) =>
    request<T>(endpoint, { ...opts, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, opts?: object) =>
    request<T>(endpoint, { ...opts, method: 'PUT', body }),

  delete: <T>(endpoint: string, opts?: object) =>
    request<T>(endpoint, { ...opts, method: 'DELETE' }),
};

export default apiClient;
