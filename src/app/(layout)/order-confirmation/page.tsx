'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EmailIcon from '@mui/icons-material/Email';
import ReceiptIcon from '@mui/icons-material/Receipt';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  useEffect(() => {
    // Generate order ID
    setOrderId('ZL-' + Date.now().toString(36).toUpperCase());
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        {/* Success Icon */}
        <CheckCircleIcon sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />

        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Order Confirmed!
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          Thank you for your purchase
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Order ID: <strong>{orderId}</strong>
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon sx={{ color: '#463AE8' }} />
            <Typography variant="body2">Confirmation email sent</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon sx={{ color: '#463AE8' }} />
            <Typography variant="body2">Invoice attached</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShippingIcon sx={{ color: '#463AE8' }} />
            <Typography variant="body2">
              Est. delivery: {estimatedDelivery.toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* What's Next */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>What&apos;s Next?</Typography>
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
          {[
            { step: '1', title: 'Processing', desc: 'We\'re preparing your order' },
            { step: '2', title: 'Shipped', desc: 'You\'ll receive tracking info' },
            { step: '3', title: 'Delivered', desc: 'Enjoy your new lenses!' },
          ].map((item) => (
            <Box key={item.step} sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 40, height: 40, borderRadius: '50%',
                  bgcolor: '#463AE8', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, mx: 'auto', mb: 1,
                }}
              >
                {item.step}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.title}</Typography>
              <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" component={Link} href="/" sx={{ bgcolor: '#463AE8' }}>
            Continue Shopping
          </Button>
          <Button variant="outlined" onClick={() => router.push('/account')}>
            View Orders
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
