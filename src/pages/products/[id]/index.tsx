'use client';

import {Product} from '@/lib/classes/Product';
import ProductOptionsCard from '@/lib/components/cards/ProductOptionsCard';
import {useCart} from '@/lib/components/hooks/useCart';
import prisma from '@/prisma/index';
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  ImageList,
  ImageListItem,
  Radio,
  RadioGroup,
} from '@mui/material';
import Prisma, {ProductOption} from '@prisma/client';
import {GetServerSidePropsContext} from 'next';
import {useSession} from 'next-auth/react';
import Image from 'next/image';
import {notFound} from 'next/navigation';
import {useState} from 'react';
import {v4} from 'uuid';

import EditIcon from '@mui/icons-material/Edit';

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
  const [selectedOption, setSelectedOption] = useState<
    ProductOption | undefined
  >(options.at(0));
  const [images] = useState(product.images);
  const {data: session} = useSession();

  const {addItem, setCartId, state} = useCart();

  return (
    <>
      <Card>
        <CardHeader
          title={product.title}
          subheader={product.description}
          action={
            <ButtonGroup variant="contained">
              <Button disabled sx={{fontWeight: 'bold'}}>
                $
                {(selectedOption
                  ? product.basePrice + selectedOption.extra
                  : product.basePrice
                ).toFixed(2)}
              </Button>
              <Button
                onClick={() => {
                  const cartId = state.id ?? v4()
                  if(!state.id)
                    setCartId(cartId)
                  addItem({
                    cartId,
                    id: v4(),
                    title: selectedOption
                      ? `${product.title} - ${selectedOption?.value}`
                      : product.title,
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
          <RadioGroup
            value={selectedOption?.id}
            onChange={e =>
              setSelectedOption(stateOptions.find(o => o.id === e.target.value))
            }
          >
            <ProductOptionsCard
              options={stateOptions}
              actions={({a}) => (
                <FormControlLabel value={a.id} control={<Radio />} label="" />
              )}
            />
          </RadioGroup>
        </CardContent>
      </Card>
    </>
  );
}
