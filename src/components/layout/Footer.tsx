'use client';

import Link from 'next/link';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';

// Zeelool footer link sections
const footerLinks = {
  about: [
    { label: 'About Us', href: '/about' },
    { label: 'ZEELOOL Blog', href: '/blog' },
    { label: 'Why Choose ZEELOOL', href: '/why-zeelool' },
    { label: 'Site Map', href: '/sitemap' },
    { label: 'Packaging', href: '/packaging' },
    { label: 'Write for Us', href: '/write-for-us' },
  ],
  service: [
    { label: 'Help Center', href: '/help' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Returns & Refunds', href: '/returns' },
    { label: 'Accessibility Statement', href: '/accessibility' },
  ],
  products: [
    { label: 'All Eyeglasses', href: '/products' },
    { label: 'All Sunglasses', href: '/products' },
    { label: 'All Lenses', href: '/products' },
    { label: 'All Accessories', href: '/products' },
  ],
  guides: [
    { label: 'How to Find Your Fit', href: '/guides/fit' },
    { label: 'How to Choose Eyeglasses', href: '/guides/choose' },
    { label: 'How to Measure Your Pupillary Distance', href: '/guides/pd' },
    { label: 'How to Fill Out Your Prescription', href: '/guides/prescription' },
    { label: 'How to Order', href: '/guides/order' },
  ],
  programs: [
    { label: 'Influencer Program', href: '/influencer' },
    { label: 'Affiliate Program', href: '/affiliate' },
    { label: 'ZEELOOL Rewards', href: '/rewards' },
    { label: 'Refer a Friend', href: '/refer' },
    { label: 'Education Discount', href: '/education' },
    { label: 'Ambassador', href: '/ambassador' },
  ],
};

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#282828',
        color: '#ffffff',
        pt: { xs: 6, md: 8 },
        pb: { xs: 3, md: 4 },
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        {/* ═══════════════════════════════════════════
            FOOTER LINK GRID — 5 columns (Zeelool style)
           ═══════════════════════════════════════════ */}
        <Grid container spacing={{ xs: 4, md: 3 }}>
          {/* About */}
          <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#ffffff', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              About
            </Typography>
            {footerLinks.about.map((link) => (
              <Box key={link.label} sx={{ mb: 1 }}>
                <Link href={link.href} style={{ color: '#ffffff99', textDecoration: 'none', fontSize: '0.8rem', display: 'block', lineHeight: 2 }}>
                  {link.label}
                </Link>
              </Box>
            ))}
          </Grid>

          {/* Customer Service */}
          <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#ffffff', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Customer Service
            </Typography>
            {footerLinks.service.map((link) => (
              <Box key={link.label} sx={{ mb: 1 }}>
                <Link href={link.href} style={{ color: '#ffffff99', textDecoration: 'none', fontSize: '0.8rem', display: 'block', lineHeight: 2 }}>
                  {link.label}
                </Link>
              </Box>
            ))}
          </Grid>

          {/* Products */}
          <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#ffffff', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Products
            </Typography>
            {footerLinks.products.map((link) => (
              <Box key={link.label} sx={{ mb: 1 }}>
                <Link href={link.href} style={{ color: '#ffffff99', textDecoration: 'none', fontSize: '0.8rem', display: 'block', lineHeight: 2 }}>
                  {link.label}
                </Link>
              </Box>
            ))}
          </Grid>

          {/* Guides */}
          <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#ffffff', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Guides
            </Typography>
            {footerLinks.guides.map((link) => (
              <Box key={link.label} sx={{ mb: 1 }}>
                <Link href={link.href} style={{ color: '#ffffff99', textDecoration: 'none', fontSize: '0.8rem', display: 'block', lineHeight: 2 }}>
                  {link.label}
                </Link>
              </Box>
            ))}
          </Grid>

          {/* Programs + Newsletter */}
          <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#ffffff', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Programs
            </Typography>
            {footerLinks.programs.map((link) => (
              <Box key={link.label} sx={{ mb: 1 }}>
                <Link href={link.href} style={{ color: '#ffffff99', textDecoration: 'none', fontSize: '0.8rem', display: 'block', lineHeight: 2 }}>
                  {link.label}
                </Link>
              </Box>
            ))}

            {/* Newsletter */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5, color: '#ffffff', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Newsletter
              </Typography>
              <Typography variant="body2" sx={{ color: '#ffffff99', mb: 1.5, fontSize: '0.8rem', lineHeight: 1.5 }}>
                Subscribe for exclusive deals and new arrivals.
              </Typography>
              <TextField
                placeholder="Enter your email"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  bgcolor: '#ffffff15',
                  borderRadius: '4px',
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '4px',
                    color: '#fff',
                    '& fieldset': { borderColor: '#ffffff33' },
                    '&:hover fieldset': { borderColor: '#ffffff66' },
                    '&.Mui-focused fieldset': { borderColor: '#ffffff99' },
                  },
                  '& input::placeholder': { color: '#ffffff66', fontSize: '0.8rem' },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#ffffff66', fontSize: '0.9rem' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                fullWidth
                size="small"
                sx={{
                  bgcolor: '#ffffff',
                  color: '#282828',
                  borderRadius: '4px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                  '&:hover': { bgcolor: '#f0f0f0' },
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* ═══════════════════════════════════════════
            BOTTOM BAR — copyright + legal links
           ═══════════════════════════════════════════ */}
        <Divider sx={{ borderColor: '#ffffff22', my: 4 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Left: copyright */}
          <Typography variant="body2" sx={{ color: '#ffffff66', fontSize: '0.75rem' }}>
            © {new Date().getFullYear()} ZEELOOL. All rights reserved.
          </Typography>

          {/* Center: payment icons placeholder */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {['Visa', 'Mastercard', 'PayPal', 'Amex', 'Klarna'].map((pay) => (
              <Box
                key={pay}
                sx={{
                  bgcolor: '#ffffff22',
                  color: '#ffffff99',
                  px: 1,
                  py: 0.3,
                  borderRadius: '3px',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                }}
              >
                {pay}
              </Box>
            ))}
          </Box>

          {/* Right: legal links */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {[
              { label: 'Zeelool Promise', href: '/promise' },
              { label: 'Privacy & Security', href: '/privacy' },
              { label: 'Terms & Conditions', href: '/terms' },
              { label: 'Klarna', href: '/klarna' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{ color: '#ffffff66', textDecoration: 'none', fontSize: '0.75rem' }}
              >
                {link.label}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
