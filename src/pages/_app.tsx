import ResponsiveAppBar from '@/lib/components/AppBar';
import {CartProvider} from '@/lib/components/hooks/useCart';
import type {AppProps} from 'next/app';
import '../styles/globals.css';
import {createTheme, Paper, ThemeProvider, useColorScheme} from '@mui/material';

export default function App({Component, pageProps}: AppProps) {
  const theme = createTheme({
    colorSchemes: {
      dark: true,
      light: true,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CartProvider>
        <ResponsiveAppBar />
        <Paper>
          <Component {...pageProps} />
        </Paper>
      </CartProvider>
    </ThemeProvider>
  );
}
