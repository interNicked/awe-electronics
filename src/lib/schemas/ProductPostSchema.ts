import z from 'zod';

export const ProductPostSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  basePrice: z.number().min(0),
  description: z.string(),
  images: z.array(z.string().url()),
  status: z.string(),
});
