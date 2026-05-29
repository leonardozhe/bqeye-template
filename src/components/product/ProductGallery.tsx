'use client';

import { useState } from 'react';
import { Box, CardMedia } from '@mui/material';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return null;
  }

  return (
    <Box>
      {/* Main image */}
      <Box
        sx={{
          position: 'relative',
          paddingTop: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
          bgcolor: '#f5f6f7',
          mb: 2 }}
      >
        <CardMedia
          component="img"
          image={images[activeIndex]}
          alt={`${productName} - view ${activeIndex + 1}`}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover' }}
        />
      </Box>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            pb: 1 }}
        >
          {images.map((image, index) => (
            <Box
              key={index}
              onClick={() => setActiveIndex(index)}
              sx={{
                width: 72,
                height: 72,
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: activeIndex === index ? '2px solid #463AE8' : '2px solid transparent',
                flexShrink: 0,
                transition: 'border-color 0.2s' }}
            >
              <CardMedia
                component="img"
                image={image}
                alt={`${productName} thumbnail ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover' }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
