'use client';

import { Box } from '@mui/material';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Box
        component="main"
        sx={{
          minHeight: 'calc(100vh - 64px)',
          pb: { xs: 8, md: 0 },
        }}
      >
        {children}
      </Box>
      <Footer />
      <BottomNav />
    </>
  );
}
