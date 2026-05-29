import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Typography, Box, Breadcrumbs, Grid, Container } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ProductCard from '@/components/product/ProductCard';
import { getProductBySlug, getRelatedProducts, products } from '@/lib/products';
import ProductDetail from '@/components/product/ProductDetail';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = getRelatedProducts(slug, 6);
  const categoryLabel = product.category === 'cosplay' ? 'Cosplay' : product.category === 'accessories' ? 'Accessories' : 'Colored Contacts';

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#808080', fontSize: '0.875rem' }}>Home</Link>
        <Link href="/products" style={{ textDecoration: 'none', color: '#808080', fontSize: '0.875rem' }}>
          {categoryLabel}
        </Link>
        <Typography color="#282828" variant="body2">{product.name}</Typography>
      </Breadcrumbs>

      {/* Product detail with inline lens config */}
      <ProductDetail product={product} />

      {/* ═══════════════════════════════════════════════
          "You may also like" — Zeelool grid layout
         ═══════════════════════════════════════════════ */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 8, mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: '#282828' }}>
            You may also like
          </Typography>
          <Grid container spacing={{ xs: 1.5, md: 2 }}>
            {relatedProducts.map((p) => (
              <Grid key={p.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}
