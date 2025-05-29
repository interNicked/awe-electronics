import React, {useState} from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Card,
  CardHeader,
  CardContent,
} from '@mui/material';
import {z} from 'zod';

const addressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  addressLine1: z.string().min(1, 'Address Line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postcode: z.string().min(4, 'Postcode must be at least 4 characters'),
  country: z.string().min(1, 'Country is required'),
});

type Address = z.infer<typeof addressSchema>;

const emptyAddress: Address = {
  fullName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postcode: '',
  country: '',
};

export function AddressForm() {
  const [billing, setBilling] = useState<Address>({...emptyAddress});
  const [delivery, setDelivery] = useState<Address>({...emptyAddress});
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange =
    (section: 'billing' | 'delivery', field: keyof Address) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const update = section === 'billing' ? {...billing} : {...delivery};
      update[field] = event.target.value;

      section === 'billing' ? setBilling(update) : setDelivery(update);
    };

  const validateAndSubmit = () => {
    const billingResult = addressSchema.safeParse(billing);
    const deliveryResult = addressSchema.safeParse(delivery);

    const newErrors: Record<string, string> = {};

    if (!billingResult.success) {
      for (const issue of billingResult.error.issues) {
        newErrors[`billing.${issue.path[0]}`] = issue.message;
      }
    }

    if (!sameAsBilling && !deliveryResult.success) {
      for (const issue of deliveryResult.error.issues) {
        newErrors[`delivery.${issue.path[0]}`] = issue.message;
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const submittedDelivery = sameAsBilling ? billing : delivery;
      console.log('Billing:', billing);
      console.log('Delivery:', submittedDelivery);
      alert('Form submitted!');
    }
  };

  const renderAddressFields = (
    prefix: 'billing' | 'delivery',
    address: Address,
  ) => (
    <>
      {(
        [
          'fullName',
          'addressLine1',
          'addressLine2',
          'city',
          'state',
          'postcode',
          'country',
        ] as (keyof Address)[]
      ).map(field => (
        <Grid
          size={{xs: 12, sm: field === 'addressLine2' ? 12 : 6}}
          key={field}
        >
          <TextField
            label={startCase(field)}
            fullWidth
            value={address[field] || ''}
            onChange={handleChange(prefix, field)}
            error={Boolean(errors[`${prefix}.${field}`])}
            helperText={errors[`${prefix}.${field}`] || ' '}
          />
        </Grid>
      ))}
    </>
  );

  return (
    <Card>
      <CardHeader
        title="Billing Address"
        slotProps={{title: {sx: {mt: '1rem'}}}}
        action={
          <FormControlLabel
            control={
              <Checkbox
                checked={sameAsBilling}
                onChange={e => setSameAsBilling(e.target.checked)}
              />
            }
            label="Delivery address is the same as billing"
            sx={{mt: 2}}
          />
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          {renderAddressFields('billing', billing)}
        </Grid>
      </CardContent>

      {!sameAsBilling && (
        <>
          <CardHeader title="Billing Address" />
          <CardContent>
            <Typography variant="h6" sx={{mt: 3}}>
              Delivery Address
            </Typography>
            <Grid container spacing={2}>
              {renderAddressFields('delivery', delivery)}
            </Grid>
          </CardContent>
        </>
      )}

      <CardContent>
        <Button variant="outlined" onClick={validateAndSubmit} fullWidth>
          PROCEED TO PAYMENT
        </Button>
      </CardContent>
    </Card>
  );
}

export default AddressForm;

// Utility function to convert camelCase to Title Case
function startCase(input: string): string {
  return input.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
}
