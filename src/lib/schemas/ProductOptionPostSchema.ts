import z from 'zod';

export const ProductOptionsPostSchema = z.object({
  id: z.string().uuid().optional(),
  productId: z.string().uuid(),
  sku: z.string().min(3),
  attribute: z.string(),
  value: z.string(),
  stock: z.coerce.number().min(0),
  extra: z.coerce.number(),
});
