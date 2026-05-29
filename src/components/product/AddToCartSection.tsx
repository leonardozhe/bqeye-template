'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';
import { useCartStore } from '@/lib/cartStore';
import { Product } from '@/lib/products';

export default function AddToCartSection({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    router.push('/checkout');
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Lens Config Button */}
      <Button
        variant="outlined"
        fullWidth
        size="large"
        startIcon={<BuildIcon />}
        onClick={() => router.push(`/configure/${product.slug}`)}
        sx={{
          borderRadius: '999px',
          py: 1.5,
          mb: 2,
          borderColor: '#463AE8',
          color: '#463AE8',
          fontWeight: 700,
          '&:hover': { bgcolor: '#F5F3FF', borderColor: '#463AE8' },
        }}
      >
        🔧 配置镜片（5步向导）
      </Button>

      {/* Quantity */}
      <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Quantity</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid #f5f6f7', borderRadius: '8px', p: 0.5, width: 'fit-content', mb: 2 }}>
        <IconButton size="small" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
          <RemoveIcon />
        </IconButton>
        <Typography sx={{ minWidth: 40, textAlign: 'center', fontWeight: 600 }}>{quantity}</Typography>
        <IconButton size="small" onClick={() => setQuantity(Math.min(10, quantity + 1))}>
          <AddIcon />
        </IconButton>
      </Box>

      {/* Buttons */}
      <Button
        variant="contained"
        fullWidth
        size="large"
        startIcon={added ? <CheckCircleIcon /> : <ShoppingCartIcon />}
        onClick={handleAddToCart}
        sx={{
          bgcolor: added ? '#4CAF50' : '#463AE8',
          borderRadius: '999px',
          py: 1.5,
          mb: 1,
          '&:hover': { bgcolor: added ? '#43A047' : '#3a2fd4' },
        }}
      >
        {added ? 'Added to Cart!' : `Add to Cart — $${(product.price * quantity).toFixed(2)}`}
      </Button>

      <Button
        variant="outlined"
        fullWidth
        size="large"
        onClick={handleBuyNow}
        sx={{
          borderRadius: '999px',
          py: 1.5,
          borderColor: '#463AE8',
          color: '#463AE8',
          '&:hover': { bgcolor: '#463AE8', color: '#fff' },
        }}
      >
        Buy Now
      </Button>
    </Box>
  );
}
