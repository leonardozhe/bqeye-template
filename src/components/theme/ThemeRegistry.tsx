'use client';

// Client-only theme provider — separated from server root layout
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { zeeloolTheme } from '@/lib/theme';

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={zeeloolTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
