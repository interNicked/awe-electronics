import z from "zod";

export const AddressSchema = z.object({
  id: z.string().uuid().optional(),
  status: z.enum(['CurrentAddress', 'PreviousAddress']),
  type: z.enum(['BillingAddress', 'DeliveryAddress']),
  fullName: z.string().min(1, 'Full name is required'),
  addressLine1: z.string().min(1, 'Address Line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postcode: z.string().min(4, 'Postcode must be at least 4 characters'),
  country: z.string().min(1, 'Country is required'),
});

export type Address = z.infer<typeof AddressSchema>;

export default AddressSchema;
