import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FrontendProduct } from '@/api/medusa-mappers';
import { LensConfiguration } from './lensConfig';

export interface CartItem extends FrontendProduct {
  quantity: number;
  lensConfig?: LensConfiguration;
  cartItemId?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
}

interface CartStore {
  items: CartItem[];
  couponCode: string;
  couponDiscount: number;
  shippingMethod: 'standard' | 'express';
  shippingAddress: ShippingAddress | null;
  addItem: (product: FrontendProduct, quantity?: number) => void;
  removeItem: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  setShippingMethod: (method: 'standard' | 'express') => void;
  setShippingAddress: (address: ShippingAddress) => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getShippingCost: () => number;
  getCouponDiscount: () => number;
  getTotal: () => number;
}

const COUPONS: Record<string, number> = {
  'WELCOME10': 0.10,
  'SAVE20': 0.20,
  'ZEELOOL15': 0.15,
};

const FREE_SHIPPING_THRESHOLD = 79;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: '',
      couponDiscount: 0,
      shippingMethod: 'standard',
      shippingAddress: null,

      addItem: (product: FrontendProduct & { lensConfig?: LensConfiguration }, quantity = 1) =>
        set((state) => {
          // Items with lens config are always unique entries
          if (product.lensConfig) {
            const cartItemId = `lens-${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
            const newItem: CartItem = {
              ...product,
              quantity,
              cartItemId,
              lensConfig: product.lensConfig,
            };
            return { items: [...state.items, newItem] };
          }
          const existing = state.items.find((item) => item.id === product.id && !item.lensConfig);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id && !item.lensConfig
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          const newItem: CartItem = { ...product, quantity };
          return { items: [...state.items, newItem] };
        }),

      removeItem: (id: number | string) =>
        set((state) => ({
          items: state.items.filter((item) => (item.cartItemId || String(item.id)) !== String(id)),
        })),

      updateQuantity: (id: number | string, quantity: number) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => (item.cartItemId || String(item.id)) !== String(id))
              : state.items.map((item) =>
                  (item.cartItemId || String(item.id)) === String(id) ? { ...item, quantity } : item
                ),
        })),

      clearCart: () =>
        set({ items: [], couponCode: '', couponDiscount: 0, shippingAddress: null }),

      applyCoupon: (code) => {
        const discount = COUPONS[code.toUpperCase()];
        if (discount) {
          set({ couponCode: code.toUpperCase(), couponDiscount: discount });
          return true;
        }
        return false;
      },

      setShippingMethod: (method) => set({ shippingMethod: method }),
      setShippingAddress: (address) => set({ shippingAddress: address }),

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
    }),
    { name: 'zeelool-cart' }
  )
);
