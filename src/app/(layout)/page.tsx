'use client';

import { Typography, Button, Box, Avatar , Grid } from '@mui/material';
import Container from '@mui/material/Container';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ProductCard from '@/components/product/ProductCard';
import { useNewArrivals, useBestSellers } from '@/hooks/useProducts';

export default function HomePage() {
  const { products: newArrivals } = useNewArrivals(4);
  const { products: bestSellers } = useBestSellers(4);

  const categoryShowcase = [
  { name: 'Blue Contacts', image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=300&fit=crop', href: '/products?category=colored-contacts' },
  { name: 'Cosplay Lenses', image: 'https://images.unsplash.com/photo-1592981712106-c44375939d7b?w=400&h=300&fit=crop', href: '/products?category=cosplay' },
  { name: 'Natural Brown', image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&h=300&fit=crop', href: '/products?category=colored-contacts' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=300&fit=crop', href: '/products?category=accessories' },
  { name: 'Red Lenses', image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=300&fit=crop&sat=50', href: '/products?category=cosplay' },
  { name: 'Gray Contacts', image: 'https://images.unsplash.com/photo-1592981712106-c44375939d7b?w=400&h=300&fit=crop&sat=-80', href: '/products?category=colored-contacts' },
];

const shopByLook = [
  { name: 'Natural', image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=200&h=200&fit=crop' },
  { name: 'Bold', image: 'https://images.unsplash.com/photo-1592981712106-c44375939d7b?w=200&h=200&fit=crop' },
  { name: 'Cosplay', image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=200&h=200&fit=crop' },
  { name: 'Party', image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=200&h=200&fit=crop&sat=50' },
  { name: 'Daily', image: 'https://images.unsplash.com/photo-1592981712106-c44375939d7b?w=200&h=200&fit=crop&sat=-40' },
];

  return (
    <Box>
      {/* Hero Banner */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '300px', md: '500px' },
          background: 'linear-gradient(135deg, #463AE8 0%, #2d1fb5 50%, #1a0f6e 100%)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden' }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            right: '-10%',
            top: '-20%',
            width: '60%',
            height: '140%',
            borderRadius: '50%',
            background: 'rgba(199, 255, 87, 0.1)' }}
        />
        <Box
          sx={{
            position: 'absolute',
            left: '5%',
            bottom: '-30%',
            width: '40%',
            height: '80%',
            borderRadius: '50%',
            background: 'rgba(199, 255, 87, 0.05)' }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container alignItems="center" spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h2"
                sx={{
                  color: '#ffffff',
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '3.5rem' },
                  lineHeight: 1.2 }}
              >
                Transform Your
                <br />
                <Box component="span" sx={{ color: '#C7FF57' }}>Eye Color</Box>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#ffffffcc',
                  mb: 3,
                  fontSize: { xs: '1rem', md: '1.25rem' } }}
              >
                Premium colored contact lenses for every look.
                From natural to bold cosplay transformations.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  href="/products"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: '#C7FF57',
                    color: '#282828',
                    '&:hover': { bgcolor: '#b8f04a' } }}
                >
                  Shop Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  href="/?section=new"
                  sx={{
                    borderColor: '#ffffff44',
                    color: '#ffffff',
                    '&:hover': { borderColor: '#ffffff', bgcolor: '#ffffff11' } }}
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
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  mx: 'auto',
                  display: 'block',
                  borderRadius: '50%',
                  border: '4px solid rgba(199, 255, 87, 0.3)' }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Category Showcase */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          Shop by Category
        </Typography>
        <Grid container spacing={2}>
          {categoryShowcase.map((cat) => (
            <Grid key={cat.name} size={{ xs: 6, sm: 4, md: 2 }}>
              <Box
                component="a"
                href={cat.href}
                sx={{
                  display: 'block',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' } }}
              >
                <Box
                  component="img"
                  src={cat.image}
                  alt={cat.name}
                  sx={{
                    width: '100%',
                    paddingTop: '100%',
                    objectFit: 'cover',
                    display: 'block' }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: 'center',
                    mt: 1,
                    fontWeight: 500,
                    color: '#282828' }}
                >
                  {cat.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* New Arrivals */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            New Arrivals
          </Typography>
          <Button
            endIcon={<ArrowForwardIcon />}
            href="/?section=new"
            sx={{ color: '#463AE8' }}
          >
            View All
          </Button>
        </Box>
        <Grid container spacing={2}>
          {newArrivals.map((product) => (
            <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3 }}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Promotional Banner */}
      <Box
        sx={{
          bgcolor: '#463AE8',
          py: { xs: 4, md: 6 },
          px: 2 }}
      >
        <Container maxWidth="xl">
          <Grid container alignItems="center" spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography
                variant="h3"
                sx={{
                  color: '#C7FF57',
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', md: '2.5rem' },
                  mb: 1 }}
              >
                Summer Sale — Up to 40% Off
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffffcc', mb: 2 }}>
                Premium lenses at unbeatable prices. Free shipping on orders over $50.
              </Typography>
              <Button
                variant="contained"
                size="large"
                href="/products"
                sx={{
                  bgcolor: '#C7FF57',
                  color: '#282828',
                  '&:hover': { bgcolor: '#b8f04a' } }}
              >
                Shop the Sale
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: 'center' }}>
              <Typography variant="h1" sx={{ color: '#C7FF57', fontWeight: 700, fontSize: '6rem', lineHeight: 1 }}>
                40%
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff' }}>
                OFF SELECTED LENSES
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Best Sellers */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Best Sellers
          </Typography>
          <Button
            endIcon={<ArrowForwardIcon />}
            href="/?section=best"
            sx={{ color: '#463AE8' }}
          >
            View All
          </Button>
        </Box>
        <Grid container spacing={2}>
          {bestSellers.map((product) => (
            <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3 }}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Shop by Look */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
          Shop by Look
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 2, md: 4 }, flexWrap: 'wrap' }}>
          {shopByLook.map((look) => (
            <Box
              key={look.name}
              component="a"
              href="/products"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                gap: 1,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.05)' } }}
            >
              <Avatar
                src={look.image}
                alt={look.name}
                sx={{
                  width: { xs: 80, md: 100 },
                  height: { xs: 80, md: 100 },
                  border: '3px solid #f5f6f7' }}
              />
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#282828' }}>
                {look.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
