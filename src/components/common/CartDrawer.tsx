'use client';

import { Drawer, Box, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useCartStore } from '@/lib/cartStore';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 } } }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%' }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f5f6f7' }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Shopping Cart
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Cart items or empty state */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {items.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#808080' }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>Your cart is empty</Typography>
              <Typography variant="body2">Add some products to get started!</Typography>
            </Box>
          ) : (
            items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  gap: 2,
                  mb: 2,
                  pb: 2,
                  borderBottom: '1px solid #f5f6f7' }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '8px',
                    objectFit: 'cover',
                    bgcolor: '#f5f6f7' }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#463AE8', fontWeight: 700 }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2">{item.quantity}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => removeItem(item.id)}
                      sx={{ ml: 'auto', color: '#808080' }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))
          )}
        </Box>

        {/* Footer */}
        {items.length > 0 && (
          <Box sx={{ p: 2, borderTop: '1px solid #f5f6f7' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2 }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Subtotal
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#463AE8' }}>
                ${getSubtotal().toFixed(2)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{
                bgcolor: '#463AE8',
                borderRadius: '999px',
                py: 1.5,
                '&:hover': { bgcolor: '#3a2fd4' } }}
              onClick={onClose}
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
