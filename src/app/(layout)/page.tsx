// src/app/(layout)/page.tsx — HomePage matching zeelool.com layout
'use client';

import { Typography, Button, Box, Avatar, Grid } from '@mui/material';
import Container from '@mui/material/Container';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ProductCard from '@/components/product/ProductCard';
import CouponPopup from '@/components/common/CouponPopup';
import { IconSection, frameShapeIcons, lensTypeIcons } from '@/components/icons/EyewearIcons';
import { useNewArrivals, useBestSellers, useProducts } from '@/hooks/useProducts';
import { useState, useEffect } from 'react';

// ─── Zeelool-style deal cards ───
const bestDeals = [
  { title: 'Buy 1, Get 50% Off', desc: 'On additional frames', bg: 'linear-gradient(135deg, #463AE8, #2d1fb5)', href: '/products?deal=buy1get50' },
  { title: 'Free Shipping', desc: 'Orders over $39', bg: 'linear-gradient(135deg, #E91E63, #c2185b)', href: '/products?deal=free-shipping' },
  { title: 'New Customer $20 Off', desc: 'Use code: WELCOME20', bg: 'linear-gradient(135deg, #FF5722, #e64a19)', href: '/products?deal=new-customer' },
  { title: 'Refer a Friend', desc: 'Earn $10 each', bg: 'linear-gradient(135deg, #9C27B0, #7b1fa2)', href: '/refer' },
];

// ─── Category showcase ───
const categoryShowcase = [
  { name: 'Eyeglasses', image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=300&fit=crop', href: '/products?category=eyeglasses' },
  { name: 'Sunglasses', image: 'https://images.unsplash.com/photo-1592981712106-c44375939d7b?w=400&h=300&fit=crop', href: '/products?category=sunglasses' },
  { name: 'Colored Contacts', image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&h=300&fit=crop', href: '/products?category=colored-contacts' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=300&fit=crop', href: '/products?category=accessories' },
];

// ─── Eyewear Insights & Tips ───
const eyewearInsights = [
  {
    title: 'How to Choose the Right Frame Shape for Your Face',
    desc: 'Round, square, or cat-eye? Find the perfect match.',
    image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&h=400&fit=crop',
    href: '/guides/choose-frame',
    tag: 'Guide',
  },
  {
    title: 'Understanding Your Prescription: A Complete Guide',
    desc: 'Decode SPH, CYL, AXIS and more.',
    image: 'https://images.unsplash.com/photo-1592981712106-c44375939d7b?w=600&h=400&fit=crop',
    href: '/guides/prescription',
    tag: 'Tutorial',
  },
  {
    title: 'Blue Light Glasses: Do You Really Need Them?',
    desc: 'The science behind blue light filtering.',
    image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600&h=400&fit=crop',
    href: '/guides/blue-light',
    tag: 'Research',
  },
];

// ─── Shop by Look ───
const shopByLook = [
  { name: 'Natural', image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=200&h=200&fit=crop' },
  { name: 'Bold', image: 'https://images.unsplash.com/photo-1592981712106-c44375939d7b?w=200&h=200&fit=crop' },
  { name: 'Cosplay', image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=200&h=200&fit=crop' },
  { name: 'Party', image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=200&h=200&fit=crop&sat=50' },
  { name: 'Daily', image: 'https://images.unsplash.com/photo-1592981712106-c44375939d7b?w=200&h=200&fit=crop&sat=-40' },
];

export default function HomePage() {
  const { products: newArrivals, loading: newLoading } = useNewArrivals(8);
  const { products: bestSellers, loading: bestLoading } = useBestSellers(8);
  const { products: bestDealsProducts } = useProducts({ limit: 8, order: '-created_at' });

  // Coupon popup — show on first visit
  const [couponOpen, setCouponOpen] = useState(false);

  useEffect(() => {
    const hasClaimed = localStorage.getItem('bqeye_coupon_claimed');
    if (!hasClaimed) {
      setCouponOpen(true);
    }
  }, []);

  const handleCouponClaim = (code: string) => {
    localStorage.setItem('bqeye_coupon_claimed', code);
    // TODO: integrate with cartStore.applyCoupon(code)
  };

  return (
    <Box>
      {/* ─── Coupon Popup ─── */}
      <CouponPopup
        open={couponOpen}
        onClose={() => setCouponOpen(false)}
        onApply={handleCouponClaim}
      />

      {/* ═══════════════════════════════════════════
          HERO BANNER
         ═══════════════════════════════════════════ */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '300px', md: '500px' },
          background: 'linear-gradient(135deg, #463AE8 0%, #2d1fb5 50%, #1a0f6e 100%)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            right: '-10%',
            top: '-20%',
            width: '60%',
            height: '140%',
            borderRadius: '50%',
            background: 'rgba(199, 255, 87, 0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            left: '5%',
            bottom: '-30%',
            width: '40%',
            height: '80%',
            borderRadius: '50%',
            background: 'rgba(199, 255, 87, 0.05)',
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container alignItems="center" spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h2"
                sx={{ color: '#ffffff', fontWeight: 700, mb: 2, fontSize: { xs: '2rem', md: '3.5rem' }, lineHeight: 1.2 }}
              >
                Transform Your
                <br />
                <Box component="span" sx={{ color: '#C7FF57' }}>Eye Color</Box>
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffffcc', mb: 3, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                Premium colored contact lenses for every look.
                From natural to bold cosplay transformations.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained" size="large" href="/products" endIcon={<ArrowForwardIcon />}
                  sx={{ bgcolor: '#C7FF57', color: '#282828', '&:hover': { bgcolor: '#b8f04a' } }}
                >
                  Shop Now
                </Button>
                <Button
                  variant="outlined" size="large" href="/products?new=true"
                  sx={{ borderColor: '#ffffff44', color: '#ffffff', '&:hover': { borderColor: '#ffffff', bgcolor: '#ffffff11' } }}
                >
                  New Arrivals
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 6 }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&h=600&fit=crop"
                alt="Hero colored contacts"
                sx={{ width: '100%', maxWidth: 400, mx: 'auto', display: 'block', borderRadius: '50%', border: '4px solid rgba(199, 255, 87, 0.3)' }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════
          BEST DEALS — zeelool style deal cards
         ═══════════════════════════════════════════ */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalOfferIcon sx={{ color: '#463AE8' }} /> Best Deals
        </Typography>
        <Grid container spacing={2}>
          {bestDeals.map((deal) => (
            <Grid key={deal.title} size={{ xs: 6, md: 3 }}>
              <Box
                component="a"
                href={deal.href}
                sx={{
                  display: 'block',
                  p: 3,
                  borderRadius: '12px',
                  background: deal.bg,
                  color: '#fff',
                  textDecoration: 'none',
                  minHeight: 120,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>{deal.title}</Typography>
                <Typography variant="body2" sx={{ color: '#ffffffcc' }}>{deal.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ═══════════════════════════════════════════
          CATEGORY SHOWCASE
         ═══════════════════════════════════════════ */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Shop by Category</Typography>
        <Grid container spacing={2}>
          {categoryShowcase.map((cat) => (
            <Grid key={cat.name} size={{ xs: 6, sm: 3 }}>
              <Box
                component="a" href={cat.href}
                sx={{ display: 'block', borderRadius: '12px', overflow: 'hidden', textDecoration: 'none', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}
              >
                <Box component="img" src={cat.image} alt={cat.name} sx={{ width: '100%', paddingTop: '75%', objectFit: 'cover', display: 'block' }} />
                <Typography variant="body2" sx={{ textAlign: 'center', mt: 1, fontWeight: 500, color: '#282828' }}>{cat.name}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ═══════════════════════════════════════════
          NEW ARRIVALS
         ═══════════════════════════════════════════ */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon sx={{ color: '#463AE8' }} /> New Arrivals
          </Typography>
          <Button endIcon={<ArrowForwardIcon />} href="/products?new=true" sx={{ color: '#463AE8' }}>View All</Button>
        </Box>
        {newLoading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}><Typography color="#808080">Loading...</Typography></Box>
        ) : (
          <Grid container spacing={2}>
            {newArrivals.map((p) => (
              <Grid key={p.id} size={{ xs: 6, sm: 4, md: 3 }}>
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* ═══════════════════════════════════════════
          SHOP BY FRAME SHAPE — icons
         ═══════════════════════════════════════════ */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <IconSection title="Shop by Frame Shape" items={frameShapeIcons} itemsPerRow={9} />
      </Container>

      {/* ═══════════════════════════════════════════
          SHOP BY LENS TYPE — icons
         ═══════════════════════════════════════════ */}
      <Box sx={{ bgcolor: '#f5f6f7', py: { xs: 4, md: 6 } }}>
        <Container maxWidth="xl">
          <IconSection title="Shop by Lens Type" items={lensTypeIcons} itemsPerRow={6} />
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════
          PROMOTIONAL BANNER
         ═══════════════════════════════════════════ */}
      <Box sx={{ bgcolor: '#463AE8', py: { xs: 4, md: 6 }, px: 2 }}>
        <Container maxWidth="xl">
          <Grid container alignItems="center" spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h3" sx={{ color: '#C7FF57', fontWeight: 700, fontSize: { xs: '1.5rem', md: '2.5rem' }, mb: 1 }}>
                Summer Sale — Up to 40% Off
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffffcc', mb: 2 }}>
                Premium lenses at unbeatable prices. Free shipping on orders over $50.
              </Typography>
              <Button variant="contained" size="large" href="/products" sx={{ bgcolor: '#C7FF57', color: '#282828', '&:hover': { bgcolor: '#b8f04a' } }}>
                Shop the Sale
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: 'center' }}>
              <Typography variant="h1" sx={{ color: '#C7FF57', fontWeight: 700, fontSize: '6rem', lineHeight: 1 }}>40%</Typography>
              <Typography variant="body1" sx={{ color: '#ffffff' }}>OFF SELECTED LENSES</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════
          EYEWEAR INSIGHTS & TIPS
         ═══════════════════════════════════════════ */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <LightbulbIcon sx={{ color: '#463AE8' }} /> Eyewear Insights & Tips
        </Typography>
        <Grid container spacing={3}>
          {eyewearInsights.map((article) => (
            <Grid key={article.title} size={{ xs: 12, md: 4 }}>
              <Box
                component="a" href={article.href}
                sx={{ display: 'block', borderRadius: '12px', overflow: 'hidden', textDecoration: 'none', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' }, bgcolor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                <Box component="img" src={article.image} alt={article.title} sx={{ width: '100%', paddingTop: '60%', objectFit: 'cover', display: 'block' }} />
                <Box sx={{ p: 2 }}>
                  <Typography variant="caption" sx={{ color: '#463AE8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {article.tag}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#282828', mt: 0.5, mb: 0.5 }}>{article.title}</Typography>
                  <Typography variant="body2" color="#808080">{article.desc}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ═══════════════════════════════════════════
          BEST SELLERS
         ═══════════════════════════════════════════ */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Best Sellers</Typography>
          <Button endIcon={<ArrowForwardIcon />} href="/products?best=true" sx={{ color: '#463AE8' }}>View All</Button>
        </Box>
        {bestLoading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}><Typography color="#808080">Loading...</Typography></Box>
        ) : (
          <Grid container spacing={2}>
            {bestSellers.map((p) => (
              <Grid key={p.id} size={{ xs: 6, sm: 4, md: 3 }}>
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* ═══════════════════════════════════════════
          SHOP BY LOOK
         ═══════════════════════════════════════════ */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>Shop by Look</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 2, md: 4 }, flexWrap: 'wrap' }}>
          {shopByLook.map((look) => (
            <Box key={look.name} component="a" href="/products" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', gap: 1, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}>
              <Avatar src={look.image} alt={look.name} sx={{ width: { xs: 80, md: 100 }, height: { xs: 80, md: 100 }, border: '3px solid #f5f6f7' }} />
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#282828' }}>{look.name}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
