import Prisma from '@/prisma/generated';
import {useState, useEffect} from 'react';

export function useProducts() {
  const [products, setProducts] = useState<Prisma.Product[]>([]);
  const [productCategories, setProductCategories] = useState<
    Prisma.ProductCategory[]
  >([]);
  const [productOptions, setProductOptions] = useState<Prisma.ProductOption[]>(
    [],
  );

  useEffect(() => {
    async function getProducts() {
      const res = await fetch('/api/products');
      if (res.ok) {
        const items = await res.json();
        setProducts(items);
      }
    }
    async function getProductCategories() {
      const res = await fetch('/api/products/categories');
      if (res.ok) {
        const items = await res.json();
        setProductCategories(items);
      }
    }
    async function getProductOptions() {
      const res = await fetch('/api/products/options');
      if (res.ok) {
        const items = await res.json();
        setProductOptions(items);
      }
    }

    Promise.all([getProducts(), getProductCategories(), getProductOptions()]);
  }, []);

  return {
    productCategories, productOptions, products
  };
}

export default useProducts;
