'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Container, Box, Typography, Button, IconButton, Stepper, Step, StepLabel,
  TextField, Grid, Divider, Radio, RadioGroup,
  FormControlLabel, CircularProgress, Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useCartStore, ShippingAddress, PaymentInfo } from '@/lib/cartStore';

const STEPS = ['Shipping', 'Delivery', 'Payment'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getShippingCost, getCouponDiscount, getTotal, clearCart } = useCartStore();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '', lastName: '', email: '', phone: '',
    address1: '', address2: '', city: '', state: '', zipCode: '', country: 'US',
  });
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '', cardExpiry: '', cardCvc: '', cardName: '',
  });

  if (items.length === 0) {
    return (
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: 'calc(100vh - 96px)', py: 8 }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Box sx={{ bgcolor: '#fff', p: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#282828' }}>Your cart is empty</Typography>
            <Button component={Link} href="/cart" sx={{ mt: 2, bgcolor: '#282828', borderRadius: 0, px: 4, py: 1.2, fontWeight: 700, textTransform: 'none' }} variant="contained">
              Go to Cart
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  const handleNext = () => {
    if (activeStep === 0) {
      if (!shippingAddress.firstName || !shippingAddress.email || !shippingAddress.address1 || !shippingAddress.city) {
        setError('Please fill in all required fields');
        return;
      }
    }
    if (activeStep === 2) {
      if (!paymentInfo.cardNumber || !paymentInfo.cardExpiry || !paymentInfo.cardCvc) {
        setError('Please fill in payment details');
        return;
      }
      setLoading(true);
      setError('');
      setTimeout(() => {
        clearCart();
        router.push('/order-confirmation');
      }, 2000);
      return;
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => { setError(''); setActiveStep((prev) => prev - 1); };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: 'calc(100vh - 96px)', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton component={Link} href="/cart" sx={{ mr: 1, color: '#282828' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#282828', fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
            Checkout
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* ─── Main Content ─── */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Stepper */}
            <Box sx={{ bgcolor: '#fff', p: 3, mb: 3 }}>
              <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
                {STEPS.map((label) => (
                  <Step key={label}>
                    <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: '0.9rem' } }}>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>{error}</Alert>}

            <Box sx={{ bgcolor: '#fff', p: 3 }}>
              {/* Step 1: Shipping Address */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#282828', display: 'flex', alignItems: 'center' }}>
                    <LocalShippingIcon sx={{ mr: 1 }} /> Shipping Address
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField label="First Name" fullWidth required variant="outlined" size="small"
                        value={shippingAddress.firstName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField label="Last Name" fullWidth required variant="outlined" size="small"
                        value={shippingAddress.lastName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField label="Email" type="email" fullWidth required variant="outlined" size="small"
                        value={shippingAddress.email}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField label="Phone" fullWidth required variant="outlined" size="small"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField label="Address" fullWidth required variant="outlined" size="small"
                        value={shippingAddress.address1}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address1: e.target.value })}
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField label="Apt, Suite, etc (optional)" fullWidth variant="outlined" size="small"
                        value={shippingAddress.address2}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address2: e.target.value })}
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField label="City" fullWidth required variant="outlined" size="small"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField label="State" fullWidth required variant="outlined" size="small"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField label="ZIP Code" fullWidth required variant="outlined" size="small"
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                        sx={textFieldStyle}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Step 2: Delivery Method */}
              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#282828', display: 'flex', alignItems: 'center' }}>
                    <LocalShippingIcon sx={{ mr: 1 }} /> Delivery Method
                  </Typography>
                  <RadioGroup value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value as 'standard' | 'express')}>
                    <Box sx={{ p: 2, mb: 1.5, border: '1px solid', borderColor: deliveryMethod === 'standard' ? '#463AE8' : '#e0e0e0', cursor: 'pointer', bgcolor: deliveryMethod === 'standard' ? '#f9f7ff' : '#fff' }}>
                      <FormControlLabel value="standard" control={<Radio />} label={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <Box>
                            <Typography sx={{ fontWeight: 600, color: '#282828' }}>Standard Shipping</Typography>
                            <Typography variant="body2" color="#808080">5-7 business days</Typography>
                          </Box>
                          <Typography sx={{ fontWeight: 700, color: '#282828' }}>
                            {getSubtotal() >= 79 ? <Box component="span" sx={{ color: '#2E7D32' }}>FREE</Box> : '$5.99'}
                          </Typography>
                        </Box>
                      } sx={{ m: 0, width: '100%' }} />
                    </Box>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: deliveryMethod === 'express' ? '#463AE8' : '#e0e0e0', cursor: 'pointer', bgcolor: deliveryMethod === 'express' ? '#f9f7ff' : '#fff' }}>
                      <FormControlLabel value="express" control={<Radio />} label={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <Box>
                            <Typography sx={{ fontWeight: 600, color: '#282828' }}>Express Shipping</Typography>
                            <Typography variant="body2" color="#808080">2-3 business days</Typography>
                          </Box>
                          <Typography sx={{ fontWeight: 700, color: '#282828' }}>$14.99</Typography>
                        </Box>
                      } sx={{ m: 0, width: '100%' }} />
                    </Box>
                  </RadioGroup>
                </Box>
              )}

              {/* Step 3: Payment */}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#282828', display: 'flex', alignItems: 'center' }}>
                    <CreditCardIcon sx={{ mr: 1 }} /> Payment Details
                  </Typography>
                  <Alert severity="info" sx={{ mb: 3, borderRadius: 0, bgcolor: '#f0f4ff' }}>
                    <LockIcon sx={{ mr: 1, fontSize: '1rem' }} /> All transactions are secure and encrypted
                  </Alert>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField label="Cardholder Name" fullWidth required variant="outlined" size="small"
                        value={paymentInfo.cardName}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField label="Card Number" fullWidth required variant="outlined" size="small"
                        placeholder="1234 5678 9012 3456"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                          setPaymentInfo({ ...paymentInfo, cardNumber: v.replace(/(.{4})/g, '$1 ').trim() });
                        }}
                        inputProps={{ inputMode: 'numeric', maxLength: 19 }}
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField label="Expiry Date" fullWidth required variant="outlined" size="small"
                        placeholder="MM/YY"
                        value={paymentInfo.cardExpiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                          if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
                          setPaymentInfo({ ...paymentInfo, cardExpiry: v });
                        }}
                        inputProps={{ inputMode: 'numeric', maxLength: 5 }}
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField label="CVC" fullWidth required variant="outlined" size="small"
                        placeholder="123"
                        value={paymentInfo.cardCvc}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardCvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        inputProps={{ inputMode: 'numeric', maxLength: 4 }}
                        sx={textFieldStyle}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                {activeStep > 0 ? (
                  <Button variant="outlined" onClick={handleBack} sx={{ borderRadius: 0, textTransform: 'none', fontWeight: 600, borderColor: '#ccc', color: '#555', px: 3 }}>
                    Back
                  </Button>
                ) : <div />}
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading}
                  sx={{
                    bgcolor: '#463AE8',
                    borderRadius: 0,
                    px: 4,
                    fontWeight: 700,
                    minWidth: 160,
                    textTransform: 'none',
                    letterSpacing: '0.5px',
                    '&:hover': { bgcolor: '#3a2fd4' },
                    '&:disabled': { bgcolor: '#ccc' },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : activeStep === 2 ? (
                    `Pay $${getTotal().toFixed(2)}`
                  ) : (
                    'Continue'
                  )}
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* ─── Order Summary Sidebar ─── */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ bgcolor: '#fff', p: 3, position: 'sticky', top: 80 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#282828', fontSize: '1.1rem' }}>
                Order Summary
              </Typography>

              {/* Items */}
              <Box sx={{ maxHeight: 280, overflow: 'auto', mb: 2 }}>
                {items.map((item) => (
                  <Box key={item.cartItemId || item.id} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                    <Box
                      component="img" src={item.image} alt={item.name}
                      sx={{ width: 56, height: 56, bgcolor: '#f5f5f5', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.3, color: '#282828', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</Typography>
                      <Typography variant="caption" color="#808080">Qty: {item.quantity}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#282828', whiteSpace: 'nowrap' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ borderColor: '#e8e8e8', my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="#808080" sx={{ fontSize: '0.9rem' }}>Subtotal</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#282828' }}>${getSubtotal().toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="#808080" sx={{ fontSize: '0.9rem' }}>Shipping</Typography>
                <Typography sx={{ fontSize: '0.9rem' }}>
                  {getSubtotal() >= 79 ? (
                    <Box component="span" sx={{ color: '#2E7D32', fontWeight: 600 }}>FREE</Box>
                  ) : (
                    `$${getShippingCost().toFixed(2)}`
                  )}
                </Typography>
              </Box>
              {getCouponDiscount() > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography sx={{ color: '#2E7D32', fontSize: '0.9rem' }}>Discount</Typography>
                  <Typography sx={{ color: '#2E7D32', fontWeight: 600, fontSize: '0.9rem' }}>-${getCouponDiscount().toFixed(2)}</Typography>
                </Box>
              )}
              <Divider sx={{ borderColor: '#e8e8e8', my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#282828' }}>Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#463AE8' }}>
                  ${getTotal().toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 0,
    bgcolor: '#f9f9f9',
    '& fieldset': { borderColor: '#e0e0e0' },
    '&:hover fieldset': { borderColor: '#ccc' },
    '&.Mui-focused fieldset': { borderColor: '#463AE8' },
  },
};
