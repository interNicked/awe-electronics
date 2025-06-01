'use client';

import {ProductGrid} from '@/lib/components/ProductGrid';
import {Typography} from '@mui/material';

export default function Home() {
  return (
    <>
      <Typography variant="overline" fontSize={'2rem'}>
        AWE Electronics
      </Typography>
      <ProductGrid />
    </>
  );
}
