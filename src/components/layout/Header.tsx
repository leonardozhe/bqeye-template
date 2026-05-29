'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box, Typography, IconButton, Badge, Drawer, List, ListItem,
  ListItemButton, ListItemText, Divider, Container,
  Paper, Grid, TextField, Button,
  Dialog, DialogContent, DialogTitle
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { useCartStore } from '@/lib/cartStore';
import { medusaProducts } from '@/api/medusa';

// Zeelool nav tabs — exact names
const mainTabs = [
  { label: 'Eyeglasses', href: '/products' },
  { label: 'Sunglasses', href: '/products' },
  { label: 'Lenses', href: '/products' },
  { label: 'Featured', href: '/' },
  { label: 'New Arrivals', href: '/?section=new' },
  { label: 'PG Collection', href: '/?section=pg' },
];

const topBarMessages = [
  'Free standard shipping on orders over $39.00',
  'Buy 1, get 50% off on additional frames',
];

// ─── Mega Menu Data ───
const megaMenuData: Record<string, { title: string; items: { label: string; href: string }[] }[]> = {
  Eyeglasses: [
    { title: 'By Gender', items: [
      { label: "Women's Eyeglasses", href: '/products?gender=women' },
      { label: "Men's Eyeglasses", href: '/products?gender=men' },
      { label: "Kids' Eyeglasses", href: '/products?gender=kids' },
    ]},
    { title: 'By Shape', items: [
      { label: 'Square', href: '/products?shape=square' },
      { label: 'Cat-Eye', href: '/products?shape=cat-eye' },
      { label: 'Round', href: '/products?shape=round' },
      { label: 'Rectangle', href: '/products?shape=rectangle' },
      { label: 'Butterfly', href: '/products?shape=butterfly' },
      { label: 'Aviator', href: '/products?shape=aviator' },
      { label: 'Browline', href: '/products?shape=browline' },
      { label: 'Geometric', href: '/products?shape=geometric' },
      { label: 'Oval', href: '/products?shape=oval' },
    ]},
    { title: 'By Material', items: [
      { label: 'Acetate', href: '/products?material=acetate' },
      { label: 'Plastic', href: '/products?material=plastic' },
      { label: 'Metal', href: '/products?material=metal' },
      { label: 'Titanium', href: '/products?material=titanium' },
      { label: 'TR90', href: '/products?material=tr90' },
      { label: 'Nylon', href: '/products?material=nylon' },
    ]},
    { title: 'By Prescription', items: [
      { label: 'Single Vision', href: '/products?rx=single' },
      { label: 'Reading Glasses', href: '/products?rx=reading' },
      { label: 'Non-Prescription', href: '/products?rx=none' },
      { label: 'Progressive', href: '/products?rx=progressive' },
      { label: 'Sunglasses Prescription', href: '/products?rx=sun-rx' },
    ]},
    { title: 'By Size', items: [
      { label: 'Narrow', href: '/products?size=narrow' },
      { label: 'Medium', href: '/products?size=medium' },
      { label: 'Wide', href: '/products?size=wide' },
      { label: 'Extra Wide', href: '/products?size=extra-wide' },
      { label: 'Custom', href: '/products?size=custom' },
    ]},
  ],
  Sunglasses: [
    { title: 'By Gender', items: [
      { label: "Women's Sunglasses", href: '/products?gender=women&type=sun' },
      { label: "Men's Sunglasses", href: '/products?gender=men&type=sun' },
    ]},
    { title: 'By Shape', items: [
      { label: 'Round', href: '/products?shape=round&type=sun' },
      { label: 'Square', href: '/products?shape=square&type=sun' },
      { label: 'Oval', href: '/products?shape=oval&type=sun' },
      { label: 'Aviator', href: '/products?shape=aviator&type=sun' },
      { label: 'Cat-Eye', href: '/products?shape=cat-eye&type=sun' },
      { label: 'Butterfly', href: '/products?shape=butterfly&type=sun' },
    ]},
    { title: 'By Lens Type', items: [
      { label: 'Prescription', href: '/products?type=rx-sun' },
      { label: 'Non-Prescription', href: '/products?type=non-rx-sun' },
      { label: 'Polarized', href: '/products?type=polarized' },
    ]},
    { title: 'By Material', items: [
      { label: 'Metal', href: '/products?material=metal&type=sun' },
      { label: 'Acetate', href: '/products?material=acetate&type=sun' },
      { label: 'TR90', href: '/products?material=tr90&type=sun' },
    ]},
  ],
  Lenses: [
    { title: 'Lens Type', items: [
      { label: 'Single Vision', href: '/products?lens=sv' },
      { label: 'Progressive', href: '/products?lens=progressive' },
      { label: 'Reading', href: '/products?lens=reading' },
    ]},
    { title: 'Lens Features', items: [
      { label: 'Blue Light Blocking', href: '/products?feature=blue-light' },
      { label: 'Photochromic', href: '/products?feature=photochromic' },
      { label: 'Polarized', href: '/products?feature=polarized' },
      { label: 'Driving Lenses', href: '/products?feature=driving' },
      { label: 'Transitions® Lenses', href: '/products?feature=transitions' },
    ]},
    { title: 'Lens Index', items: [
      { label: '1.56 Standard', href: '/products?index=1.56' },
      { label: '1.60 Thin', href: '/products?index=1.60' },
      { label: '1.67 Ultra Thin', href: '/products?index=1.67' },
      { label: '1.74 Ultra Thin', href: '/products?index=1.74' },
    ]},
  ],
  Featured: [
    { title: 'Collections', items: [
      { label: 'Best Sellers', href: '/?section=best' },
      { label: 'New Arrivals', href: '/?section=new' },
      { label: 'Flash Sale', href: '/?section=sale' },
      { label: 'Under $20', href: '/?section=under20' },
    ]},
    { title: 'Programs', items: [
      { label: 'ZEELOOL Rewards', href: '/rewards' },
      { label: 'Refer a Friend', href: '/refer' },
      { label: 'Education Discount', href: '/education' },
    ]},
  ],
  'New Arrivals': [
    { title: 'New Products', items: [
      { label: "Women's New Arrivals", href: '/products?new=women' },
      { label: "Men's New Arrivals", href: '/products?new=men' },
      { label: 'Sunglasses New Arrivals', href: '/products?new=sun' },
    ]},
  ],
  'PG Collection': [
    { title: 'PG Collection', items: [
      { label: 'All PG Collection', href: '/?section=pg' },
      { label: 'PG Eyeglasses', href: '/products?pg=eyeglasses' },
      { label: 'PG Sunglasses', href: '/products?pg=sun' },
    ]},
  ],
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [topBarMsgIdx, setTopBarMsgIdx] = useState(0);
  const [activeMegaTab, setActiveMegaTab] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const megaTimer = useRef<NodeJS.Timeout | null>(null);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const pathname = usePathname();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const cycleTopBar = (delta: number) => setTopBarMsgIdx((i) => (i + delta + topBarMessages.length) % topBarMessages.length);

  const handleTabEnter = (label: string) => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    setActiveMegaTab(label);
  };

  const handleTabLeave = () => {
    megaTimer.current = setTimeout(() => setActiveMegaTab(null), 200);
  };

  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults([]); return; }
    const t = setTimeout(() => {
      medusaProducts.list({ q: searchQuery, limit: 8 })
        .then(r => setSearchResults(r.products))
        .catch(() => setSearchResults([]));
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const drawer = (
    <Box sx={{ width: 300 }} role="presentation">
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#282828', letterSpacing: '2px' }}>ZEELOOL</Typography>
        <IconButton onClick={handleDrawerToggle}><CloseIcon /></IconButton>
      </Box>
      <Divider />
      <List>
        {mainTabs.map((link) => (
          <ListItem key={link.label} disablePadding>
            <ListItemButton href={link.href} onClick={handleDrawerToggle} selected={pathname === link.href}
              sx={{ py: 1.5, '&.Mui-selected': { bgcolor: '#f5f5f5' } }}>
              <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { setSearchOpen(true); handleDrawerToggle(); }}>
            <SearchIcon sx={{ mr: 2, color: '#282828' }} />
            <ListItemText primary="Search" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { setAccountOpen(true); handleDrawerToggle(); }}>
            <PersonOutlineIcon sx={{ mr: 2, color: '#282828' }} />
            <ListItemText primary="Account" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { setWishlistOpen(true); handleDrawerToggle(); }}>
            <FavoriteBorderIcon sx={{ mr: 2, color: '#282828' }} />
            <ListItemText primary="Wishlist" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton href="/cart">
            <Badge badgeContent={totalItems} color="error" sx={{ mr: 2 }}>
              <ShoppingCartOutlinedIcon sx={{ color: '#282828' }} />
            </Badge>
            <ListItemText primary="Cart" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* ═══════════════════════════════════════════════
          TOP BAR
         ═══════════════════════════════════════════════ */}
      <Box sx={{ bgcolor: '#282828', color: '#ffffff', height: '36px', display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'space-between', px: 4, fontSize: '0.75rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" onClick={() => cycleTopBar(-1)} sx={{ color: '#ffffff', p: 0.5 }}>
            <ChevronLeftIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#ffffff', letterSpacing: '0.3px' }}>
            {topBarMessages[topBarMsgIdx]}
          </Typography>
          <IconButton size="small" onClick={() => cycleTopBar(1)} sx={{ color: '#ffffff', p: 0.5 }}>
            <ChevronRightIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <Link href="/help" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '0.75rem', letterSpacing: '0.3px' }}>Help Center</Link>
          <Link href="/track-order" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '0.75rem', letterSpacing: '0.3px' }}>Track Order</Link>
          <Link href="/accessibility" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '0.75rem', letterSpacing: '0.3px' }}>Enable Accessibility</Link>
        </Box>
      </Box>

      {/* ═══════════════════════════════════════════════
          MAIN HEADER
         ═══════════════════════════════════════════════ */}
      <Box sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 1100 }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', position: 'relative' }}>

            {/* LEFT: Mobile menu + Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton edge="start" onClick={handleDrawerToggle} sx={{ display: { xs: 'flex', lg: 'none' }, color: '#282828', p: 0.5 }}>
                <MenuIcon />
              </IconButton>
              <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 900, color: '#282828', letterSpacing: '3px', cursor: 'pointer', fontSize: { xs: '1.25rem', md: '1.5rem' }, lineHeight: 1 }}>
                  ZEELOOL
                </Typography>
              </Link>
            </Box>

            {/* CENTER: Nav tabs */}
            <Box
              sx={{ display: { xs: 'none', lg: 'flex' }, position: 'relative' }}
              onMouseLeave={handleTabLeave}
            >
              {mainTabs.map((tab) => (
                <Box
                  key={tab.label}
                  onMouseEnter={() => handleTabEnter(tab.label)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography
                    component={Link}
                    href={tab.href}
                    sx={{
                      textDecoration: 'none',
                      fontWeight: 600,
                      color: activeMegaTab === tab.label ? '#463AE8' : '#282828',
                      fontSize: '0.9rem',
                      px: 2.5,
                      py: '18px',
                      display: 'block',
                      borderBottom: activeMegaTab === tab.label ? '2px solid #463AE8' : '2px solid transparent',
                      transition: 'all 0.15s',
                      '&:hover': { color: '#463AE8' },
                    }}
                  >
                    {tab.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Full-width Mega Menu Dropdown */}
            {activeMegaTab && megaMenuData[activeMegaTab] && (
              <Paper
                elevation={4}
                sx={{
                  position: 'fixed',
                  top: 96,
                  left: 0,
                  right: 0,
                  bgcolor: '#fff',
                  borderTop: '1px solid #f0f0f0',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  zIndex: 1200,
                  px: 0,
                  py: 3,
                  borderRadius: 0,
                }}
                onMouseEnter={() => { if (megaTimer.current) clearTimeout(megaTimer.current); setActiveMegaTab(activeMegaTab); }}
                onMouseLeave={handleTabLeave}
              >
                <Container maxWidth="xl">
                  <Grid container spacing={3}>
                    {megaMenuData[activeMegaTab].map((section) => (
                      <Grid key={section.title} size={{ xs: 6, sm: 4, md: 2.4 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#282828', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {section.title}
                        </Typography>
                        <List dense disablePadding>
                          {section.items.map((item) => (
                            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                              <ListItemButton href={item.href} sx={{ py: 0.5, px: 1, borderRadius: '4px', '&:hover': { bgcolor: '#f5f3ff' } }}>
                                <ListItemText primary={item.label} primaryTypographyProps={{ variant: 'body2', fontSize: '0.85rem', color: '#555' }} />
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                    ))}
                  </Grid>
                </Container>
              </Paper>
            )}

            {/* RIGHT: Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}>
              <IconButton onClick={() => setSearchOpen(true)} sx={{ color: '#282828', p: { xs: 1, md: 0.75 } }}>
                <SearchIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => setAccountOpen(true)} sx={{ color: '#282828', p: { xs: 1, md: 0.75 }, display: { xs: 'none', sm: 'flex' } }}>
                <PersonOutlineIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => setWishlistOpen(true)} sx={{ color: '#282828', p: { xs: 1, md: 0.75 }, display: { xs: 'none', sm: 'flex' } }}>
                <FavoriteBorderIcon fontSize="small" />
              </IconButton>
              <IconButton href="/cart" sx={{ color: '#282828', p: { xs: 1, md: 0.75 } }}>
                <Badge badgeContent={totalItems} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: '16px', minWidth: '16px' } }}>
                  <ShoppingCartOutlinedIcon fontSize="small" />
                </Badge>
              </IconButton>
              {/* GIFT badge */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', bgcolor: '#282828', color: '#fff', px: 1, py: 0.3, borderRadius: '4px', ml: 1, gap: 0.3 }}>
                <CardGiftcardIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700 }}>GIFT</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700 }}>X 0</Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ─── Mobile Drawer ─── */}
      <Drawer variant="temporary" anchor="left" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', lg: 'none' } }}>
        {drawer}
      </Drawer>

      {/* ─── Search Modal ─── */}
      <Dialog open={searchOpen} onClose={() => setSearchOpen(false)} maxWidth="sm" fullWidth fullScreen={false} PaperProps={{ sx: { borderRadius: '8px', maxHeight: '70vh', mt: '10vh' } }}>
        <DialogTitle sx={{ p: 0, borderBottom: '1px solid #f0f0f0' }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <SearchIcon sx={{ color: '#808080' }} />
            <TextField autoFocus fullWidth placeholder="Search for products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} variant="standard" InputProps={{ disableUnderline: true }} sx={{ '& input': { fontSize: '1.1rem' } }} />
            <IconButton onClick={() => setSearchOpen(false)} size="small"><CloseIcon /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, maxHeight: '60vh', overflow: 'auto' }}>
          {searchQuery.length >= 2 && searchResults.length > 0 ? (
            <List>
              {searchResults.map((product) => (
                <ListItem key={product.id} disablePadding>
                  <ListItemButton href={`/products/${product.handle}`} onClick={() => setSearchOpen(false)} sx={{ py: 1.5, px: 2 }}>
                    <Box component="img" src={product.thumbnail} alt={product.title} sx={{ width: 56, height: 56, borderRadius: '8px', objectFit: 'cover', mr: 2 }} />
                    <ListItemText primary={product.title} secondary={`$${(product.variants?.[0]?.price ?? 0).toFixed(2)}`} primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} secondaryTypographyProps={{ variant: 'body2', color: '#463AE8', fontWeight: 600 }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : searchQuery.length >= 2 ? (
            <Box sx={{ p: 4, textAlign: 'center', color: '#808080' }}>
              <Typography>No products found for &quot;{searchQuery}&quot;</Typography>
            </Box>
          ) : (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5, color: '#282828', px: 1 }}>Popular Products</Typography>
              <List>
                  {/* Popular products temporarily disabled — will be fetched from Medusa */}
              </List>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Account Modal ─── */}
      <AccountModal open={accountOpen} onClose={() => setAccountOpen(false)} />

      {/* ─── Wishlist Modal ─── */}
      <WishlistModal open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
    </>
  );
}

// ─── Account Modal Component ───
function AccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '8px' } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{mode === 'login' ? 'Sign In' : 'Sign Up'}</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Email Address" type="email" variant="outlined" size="small" sx={{ mb: 2 }} />
        <TextField fullWidth label="Password" type="password" variant="outlined" size="small" sx={{ mb: mode === 'signup' ? 2 : 3 }} />
        {mode === 'signup' && <TextField fullWidth label="Confirm Password" type="password" variant="outlined" size="small" sx={{ mb: 3 }} />}

        {mode === 'login' && (
          <Typography variant="body2" sx={{ color: '#463AE8', cursor: 'pointer', mb: 2, textAlign: 'right', fontWeight: 600 }}>
            Forgot Password?
          </Typography>
        )}

        <Button variant="contained" fullWidth size="large" sx={{ bgcolor: '#463AE8', borderRadius: '4px', py: 1.5, fontWeight: 700, textTransform: 'none', mb: 3 }}>
          {mode === 'login' ? 'Sign In' : 'Sign Up'}
        </Button>

        <Divider sx={{ mb: 3 }}>
          <Typography variant="caption" color="#808080">or continue with</Typography>
        </Divider>

        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Button variant="outlined" fullWidth sx={{ borderRadius: '4px', textTransform: 'none', py: 1 }}>Google</Button>
          <Button variant="outlined" fullWidth sx={{ borderRadius: '4px', textTransform: 'none', py: 1 }}>Facebook</Button>
          <Button variant="outlined" fullWidth sx={{ borderRadius: '4px', textTransform: 'none', py: 1 }}>Apple</Button>
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center', color: '#808080' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <Box component="span" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} sx={{ color: '#463AE8', fontWeight: 700, cursor: 'pointer' }}>
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </Box>
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

// ─── Wishlist Modal Component ───
function WishlistModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={false} PaperProps={{ sx: { borderRadius: '8px', maxHeight: '70vh', mt: '10vh' } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Wishlist</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <FavoriteBorderIcon sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Your wishlist is empty</Typography>
          <Typography variant="body2" color="#808080" sx={{ mb: 3 }}>Browse our products and add items to your wishlist.</Typography>
          <Button variant="contained" href="/products" onClick={onClose} sx={{ bgcolor: '#463AE8', borderRadius: '4px', textTransform: 'none', fontWeight: 700, px: 4 }}>
            Start Shopping
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
