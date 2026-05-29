'use client';

import { Box, Stack, Chip } from '@mui/material';

interface CategoryTabsProps {
  categories?: string[];
  selected?: string;
  onChange?: (category: string) => void;
  sx?: object;
}

const categoryLabels: Record<string, string> = {
  all: 'All',
  'colored-contacts': 'Colored Contacts',
  cosplay: 'Cosplay',
  accessories: 'Accessories',
};

export default function CategoryTabs({ categories, selected = 'all', onChange, sx }: CategoryTabsProps) {
  const items = categories || ['all', 'colored-contacts', 'cosplay', 'accessories'];

  return (
    <Box sx={{ overflowX: 'auto', ...sx }}>
      <Stack direction="row" spacing={1} sx={{ minWidth: 'fit-content' }}>
        {items.map((cat) => (
          <Chip
            key={cat}
            label={categoryLabels[cat] || cat}
            onClick={() => onChange?.(cat)}
            clickable
            sx={{
              bgcolor: selected === cat ? '#463AE8' : '#f5f6f7',
              color: selected === cat ? '#fff' : '#282828',
              fontWeight: selected === cat ? 600 : 400,
              '&:hover': {
                bgcolor: selected === cat ? '#3a2fd4' : '#e8e9ea',
              },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
