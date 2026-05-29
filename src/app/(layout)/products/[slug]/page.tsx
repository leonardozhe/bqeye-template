// src/app/(layout)/products/[slug]/page.tsx
// Server component — calls Medusa API directly
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Typography, Box, Breadcrumbs, Grid, Container } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ProductCard from '@/components/product/ProductCard';
import ProductDetail from '@/components/product/ProductDetail';
import { medusaProducts } from '@/api/medusa';
import type { FrontendProduct } from '@/api/medusa-mappers';

export function generateStaticParams() {
  // Medusa products are dynamic, return empty for SSR
  return [];
}

async function fetchProduct(handle: string): Promise<FrontendProduct | null> {
  try {
    return await medusaProducts.getByHandle(handle);
  } catch {
    return null;
  }
}

async function fetchRelated(categoryId?: string, excludeId?: string, limit = 6): Promise<FrontendProduct[]> {
  try {
    const result = await medusaProducts.list({
      limit,
      category_id: categoryId,
    });
    return result.products.filter(p => p.id !== excludeId);
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) notFound();

  const relatedProducts = await fetchRelated(
    product.categories[0],
    product.id,
    6
  );
  const categoryLabel = product.categories[0] || 'All Products';

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#808080', fontSize: '0.875rem' }}>Home</Link>
        <Link href="/products" style={{ textDecoration: 'none', color: '#808080', fontSize: '0.875rem' }}>
          {categoryLabel}
        </Link>
        <Typography color="#282828" variant="body2">{product.title}</Typography>
      </Breadcrumbs>

      {/* Product detail with inline lens config */}
      <ProductDetail product={product} />

      {/* You may also like */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 8, mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: '#282828' }}>
            You may also like
          </Typography>
          <Grid container spacing={{ xs: 1.5, md: 2 }}>
            {relatedProducts.map((p) => (
              <Grid key={p.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
                {/* TODO: ProductCard */}
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}
