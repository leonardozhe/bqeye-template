// src/components/common/CouponPopup.tsx
// 首次访问优惠券弹窗（类似 zeelool.com）
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogTitle, Box, Typography,
  Button, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

interface CouponPopupProps {
  open: boolean;
  onClose: () => void;
  onApply: (code: string) => void;
}

const COUPONS = [
  { code: 'WELCOME5', label: '$5 OFF', desc: 'Orders over $39', bg: '#463AE8' },
  { code: 'WELCOME10', label: '$10 OFF', desc: 'Orders over $69', bg: '#E91E63' },
  { code: 'SAVE20', label: '$20 OFF', desc: 'Orders over $99', bg: '#FF5722' },
];

export default function CouponPopup({ open, onClose, onApply }: CouponPopupProps) {
  const [selected, setSelected] = useState<string | null>(null);

  // 自动选择最优优惠券
  useEffect(() => {
    if (open) {
      setSelected(COUPONS[0].code);
    }
  }, [open]);

  const handleClaim = () => {
    if (selected) {
      onApply(selected);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #463AE8 0%, #2d1fb5 40%, #1a0f6e 100%)',
          color: '#fff',
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: '#ffffff99' }}
          size="small"
        >
          <CloseIcon />
        </IconButton>

        {/* Header */}
        <Box sx={{ textAlign: 'center', pt: 4, pb: 2, px: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CardGiftcardIcon sx={{ fontSize: 48, color: '#C7FF57' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Welcome to BQEye!
          </Typography>
          <Typography variant="body2" sx={{ color: '#ffffffcc' }}>
            Claim your exclusive new customer coupons
          </Typography>
        </Box>

        {/* Coupon list */}
        <Box sx={{ px: 3, pb: 3 }}>
          {COUPONS.map((c) => (
            <Box
              key={c.code}
              onClick={() => setSelected(c.code)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                mb: 1.5,
                borderRadius: '8px',
                bgcolor: selected === c.code ? '#ffffff22' : '#ffffff11',
                border: selected === c.code ? '2px solid #C7FF57' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <LocalOfferIcon sx={{ fontSize: 28, color: c.bg === '#463AE8' ? '#C7FF57' : '#ffffff99' }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{c.label}</Typography>
                <Typography variant="caption" sx={{ color: '#ffffff99' }}>{c.desc}</Typography>
              </Box>
              <Box sx={{
                px: 1.5, py: 0.5, borderRadius: '4px',
                bgcolor: c.bg, color: '#fff',
                fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase'
              }}>
                {c.code}
              </Box>
            </Box>
          ))}
        </Box>

        {/* CTA */}
        <Box sx={{ px: 3, pb: 4 }}>
          <Button
            fullWidth
            size="large"
            onClick={handleClaim}
            sx={{
              bgcolor: '#C7FF57',
              color: '#282828',
              borderRadius: '8px',
              py: 1.5,
              fontWeight: 800,
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': { bgcolor: '#b8f04a' },
            }}
          >
            Claim Now
          </Button>
          <Typography
            variant="caption"
            sx={{ display: 'block', textAlign: 'center', mt: 2, color: '#ffffff66', cursor: 'pointer' }}
            onClick={onClose}
          >
            No thanks, I'll pay full price
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
