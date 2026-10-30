import { createTheme } from '@mui/material/styles';

export function buildOwjifyTheme(lang = 'fa') {
  const isRTL = lang === 'fa';
  const fontFamily = isRTL
    ? "'Vazirmatn', system-ui, -apple-system, Tahoma, sans-serif"
    : "'DM Sans', system-ui, -apple-system, sans-serif";

  return createTheme({
    direction: isRTL ? 'rtl' : 'ltr',
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1440,
      },
    },
    palette: {
      mode: 'light',
      primary: {
        main: '#11120F',
        light: '#232620',
        dark: '#0B0C0A',
        contrastText: '#F6F5F0',
      },
      secondary: {
        main: '#C7F36B',
        light: '#D8F892',
        dark: '#B4E450',
        contrastText: '#11120F',
      },
      success: {
        main: '#289E67',
      },
      warning: {
        main: '#E0922B',
      },
      error: {
        main: '#D94848',
      },
      background: {
        default: '#F6F5F0',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#11120F',
        secondary: '#5C5E56',
      },
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily,
      h1: { fontWeight: 900 },
      h2: { fontWeight: 900 },
      h3: { fontWeight: 800 },
      h4: { fontWeight: 800 },
      h5: { fontWeight: 800 },
      h6: { fontWeight: 700 },
      button: {
        textTransform: 'none',
        fontWeight: 700,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: '#F6F5F0',
            color: '#11120F',
            overflowX: 'clip',
          },
        },
      },
      MuiContainer: {
        defaultProps: {
          maxWidth: 'xl',
        },
        styleOverrides: {
          root: {
            paddingLeft: 'clamp(1rem, 3vw, 2.5rem)',
            paddingRight: 'clamp(1rem, 3vw, 2.5rem)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            padding: '0.62rem 1.35rem',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 999,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 24,
            backgroundColor: '#F6F5F0',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 700,
            minHeight: 44,
          },
        },
      },
    },
  });
}
