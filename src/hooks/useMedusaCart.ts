// src/hooks/useMedusaCart.ts — Medusa Cart API 同步 hook
// 架构：Zustand 本地状态（UI 快速响应）+ Medusa 后端同步（持久化）
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { medusaCart } from '@/api/medusa';
import type { FrontendProduct } from '@/api/medusa-mappers';
import type { LensConfiguration } from '@/lib/lensConfig';

// ─── Cart item type ───
export interface BqeyeCartItem extends FrontendProduct {
  quantity: number;
  lensConfig?: LensConfiguration;
  cartItemId?: string;
  lineItemId?: string; // Medusa line item id
}

// ─── Coupons ───
const COUPONS: Record<string, number> = {
  WELCOME10: 0.10,
  SAVE20: 0.20,
  BQEye15: 0.15,
};

const FREE_SHIPPING_THRESHOLD = 79;

// ─── Store ───
interface BqeyeCartStore {
  // Local state
  items: BqeyeCartItem[];
  couponCode: string;
  couponDiscount: number;
  shippingMethod: 'standard' | 'express';

  // Medusa cart state
  medusaCartId: string | null;
  medusaSyncing: boolean;
  medusaError: string | null;

  // Actions
  addItem: (product: FrontendProduct & { lensConfig?: LensConfiguration; variantId?: string }, quantity?: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  setShippingMethod: (method: 'standard' | 'express') => void;

  // Computed
  getTotalItems: () => number;
  getSubtotal: () => number;
  getShippingCost: () => number;
  getCouponDiscount: () => number;
  getTotal: () => number;

  // Medusa sync
  syncFromMedusa: () => Promise<void>;
  ensureMedusaCart: () => Promise<string>;
}

// ─── Helper: create unique cart item id ───
function makeCartItemId(product: FrontendProduct): string {
  return `local-${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export const useBqeyeCart = create<BqeyeCartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: '',
      couponDiscount: 0,
      shippingMethod: 'standard',
      medusaCartId: null,
      medusaSyncing: false,
      medusaError: null,

      // ─── Add item ───
      addItem: async (product, quantity = 1) => {
        // 1. Optimistic local update
        set((state) => {
          if (product.lensConfig) {
            const cartItemId = makeCartItemId(product);
            const newItem: BqeyeCartItem = {
              ...product,
              quantity,
              cartItemId,
              lensConfig: product.lensConfig,
            };
            return { items: [...state.items, newItem] };
          }

          const existing = state.items.find(
            (item) => item.id === product.id && !item.lensConfig
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id && !item.lensConfig
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return { items: [...state.items, { ...product, quantity, cartItemId: makeCartItemId(product) }] };
        });

        // 2. Sync to Medusa
        try {
          const cartId = await get().ensureMedusaCart();
          const variantId = product.variants?.[0]?.id;
          if (variantId) {
            const updatedCart = await medusaCart.addLineItem(cartId, {
              variant_id: variantId,
              quantity,
            });
            // Update lineItemId mapping
            const lastItem = updatedCart.items[updatedCart.items.length - 1];
            if (lastItem) {
              set((state) => ({
                items: state.items.map((item) =>
                  item.id === product.id && !item.lineItemId
                    ? { ...item, lineItemId: lastItem.id }
                    : item
                ),
              }));
            }
          }
        } catch (e) {
          set({
            medusaError: e instanceof Error ? e.message : 'Failed to sync cart',
          });
        }
      },

      // ─── Remove item ───
      removeItem: async (id: string) => {
        const item = get().items.find(
          (i) => (i.cartItemId || i.id) === id
        );

        // 1. Optimistic local remove
        set((state) => ({
          items: state.items.filter(
            (i) => (i.cartItemId || i.id) !== id
          ),
        }));

        // 2. Sync to Medusa
        if (item?.lineItemId && get().medusaCartId) {
          try {
            await medusaCart.deleteLineItem(get().medusaCartId!, item.lineItemId);
          } catch (e) {
            set({
              medusaError: e instanceof Error ? e.message : 'Failed to remove from cart',
            });
          }
        }
      },

      // ─── Update quantity ───
      updateQuantity: async (id: string, quantity: number) => {
        const item = get().items.find(
          (i) => (i.cartItemId || i.id) === id
        );

        // 1. Optimistic local update
        if (quantity <= 0) {
          return get().removeItem(id);
        }
        set((state) => ({
          items: state.items.map((i) =>
            (i.cartItemId || i.id) === id ? { ...i, quantity } : i
          ),
        }));

        // 2. Sync to Medusa
        if (item?.lineItemId && get().medusaCartId) {
          try {
            await medusaCart.updateLineItem(get().medusaCartId!, item.lineItemId, {
              quantity,
            });
          } catch (e) {
            set({
              medusaError: e instanceof Error ? e.message : 'Failed to update cart',
            });
          }
        }
      },

      // ─── Clear cart ───
      clearCart: () => {
        set({
          items: [],
          couponCode: '',
          couponDiscount: 0,
          medusaCartId: null,
        });
      },

      // ─── Coupon ───
      applyCoupon: (code: string) => {
        const discount = COUPONS[code.toUpperCase()];
        if (discount) {
          set({ couponCode: code.toUpperCase(), couponDiscount: discount });
          return true;
        }
        return false;
      },

      // ─── Shipping ───
      setShippingMethod: (method: 'standard' | 'express') => {
        set({ shippingMethod: method });
      },

      // ─── Computed ───
      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getShippingCost: () => {
        const subtotal = get().getSubtotal();
        if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
        return get().shippingMethod === 'express' ? 14.99 : 5.99;
      },

      getCouponDiscount: () => {
        const subtotal = get().getSubtotal();
        return subtotal * get().couponDiscount;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShippingCost();
        const discount = get().getCouponDiscount();
        return subtotal + shipping - discount;
      },

      // ─── Medusa sync ───
      ensureMedusaCart: async () => {
        const existing = get().medusaCartId;
        if (existing) return existing;

        const cart = await medusaCart.create();
        set({ medusaCartId: cart.id });
        return cart.id;
      },

      syncFromMedusa: async () => {
        const cartId = get().medusaCartId;
        if (!cartId) return;

        set({ medusaSyncing: true, medusaError: null });
        try {
          const cart = await medusaCart.retrieve(cartId);
          // TODO: Map Medusa line items to local items
          // For now, just update cart id state
          set({ medusaSyncing: false });
        } catch (e) {
          set({
            medusaSyncing: false,
            medusaError: e instanceof Error ? e.message : 'Failed to sync',
          });
        }
      },
    }),
    { name: 'bqeye-cart' }
  )
);

// ─── Legacy alias for backward compatibility ───
export const useCartStore = useBqeyeCart;
