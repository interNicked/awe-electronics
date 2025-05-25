'use client';
import Image from 'next/image';
import useProducts from '@/lib/components/hooks/useProducts';
import {Product} from '@/lib/classes/Product';
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemIcon,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import {useState} from 'react';
import {v4 as uuid} from 'uuid';
import z from 'zod';
import {ProductOption} from '@/prisma/generated';
import ProductOptionsCard from '@/lib/components/cards/ProductOptions';
import {ProductPostSchema} from '@/lib/schemas/ProductPostSchema';

import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';

export function AddProductPage() {
  const {products, productOptions, productCategories} = useProducts();
  const [id] = useState<Product['id']>(uuid());
  const [product, setProduct] = useState<Product>(new Product(id, '', '', 0));
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [option, setOption] = useState<ProductOption>({
    id: uuid(),
    sku: '',
    attribute: '',
    value: '',
    stock: 0,
    extra: 0,
    productId: id,
  });
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleAddProduct = async () => {
    const {success, error} = ProductPostSchema.safeParse(product);
    console.log({error});
    if (success) {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (res.ok) {
        const savedProduct = await res.json();
        await Promise.all(
          options.map(o =>
            fetch(`/api/products/${savedProduct.id}/options`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(o),
            }),
          ),
        );
        console.log('Saved!');
      }
    }
  };

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

  return (
    <>
      <Card>
        <CardHeader
          title="Add Product"
          action={
            <ButtonGroup>
              <Button onClick={() => handleAddProduct()}>
                <SaveIcon />
              </Button>
            </ButtonGroup>
          }
        />
        <CardContent
          sx={{display: 'flex', flexDirection: 'column', gap: '1rem'}}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: {md: 'row', xs: 'column'},
              gap: '1rem',
            }}
          >
            <TextField
              label="Title"
              value={product.title}
              fullWidth
              onChange={e =>
                setProduct(p =>
                  Product.from({
                    ...p,
                    createdAt: new Date(p.createdAt.valueOf()),
                    updatedAt: new Date(p.updatedAt.valueOf()),
                    title: e.target.value,
                  }),
                )
              }
            />

            <TextField
              label="Price"
              type="number"
              value={product.basePrice.toFixed(2)}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                },
              }}
              onChange={e =>
                setProduct(p =>
                  Product.from({
                    ...p,
                    createdAt: new Date(p.createdAt.valueOf()),
                    updatedAt: new Date(),
                    basePrice: Number(e.target.value),
                  }),
                )
              }
            />
          </Box>

          <TextField
            label="Description"
            multiline
            minRows={6}
            value={product.description}
            onChange={e =>
              setProduct(p =>
                Product.from({
                  ...p,
                  createdAt: new Date(p.createdAt.valueOf()),
                  updatedAt: new Date(),
                  description: e.target.value,
                }),
              )
            }
          />
        </CardContent>
        <CardHeader title="Options" />
        <CardContent>
          <ProductOptionsCard options={options} />
          <Box sx={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
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
                onChange={e => handleOptionChange('extra', e.target.value)}
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
              <Button variant="outlined" fullWidth>
                Reset
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setOptions(o => [...o, option]);
                }}
              >
                Add Option
              </Button>
            </Box>
          </Box>
        </CardContent>

        <CardHeader title="Images" />
        <CardContent
          sx={{display: 'flex', flexDirection: 'column', gap: '1rem'}}
        >
          <Box>
            {product.images.length > 0 ? (
              product.images.map(i => (
                <ListItem key={i}>
                  <ListItemIcon>
                    <Image src={i} width={250} height={250} alt={i} />
                  </ListItemIcon>
                  {i}
                </ListItem>
              ))
            ) : (
              <Typography variant="overline">No Images</Typography>
            )}
          </Box>
          <TextField
            label="Image URL"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            error={error !== ''}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        const {success, error} = z
                          .string()
                          .url()
                          .safeParse(imageUrl);
                        if (success) {
                          setProduct(p =>
                            Product.from({
                              ...p,
                              createdAt: new Date(p.createdAt.valueOf()),
                              updatedAt: new Date(),
                              images: [...p.images, imageUrl],
                            }),
                          );
                          setImageUrl('');
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
          <Button
            variant="contained"
            fullWidth
            sx={{mt: '1rem'}}
            onClick={() => handleAddProduct()}
          >
            Add Product
          </Button>
        </CardContent>
      </Card>
      <Snackbar
        open={error !== ''}
        autoHideDuration={6000}
        onClose={() => setError('')}
        message={<Alert severity="error">{error}</Alert>}
      />
    </>
  );
}

export default AddProductPage;
