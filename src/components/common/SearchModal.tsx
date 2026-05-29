'use client';

import { useState, useEffect } from 'react';
import {
  useMediaQuery,
  useTheme,
  Dialog,
  DialogContent,
  Box,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  InputAdornment,
  CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { medusaProducts } from '@/api/medusa';
import type { FrontendProduct } from '@/api/medusa-mappers';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const recentSearches = ['blue contacts', 'cosplay lenses', 'cat eye'];

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FrontendProduct[]>([]);
  const [popular, setPopular] = useState<FrontendProduct[]>([]);
  const [searching, setSearching] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch popular products when modal opens
  useEffect(() => {
    if (open && popular.length === 0) {
      medusaProducts.list({ tag: 'best-seller', limit: 3 })
        .then(r => setPopular(r.products))
        .catch(() => {});
    }
  }, [open, popular.length]);

  // Debounced search against Medusa
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      medusaProducts.list({ q: query, limit: 6 })
        .then(r => setResults(r.products))
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Reset query when modal closes
  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderTopLeftRadius: { xs: 0, sm: 16 },
          borderTopRightRadius: { xs: 0, sm: 16 },
          maxHeight: { xs: '100%', sm: '80vh' },
          mt: { xs: 0, sm: '10vh' } } }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Search input */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            autoFocus
            fullWidth
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '999px',
                bgcolor: '#f5f6f7',
                '& fieldset': { border: 'none' } } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#808080' }} />
                </InputAdornment>
              ) }}
          />
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Results or suggestions */}
        <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          {searching ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : results.length > 0 ? (
            <List>
              {results.map((product) => (
                <ListItem key={product.id} disablePadding>
                  <ListItemButton
                    href={`/products/${product.handle}`}
                    onClick={onClose}
                    sx={{ py: 1 }}
                  >
                    <Box
                      component="img"
                      src={product.thumbnail}
                      alt={product.title}
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '8px',
                        objectFit: 'cover',
                        mr: 2 }}
                    />
                    <ListItemText
                      primary={product.title}
                      secondary={`$${product.variants[0]?.price.toFixed(2)}`}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                      secondaryTypographyProps={{ variant: 'body2', color: '#463AE8' }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : query.length >= 2 ? (
            <Box sx={{ p: 3, textAlign: 'center', color: '#808080' }}>
              <Typography>No products found for &quot;{query}&quot;</Typography>
            </Box>
          ) : (
            <>
              {/* Recent searches */}
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <HistoryIcon fontSize="small" /> Recent Searches
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {recentSearches.map((term) => (
                    <Box
                      key={term}
                      onClick={() => setQuery(term)}
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: '999px',
                        bgcolor: '#f5f6f7',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#e8e9ea' } }}
                    >
                      {term}
                    </Box>
                  ))}
                </Box>
              </Box>

              <Divider />

              {/* Popular products */}
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <TrendingUpIcon fontSize="small" /> Popular Products
                </Typography>
                <List>
                  {popular.map((product) => (
                    <ListItem key={product.id} disablePadding>
                      <ListItemButton
                        href={`/products/${product.handle}`}
                        onClick={onClose}
                        sx={{ py: 1 }}
                      >
                        <Box
                          component="img"
                          src={product.thumbnail}
                          alt={product.title}
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '8px',
                            objectFit: 'cover',
                            mr: 2 }}
                        />
                        <ListItemText
                          primary={product.title}
                          secondary={`$${product.variants[0]?.price.toFixed(2)}`}
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                          secondaryTypographyProps={{ variant: 'body2', color: '#463AE8' }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
