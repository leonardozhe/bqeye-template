// src/components/common/CouponPopup.tsx
// 1:1 高仿 zeelool.com coupon 弹窗
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, Box, Typography,
  Button, TextField, Checkbox, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

interface CouponPopupProps {
  open: boolean;
  onClose: () => void;
  onApply: (code: string) => void;
}

const COUPONS = [
  { code: 'WELCOME7', label: '$7 OFF', desc: 'Sitewide Sale', badge: 'First Order Only', bg: '#C6FF58' },
  { code: 'SAVE15', label: '$15 OFF', desc: 'Orders over $169' },
  { code: 'SAVE10', label: '$10 OFF', desc: 'Orders over $109' },
  { code: 'SAVE5', label: '$5 OFF', desc: 'Orders over $60' },
];

export default function CouponPopup({ open, onClose, onApply }: CouponPopupProps) {
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (open) {
      const claimed = localStorage.getItem('bqeye_coupon_claimed');
      if (claimed) onClose();
    }
  }, [open, onClose]);

  const handleGetCoupons = () => {
    if (email) {
      localStorage.setItem('bqeye_coupon_claimed', 'true');
      onApply(COUPONS[0].code);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: '12px',
          overflow: 'hidden',
          width: '100%',
          maxWidth: 420,
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* ─── Top section: coupon grid ─── */}
        <Box
          sx={{
            bgcolor: '#e3e7fa',
            position: 'relative',
            pt: 5,
            pb: 3,
            px: 3,
          }}
        >
          {/* Close button */}
          <Box
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 20,
              cursor: 'pointer',
              bgcolor: 'transparent',
              border: 'none',
              p: 0, m: 0,
            }}
          >
            <CloseIcon sx={{ fontSize: 20, color: '#1A1A1A', cursor: 'pointer' }} />
          </Box>

          {/* Title */}
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: '16px',
              lineHeight: 1.2,
              fontWeight: 700,
              color: '#333',
              mb: 2.5,
            }}
          >
            Subscribe to receive the coupons below
          </Typography>

          {/* Coupon grid — 2 columns, full width no extra padding */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1,
            }}
          >
            {COUPONS.map((c) => (
              <Box
                key={c.code}
                sx={{
                  position: 'relative',
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Left coupon edge */}
                <Box
                  component="img"
                  src="/icons/coupon/coupon_left.png"
                  alt=""
                  sx={{ position: 'absolute', top: 0, left: 0, width: 10, height: 80 }}
                />
                {/* Right coupon edge (rotated) */}
                <Box
                  component="img"
                  src="/icons/coupon/coupon_left.png"
                  alt=""
                  sx={{ position: 'absolute', top: 0, right: 0, width: 10, height: 80, transform: 'rotate(180deg)' }}
                />

                {/* Badge (only first coupon) */}
                {c.badge && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0, left: 5,
                      zIndex: 10,
                      px: 0.5, py: 0.25,
                      whiteSpace: 'nowrap',
                      fontSize: '12px',
                      lineHeight: '14px',
                      borderRadius: '6px 0 6px 0',
                      color: '#282828',
                      bgcolor: c.bg,
                      fontWeight: 700,
                    }}
                  >
                    {c.badge}
                  </Box>
                )}

                {/* Center coupon content */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 80,
                    width: 'calc(100% - 20px)',
                    mx: 1.25,
                    borderRadius: 0,
                    bgcolor: '#fff',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#1F2937',
                      fontSize: '24px',
                      lineHeight: 1,
                      fontWeight: 700,
                      letterSpacing: '-1px',
                    }}
                  >
                    {c.label}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#1F2937',
                      fontSize: '12px',
                      mt: 0.75,
                    }}
                  >
                    {c.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ─── Bottom section: email + login ─── */}
        <Box
          sx={{
            position: 'relative',
            mt: -3,
            bgcolor: '#edf0ff',
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 12 }}>
            {/* Decorative gradient wave */}
            <Box
              sx={{
                position: 'absolute',
                left: 0, top: -40, right: 0,
                zIndex: 14,
                height: '112.5px',
                background: 'linear-gradient(180deg, transparent 0%, #edf0ff 100%)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: '100.3% 112.5px',
              }}
            />

            {/* Form area */}
            <Box sx={{ position: 'relative', zIndex: 15 }}>
              <Box sx={{ mx: 2.5, pb: 2, pt: 1 }}>
                {/* Email input */}
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Email Address"
                    required
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#fff',
                        borderRadius: '8px',
                        '& fieldset': { borderColor: '#ccc' },
                        '&:hover fieldset': { borderColor: '#999' },
                      }
                    }}
                  />
                </Box>

                {/* GET COUPONS button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="medium"
                  onClick={handleGetCoupons}
                  sx={{
                    bgcolor: '#463AE8',
                    borderRadius: '8px',
                    py: 1.2,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '0.875rem',
                    letterSpacing: '0.5px',
                    '&:hover': { bgcolor: '#3a2fd4' },
                  }}
                >
                  GET COUPONS
                </Button>

                {/* "or" divider */}
                <Box sx={{ mx: 'auto', pt: 1.5, width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ display: 'block', height: 1, width: '122px', background: 'linear-gradient(to right, transparent, #999cff)' }} />
                    <Typography sx={{ color: '#2f4f96', fontSize: '12px', lineHeight: '12px', mx: 1.5 }}>or</Typography>
                    <Box sx={{ display: 'block', height: 1, width: '122px', background: 'linear-gradient(to right, #999cff, transparent)' }} />
                  </Box>

                  {/* Social login buttons */}
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5, pb: 0.25, mt: 2 }}>
                    {[
                      { name: 'Google', icon: <GoogleIcon sx={{ fontSize: 20 }} /> },
                      { name: 'Facebook', icon: <FacebookIcon sx={{ fontSize: 20, color: '#1877F2' }} /> },
                      { name: 'Amazon', icon: <Box component="img" src="/icons/amazon_pc.png" sx={{ width: 20, height: 20 }} /> },
                    ].map((s) => (
                      <Button
                        key={s.name}
                        fullWidth
                        variant="text"
                        sx={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxSizing: 'border-box', border: 'none', width: '100%', height: 32,
                          bgcolor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                          textTransform: 'none', fontSize: '12px', color: '#282828', gap: 0.5,
                          '&:hover': { bgcolor: '#f5f5f5' },
                        }}
                      >
                        {s.icon}
                        {s.name}
                      </Button>
                    ))}
                  </Box>
                </Box>

                {/* Terms checkbox */}
                <Box sx={{ mt: 2, display: 'flex' }}>
                  <FormControlLabel
                    control={<Checkbox size="small" sx={{ mr: 0 }} />}
                    label={
                      <Typography sx={{ ml: 0.75, fontSize: '11px', lineHeight: '14px', color: '#5e68a7' }}>
                        Agree to receive SMS & EMAILS from BQEye by checking{' '}
                        <Box component="span" sx={{ cursor: 'pointer', textDecoration: 'underline' }}>Terms of Use</Box>{' '}
                        and{' '}
                        <Box component="span" sx={{ cursor: 'pointer', textDecoration: 'underline' }}>Privacy Policy</Box>.
                        To unsubscribe from SMS, please reply STOP.
                      </Typography>
                    }
                    sx={{ m: 0 }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
