// src/lib/cartStore.ts — 兼容层：重新导出 useMedusaCart
// 所有组件 import { useCartStore } from '@/lib/cartStore' 自动切换到 Medusa 后端
export { useBqeyeCart as useCartStore } from '@/hooks/useMedusaCart';
export type { BqeyeCartItem as CartItem } from '@/hooks/useMedusaCart';
export type { ShippingAddress, PaymentInfo } from './cart-types';
