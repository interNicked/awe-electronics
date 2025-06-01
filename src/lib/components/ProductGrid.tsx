import {
  Grid,
  Card,
  CardMedia,
  Skeleton,
  CardHeader,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import useProducts from './hooks/useProducts';

export function ProductGrid() {
  const {products} = useProducts();
  return (
    <Grid container gap="1rem">
      {products.map(p => (
        <Grid key={p.id} width={{md: '25%', xs: '75%'}} margin={'auto'}>
          <Link href={`/products/${p.id}`}>
            <Card sx={{minWidth: 250}}>
              <CardMedia
                sx={{
                  position: 'relative',
                  height: 250,
                  width: '100%',
                }}
              >
                {p.images[0] ? (
                  <Image src={p.images[0]} fill alt={p.title} />
                ) : (
                  <Skeleton variant="rectangular" height={250} />
                )}
              </CardMedia>
              <CardHeader
                title={p.title}
                subheader={p.description}
                action={
                  <Typography variant="overline">
                    ${p.basePrice.toFixed(2)}
                  </Typography>
                }
              />
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}
