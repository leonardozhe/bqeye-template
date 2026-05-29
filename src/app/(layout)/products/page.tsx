'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Container, Box, Typography, Grid, IconButton, Button,
  Divider, Collapse, TextField, InputAdornment
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ProductCard from '@/components/product/ProductCard';
import { getProducts, Product } from '@/lib/products';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Relevance' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Best Discount' },
];

// ─── Category metadata matching Zeelool ───
const CATEGORY_META: Record<string, { title: string; desc: string }> = {
  all: {
    title: "Women's Glasses",
    desc: "Fashionable prescription glasses designed for women exclusively, making it easy to order your frames online at ZEELOOL and have them delivered straight to your door.",
  },
  'colored-contacts': {
    title: "Women's Glasses",
    desc: "Fashionable prescription glasses designed for women exclusively, making it easy to order your frames online at ZEELOOL and have them delivered straight to your door.",
  },
  cosplay: {
    title: "Men's Glasses",
    desc: "Stylish prescription eyeglasses for men, designed for everyday wear and special occasions.",
  },
  accessories: {
    title: 'Accessories',
    desc: 'Essential accessories for your eyewear — cases, solutions, and more.',
  },
};

function ProductsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCategory = searchParams.get('category') || 'all';
  const priceRange = searchParams.get('price') || 'all';
  const shapeFilter = searchParams.get('shape') || 'all';

  const products = useMemo(() => {
    let filtered = getProducts();
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter((p) => p.price >= min && (!max || p.price <= max));
    }
    if (shapeFilter !== 'all') {
      filtered = filtered.filter((p) => {
        // Simple shape matching based on product name/description
        const name = (p.name + ' ' + p.description).toLowerCase();
        return name.includes(shapeFilter.toLowerCase());
      });
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'price-asc': return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...filtered].sort((a, b) => b.price - a.price);
      case 'rating': return [...filtered].sort((a, b) => b.rating - a.rating);
      case 'discount': return [...filtered].sort((a, b) => (b.discount || 0) - (a.discount || 0));
      case 'newest': return [...filtered].sort((a, b) => b.id - a.id);
      default: return [...filtered].sort((a, b) => b.reviews - a.reviews);
    }
  }, [selectedCategory, priceRange, shapeFilter, sortBy, searchQuery]);

  const meta = CATEGORY_META[selectedCategory] || CATEGORY_META.all;

  const handleCategoryChange = (cat: string) => {
    if (cat === 'all') router.push('/products');
    else router.push(`/products?category=${cat}`);
  };

  const handlePriceChange = (range: string) => {
    const params = new URLSearchParams(searchParams);
    if (range === 'all') params.delete('price');
    else params.set('price', range);
    router.push(`/products?${params.toString()}`);
  };

  const handleShapeChange = (shape: string) => {
    const params = new URLSearchParams(searchParams);
    if (shape === 'all') params.delete('shape');
    else params.set('shape', shape);
    router.push(`/products?${params.toString()}`);
  };

  // ─── Filter accordion state ───
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    gender: true,
    price: true,
    shape: true,
    color: true,
    prescription: false,
    material: false,
    size: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // ─── Filter Components ───
  const FilterSection = ({ title, section, children }: { title: string; section: string; children: React.ReactNode }) => (
    <Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, cursor: 'pointer' }}
        onClick={() => toggleSection(section)}
      >
        <Typography variant="body2" sx={{ fontWeight: 700, color: '#282828', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {title}
        </Typography>
        {openSections[section] ? <ExpandLessIcon sx={{ fontSize: 18, color: '#808080' }} /> : <ExpandMoreIcon sx={{ fontSize: 18, color: '#808080' }} />}
      </Box>
      <Collapse in={openSections[section]}>
        {children}
      </Collapse>
      <Divider sx={{ borderColor: '#e8e8e8' }} />
    </Box>
  );

  const FilterChip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        py: 0.5,
        cursor: 'pointer',
        '&:hover .filter-checkbox': { borderColor: '#463AE8' },
      }}
    >
      <Box
        className="filter-checkbox"
        sx={{
          width: 16,
          height: 16,
          borderRadius: '3px',
          border: active ? '2px solid #463AE8' : '1px solid #ccc',
          bgcolor: active ? '#463AE8' : '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s',
          flexShrink: 0,
        }}
      >
        {active && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </Box>
      <Typography variant="body2" sx={{ fontSize: '0.85rem', color: active ? '#463AE8' : '#555', fontWeight: active ? 600 : 400 }}>
        {label}
      </Typography>
    </Box>
  );

  const ColorDot = ({ hex }: { hex: string }) => (
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        bgcolor: hex,
        border: hex === '#FFFFFF' ? '1px solid #e0e0e0' : 'none',
        outline: '1px solid rgba(0,0,0,0.1)',
        outlineOffset: '-1px',
        cursor: 'pointer',
        '&:hover': { outline: '2px solid #463AE8' },
      }}
    />
  );

  // ─── Product Card Component (use shared component)
  const ProductCardComponent = ({ product }: { product: Product }) => {
    return <ProductCard product={product} />;
  };

  const FilterSidebar = () => (
    <Box sx={{ pr: 2 }}>
      {/* Gender */}
      <FilterSection title="Gender" section="gender">
        <Box sx={{ py: 1 }}>
          <FilterChip label="Women" active={selectedCategory === 'colored-contacts'} onClick={() => handleCategoryChange('colored-contacts')} />
          <FilterChip label="Men" active={selectedCategory === 'cosplay'} onClick={() => handleCategoryChange('cosplay')} />
        </Box>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price" section="price">
        <Box sx={{ py: 1 }}>
          <FilterChip label="Under $10" active={priceRange === '0-10'} onClick={() => handlePriceChange('0-10')} />
          <FilterChip label="Under $20" active={priceRange === '0-20'} onClick={() => handlePriceChange('0-20')} />
          <FilterChip label="Under $30" active={priceRange === '0-30'} onClick={() => handlePriceChange('0-30')} />
          <FilterChip label="Above $30" active={priceRange === '30-999'} onClick={() => handlePriceChange('30-999')} />
          <FilterChip label="On Sale" active={false} onClick={() => {}} />
        </Box>
      </FilterSection>

      {/* Shape */}
      <FilterSection title="Shape" section="shape">
        <Box sx={{ py: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {['Square', 'Cat-Eye', 'Round', 'Rectangle', 'Butterfly', 'Aviator', 'Browline', 'Geometric', 'Oval'].map((s) => (
            <FilterChip key={s} label={s} active={false} onClick={() => handleShapeChange(s === shapeFilter ? 'all' : s.toLowerCase())} />
          ))}
        </Box>
      </FilterSection>

      {/* Color */}
      <FilterSection title="Color" section="color">
        <Box sx={{ py: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {['#282828', '#8B6914', '#DC143C', '#2E8B57', '#4169E1', '#E91E63', '#808080', '#D2691E', '#FFFFFF', '#FFD700', '#9370DB', '#00CED1'].map((hex) => (
            <ColorDot key={hex} hex={hex} />
          ))}
        </Box>
      </FilterSection>

      {/* Prescription */}
      <FilterSection title="Prescription" section="prescription">
        <Box sx={{ py: 1 }}>
          <FilterChip label="Single Vision" active={false} onClick={() => {}} />
          <FilterChip label="Reading Glasses" active={false} onClick={() => {}} />
          <FilterChip label="Non-Prescription" active={false} onClick={() => {}} />
          <FilterChip label="Progressive" active={false} onClick={() => {}} />
        </Box>
      </FilterSection>

      {/* Material */}
      <FilterSection title="Material" section="material">
        <Box sx={{ py: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {['Acetate', 'Plastic', 'Metal', 'Titanium', 'TR90', 'Nylon'].map((m) => (
            <FilterChip key={m} label={m} active={false} onClick={() => {}} />
          ))}
        </Box>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size" section="size">
        <Box sx={{ py: 1 }}>
          <FilterChip label="Narrow" active={false} onClick={() => {}} />
          <FilterChip label="Medium" active={false} onClick={() => {}} />
          <FilterChip label="Wide" active={false} onClick={() => {}} />
          <FilterChip label="Extra Wide" active={false} onClick={() => {}} />
        </Box>
      </FilterSection>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      {/* ─── Category Hero Banner ─── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#282828', mb: 1.5, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
          {meta.title}
        </Typography>
        <Typography variant="body1" color="#808080" sx={{ maxWidth: 600, lineHeight: 1.7, fontSize: '0.95rem' }}>
          {meta.desc}
        </Typography>
      </Box>

      {/* ─── Top bar: results count + search + sort ─── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        {/* Left: results count + mobile filter */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="#808080" sx={{ fontSize: '0.9rem' }}>
            Showing <Typography component="span" sx={{ fontWeight: 700, color: '#282828' }}>{products.length}</Typography> results
          </Typography>
          <IconButton sx={{ display: { md: 'none' } }} onClick={() => setMobileFilterOpen(true)}>
            <FilterListIcon />
          </IconButton>
        </Box>

        {/* Right: search + sort */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              display: { xs: 'none', sm: 'block' },
              width: 200,
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                bgcolor: '#f5f5f5',
                '& fieldset': { border: 'none' },
                '& input': { fontSize: '0.85rem' },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#808080', fontSize: '0.9rem' }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Sort */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="#808080" sx={{ fontSize: '0.85rem' }}>Sort by</Typography>
            <Box
              component="select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{
                border: 'none',
                bgcolor: 'transparent',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#282828',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                pr: 2,
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23808080' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0 center',
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ─── Main Content: Sidebar + Product Grid ─── */}
      <Box sx={{ display: 'flex', gap: { xs: 0, md: 3 } }}>
        {/* Sidebar Filters (desktop) */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, width: 240, flexShrink: 0 }}>
          <Box sx={{ position: 'sticky', top: 80 }}>
            <FilterSidebar />
          </Box>
        </Box>

        {/* Product Grid */}
        <Box sx={{ flex: 1 }}>
          <Grid container spacing={{ xs: 1, sm: 1.5, md: 1.5 }}>
            {products.map((product) => (
              <Grid key={product.id} size={{ xs: 6, sm: 4, md: 4, lg: 3 }}>
                <ProductCardComponent product={product} />
              </Grid>
            ))}
          </Grid>

          {products.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="#808080">No products found</Typography>
              <Button component={Link} href="/products" sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}>
                Clear Filters
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* ─── Mobile Filter Drawer ─── */}
      {mobileFilterOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 1200,
            display: { md: 'none' },
          }}
          onClick={() => setMobileFilterOpen(false)}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: 300,
              bgcolor: '#fff',
              overflow: 'auto',
              p: 2,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#282828' }}>Filters</Typography>
              <IconButton onClick={() => setMobileFilterOpen(false)}><CloseIcon /></IconButton>
            </Box>
            <FilterSidebar />
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Box sx={{ p: 4, textAlign: 'center', bgcolor: '#f5f5f5', minHeight: 'calc(100vh - 96px)' }}>Loading...</Box>}>
      <ProductsPageInner />
    </Suspense>
  );
}
