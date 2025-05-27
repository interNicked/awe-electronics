'use client';

import {GetServerSidePropsContext, GetServerSidePropsResult} from 'next';
import prisma from '@/prisma/index';
import {notFound} from 'next/navigation';
import Prisma, {ProductOption} from '@prisma/client';
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
  ListItem,
  TextField,
  ToggleButton,
} from '@mui/material';
import {Customer} from '@/lib/classes/Customer';
import {Product} from '@/lib/classes/Product';
import ProductOptionsCard from '@/lib/components/cards/ProductOptions';
import {useState} from 'react';
import {v4} from 'uuid';
import Image from 'next/image';
import {ProductOptionsPostSchema} from '@/lib/schemas/ProductOptionPostSchema';

import ResetIcon from '@mui/icons-material/Undo';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import z from 'zod';

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
  const [viewMode, setViewMode] = useState(true);
  const [stateOptions, setStateOptions] = useState<ProductOption[]>(options);
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState(product.images);
  const [error, setError] = useState('');
  const [option, setOption] = useState<ProductOption>({
    id: v4(),
    sku: '',
    attribute: '',
    value: '',
    stock: 0,
    extra: 0,
    productId: product.id,
  });

  const handleOptionChange = (field: keyof ProductOption, value: string) => {
    setOption(o => {
      const opts = {
        ...o,
        ...JSON.parse(
          `{"${field}": ${['stock', 'extra'].includes(field) ? `${value}` : `"${value}"`}}`,
        ),
      };

      return opts;
    });
  };

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

  return (
    <>
      <Card>
        <CardHeader
          title={product.title}
          subheader={product.description}
          action={
            <ButtonGroup variant="contained">
              <Button
                color={viewMode ? 'primary' : 'warning'}
                onClick={() => setViewMode(!viewMode)}
              >
                <EditIcon />
              </Button>
              <Button disabled={viewMode}>
                <ResetIcon />
              </Button>
              <Button disabled={viewMode}>
                <SaveIcon />
              </Button>
            </ButtonGroup>
          }
        />
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
            error={error !== ''}
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
                        if (error) {
                          setError(`${error.issues.at(0)?.message}`);
                        }
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
          <ProductOptionsCard options={stateOptions} />
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
              disabled={viewMode}
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
                disabled={viewMode}
                value={option.attribute}
                onChange={e => handleOptionChange('attribute', e.target.value)}
              />
              <TextField
                label="Value"
                fullWidth
                disabled={viewMode}
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
                onChange={e => handleOptionChange('extra', e.target.value)}
                fullWidth
                disabled={viewMode}
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
                disabled={viewMode}
                value={option.stock}
                onChange={e => handleOptionChange('stock', e.target.value)}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: {md: 'row', xs: 'column'},
                gap: '1rem',
              }}
            >
              <Button variant="outlined" fullWidth disabled={viewMode}>
                Reset
              </Button>
              <Button
                variant="contained"
                fullWidth
                disabled={viewMode}
                onClick={handleAddProduct}
              >
                Add Option
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
