import z from 'zod';

export const ProductPostSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  basePrice: z.coerce.number().min(0),
  description: z.string(),
  images: z.array(z.string().url()),
  status: z.string(),
});
