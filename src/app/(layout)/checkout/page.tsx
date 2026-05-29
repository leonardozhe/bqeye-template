// src/app/(layout)/checkout/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Container, Box, Typography, Button, TextField, Stepper,
  Step, StepLabel, Paper, Divider, Grid, Alert, CircularProgress
} from '@mui/material';
import { useBqeyeCart } from '@/hooks/useMedusaCart';
import { medusaCart } from '@/api/medusa';

const FREE_SHIPPING_THRESHOLD = 79;

const steps = ['Shipping', 'Delivery', 'Payment'];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items, getSubtotal, getShippingCost, getCouponDiscount,
    getTotal, clearCart, medusaCartId, medusaSyncing, medusaError,
  } = useBqeyeCart();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Shipping
  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address1: '', address2: '', city: '', state: '', zipCode: '', country: 'US',
  });

  // Delivery
  const [delivery, setDelivery] = useState<'standard' | 'express'>('standard');

  // Payment (mock)
  const [payment, setPayment] = useState({
    cardNumber: '', cardExpiry: '', cardCvc: '', cardName: '',
  });

  // ─── Empty cart ───
  if (items.length === 0) {
    return (
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: 'calc(100vh - 96px)', py: 8 }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Paper sx={{ p: 6, borderRadius: '8px' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Your cart is empty</Typography>
            <Typography color="#808080" sx={{ mb: 4 }}>Add some items before checkout.</Typography>
            <Button component={Link} href="/products" variant="contained"
              sx={{ bgcolor: '#463AE8', borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 700 }}>
              Start Shopping
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  // ─── Place order (complete Medusa cart) ───
  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Ensure Medusa cart exists
      let cid = medusaCartId;
      if (!cid) {
        const cart = await medusaCart.create();
        cid = cart.id;
      }

      // 2. Set email on cart (Medusa requirement)
      await medusaCart.setEmail(cid, shipping.email);

      // 3. Complete order
      const result = await medusaCart.complete(cid);

      if (result.type === 'order') {
        clearCart();
        router.push('/order-confirmation');
      } else {
        setError('Order could not be completed. Please try again.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  // ─── Next step ───
  const handleNext = () => {
    if (activeStep === 0 && !shipping.email) {
      setError('Email is required');
      return;
    }
    if (activeStep === 2) {
      handlePlaceOrder();
      return;
    }
    setActiveStep((s) => s + 1);
  };

  const subtotal = getSubtotal();
  const shippingCost = getShippingCost();
  const discount = getCouponDiscount();
  const total = getTotal();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Checkout</Typography>

      <Grid container spacing={4}>
        {/* ─── Left: Checkout Form ─── */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {medusaError && <Alert severity="warning" sx={{ mb: 2 }}>Cart sync: {medusaError}</Alert>}

          <Paper sx={{ p: 3, borderRadius: '8px' }}>
            {/* Step 0: Shipping */}
            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Shipping Address</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField fullWidth size="small" label="First Name"
                      value={shipping.firstName} onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField fullWidth size="small" label="Last Name"
                      value={shipping.lastName} onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth size="small" label="Email *" type="email"
                      value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth size="small" label="Phone"
                      value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth size="small" label="Address"
                      value={shipping.address1} onChange={(e) => setShipping({ ...shipping, address1: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth size="small" label="Apt, suite, etc. (optional)"
                      value={shipping.address2} onChange={(e) => setShipping({ ...shipping, address2: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <TextField fullWidth size="small" label="City"
                      value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <TextField fullWidth size="small" label="State"
                      value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <TextField fullWidth size="small" label="ZIP Code"
                      value={shipping.zipCode} onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })} />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Step 1: Delivery */}
            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Delivery Method</Typography>
                {[
                  { id: 'standard' as const, label: 'Standard Shipping', price: '$5.99', days: '5-7 business days', free: subtotal >= FREE_SHIPPING_THRESHOLD },
                  { id: 'express' as const, label: 'Express Shipping', price: '$14.99', days: '2-3 business days' },
                ].map((m) => (
                  <Box key={m.id}
                    onClick={() => setDelivery(m.id)}
                    sx={{
                      p: 2, mb: 2, border: '1px solid', borderColor: delivery === m.id ? '#463AE8' : '#e0e0e0',
                      borderRadius: '8px', cursor: 'pointer', bgcolor: delivery === m.id ? '#f5f3ff' : '#fff' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{m.label}</Typography>
                      <Typography sx={{ fontWeight: 700, color: m.free ? '#4CAF50' : 'inherit' }}>
                        {m.free ? 'FREE' : m.price}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="#808080">{m.days}</Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Step 2: Payment */}
            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Payment</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth size="small" label="Card Number" placeholder="4242 4242 4242 4242"
                      value={payment.cardNumber} onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth size="small" label="Name on Card"
                      value={payment.cardName} onChange={(e) => setPayment({ ...payment, cardName: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField fullWidth size="small" label="Expiry" placeholder="MM/YY"
                      value={payment.cardExpiry} onChange={(e) => setPayment({ ...payment, cardExpiry: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField fullWidth size="small" label="CVC" placeholder="123"
                      value={payment.cardCvc} onChange={(e) => setPayment({ ...payment, cardCvc: e.target.value })} />
                  </Grid>
                </Grid>
                <Alert severity="info" sx={{ mt: 2 }}>
                  Test card: 4242 4242 4242 4242
                </Alert>
              </Box>
            )}

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button disabled={activeStep === 0} onClick={() => setActiveStep((s) => s - 1)}>
                Back
              </Button>
              <Button variant="contained" size="large" onClick={handleNext}
                disabled={loading || medusaSyncing}
                sx={{ bgcolor: '#463AE8', borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 700 }}>
                {loading ? <CircularProgress size={20} color="inherit" /> : activeStep === 2 ? `Pay $${total.toFixed(2)}` : 'Continue'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* ─── Right: Order Summary ─── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, borderRadius: '8px', position: { md: 'sticky' }, top: { md: 100 } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Order Summary</Typography>

            {/* Items */}
            {items.map((item) => (
              <Box key={item.cartItemId || item.id} sx={{ display: 'flex', gap: 2, mb: 2, pb: 2, borderBottom: '1px solid #f0f0f0' }}>
                <Box component="img" src={item.thumbnail} alt={item.title}
                  sx={{ width: 64, height: 64, borderRadius: '8px', objectFit: 'cover', bgcolor: '#f5f5f5' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.title}</Typography>
                  <Typography variant="caption" color="#808080">Qty: {item.quantity}</Typography>
                  {item.lensConfig && (
                    <Typography variant="caption" color="#463AE8" sx={{ display: 'block' }}>
                      🔬 配镜订单
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}

            {/* Totals */}
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="#808080">Subtotal</Typography>
                <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="#808080">Shipping</Typography>
                <Typography variant="body2" sx={{ color: shippingCost === 0 ? '#4CAF50' : 'inherit' }}>
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </Typography>
              </Box>
              {discount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="#4CAF50">Discount</Typography>
                  <Typography variant="body2" color="#4CAF50">-${discount.toFixed(2)}</Typography>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#463AE8' }}>
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            {medusaCartId && (
              <Typography variant="caption" color="#808080" sx={{ mt: 2, display: 'block' }}>
                Cart ID: {medusaCartId.slice(0, 16)}...
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
