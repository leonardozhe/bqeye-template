'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import EmailIcon from '@mui/icons-material/Email';
import { useCartStore } from '@/lib/cartStore';

const COUPONS = [
  { code: 'SAVE5', label: '$5 OFF', desc: 'Orders over $39', bg: '#463AE8' },
  { code: 'SAVE10', label: '$10 OFF', desc: 'Orders over $69', bg: '#E91E63' },
  { code: 'SAVE20', label: '$20 OFF', desc: 'Orders over $99', bg: '#FF5722' },
];

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, getSubtotal, getShippingCost, getCouponDiscount, getTotal, applyCoupon } = useCartStore();
  const [showCouponPopup, setShowCouponPopup] = useState(false);
  const [, setCouponMsg] = useState('');

  const handleApplyCouponFromPopup = (code: string) => {
    const success = applyCoupon(code);
    if (success) {
      setCouponMsg(`Coupon ${code} applied!`);
    } else {
      setCouponMsg(`Coupon ${code} expired or not applicable`);
    }
    setShowCouponPopup(false);
  };

  // ─── Empty Cart ───
  if (items.length === 0) {
    return (
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: 'calc(100vh - 96px)', py: 8 }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Box sx={{ bgcolor: '#fff', p: 6, borderRadius: '8px' }}>
            <ShoppingBagIcon sx={{ fontSize: 72, color: '#e0e0e0', mb: 3 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#282828' }}>Your cart is empty</Typography>
            <Typography color="#808080" sx={{ mb: 4 }}>Browse our collection and add some items!</Typography>
            <Button component={Link} href="/" variant="contained" sx={{ bgcolor: '#463AE8', borderRadius: 2, px: 4, py: 1.2, fontWeight: 700, textTransform: 'none', letterSpacing: '0.5px', '&:hover': { bgcolor: '#3a2fd4' } }}>
              Start Shopping
            </Button>
          </Box>
        </Container>

        {/* Coupon popup even on empty cart */}
        <CouponPopup open={showCouponPopup} onClose={() => setShowCouponPopup(false)} onApply={handleApplyCouponFromPopup} />
      </Box>
    );
  }

  // ─── Cart with Items ───
  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: 'calc(100vh - 96px)', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        {/* Page Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton component={Link} href="/" sx={{ mr: 1, color: '#282828' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#282828', fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
            Shopping Cart
          </Typography>
          <Typography sx={{ ml: 1.5, color: '#808080', fontSize: '0.95rem' }}>
            ({items.reduce((sum, i) => sum + i.quantity, 0)} item{items.reduce((sum, i) => sum + i.quantity, 0) !== 1 ? 's' : ''})
          </Typography>
          {items.length > 1 && (
            <Button
              onClick={clearCart}
              sx={{ ml: 'auto', textTransform: 'none', fontSize: '0.85rem', fontWeight: 600, color: '#808080', px: 2, py: 0.5, '&:hover': { color: '#e53935', bgcolor: 'transparent' } }}
            >
              Clear Cart
            </Button>
          )}
        </Box>

        {/* ─── Coupon Banner ─── */}
        <Box
          sx={{
            mb: 3,
            p: { xs: 2, md: 2.5 },
            bgcolor: '#fff',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LocalOfferIcon sx={{ color: '#463AE8', fontSize: '1.3rem' }} />
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#282828' }}>
              Subscribe to receive the coupons below
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setShowCouponPopup(true)}
            sx={{
              bgcolor: '#463AE8',
              borderRadius: 2,
              px: 3,
              py: 0.8,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '0.85rem',
              '&:hover': { bgcolor: '#3a2fd4' },
            }}
          >
            Get Coupons
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* ─── Cart Items ─── */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {items.map((item) => (
                <Box
                  key={item.cartItemId || item.id}
                  sx={{
                    bgcolor: '#fff',
                    p: { xs: 2.5, md: 3 },
                    display: 'flex',
                    gap: { xs: 2, md: 3 },
                    alignItems: 'flex-start',
                    borderRadius: '8px',
                  }}
                >
                  {/* Product Image */}
                  <Box
                    component={Link}
                    href={`/products/${item.slug}`}
                    sx={{
                      width: { xs: 90, md: 120 },
                      height: { xs: 90, md: 120 },
                      borderRadius: '8px',
                      bgcolor: '#f5f5f5',
                      flexShrink: 0,
                      textDecoration: 'none',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>

                  {/* Product Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {/* Product name */}
                    <Link href={`/products/${item.slug}`} style={{ textDecoration: 'none' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#282828', mb: 0.25, lineHeight: 1.3, fontSize: '1.1rem', '&:hover': { color: '#463AE8' } }}>
                        {item.name}
                      </Typography>
                    </Link>

                    {/* Subtitle */}
                    <Typography variant="body2" sx={{ color: '#808080', mb: 1.5, fontSize: '0.875rem' }}>
                      {item.description.split('.')[0]}.
                    </Typography>

                    {/* Color chips */}
                    {item.colors && item.colors.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.75, mb: 1.5, flexWrap: 'wrap' }}>
                        {item.colors.map((color) => (
                          <Box
                            key={color.name}
                            sx={{
                              bgcolor: color.hex === '#000000' ? '#282828' : color.hex === '#FFFFFF' ? '#f5f5f5' : color.hex,
                              color: color.hex === '#000000' || color.hex === '#8B6914' ? '#fff' : '#282828',
                              border: color.hex === '#FFFFFF' ? '1px solid #e0e0e0' : 'none',
                              px: 2,
                              py: 0.35,
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            {color.name}
                          </Box>
                        ))}
                      </Box>
                    )}

                    {/* Size info */}
                    <Typography variant="body2" sx={{ color: '#282828', mb: 1.5, fontSize: '0.85rem', fontWeight: 500 }}>
                      Size: <Typography component="span" sx={{ fontWeight: 700 }}>Medium (51-40-145 mm)</Typography>
                      <Box component="span" sx={{ color: '#463AE8', ml: 1, cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>Size Chart</Box>
                    </Typography>

                    {/* Lens config summary */}
                    {item.lensConfig && (
                      <Box sx={{ mt: 1, mb: 1.5 }}>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {['Lens Configured', item.lensConfig.step4.lensIndex.label].map((tag) => (
                            <Box
                              key={tag}
                              sx={{
                                bgcolor: '#463AE8',
                                color: '#fff',
                                px: 1.5,
                                py: 0.3,
                                borderRadius: '20px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                              }}
                            >
                              {tag}
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Klarna / installment */}
                    <Typography variant="caption" sx={{ color: '#808080', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      4 interest-free instalments of ${(item.price / 4).toFixed(2)} with
                      <Box component="span" sx={{ bgcolor: '#FFE8F0', color: '#E91E63', px: 1, py: 0.1, borderRadius: '4px', fontWeight: 700, fontSize: '0.7rem' }}>
                        Klarna
                      </Box>
                    </Typography>
                  </Box>

                  {/* Right side: Price + Quantity + Remove */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1.5, minWidth: 100 }}>
                    {/* Price */}
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#282828', fontSize: '1.1rem' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <Typography variant="body2" sx={{ color: '#999', textDecoration: 'line-through', fontSize: '0.85rem' }}>
                          ${item.originalPrice.toFixed(2)}
                        </Typography>
                      )}
                    </Box>

                    {/* Quantity */}
                    <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: '20px', overflow: 'hidden' }}>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity - 1)}
                        sx={{ p: 0.5, color: '#555', '&:hover': { bgcolor: '#f5f5f5' }, '&:disabled': { color: '#ccc' } }}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ minWidth: 32, textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', color: '#282828', px: 0.5 }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity + 1)}
                        sx={{ p: 0.5, color: '#555', '&:hover': { bgcolor: '#f5f5f5' }, '&:disabled': { color: '#ccc' } }}
                        disabled={item.quantity >= 10}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* Remove */}
                    <IconButton
                      size="small"
                      onClick={() => removeItem(item.cartItemId || item.id)}
                      sx={{ color: '#ccc', p: 0.5, '&:hover': { color: '#e53935' }, mt: 'auto' }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* ─── Prescription upgrade banner ─── */}
            <Box sx={{ mt: 3, p: 3, bgcolor: '#fff', borderRadius: '8px', display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#282828', mb: 0.5, fontSize: '1.1rem' }}>
                  Prescription
                </Typography>
                <Typography variant="body2" color="#808080" sx={{ mb: 1.5 }}>
                  Upgrade your frames with prescription lenses
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  {['Progressive', 'Reading', 'Blue Light Blocking'].map((tag) => (
                    <Box
                      key={tag}
                      sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: '20px',
                        px: 2,
                        py: 0.5,
                        fontSize: '0.8rem',
                        color: '#282828',
                        cursor: 'pointer',
                        fontWeight: 500,
                        '&:hover': { borderColor: '#463AE8', color: '#463AE8' },
                      }}
                    >
                      {tag}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* ─── Order Summary ─── */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                bgcolor: '#fff',
                p: 3,
                borderRadius: '8px',
                position: 'sticky',
                top: 80,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#282828', fontSize: '1.1rem' }}>
                Order Summary
              </Typography>

              {/* Items in summary */}
              <Box sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
                {items.map((item) => (
                  <Box key={item.cartItemId || item.id} sx={{ display: 'flex', gap: 1.5, mb: 1.5, alignItems: 'center' }}>
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{ width: 48, height: 48, borderRadius: '6px', bgcolor: '#f5f5f5', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2, color: '#282828', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="#808080">Qty: {item.quantity}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#282828', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Gift box */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, p: 1.5, bgcolor: '#FFF8E1', borderRadius: '8px' }}>
                <CardGiftcardIcon sx={{ color: '#F59E0B', fontSize: '1.2rem' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#282828', fontSize: '0.85rem' }}>GIFT BOX</Typography>
                  <Typography variant="caption" color="#808080" sx={{ fontSize: '0.7rem' }}>Free with your order</Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor: '#e8e8e8', my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="#808080" sx={{ fontSize: '0.9rem' }}>Subtotal</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#282828' }}>${getSubtotal().toFixed(2)}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="#808080" sx={{ fontSize: '0.9rem' }}>Shipping</Typography>
                <Typography sx={{ fontSize: '0.9rem' }}>
                  {getSubtotal() >= 79 ? (
                    <Box component="span" sx={{ color: '#2E7D32', fontWeight: 600 }}>FREE</Box>
                  ) : (
                    `$${getShippingCost().toFixed(2)}`
                  )}
                </Typography>
              </Box>

              {getSubtotal() < 79 && (
                <Typography variant="caption" color="#808080" sx={{ display: 'block', mb: 1.5, fontSize: '0.8rem' }}>
                  Add ${(79 - getSubtotal()).toFixed(2)} more for free shipping!
                </Typography>
              )}

              {getCouponDiscount() > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ color: '#2E7D32', fontSize: '0.9rem' }}>
                    Coupon ({useCartStore.getState().couponCode})
                  </Typography>
                  <Typography sx={{ color: '#2E7D32', fontWeight: 600, fontSize: '0.9rem' }}>
                    -${getCouponDiscount().toFixed(2)}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ borderColor: '#e8e8e8', my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#282828' }}>Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#463AE8' }}>
                  ${getTotal().toFixed(2)}
                </Typography>
              </Box>

              {/* Checkout Button */}
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => router.push('/checkout')}
                sx={{
                  bgcolor: '#463AE8',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: 2,
                  textTransform: 'none',
                  letterSpacing: '0.5px',
                  '&:hover': { bgcolor: '#3a2fd4' },
                  mb: 2,
                }}
              >
                Proceed to Checkout
              </Button>

              {/* Coupon link */}
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Box
                  component="span"
                  onClick={() => setShowCouponPopup(true)}
                  sx={{ color: '#463AE8', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', '&:hover': { textDecoration: 'underline' } }}
                >
                  Subscribe to receive the coupons below
                </Box>
              </Box>

              {/* Payment icons */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mt: 1 }}>
                {['Visa', 'MC', 'PayPal', 'Amex'].map((pay) => (
                  <Box key={pay} sx={{ bgcolor: '#f5f5f5', color: '#999', px: 1.5, py: 0.4, borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600 }}>
                    {pay}
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* ─── Coupon Popup Modal ─── */}
      <CouponPopup open={showCouponPopup} onClose={() => setShowCouponPopup(false)} onApply={handleApplyCouponFromPopup} />
    </Box>
  );
}

// ─── Coupon Popup Component ───
function CouponPopup({ open, onClose, onApply }: { open: boolean; onClose: () => void; onApply: (code: string) => void }) {
  const [email, setEmail] = useState('');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
        },
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        {/* Top gradient banner */}
        <Box
          sx={{
            bgcolor: 'linear-gradient(135deg, #463AE8 0%, #7B68EE 100%)',
            background: 'linear-gradient(135deg, #463AE8 0%, #7B68EE 100%)',
            p: 3,
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Close button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: '#fff',
              bgcolor: 'rgba(255,255,255,0.2)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>
            Subscribe to receive the coupons below
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
            Enter your email address and get exclusive discounts
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 2 }}>
        {/* Email input */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: <EmailIcon sx={{ color: '#808080', mr: 1, fontSize: '1rem' }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '& fieldset': { borderColor: '#e0e0e0' },
                '&:hover fieldset': { borderColor: '#463AE8' },
                '&.Mui-focused fieldset': { borderColor: '#463AE8' },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={() => { if (email) { onClose(); } }}
            sx={{
              bgcolor: '#463AE8',
              borderRadius: '8px',
              px: 3,
              fontWeight: 700,
              textTransform: 'none',
              whiteSpace: 'nowrap',
              '&:hover': { bgcolor: '#3a2fd4' },
            }}
          >
            Subscribe
          </Button>
        </Box>

        {/* Coupon cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {COUPONS.map((coupon) => (
            <Box
              key={coupon.code}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: coupon.bg,
                  bgcolor: `${coupon.bg}08`,
                },
              }}
              onClick={() => onApply(coupon.code)}
            >
              {/* Coupon badge */}
              <Box
                sx={{
                  bgcolor: coupon.bg,
                  color: '#fff',
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  minWidth: 80,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>
                  {coupon.label}
                </Typography>
              </Box>

              {/* Coupon info */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#282828' }}>
                  {coupon.desc}
                </Typography>
                <Typography variant="caption" color="#808080">
                  Code: {coupon.code}
                </Typography>
              </Box>

              {/* Apply button */}
              <Button
                size="small"
                sx={{
                  bgcolor: coupon.bg,
                  color: '#fff',
                  borderRadius: '20px',
                  px: 2,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  '&:hover': { opacity: 0.9 },
                }}
              >
                Apply
              </Button>
            </Box>
          ))}
        </Box>

        {/* Bottom text */}
        <Typography variant="caption" color="#808080" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
          Limited-time offer. Terms and conditions apply.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
