// src/lib/products.ts — 产品类型定义 + 本地 fallback（无后端时使用）
// Medusa 对接后，实际数据从 /store/products 获取
export type { FrontendProduct as Product } from '@/api/medusa-mappers';

// 兼容旧 Product 接口（已迁移到 FrontendProduct）
// 新代码请直接使用 FrontendProduct

// 价格辅助
export function getProductPrice(product: { variants?: Array<{ price?: number }> }): number {
  return product.variants?.[0]?.price || 0;
}

export function getProductCurrency(product: { variants?: Array<{ currencyCode?: string }> }): string {
  return product.variants?.[0]?.currencyCode || 'usd';
}

// 本地 mock 数据（开发 fallback，Medusa 有数据后可删除）
export const mockProducts: any[] = [];

export function getMockProductByHandle(handle: string): any | undefined {
  return mockProducts.find((p) => p.handle === handle);
}

export function getMockProducts(category?: string): any[] {
  if (!category) return mockProducts;
  return mockProducts.filter((p) => p.categories?.includes(category));
}
