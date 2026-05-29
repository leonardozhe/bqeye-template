// src/lib/cart-types.ts — Shared cart type definitions
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
