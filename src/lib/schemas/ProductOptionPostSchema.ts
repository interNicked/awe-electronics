import z from 'zod'

export const ProductOptionsPostSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  sku: z.string(),
  attribute: z.string(),
  value: z.string(),
  stock: z.number().min(0),
  extra: z.number(),
});
