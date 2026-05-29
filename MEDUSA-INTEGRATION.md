# Bqeye — Medusa 集成计划

> 状态：规划中 | 创建：2026-05-29

## 📊 当前状态分析

### ✅ 可复用（无需修改）
- 全部 UI 组件（ProductCard, ProductGallery, ProductDetail, Header, Footer, BottomNav）
- Theme / ThemeRegistry
- LensConfigWizard（配镜逻辑独立）
- Layout 结构（(layout)/ 路由组）
- GeoSEO 模块 API（`src/api/geo-seo.ts`）
- CartDrawer, CategoryTabs, SearchModal

### 🔧 需要适配 Medusa
| 文件 | 当前 | 目标 |
|------|------|------|
| `src/lib/products.ts` | 硬编码 12 个产品 | → Medusa Store API 动态获取 |
| `src/lib/cartStore.ts` | Zustand 本地购物车 | → Medusa Cart SDK 或 API 同步 |
| `src/hooks/useProducts.ts` | 调用本地 `getProducts()` | → 调用 Medusa API |
| `src/app/(layout)/checkout/page.tsx` | 本地结账 | → Medusa `cart.complete` flow |
| `src/api/client.ts` | 通用 fetch | → 添加 Medusa Store API 端点 |

### 🆕 需要新增
| 文件 | 用途 |
|------|------|
| `src/api/medusa.ts` | Medusa Store API 封装 |
| `src/api/medusa-mappers.ts` | Medusa Product → 前端 Product 类型映射 |
| `src/hooks/useMedusaCart.ts` | Medusa 购物车 hook |
| `src/lib/medusa-config.ts` | Medusa SDK 配置 |

---

## 🏗️ 集成架构

```
┌─────────────────────────────────────────────┐
│              Bqeye Frontend                  │
├─────────────────────────────────────────────┤
│  Next.js App Router (SSR + Client)           │
│                                              │
│  src/api/                                    │
│  ├── medusa.ts        ← Store API 封装        │
│  ├── medusa-mappers.ts ← 类型映射            │
│  ├── geo-seo.ts       ← GeoSEO 模块           │
│  └── client.ts        ← 通用客户端            │
│                                              │
│  src/hooks/                                  │
│  ├── useProducts       ← 产品列表/详情        │
│  ├── useMedusaCart     ← 购物车同步           │
│  └── useGeoSeo         ← SEO 状态             │
│                                              │
│  src/lib/                                    │
│  ├── products.ts       ← 类型定义 + fallback   │
│  ├── cartStore.ts      ← Zustand (本地缓存)    │
│  ├── medusa-config.ts  ← SDK 初始化           │
│  └── lensConfig.ts     ← 配镜逻辑 (不变)       │
└──────────────────┬──────────────────────────┘
                   │ fetch / Medusa SDK
                   ▼
┌─────────────────────────────────────────────┐
│          Medusa Backend (:9000)              │
├─────────────────────────────────────────────┤
│  Store API:                                  │
│  GET  /store/products                        │
│  GET  /store/products/:id                    │
│  POST /store/carts                           │
│  POST /store/carts/:id/line-items            │
│  POST /store/carts/:id/complete              │
│  GET  /store/carts/:id                       │
│  ...                                         │
│                                              │
│  GeoSEO Module:                              │
│  GET  /store/geo-seo/status                  │
│  GET  /store/geo-seo/jsonld/:type            │
│  ...                                         │
└─────────────────────────────────────────────┘
```

---

## 📋 实施步骤

### Phase 1: Medusa API 层
1. 安装 `@medusajs/js-sdk` 或直接用 fetch
2. 创建 `src/api/medusa.ts` — Store API 封装
3. 创建 `src/api/medusa-mappers.ts` — Medusa Product → 前端 Product 映射
4. 添加 `.env.example` 中的 `NEXT_PUBLIC_MEDUSA_URL`

### Phase 2: 产品数据层改造
1. 修改 `src/lib/products.ts` — 保留类型定义，移除硬编码数据
2. 修改 `src/hooks/useProducts.ts` — 改用 Medusa API
3. 修改产品页面 → 使用 hook 而非本地数据

### Phase 3: 购物车同步
1. 保留 Zustand 作为 UI 状态 + 本地缓存
2. 新增 `useMedusaCart.ts` — 同步到 Medusa Cart
3. 修改 CartDrawer / checkout → 使用双端同步

### Phase 4: 结账流程
1. 修改 checkout page → 调用 `cart.complete`
2. 处理支付（Stripe/PayPal）
3. 订单确认页 → 从 Medusa 获取订单状态

### Phase 5: GeoSEO 集成
1. 确认 medusa-geo-seo 模块已安装
2. 前端调用 `/store/geo-seo/*` 端点
3. JSON-LD 注入到产品页

---

## 🔌 Medusa Store API 端点映射

```typescript
// Medusa → Bqeye 前端映射
const MEDUSA_MAPPING = {
  // 产品列表
  products: {
    list: 'GET /store/products',
    detail: 'GET /store/products/:id',
    // 参数映射
    params: {
      limit: 'limit',
      offset: 'offset',
      category: 'category_id',
      search: 'q',
      sort: 'order',  // created_at, -created_at, price_asc, price_desc
    },
  },
  // 购物车
  cart: {
    create: 'POST /store/carts',
    get: 'GET /store/carts/:id',
    addItem: 'POST /store/carts/:id/line-items',
    updateItem: 'POST /store/carts/:id/line-items/:line_id',
    removeItem: 'DELETE /store/carts/:id/line-items/:line_id',
    complete: 'POST /store/carts/:id/complete',
  },
};
```

## 🎯 Medusa Product → 前端 Product 映射

```typescript
// medusa-mappers.ts
function mapMedusaProduct(m: MedusaProduct): Product {
  return {
    id: m.id,           // string → 改用 string
    name: m.title,
    slug: m.handle,
    price: m.variants?.[0]?.calculated_price?.calculated_amount || 0,
    originalPrice: 0,    // Medusa 无 originalPrice，从 metadata 获取
    image: m.thumbnail || m.images?.[0]?.url || '',
    description: m.description || '',
    category: m.categories?.[0]?.handle || 'colored-contacts',
    rating: 0,           // 从 reviews 模块获取
    reviews: 0,
    images: m.images?.map(i => i.url) || [],
    isNew: m.tags?.includes('new'),
    isBestSeller: m.tags?.includes('best-seller'),
    discount: 0,         // 从 sales channels / price lists 计算
    colors: m.options?.find(o => o.title === 'Color')?.values || [],
  };
}
```
