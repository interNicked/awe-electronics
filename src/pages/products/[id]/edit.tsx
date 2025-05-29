'use client';

import {Product} from '@/lib/classes/Product';
import ProductOptionsCard from '@/lib/components/cards/ProductOptionsCard';
import {ProductOptionsPostSchema} from '@/lib/schemas/ProductOptionPostSchema';
import prisma from '@/prisma/index';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  ImageList,
  ImageListItem,
  InputAdornment,
  TextField,
} from '@mui/material';
import Prisma, {ProductOption} from '@prisma/client';
import {GetServerSidePropsContext} from 'next';
import Image from 'next/image';
import {notFound} from 'next/navigation';
import {useSnackbar} from 'notistack';
import {useState} from 'react';
import z from 'zod';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState(product.images);
  const [errorPath, setErrorPath] = useState<string[]>([]);
  const [option, setOption] = useState<Partial<ProductOption>>({
    sku: '',
    attribute: '',
    value: '',
    stock: 0,
    extra: 0,
    productId: product.id,
  });
  const {enqueueSnackbar} = useSnackbar();

  function handleOptionChange<K extends keyof typeof option>(
    field: K,
    value: (typeof option)[K],
  ) {
    setOption(o => ({
      ...o,
      [field]: value,
    }));
  }

  const handleAddProduct = async () => {
    const {success, error} = ProductOptionsPostSchema.safeParse(option);
    if (success) {
      const res = await fetch(`/api/products/${product.id}/options`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(option),
      });
      if (res.ok) {
        const opt = await res.json();
        console.log({opt});
        setStateOptions(o => [...o, opt]);
      }
    }
    if (error) console.error({error});
  };

  const handleDeleteOption = async (id: string) => {
    const {productId} = options[0];
    if (!productId) throw new Error('Missing Product ID');
    const res = await fetch(`/api/products/${productId}/options/${id}`, {
      method: 'DELETE',
    });

    console.log({ok: res.ok});
  };

  return (
    <>
      <Card>
        <CardHeader title={product.title} subheader={product.description} />
        <CardContent>
          {images.length > 0 && (
            <ImageList sx={{width: 500, height: 450}} cols={3} rowHeight={164}>
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
          <TextField
            label="Image URL"
            value={imageUrl}
            fullWidth
            onChange={e => setImageUrl(e.target.value)}
            error={errorPath.includes('img')}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={async () => {
                        const {success, error} = z
                          .string()
                          .url()
                          .safeParse(imageUrl);
                        if (success) {
                          const res = await fetch(
                            `/api/products/${product.id}`,
                            {
                              method: 'PUT',
                              headers: {'Content-Type': 'application/json'},
                              body: JSON.stringify({
                                ...product,
                                images: [...product.images, imageUrl],
                              }),
                            },
                          );
                          if (res.ok) {
                            setImages(i => [...i, imageUrl]);
                            setImageUrl('');
                          } else console.error(res.statusText);
                        }
                        if (error)
                          error.issues.map(i => {
                            setErrorPath(p => [...p, `${i.path}`]);
                            enqueueSnackbar(i.message, {variant: 'error'});
                          });
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </CardContent>
        <CardHeader title="Options" />
        <CardContent>
          <ProductOptionsCard
            options={stateOptions}
            actions={({a}) => (
              <IconButton
                sx={{':hover': {color: 'red'}}}
                onClick={() => handleDeleteOption(a.id)}
              >
                <DeleteIcon />
              </IconButton>
            )}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              mt: '1rem',
            }}
          >
            <TextField
              label="SKU"
              value={option.sku}
              onChange={e => handleOptionChange('sku', e.target.value)}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: {md: 'row', xs: 'column'},
                gap: '1rem',
              }}
            >
              <TextField
                label="Attribute"
                fullWidth
                value={option.attribute}
                onChange={e => handleOptionChange('attribute', e.target.value)}
              />
              <TextField
                label="Value"
                fullWidth
                value={option.value}
                onChange={e => handleOptionChange('value', e.target.value)}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: {md: 'row', xs: 'column'},
                gap: '1rem',
              }}
            >
              <TextField
                label="Extra"
                value={option.extra}
                onChange={e =>
                  handleOptionChange('extra', Number(e.target.value))
                }
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="Stock"
                fullWidth
                value={option.stock}
                onChange={e =>
                  handleOptionChange('stock', Number(e.target.value))
                }
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: {md: 'row', xs: 'column'},
                gap: '1rem',
              }}
            >
              <Button variant="outlined" fullWidth>
                Reset
              </Button>
              <Button variant="contained" fullWidth onClick={handleAddProduct}>
                Add Option
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
