'use client';

import ProductOptionsCard from '@/lib/components/cards/ProductOptionsCard';
import {Product} from '@/lib/classes/Product';
import {ProductOptionsPostSchema} from '@/lib/schemas/ProductOptionPostSchema';
import prisma from '@/prisma/index';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  ImageList,
  ImageListItem,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import {GetServerSidePropsContext} from 'next';
import Image from 'next/image';
import {notFound} from 'next/navigation';
import {useState} from 'react';
import {v4} from 'uuid';
import z from 'zod';
import Prisma, {ProductOption} from '@prisma/client';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ResetIcon from '@mui/icons-material/Undo';
import {useCart} from '@/lib/components/hooks/useCart';
import {useSession} from 'next-auth/react';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {id} = context.query;

  if (!id || Array.isArray(id)) notFound();

  const product = await prisma.product.findUnique({
    where: {id},
  });

  if (!product) return {notFound: true};

  const options = await prisma.productOption.findMany({
    where: {productId: id},
  });

  console.log({product, options});

  return {
    props: {product: Product.serialize(product), options},
  };
}

export default function ProductPage({
  product,
  options,
}: {
  product: Prisma.Product;
  options: Prisma.ProductOption[];
}) {
  const [stateOptions, setStateOptions] = useState<ProductOption[]>(options);
  const [selectedOption, setSelectedOption] = useState(options.at(0));
  const [images] = useState(product.images);
  const {data: session} = useSession();

  const {addItem, state} = useCart();

  return (
    <>
      <Card>
        <CardHeader
          title={product.title}
          subheader={product.description}
          action={
            <ButtonGroup variant="contained">
              <Button disabled>
                $
                {(selectedOption
                  ? product.basePrice + selectedOption.extra
                  : product.basePrice
                ).toFixed(2)}
              </Button>
              <Button
                onClick={() => {
                  console.log({state});
                  addItem({
                    id: v4(),
                    title: selectedOption
                      ? `${product.title} - ${selectedOption?.value}`
                      : product.title,
                    cartId: state.id,
                    productId: product.id,
                    basePrice: product.basePrice,
                    extraPrice: selectedOption?.extra ?? 0,
                    productOptionId: selectedOption?.id ?? null,
                    quantity: 1,
                  });
                }}
              >
                Add to Cart
              </Button>
              {session?.user.role === 'admin' && (
                <Button href={`/products/${product.id}/edit`}>
                  <EditIcon />
                </Button>
              )}
            </ButtonGroup>
          }
        />
        <CardContent>
          {images.length > 0 && (
            <ImageList sx={{width: 500, height: 164}} cols={3} rowHeight={164}>
              {images.map((img, i) => (
                <ImageListItem key={img}>
                  <Image
                    src={img}
                    height={164}
                    width={164}
                    alt={`image ${i}`}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </CardContent>
        <CardHeader title="Options" />
        <CardContent>
          <ProductOptionsCard options={stateOptions} editable={false} />
        </CardContent>
      </Card>
    </>
  );
}
