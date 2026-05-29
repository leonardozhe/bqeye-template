// src/components/icons/EyewearIcons.tsx
// Eyewear category icons — SVG icons for Zeelool-style category navigation
'use client';

import { Box, Typography } from '@mui/material';

interface IconItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const ICON_SIZE = 48;

// ─── SVG Icon Components ───

function RoundIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" stroke="#463AE8" strokeWidth="2" />
      <circle cx="24" cy="24" r="16" stroke="#463AE8" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}

function SquareIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 48 48" fill="none">
      <rect x="6" y="6" width="36" height="36" rx="2" stroke="#463AE8" strokeWidth="2" />
    </svg>
  );
}

function CatEyeIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 48 48" fill="none">
      <path d="M4 28 Q12 14 24 24 Q36 14 44 28 Q36 20 24 30 Q12 20 4 28Z" stroke="#463AE8" strokeWidth="2" fill="none" />
    </svg>
  );
}

function AviatorIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 48 48" fill="none">
      <path d="M6 20 Q6 10 24 10 Q42 10 42 20 L42 36 Q42 42 24 42 Q6 42 6 36Z" stroke="#463AE8" strokeWidth="2" fill="none" />
      <line x1="24" y1="10" x2="24" y2="42" stroke="#463AE8" strokeWidth="1" />
    </svg>
  );
}

function RectangleIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 48 48" fill="none">
      <rect x="4" y="12" width="40" height="24" rx="2" stroke="#463AE8" strokeWidth="2" fill="none" />
    </svg>
  );
}

function OvalIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 48 48" fill="none">
      <ellipse cx="24" cy="24" rx="22" ry="16" stroke="#463AE8" strokeWidth="2" fill="none" />
    </svg>
  );
}

function GeometricIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 48 48" fill="none">
      <polygon points="24,4 44,24 24,44 4,24" stroke="#463AE8" strokeWidth="2" fill="none" />
    </svg>
  );
}

function BrowlineIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 48 48" fill="none">
      <path d="M4 20 Q4 12 24 12 Q44 12 44 20 L44 34 Q44 42 24 42 Q4 42 4 34Z" stroke="#463AE8" strokeWidth="2" fill="none" />
      <path d="M4 20 Q4 16 24 16 Q44 16 44 20" stroke="#463AE8" strokeWidth="3" fill="none" />
    </svg>
  );
}

function ButterflyIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 48 48" fill="none">
      <path d="M8 16 Q4 8 24 12 Q44 8 40 16 Q44 24 24 28 Q4 24 8 16Z" stroke="#463AE8" strokeWidth="2" fill="none" />
      <path d="M12 28 Q8 36 24 38 Q40 36 36 28 Q40 20 24 24 Q8 20 12 28Z" stroke="#463AE8" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// ─── Lens Type Icons ───

function SingleVisionIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="18" stroke="#463AE8" strokeWidth="2" fill="none" />
      <circle cx="24" cy="24" r="4" fill="#463AE8" />
    </svg>
  );
}

function ProgressiveIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="18" stroke="#463AE8" strokeWidth="2" fill="none" />
      <path d="M12 16 Q24 24 36 16" stroke="#C7FF57" strokeWidth="2" fill="none" />
      <path d="M12 24 Q24 32 36 24" stroke="#C7FF57" strokeWidth="2" fill="none" />
      <path d="M12 32 Q24 40 36 32" stroke="#C7FF57" strokeWidth="2" fill="none" />
    </svg>
  );
}

function ReadingIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 48 48" fill="none">
      <rect x="8" y="8" width="32" height="32" rx="4" stroke="#463AE8" strokeWidth="2" fill="none" />
      <path d="M14 20 L20 20" stroke="#463AE8" strokeWidth="2" />
      <path d="M14 26 L28 26" stroke="#463AE8" strokeWidth="2" />
      <path d="M14 32 L24 32" stroke="#463AE8" strokeWidth="2" />
    </svg>
  );
}

function SunglassesIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 48 48" fill="none">
      <rect x="2" y="14" width="18" height="16" rx="8" stroke="#463AE8" strokeWidth="2" fill="#463AE8" fillOpacity="0.3" />
      <rect x="28" y="14" width="18" height="16" rx="8" stroke="#463AE8" strokeWidth="2" fill="#463AE8" fillOpacity="0.3" />
      <path d="M20 22 L28 22" stroke="#463AE8" strokeWidth="2" />
    </svg>
  );
}

function BlueLightIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="18" stroke="#463AE8" strokeWidth="2" fill="none" />
      <path d="M16 24 L22 24" stroke="#3B82F6" strokeWidth="3" />
      <path d="M24 18 L24 30" stroke="#3B82F6" strokeWidth="3" />
      <path d="M28 24 L34 24" stroke="#3B82F6" strokeWidth="3" />
    </svg>
  );
}

function PhotochromicIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="8" fill="#FFD700" />
      <g stroke="#FFD700" strokeWidth="2">
        <line x1="24" y1="2" x2="24" y2="8" />
        <line x1="24" y1="40" x2="24" y2="46" />
        <line x1="2" y1="24" x2="8" y2="24" />
        <line x1="40" y1="24" x2="46" y2="24" />
        <line x1="8.4" y1="8.4" x2="12.7" y2="12.7" />
        <line x1="35.3" y1="35.3" x2="39.6" y2="39.6" />
        <line x1="8.4" y1="39.6" x2="12.7" y2="35.3" />
        <line x1="35.3" y1="12.7" x2="39.6" y2="8.4" />
      </g>
      <circle cx="34" cy="34" r="10" stroke="#463AE8" strokeWidth="2" fill="none" fillOpacity="0.3" />
    </svg>
  );
}

// ─── Export category data ───

export const frameShapeIcons: IconItem[] = [
  { icon: <RoundIcon />, label: 'Round', href: '/products?shape=round' },
  { icon: <SquareIcon />, label: 'Square', href: '/products?shape=square' },
  { icon: <CatEyeIcon />, label: 'Cat-Eye', href: '/products?shape=cat-eye' },
  { icon: <AviatorIcon />, label: 'Aviator', href: '/products?shape=aviator' },
  { icon: <RectangleIcon />, label: 'Rectangle', href: '/products?shape=rectangle' },
  { icon: <OvalIcon />, label: 'Oval', href: '/products?shape=oval' },
  { icon: <GeometricIcon />, label: 'Geometric', href: '/products?shape=geometric' },
  { icon: <BrowlineIcon />, label: 'Browline', href: '/products?shape=browline' },
  { icon: <ButterflyIcon />, label: 'Butterfly', href: '/products?shape=butterfly' },
];

export const lensTypeIcons: IconItem[] = [
  { icon: <SingleVisionIcon />, label: 'Single Vision', href: '/products?lens=single-vision' },
  { icon: <ProgressiveIcon />, label: 'Progressive', href: '/products?lens=progressive' },
  { icon: <ReadingIcon />, label: 'Reading', href: '/products?lens=reading' },
  { icon: <SunglassesIcon />, label: 'Sunglasses', href: '/products?lens=sunglasses' },
  { icon: <BlueLightIcon />, label: 'Blue Light', href: '/products?lens=blue-light' },
  { icon: <PhotochromicIcon />, label: 'Photochromic', href: '/products?lens=photochromic' },
];

// ─── Icon Section Component ───

interface IconSectionProps {
  title: string;
  items: IconItem[];
  itemsPerRow?: number;
}

export function IconSection({ title, items, itemsPerRow = 9 }: IconSectionProps) {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#282828' }}>
        {title}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: `repeat(${Math.min(3, items.length)}, 1fr)`,
            sm: `repeat(${Math.min(5, items.length)}, 1fr)`,
            md: `repeat(${itemsPerRow}, 1fr)`,
          },
          gap: { xs: 2, md: 3 },
        }}
      >
        {items.map((item) => (
          <Box
            key={item.label}
            component="a"
            href={item.href}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              gap: 1,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' },
              cursor: 'pointer',
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: '#f5f6f7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: '#e8e9ea' },
              }}
            >
              {item.icon}
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 500, color: '#282828', textAlign: 'center' }}>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
