// src/app/(layout)/page.tsx — HomePage 1:1 matching zeelool.com
'use client';

import { useState, useEffect } from 'react';
import {
  Typography, Button, Box, Grid, Container,
  IconButton, Divider, Chip } from '@mui/material';
import Link from 'next/link';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PercentIcon from '@mui/icons-material/Percent';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import StarIcon from '@mui/icons-material/Star';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import RxIcon from '@/components/icons/RxIcon';
import GlassesMaintenanceIcon from '@/components/icons/GlassesMaintenanceIcon';
import CouponPopup from '@/components/common/CouponPopup';
import { useNewArrivals, useBestSellers, useProducts } from '@/hooks/useProducts';
import type { FrontendProduct } from '@/api/medusa-mappers';

// ─── Zeelool-style filter pills ───
const filterPills = [
  "Women's Glasses", "Men's Glasses", "Kids' Glasses",
  'Sunglasses', 'Blue-Light Blocking Glasses', 'Shop All Glasses',
];

// ─── Zeelool style categories ───
const styleCategories = [
  {
    title: 'Urban Chic',
    desc: 'Modern frames designed for effortless city style.',
    image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&h=450&fit=crop',
    href: '/products?style=urban-chic',
  },
  {
    title: 'Diva',
    desc: 'Bold, confidence-boosting frames designed to stand out.',
    image: 'https://images.unsplash.com/photo-1592981712106-c44375939d7b?w=600&h=450&fit=crop',
    href: '/products?style=diva',
  },
  {
    title: 'Nostalgia',
    desc: 'Retro-inspired eyewear with a timeless modern twist.',
    image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600&h=450&fit=crop',
    href: '/products?style=nostalgia',
  },
];

// ─── Shop by Style cards ───
const shopByStyle = [
  {
    title: 'Quiet Luxury',
    desc: 'Refined frames that speak softly with elevated style.',
    image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=500&h=500&fit=crop',
    href: '/products?style=quiet-luxury',
  },
  {
    title: 'Business Casual',
    desc: 'Polished everyday eyewear for work and beyond.',
    image: 'https://images.unsplash.com/photo-1592981712106-c44375939d7b?w=500&h=500&fit=crop',
    href: '/products?style=business-casual',
  },
  {
    title: 'Classic',
    desc: 'Timeless designs that never go out of style.',
    image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&h=500&fit=crop',
    href: '/products?style=classic',
  },
];

// ─── Frame shape icons (本地图片, 后续迁移到 R2) ───
const frameShapes = [
  { name: 'Aviator', img: '/icons/frame-shapes/aviator.png', href: '/goods-list/100' },
  { name: 'Cat-Eye', img: '/icons/frame-shapes/cat-eye.png', href: '/goods-list/101' },
  { name: 'Round', img: '/icons/frame-shapes/round.png', href: '/goods-list/97' },
  { name: 'Oval', img: '/icons/frame-shapes/oval.png', href: '/goods-list/94' },
  { name: 'Browline', img: '/icons/frame-shapes/browline.png', href: '/goods-list/99' },
  { name: 'Geometric', img: '/icons/frame-shapes/geometric.png', href: '/goods-list/131' },
  { name: 'Rectangle', img: '/icons/frame-shapes/rectangle.png', href: '/goods-list/95' },
  { name: 'Butterfly', img: '/icons/frame-shapes/butterfly.png', href: '/goods-list/247' },
  { name: 'Square', img: '/icons/frame-shapes/square.png', href: '/goods-list/96' },
];

// ─── Lens type icons (6 types, line art style) ───
const lensTypes = [
  { name: 'Single Vision', path: 'M8 24 A16 16 0 1 1 40 24 A16 16 0 1 1 8 24 M24 20 L24 28 M20 24 L28 24' },
  { name: 'Progressive', path: 'M8 24 A16 16 0 1 1 40 24 A16 16 0 1 1 8 24 M14 18 Q24 24 34 18 M14 24 Q24 30 34 24 M14 30 Q24 36 34 30' },
  { name: 'Reading', path: 'M8 24 A16 16 0 1 1 40 24 A16 16 0 1 1 8 24 M18 18 L30 18 M18 24 L28 24 M18 30 L26 30' },
  { name: 'Sunglasses', path: 'M4 18 Q4 8 20 8 Q24 8 24 18 L24 28 Q24 36 20 36 Q4 36 4 28Z M28 18 Q28 8 44 8 Q40 8 40 18 L40 28 Q40 36 36 36 Q28 36 28 28Z M24 22 L28 22' },
  { name: 'Blue Light', path: 'M8 24 A16 16 0 1 1 40 24 A16 16 0 1 1 8 24 M14 24 L20 24 M22 18 L22 30 M28 24 L34 24' },
  { name: 'Photochromic', path: 'M24 16 A8 8 0 1 1 24 32 A8 8 0 1 1 24 16 M24 4 L24 8 M24 40 L24 44 M4 24 L8 24 M40 24 L44 24 M10 10 L13 13 M35 35 L38 38 M10 38 L13 35 M35 10 L38 13' },
];

// ─── Eyewear Insights & Tips ───
const eyewearInsights = [
  {
    icon: 'frame',
    title: 'Learn about Frame',
    desc: 'High Bridge vs. Low Bridge Glasses: How to Find the Most Comfortable Fit',
    href: '/guides/bridge-fit',
  },
  {
    icon: 'lens',
    title: 'Learn about Lens',
    desc: 'Photochromic Lenses vs. Transitions®: What\'s the Real Difference',
    href: '/guides/photochromic',
  },
  {
    icon: 'rx',
    title: 'Learn about Prescription',
    desc: 'What Does "ADD" Mean on Your Eyeglass Prescription',
    href: '/guides/prescription',
  },
  {
    icon: 'maintenance',
    title: 'Learn about Maintenance',
    desc: 'How to Prevent and Remove Glasses Marks on Your Nose',
    href: '/guides/maintenance',
  },
];

// ─── Product Card (Zeelool style) ───
function ZeeloolProductCard({ product }: { product: FrontendProduct }) {
  const price = product.variants?.[0]?.price || 0;
  const originalPrice = price * 1.3;
  const discount = Math.round((1 - price / originalPrice) * 100);

  return (
    <Box
      component="a"
      href={`/products/${product.handle}`}
      sx={{
        display: 'block',
        textDecoration: 'none',
        minWidth: 240,
        flexShrink: 0,
      }}
    >
      {/* Image area */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: '#F2F2F2',
          pt: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          mb: 1.5,
        }}
      >
        <Box
          component="img"
          src={product.thumbnail || product.images?.[0] || ''}
          alt={product.title}
          sx={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            objectFit: 'contain',
            p: 2,
          }}
        />
        {/* Wishlist heart */}
        <IconButton
          size="small"
          sx={{
            position: 'absolute',
            top: 8, right: 8,
            bgcolor: 'rgba(255,255,255,0.8)',
            '&:hover': { bgcolor: '#fff' },
          }}
          onClick={(e) => e.preventDefault()}
        >
          <FavoriteBorderIcon sx={{ fontSize: 18 }} />
        </IconButton>
        {/* NEW badge */}
        {product.isNew && (
          <Box
            sx={{
              position: 'absolute',
              top: 8, left: 8,
              bgcolor: '#000',
              color: '#fff',
              px: 1, py: 0.3,
              borderRadius: '4px',
              fontSize: '0.65rem',
              fontWeight: 700,
            }}
          >
            NEW
          </Box>
        )}
      </Box>

      {/* Product info */}
      <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A1A1A', mb: 0.5 }}>
        {product.title}
      </Typography>

      {/* Price */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
          ${price.toFixed(2)}
        </Typography>
        {discount > 0 && (
          <Typography variant="caption" sx={{ color: '#999', textDecoration: 'line-through' }}>
            ${originalPrice.toFixed(2)}
          </Typography>
        )}
      </Box>

      {/* Color swatches */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {['#463AE8', '#8B7355', '#D4A574', '#333'].map((color, i) => (
          <Box
            key={i}
            sx={{
              width: 14, height: 14,
              borderRadius: '50%',
              bgcolor: color,
              border: i === 0 ? '2px solid #463AE8' : '1px solid #ddd',
              boxSizing: 'border-box',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

// ─── Section Header (with View More button) ───
function SectionHeader({ title }: { title: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A1A1A' }}>
        {title}
      </Typography>
      <Button
        endIcon={<ChevronRightIcon />}
        sx={{
          color: '#1A1A1A',
          border: '1px solid #1A1A1A',
          borderRadius: '999px',
          px: 2.5, py: 0.8,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          '&:hover': { bgcolor: '#1A1A1A', color: '#fff' },
        }}
      >
        View More
      </Button>
    </Box>
  );
}

// ─── MAIN PAGE ───
export default function HomePage() {
  const { products: newArrivals, loading: newLoading } = useNewArrivals(8);
  const { products: bestSellers, loading: bestLoading } = useBestSellers(8);

  // Coupon popup
  const [couponOpen, setCouponOpen] = useState(false);
  useEffect(() => {
    const claimed = localStorage.getItem('bqeye_coupon_claimed');
    if (!claimed) setCouponOpen(true);
  }, []);

  return (
    <Box sx={{ bgcolor: '#fff' }}>
      {/* ─── Coupon Popup ─── */}
      <CouponPopup open={couponOpen} onClose={() => setCouponOpen(false)} onApply={() => {}} />

      {/* ═══════════════════════════════════════════
          HERO BANNER — Zeelool summer style
         ═══════════════════════════════════════════ */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '280px', md: '480px' },
          background: 'linear-gradient(135deg, #B3E5FC 0%, #E1F5FE 30%, #FCE4EC 70%, #FFF3E0 100%)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <Box sx={{ position: 'absolute', top: '-5%', right: '-5%', width: '30%', opacity: 0.15, fontSize: '120px', transform: 'rotate(-15deg)' }}>🌴</Box>
        <Box sx={{ position: 'absolute', bottom: '-5%', left: '-2%', width: '20%', opacity: 0.15, fontSize: '80px', transform: 'rotate(10deg)' }}>🌿</Box>

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container alignItems="center" spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: '2.5rem', md: '3.5rem' }, color: '#1A1A1A', mb: 2, lineHeight: 1.1 }}>
                Summer
                <br />
                in Style
              </Typography>
              <Typography variant="body1" sx={{ color: '#555', mb: 3, fontSize: '1.1rem' }}>
                Light, effortless frames for every summer plan
              </Typography>
              <Button
                variant="contained" size="large" href="/products"
                sx={{
                  bgcolor: '#1A1A1A', color: '#fff', borderRadius: '999px',
                  px: 4, py: 1.2, textTransform: 'none', fontWeight: 700, fontSize: '1rem',
                  '&:hover': { bgcolor: '#333' },
                }}
              >
                Shop Now
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Box component="img" src="https://images.unsplash.com/photo-1574169208507-84376144848b?w=350&h=350&fit=crop" alt="Summer glasses" sx={{ maxWidth: { xs: '40%', md: 280 }, borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }} />
              <Box component="img" src="https://images.unsplash.com/photo-1592981712106-c44375939d7b?w=350&h=350&fit=crop" alt="Summer glasses" sx={{ maxWidth: { xs: '40%', md: 280 }, borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', display: { xs: 'none', md: 'block' } }} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════
          FEATURES / TRUST BAR
         ═══════════════════════════════════════════ */}
      <Box sx={{ bgcolor: '#F8F9FA', py: 4 }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {[
              { icon: <PercentIcon sx={{ fontSize: 32, color: '#4CAF50' }} />, title: 'Best Deals', sub: 'Limited Time & Stock' },
              { icon: <LocalOfferIcon sx={{ fontSize: 32, color: '#4CAF50' }} />, title: 'All Coupons', sub: 'Total Value $50' },
              { icon: <AssignmentReturnIcon sx={{ fontSize: 32, color: '#4CAF50' }} />, title: '30-Day', sub: 'Returns & Exchanges' },
              { icon: <AccountBalanceWalletIcon sx={{ fontSize: 32, color: '#4CAF50' }} />, title: 'FSA/HSA', sub: 'Eligible' },
            ].map((f) => (
              <Grid key={f.title} size={{ xs: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>{f.icon}</Box>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#1A1A1A' }}>{f.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#808080', fontSize: '0.8rem' }}>{f.sub}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════
          FRAME YOUR VIBE — Filter pills + style cards
         ═══════════════════════════════════════════ */}
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
        {/* Section heading */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1A1A1A', mb: 1 }}>
            Frame Your Vibe
          </Typography>
          <Typography variant="body1" sx={{ color: '#555' }}>
            Eyewear is the finishing touch of an outfit.
          </Typography>
        </Box>

        {/* Filter pills */}
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1.5, mb: 6 }}>
          {filterPills.map((pill) => (
            <Chip
              key={pill}
              label={pill}
              component="a"
              href="/products"
              clickable
              sx={{
                borderRadius: '999px',
                px: 2,
                border: '1px solid #1A1A1A',
                bgcolor: '#fff',
                color: '#1A1A1A',
                fontWeight: 500,
                fontSize: '0.875rem',
                '&:hover': { bgcolor: '#1A1A1A', color: '#fff' },
              }}
            />
          ))}
        </Box>

        {/* Style Starts Here */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, gap: 3, mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#1A1A1A', whiteSpace: 'nowrap' }}>
            Style Starts Here
          </Typography>
          <Typography variant="body1" sx={{ color: '#555', maxWidth: 500 }}>
            From everyday essentials to standout statement pieces, discover frames designed to match your vibe, elevate your style, and complete every look.
          </Typography>
        </Box>

        {/* 3 Style category cards */}
        <Grid container spacing={3}>
          {styleCategories.map((cat) => (
            <Grid key={cat.title} size={{ xs: 12, md: 4 }}>
              <Box
                component="a" href={cat.href}
                sx={{ display: 'block', textDecoration: 'none' }}
              >
                <Box
                  component="img" src={cat.image} alt={cat.title}
                  sx={{
                    width: '100%', pt: '75%', objectFit: 'cover',
                    borderRadius: '8px', display: 'block',
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A1A1A', mt: 1.5, mb: 0.5 }}>
                  {cat.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555' }}>
                  {cat.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ═══════════════════════════════════════════
          SHOP BY STYLE (3 category cards)
         ═══════════════════════════════════════════ */}
      <Container maxWidth="xl" sx={{ pb: { xs: 4, md: 6 } }}>
        <Grid container spacing={3}>
          {shopByStyle.map((s) => (
            <Grid key={s.title} size={{ xs: 12, md: 4 }}>
              <Box component="a" href={s.href} sx={{ display: 'block', textDecoration: 'none' }}>
                <Box
                  component="img" src={s.image} alt={s.title}
                  sx={{ width: '100%', pt: '100%', objectFit: 'cover', borderRadius: '8px', display: 'block' }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A1A1A', mt: 1.5, mb: 0.5 }}>{s.title}</Typography>
                <Typography variant="body2" sx={{ color: '#555' }}>{s.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ═══════════════════════════════════════════
          NEW ARRIVALS — horizontal scrollable
         ═══════════════════════════════════════════ */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <SectionHeader title="New Arrivals" />
        {newLoading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}><Typography color="#808080">Loading...</Typography></Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              overflowX: 'auto',
              pb: 2,
              '&::-webkit-scrollbar': { height: 4 },
              '&::-webkit-scrollbar-thumb': { bgcolor: '#ddd', borderRadius: 2 },
            }}
          >
            {newArrivals.map((p) => (
              <ZeeloolProductCard key={p.id} product={p} />
            ))}
          </Box>
        )}
      </Container>

      {/* ═══════════════════════════════════════════
          SHOP BY FRAME SHAPE — 9 icon grid
         ═══════════════════════════════════════════ */}
      <Box sx={{ bgcolor: '#F5F5F5', py: { xs: 5, md: 8 } }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: { xs: 11, md: '46px' }, px: 1.75 }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: '#282828',
                fontSize: { xs: '24px', md: '28px', lg: '32px', xl: '36px', '2xl': '40px' },
                lineHeight: { xs: '29px', md: '34px', lg: '38px', xl: '43px', '2xl': '48px' },
              }}
            >
              Shop by Frame Shape
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                color: '#282828',
                fontSize: { xs: '12px', md: '13px', lg: '14px', xl: '15px', '2xl': '16px' },
                lineHeight: { xs: '14px', md: '15px', lg: '17px', xl: '18px', '2xl': '19px' },
                mt: { xs: '6px', md: '6px', lg: '7px', xl: '7px', '2xl': '8px' },
              }}
            >
              Choose the perfect frames for your face or your style.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(3, 1fr)',
                sm: 'repeat(5, 1fr)',
                md: 'repeat(9, 1fr)',
              },
              gap: { xs: 2, md: 3 },
            }}
          >
            {frameShapes.map((shape) => (
              <Box
                key={shape.name}
                component="a"
                href={shape.href}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textDecoration: 'none',
                  gap: { xs: 2.5, md: 3 },
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <Box
                  component="img"
                  src={shape.img}
                  alt={shape.name}
                  sx={{
                    width: { xs: '70px', md: '90px', xl: '110px' },
                    height: 'auto',
                    objectFit: 'cover',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 400, color: '#282828', fontSize: { xs: '12px', md: '15px', xl: '16px' }, textAlign: 'center' }}
                >
                  {shape.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════
          BEST SELLERS
         ═══════════════════════════════════════════ */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <SectionHeader title="Best Sellers" />
        {bestLoading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}><Typography color="#808080">Loading...</Typography></Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              overflowX: 'auto',
              pb: 2,
              '&::-webkit-scrollbar': { height: 4 },
              '&::-webkit-scrollbar-thumb': { bgcolor: '#ddd', borderRadius: 2 },
            }}
          >
            {bestSellers.map((p) => (
              <ZeeloolProductCard key={p.id} product={p} />
            ))}
          </Box>
        )}
      </Container>

      {/* ═══════════════════════════════════════════
          SUMMER BANNER
         ═══════════════════════════════════════════ */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '200px', md: '300px' },
          background: 'linear-gradient(135deg, #87CEEB 0%, #5DADE2 50%, #2E86C1 100%)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Beach scene simulation */}
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to top, #F5DEB3, transparent)' }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#fff', fontSize: { xs: '2rem', md: '3rem' }, mb: 1 }}>
                Summer
                <br />
                Sale
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffffcc', mb: 3 }}>
                Up to 80% off selected frames and lenses
              </Typography>
              <Button
                variant="contained" size="large" href="/products?sale=true"
                sx={{
                  bgcolor: '#fff', color: '#1A1A1A', borderRadius: '999px',
                  px: 4, py: 1.2, textTransform: 'none', fontWeight: 700,
                  '&:hover': { bgcolor: '#f0f0f0' },
                }}
              >
                Shop the Sale
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box component="img" src="https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=400&fit=crop" alt="Summer sale" sx={{ maxWidth: 300, borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════
          SHOP BY LENS TYPE — 6 icon grid
         ═══════════════════════════════════════════ */}
      <Box sx={{ bgcolor: '#F5F5F5', py: { xs: 5, md: 8 } }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: { xs: 11, md: '46px' }, px: 1.75 }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: '#282828',
                fontSize: { xs: '24px', md: '28px', lg: '32px', xl: '36px', '2xl': '40px' },
                lineHeight: { xs: '29px', md: '34px', lg: '38px', xl: '43px', '2xl': '48px' },
              }}
            >
              Shop by Lens Type
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                color: '#282828',
                fontSize: { xs: '12px', md: '13px', lg: '14px', xl: '15px', '2xl': '16px' },
                lineHeight: { xs: '14px', md: '15px', lg: '17px', xl: '18px', '2xl': '19px' },
                mt: { xs: '6px', md: '6px', lg: '7px', xl: '7px', '2xl': '8px' },
              }}
            >
              Find the right lenses for your vision needs.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(6, 1fr)' },
              gap: { xs: 2, md: 3 },
            }}
          >
            {lensTypes.map((lens) => (
              <Box
                key={lens.name}
                component="a"
                href={`/products?lens=${lens.name.toLowerCase().replace(/\s+/g, '-')}`}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textDecoration: 'none',
                  gap: 1.5,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path
                    d={lens.path}
                    stroke="#1A1A1A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <Typography variant="caption" sx={{ fontWeight: 400, color: '#333', fontSize: '0.75rem', textAlign: 'center' }}>
                  {lens.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════
          EYEWEAR INSIGHTS & TIPS — 4 info cards
         ═══════════════════════════════════════════ */}
      <Box sx={{ bgcolor: '#F0EBF8', py: { xs: 5, md: 8 } }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: { xs: 11, md: '46px' }, px: 1.75 }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: '#282828',
                fontSize: { xs: '24px', md: '28px', lg: '32px', xl: '36px', '2xl': '40px' },
                lineHeight: { xs: '29px', md: '34px', lg: '38px', xl: '43px', '2xl': '48px' },
              }}
            >
              Eyewear Insights & Tips
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                color: '#282828',
                fontSize: { xs: '12px', md: '13px', lg: '14px', xl: '15px', '2xl': '16px' },
                lineHeight: { xs: '14px', md: '15px', lg: '17px', xl: '18px', '2xl': '19px' },
                mt: { xs: '6px', md: '6px', lg: '7px', xl: '7px', '2xl': '8px' },
                maxWidth: { xs: '100%', md: '600px' },
                mx: 'auto',
              }}
            >
              Gain valuable knowledge and practical tips to enhance your eyewear experience, ensuring comfort, style, and lasting performance.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {eyewearInsights.map((article) => (
              <Grid key={article.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <Box
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: '12px',
                    p: 3,
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 64, height: 64,
                      borderRadius: '50%',
                      bgcolor: '#fff',
                      border: '1px solid #e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {article.icon === 'frame' && <RemoveRedEyeIcon sx={{ fontSize: 28, color: '#1A1A1A' }} />}
                    {article.icon === 'lens' && <NewReleasesIcon sx={{ fontSize: 28, color: '#1A1A1A' }} />}
                    {article.icon === 'rx' && <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#1A1A1A' }}>Rx</Typography>}
                    {article.icon === 'maintenance' && <AssignmentReturnIcon sx={{ fontSize: 28, color: '#1A1A1A' }} />}
                  </Box>

                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#1A1A1A', mb: 1 }}>
                    {article.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', mb: 2, lineHeight: 1.6, minHeight: 40 }}>
                    {article.desc}
                  </Typography>
                  <Button
                    endIcon={<ChevronRightIcon />}
                    href={article.href}
                    sx={{
                      color: '#1A1A1A',
                      border: '1px solid #1A1A1A',
                      borderRadius: '999px',
                      px: 2, py: 0.6,
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: '0.8rem',
                      '&:hover': { bgcolor: '#1A1A1A', color: '#fff' },
                    }}
                  >
                    Learn More
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
