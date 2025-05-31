import ResponsiveAppBar from '@/lib/components/AppBar';
import {CartProvider} from '@/lib/components/hooks/useCart';
import type {AppProps} from 'next/app';
import '../styles/globals.css';
import {
  Container,
  createTheme,
  Paper,
  ThemeProvider,
  useColorScheme,
} from '@mui/material';
import {SessionProvider} from 'next-auth/react';
import Head from 'next/head';
import {SnackbarProvider} from 'notistack';

export default function App({Component, pageProps}: AppProps) {
  const theme = createTheme({
    colorSchemes: {
      dark: true,
      light: true,
    },
  });

  return (
    <>
      <Head>
        <title>AWE Electronics</title>
        <meta
          name="description"
          content="Implementation for SWE30003 Assignments - AWE Electronics Ecommerce Case Study "
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CartProvider>
        <SessionProvider session={pageProps.session}>
          <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={5}>
              <Paper sx={{minHeight: '100vh'}}>
                <ResponsiveAppBar />
                <Container variant='outlined' maxWidth="md" sx={{width: '100%', my: '1rem', py: '2rem'}} component={Paper}>
                  <Component {...pageProps} />
                </Container>
              </Paper>
            </SnackbarProvider>
          </ThemeProvider>
        </SessionProvider>
      </CartProvider>
    </>
  );
}
