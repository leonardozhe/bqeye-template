// src/lib/medusa-config.ts — Medusa SDK / API 初始化

export const MEDUSA_URL =
  process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://192.168.1.100:9000';

export const MEDUSA_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

// 构建 fetch 基础配置（带 publishable key）
export function medusaHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (MEDUSA_PUBLISHABLE_KEY) {
    headers['x-publishable-api-key'] = MEDUSA_PUBLISHABLE_KEY;
  }
  return headers;
}

// 获取当前 region（用于多货币支持）
export const MEDUSA_REGION =
  process.env.NEXT_PUBLIC_MEDUSA_REGION || 'default';
