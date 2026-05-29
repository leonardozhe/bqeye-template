// src/lib/theme.ts — BQEye theme 1:1 对齐 zeelool.com 设计系统
import { createTheme } from '@mui/material/styles';

// ─── zeelool.com 真实 typography token ───
// h1: 24→28→32→36→40px (section 大标题)
// h2: 20→24→28→32→36px (页面大标题)
// h3: 18→20→22→24→28px (区块标题)
// h4: 16→18→20→22→24px (子标题)
// h5: 14→15→16→18→20px (卡片标题)
// h6: 12→13→14→15→16px (小标题/副标题)
// body1: 14→15→16px (正文)
// body2: 12→13→14px (小字)

export const bqeyeTheme = createTheme({
  typography: {
    fontFamily: "'Bricolage Grotesque', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: {
      fontSize: '2.5rem',       // 40px
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#282828',
    },
    h2: {
      fontSize: '2rem',         // 32px
      fontWeight: 700,
      lineHeight: 1.25,
      color: '#282828',
    },
    h3: {
      fontSize: '1.5rem',       // 24px
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#282828',
    },
    h4: {
      fontSize: '1.125rem',     // 18px
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#282828',
    },
    h5: {
      fontSize: '1rem',         // 16px
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#282828',
    },
    h6: {
      fontSize: '0.875rem',     // 14px
      fontWeight: 500,
      lineHeight: 1.4,
      color: '#282828',
    },
    body1: {
      fontSize: '1rem',         // 16px
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#282828',
    },
    body2: {
      fontSize: '0.875rem',     // 14px
      fontWeight: 400,
      lineHeight: 1.4,
      color: '#555555',
    },
    subtitle1: {
      fontSize: '0.8125rem',    // 13px
      fontWeight: 400,
      lineHeight: 1.3,
      color: '#555555',
    },
    subtitle2: {
      fontSize: '0.75rem',      // 12px
      fontWeight: 400,
      lineHeight: 1.25,
      color: '#808080',
    },
    caption: {
      fontSize: '0.75rem',      // 12px
      fontWeight: 400,
      lineHeight: 1.2,
      color: '#808080',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.3px',
    },
    overline: {
      fontSize: '0.6875rem',    // 11px
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      color: '#808080',
    },
  },

  palette: {
    primary: { main: '#463AE8' },
    secondary: { main: '#C7FF57' },
    text: {
      primary: '#282828',   // zeelool 主文字色
      secondary: '#808080', // zeelool 副文字色
    },
    divider: '#F5F6F7',
    background: { default: '#ffffff', paper: '#ffffff' },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#F5F6F7',
    },
  },

  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.04)',
    '0 1px 3px rgba(0,0,0,0.06)',
    '0 2px 6px rgba(0,0,0,0.08)',
    '0 2px 8px rgba(0,0,0,0.1)',
    '0 4px 12px rgba(0,0,0,0.1)',
    '0 4px 16px rgba(0,0,0,0.12)',
    '0 6px 20px rgba(0,0,0,0.14)',
    '0 8px 24px rgba(0,0,0,0.14)',
    '0 8px 28px rgba(0,0,0,0.16)',
    '0 10px 32px rgba(0,0,0,0.16)',
    '0 12px 36px rgba(0,0,0,0.18)',
    '0 14px 40px rgba(0,0,0,0.18)',
    '0 16px 44px rgba(0,0,0,0.2)',
    '0 18px 48px rgba(0,0,0,0.2)',
    '0 20px 52px rgba(0,0,0,0.2)',
    '0 22px 56px rgba(0,0,0,0.2)',
    '0 24px 60px rgba(0,0,0,0.22)',
    '0 26px 64px rgba(0,0,0,0.22)',
    '0 28px 68px rgba(0,0,0,0.24)',
    '0 30px 72px rgba(0,0,0,0.24)',
    '0 32px 76px rgba(0,0,0,0.26)',
    '0 34px 80px rgba(0,0,0,0.26)',
    '0 36px 84px rgba(0,0,0,0.28)',
    '0 38px 88px rgba(0,0,0,0.28)',
  ],

  shape: { borderRadius: 8 },

  spacing: 8,

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '999px',     // pill shape
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          fontSize: '0.875rem',
          letterSpacing: '0.3px',
          '&:hover': { boxShadow: 'none' },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        outlined: {
          borderWidth: '1px',
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.75rem',
        },
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '1rem',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#282828',
          boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
          elevation: 0,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#282828',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',   // 禁用默认渐变
        },
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '999px',
          fontWeight: 500,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          color: '#808080',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },
  },
});
