import z from "zod";
import { AddressSchema } from "../schemas/AddressSchema";
import { OrderStatus } from "@prisma/client";

export const OrderSchema = z.object({
  total: z.number().min(0.01),
  addresses: z.array(AddressSchema).min(2).max(2),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      productOptionId: z.string().uuid().nullable(),
      title: z.string().min(3),
      basePrice: z.coerce.number().min(0.01),
      extraPrice: z.coerce.number().min(0),
      quantity: z.coerce.number().min(1),
    }),
  ),
});

export default OrderSchema;
