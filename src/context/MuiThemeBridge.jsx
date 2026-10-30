import { useMemo } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useLanguage } from './LanguageContext';
import { buildOwjifyTheme } from '../styles/muiTheme';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const cacheLtr = createCache({
  key: 'muiltr',
  stylisPlugins: [prefixer],
});

export default function MuiThemeBridge({ children }) {
  const { lang, isRTL } = useLanguage();

  const theme = useMemo(() => buildOwjifyTheme(lang), [lang]);
  const emotionCache = isRTL ? cacheRtl : cacheLtr;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
