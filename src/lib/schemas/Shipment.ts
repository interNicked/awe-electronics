import {ShipmentStatus} from '@prisma/client';
import z from 'zod';

export const ShipmentSchema = z.object({
  orderId: z.string().uuid(),
  id: z.string().uuid(),
  addressId: z.string().uuid(),
  status: z.nativeEnum(ShipmentStatus),

  trackingNumber: z.string().min(10).nullable(),
  carrier: z.string().min(5).nullable(),
  shippedAt: z.coerce.number().nullable(),
  eta: z.coerce.number().nullable(),

  createdAt: z.coerce.number().optional(),
  updatedAt: z.coerce.number().optional(),
});

export type ShipmentSchemaType = z.infer<typeof ShipmentSchema>;
