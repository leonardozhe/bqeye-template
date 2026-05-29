import { createTheme } from '@mui/material/styles';

export const bqeyeTheme = createTheme({
  typography: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    h2: { fontSize: '2rem', fontWeight: 700 },
    h3: { fontSize: '1.5rem', fontWeight: 700 },
    h4: { fontSize: '1.25rem', fontWeight: 700 },
    h5: { fontSize: '1.125rem', fontWeight: 500 },
    h6: { fontSize: '1rem', fontWeight: 500 },
    body1: { fontSize: '1rem', fontWeight: 400 },
    body2: { fontSize: '0.875rem', fontWeight: 400 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  palette: {
    primary: { main: '#463AE8' },
    secondary: { main: '#C7FF57' },
    text: { primary: '#282828', secondary: '#808080' },
    divider: '#f5f6f7',
    background: { default: '#ffffff' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '999px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#282828',
          boxShadow: '0 1px 0 rgba(0,0,0,0.08)',
        },
      },
    },
  },
});
