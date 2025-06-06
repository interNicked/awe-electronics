'use client';
import {Product} from '@/lib/classes/Product';
import ProductOptionsCard from '@/lib/components/cards/ProductOptionsCard';
import {ProductOptionsPostSchema} from '@/lib/schemas/ProductOptionPostSchema';
import {ProductPostSchema} from '@/lib/schemas/ProductPostSchema';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemIcon,
  TextField,
  Typography,
} from '@mui/material';
import {ProductOption} from '@prisma/client';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {useSnackbar} from 'notistack';
import {useState} from 'react';
import {v4 as uuid, v4} from 'uuid';
import z from 'zod';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

export function AddProductPage() {
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
  const [errorPath, setErrorPath] = useState<string[]>([]);
  const {enqueueSnackbar} = useSnackbar();
  const router = useRouter();

  const handleAddProduct = async () => {
    const {error} = ProductPostSchema.safeParse(product);

    if (error) {
      error.issues.map(i =>
        enqueueSnackbar(`${i.path} : ${i.message}`, {variant: 'error'}),
      );
      return;
    }

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
      router.push(`/products/${savedProduct.id}`);
    }
  };

  const handleAddOption = () => {
    const {success, error} = ProductOptionsPostSchema.safeParse(option);
    if (success) {
      setOptions(o => [...o, option]);
      setOption(o => {
        return {...o, id: v4()};
      });
    }
    if (error)
      error.issues.map(i => {
        setErrorPath(p => [...p, `${i.path}`]);
        enqueueSnackbar(i.message, {variant: 'error'});
      });
  };

  function handleOptionChange<K extends keyof typeof option>(
    field: K,
    value: (typeof option)[K],
  ) {
    setOption(o => ({
      ...o,
      [field]: value,
    }));
  }

  const handleDeleteOption = async (id: string) => {
    const {productId} = options[0];
    if (!productId) throw new Error('Missing Product ID');
    await fetch(`/api/products/${productId}/options/${id}`, {
      method: 'DELETE',
    });
  };

  return (
    <>
      <Card>
        <CardHeader
          title="Add Product"
          action={
            <ButtonGroup>
              <Button onClick={handleAddProduct}>
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
              error={errorPath.includes('title')}
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
              error={errorPath.includes('price')}
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
            error={errorPath.includes('description')}
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
          <ProductOptionsCard
            options={options}
            actions={({a}) => (
              <IconButton
                sx={{':hover': {color: 'red'}}}
                onClick={() => handleDeleteOption(a.id)}
              >
                <DeleteIcon />
              </IconButton>
            )}
          />
          <Box sx={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <TextField
              label="SKU"
              value={option.sku}
              onChange={e => handleOptionChange('sku', e.target.value)}
              error={errorPath.includes('sku')}
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
                error={errorPath.includes('attribute')}
                fullWidth
                value={option.attribute}
                onChange={e => handleOptionChange('attribute', e.target.value)}
              />
              <TextField
                label="Value"
                error={errorPath.includes('value')}
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
                error={errorPath.includes('extra')}
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
                error={errorPath.includes('stock')}
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
              <Button variant="contained" fullWidth onClick={handleAddOption}>
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
            error={errorPath.includes('url')}
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
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
                        if (error)
                          error.issues.forEach(i => {
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
          <Button
            variant="contained"
            fullWidth
            sx={{mt: '1rem'}}
            onClick={handleAddProduct}
          >
            Add Product
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export default AddProductPage;
