import ResponsiveAppBar from '@/lib/components/AppBar';
import {CartProvider} from '@/lib/components/hooks/useCart';
import type {AppProps} from 'next/app';
import '../styles/globals.css';
import {Container, createTheme, Paper, ThemeProvider, useColorScheme} from '@mui/material';
import {SessionProvider} from 'next-auth/react';
import Head from 'next/head';

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
        <meta name="description" content="Implementation for SWE30003 Assignments - AWE Electronics Ecommerce Case Study " />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={pageProps.session}>
        <ThemeProvider theme={theme}>
          <CartProvider>
            <ResponsiveAppBar />
            <Container maxWidth="md" sx={{width: '100%'}} component={Paper}>
              <Component {...pageProps} />
            </Container>
          </CartProvider>
        </ThemeProvider>
      </SessionProvider>
    </>
  );
}
