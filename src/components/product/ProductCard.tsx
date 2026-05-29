'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    originalPrice: number;
    image: string;
    images?: string[];
    discount?: number;
    rating?: number;
    reviews?: number;
    isNew?: boolean;
    isBestSeller?: boolean;
    colors?: { name: string; hex: string }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const discount = product.discount || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const maxColors = 6;
  const extraColors = product.colors ? Math.max(0, product.colors.length - maxColors) : 0;
  const displayColors = product.colors ? product.colors.slice(0, maxColors) : [];

  return (
    <Box sx={{ position: 'relative', cursor: 'pointer' }}>
      {/* Image container */}
      <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <Box
          sx={{
            position: 'relative',
            paddingTop: '100%',
            overflow: 'hidden',
            bgcolor: '#f5f5f5',
          }}
        >
          {/* ─── Left side: badges stacked vertically ─── */}
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {product.isBestSeller && (
              <Box sx={{ bgcolor: '#282828', color: '#fff', px: 1.5, py: 0.3, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.5px' }}>
                Best Seller
              </Box>
            )}
            {product.isNew && (
              <Box sx={{ bgcolor: '#463AE8', color: '#fff', px: 1.5, py: 0.3, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.5px' }}>
                New
              </Box>
            )}
          </Box>

          {/* ─── Right side: Discount only (no wishlist) ─── */}
          {discount > 0 && (
            <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
              <Box sx={{ bgcolor: '#C7FF57', color: '#282828', px: 1.5, py: 0.3, fontSize: '0.75rem', fontWeight: 700 }}>
                -{discount}%
              </Box>
            </Box>
          )}

          {/* ─── Bottom-left: AR Try-On ─── */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              zIndex: 2,
              bgcolor: 'rgba(255,255,255,0.9)',
              px: 1,
              py: 0.3,
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: 0.3,
            }}
          >
            <VisibilityIcon sx={{ fontSize: 12, color: '#808080' }} />
            <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#808080', fontWeight: 600 }}>
              AR Try-On
            </Typography>
          </Box>

          {/* Product image */}
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          />

          {!imageLoaded && (
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
              <Typography variant="caption" color="#808080">Loading...</Typography>
            </Box>
          )}
        </Box>
      </Link>

      {/* Product info below image */}
      <Box sx={{ pt: 1.5 }}>
        <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
          <Typography
            variant="body2"
            sx={{
              color: '#282828',
              fontWeight: 500,
              fontSize: '0.85rem',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              '&:hover': { color: '#463AE8' },
            }}
          >
            {product.name}
          </Typography>
        </Link>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#282828', fontSize: '0.95rem' }}>
            ${product.price.toFixed(2)}
          </Typography>
          {product.originalPrice > product.price && (
            <Typography variant="caption" sx={{ color: '#999', textDecoration: 'line-through', fontSize: '0.8rem' }}>
              ${product.originalPrice.toFixed(2)}
            </Typography>
          )}
        </Box>

        {/* Rating */}
        {product.rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  sx={{
                    fontSize: 12,
                    color: i < Math.floor(product.rating || 0) ? '#FFB800' : '#e0e0e0',
                  }}
                />
              ))}
            </Box>
            <Typography variant="caption" sx={{ color: '#808080', fontSize: '0.7rem' }}>
              {product.rating}
            </Typography>
          </Box>
        )}

        {/* Color swatches */}
        {displayColors.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            {displayColors.map((color) => (
              <Box
                key={color.name}
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: color.hex,
                  border: color.hex === '#FFFFFF' || color.hex === '#D3D3D3' || color.hex === '#F5F5F5' ? '1px solid #e0e0e0' : 'none',
                  cursor: 'pointer',
                  outline: '1px solid rgba(0,0,0,0.1)',
                  outlineOffset: '-1px',
                  '&:hover': { outline: '1px solid #463AE8' },
                }}
                title={color.name}
              />
            ))}
            {extraColors > 0 && (
              <Typography variant="caption" sx={{ color: '#808080', fontSize: '0.7rem', fontWeight: 600 }}>
                +{extraColors}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
