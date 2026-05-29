// src/components/product/ProductCard.tsx — 1:1 高仿 zeelool.com 产品展示卡
'use client';

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import Link from 'next/link';

interface ColorSwatch {
  name: string;
  hex: string;
  img?: string;
}

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  colors: ColorSwatch[];
  href: string;
}

export default function ProductCard({ id, name, price, rating, image, colors, href }: ProductCardProps) {
  const [activeColor, setActiveColor] = useState(0);

  return (
    <Box
      sx={{
        position: 'relative',
        cursor: 'pointer',
        fontFamily: 'inherit',
        minWidth: 328,
      }}
    >
      <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }}>
        {/* ─── Image Container ─── */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            bgcolor: '#F5F5F5',
            overflow: 'hidden',
            borderRadius: 0,
            aspectRatio: '416/500',
          }}
        >
          {/* Product image — max-h-[67%], width: 80% */}
          <Box
            component="img"
            src={image}
            alt={name}
            loading="lazy"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              height: 'auto',
              maxHeight: '67%',
              objectFit: 'cover',
            }}
          />

          {/* ─── Top bar: Wishlist ─── */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 1,
              p: '16px',
            }}
          >
            <Box sx={{ display: 'flex', height: '24px', alignItems: 'center' }} />
            <Box
              component="button"
              onClick={(e) => e.preventDefault()}
              sx={{
                background: 'none',
                border: 'none',
                p: 0,
                cursor: 'pointer',
                lineHeight: '24px',
                color: '#808080',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Add to wishlist"
            >
              <Box
                sx={{
                  position: 'relative',
                  height: '22px',
                  width: '22px',
                }}
              >
                {/* Heart icon — matches zeelool svg */}
                <FavoriteBorderIcon
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 2,
                    cursor: 'pointer',
                    fontSize: '22px',
                    color: '#282828',
                    '&:hover': { color: '#7B68EE' },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ─── Product Info ─── */}
        <Box
          sx={{
            pt: 2,       // pt-8
            pb: 2.5,     // pb-10
            pl: 2,       // pl-16 (MUI spacing scale: 16px)
            pr: 2,       // pr-16
            position: 'relative',
            minHeight: 84,
          }}
        >
          {/* Title + Price row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                pt: 0.75,     // pt-6
                minHeight: '27px',
                flexWrap: 'wrap',
              }}
            >
              {/* Product name — text-16, font-bb, mb-[10px] */}
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#282828',
                  mr: 1,
                  mb: '10px',
                  lineHeight: 1.2,
                }}
              >
                {name}
              </Typography>
              {/* Price — text-16 */}
              <Typography
                sx={{
                  fontSize: '16px',
                  color: '#282828',
                  mr: 1,
                }}
                aria-label={`Current price, $${price.toFixed(2)}`}
              >
                ${price.toFixed(2)}
              </Typography>
            </Box>

            {/* Rating */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                pt: 0.5,     // pt-4
                ml: 2,       // ml-16
              }}
            >
              <StarIcon sx={{ fontSize: '16px', color: '#282828', mr: '8px' }} />
              <Typography sx={{ fontSize: '14px', color: '#282828' }}>
                {rating}
              </Typography>
            </Box>
          </Box>

          {/* ─── Color Swatches ─── */}
          <Box
            component="ul"
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              mt: 1.5,      // mt-12
              pb: 0.5,      // pb-2
              width: '100%',
              height: '20px',
              listStyle: 'none',
              m: 0,
              p: 0,
            }}
            role="radiogroup"
            aria-label="Available frame colors"
          >
            {colors.slice(0, 6).map((color, i) => (
              <Box
                key={`${color.name}-${i}`}
                component="li"
                sx={{ pr: 1, height: '20px', width: '20px', boxSizing: 'border-box' }}
              >
                <Box
                  component="div"
                  role="radio"
                  aria-checked={activeColor === i}
                  aria-label={`${color.name}${activeColor === i ? ', current selection' : ''}`}
                  tabIndex={0}
                  onClick={(e) => { e.preventDefault(); setActiveColor(i); }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '20px',
                    width: '20px',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    boxSizing: 'border-box',
                    border: '1px solid transparent',
                    borderColor: activeColor === i ? '#463AE8' : 'transparent',
                    '&:hover': {
                      borderColor: '#B0C4DE',
                      borderStyle: 'solid',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: '1px solid #B0C4DE',
                      borderStyle: 'solid',
                      overflow: 'hidden',
                      ...(activeColor === i ? { borderColor: '#fff' } : {}),
                    }}
                  >
                    {color.img ? (
                      <Box
                        component="img"
                        src={color.img}
                        alt={color.name}
                        sx={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          bgcolor: color.hex,
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Link>
    </Box>
  );
}
