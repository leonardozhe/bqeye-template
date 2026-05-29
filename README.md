# Bqeye — Medusa Frontend Template

> Next.js 16 + MUI 7 + Medusa Store API + GeoSEO 集成

**GitHub:** https://github.com/leonardozhe/bqeye-template  
**Backend:** http://192.168.1.100:9000 (Medusa v2)  
**Publishable Key:** pk_733fcb...3205

---

## 🏗️ 架构

```
┌─────────────────────────────────────────────────┐
│              Bqeye Frontend                     │
│              Next.js 16 (App Router)             │
├─────────────────────────────────────────────────┤
│                                                 │
│  src/api/                                       │
│  ├── medusa.ts          ← Store API 封装          │
│  ├── medusa-mappers.ts  ← Medusa→前端 类型映射    │
│  ├── geo-seo.ts         ← GeoSEO 模块 API        │
│  └── client.ts          ← 通用 fetch 客户端       │
│                                                 │
│  src/hooks/                                     │
│  ├── useProducts.ts     ← 产品列表/详情           │
│  ├── useMedusaCart.ts   ← 购物车（乐观更新+同步）  │
│  └── index.ts           ← 统一导出               │
│                                                 │
│  src/lib/                                       │
│  ├── products.ts        ← 类型定义 + fallback     │
│  ├── cartStore.ts       ← useCartStore 别名      │
│  ├── cart-types.ts      ← Shipping/Payment 类型  │
│  ├── medusa-config.ts   ← URL/Key/Region         │
│  ├── lensConfig.ts      ← 配镜向导逻辑            │
│  └── theme.ts           ← MUI 主题               │
│                                                 │
│  src/components/                                │
│  ├── layout/            ← Header, Footer, Nav    │
│  ├── product/           ← Card, Detail, Gallery  │
│  ├── common/            ← CartDrawer, Search     │
│  └── lens/              ← LensConfigWizard       │
│                                                 │
├────────────────────┬────────────────────────────┤
│  Storefront Pages  │  Medusa Backend (:9000)    │
│  /                 │                            │
│  /products         │  GET /store/products       │
│  /products/:slug   │  GET /store/products/:id   │
│  /cart             │  POST /store/carts         │
│  /checkout         │  POST /carts/:id/line-items│
│  /order-confirmation│ POST /carts/:id/complete   │
│  /account/refer    │                            │
│                    │  GeoSEO Module:            │
│                    │  GET /store/geo-seo/status │
│                    │  GET /store/geo-seo/jsonld │
│                    │  ...                       │
└────────────────────┴────────────────────────────┘
```

## 📦 安装

```bash
git clone https://github.com/leonardozhe/bqeye-template.git
cd bqeye-template

# 1. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入实际的 MEDUSA_URL 和 PUBLISHABLE_KEY

# 2. 安装依赖
npm install

# 3. 开发模式
npm run dev
# 访问 http://localhost:3000

# 4. 生产构建
npm run build
npm run start
```

## 🔧 环境变量

```env
NEXT_PUBLIC_MEDUSA_URL=http://192.168.1.100:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_***
NEXT_PUBLIC_MEDUSA_REGION=default
NEXT_PUBLIC_GEO_SEO_ENABLED=true
```

## 🗺️ 前端标准

详见 `standards/frontend.md`（来自 zeelool-template），包含：
- 项目结构规范
- API 客户端规范
- 前后端交互协议
- GeoSEO 模块前后端部署规范

## 📊 Medusa 对接状态

| 模块 | 状态 | 说明 |
|------|------|------|
| 产品列表 | ✅ 完成 | `useProducts` → `medusaProducts.list()` |
| 产品详情 | ✅ 完成 | `[slug]/page.tsx` 服务端直调 Medusa |
| 购物车 | ✅ 完成 | `useMedusaCart` 乐观更新 + 后端同步 |
| 结账流程 | ✅ 完成 | `cart.complete` → Order 创建 |
| GeoSEO | ✅ 完成 | 统一 Medusa 后端 URL |
| 搜索 | ✅ 完成 | 防抖搜索调用 Medusa API |
| 导航/Header | ✅ 完成 | 搜索 + 购物车数量 |

## 🧠 记忆系统

本项目遵循四层记忆架构（AGENTS.md v6.0）：
- L3 Archive → L2 LTM → L1 MTM → L0 STM
- 搜索层：QMD workspace markdown 搜索
