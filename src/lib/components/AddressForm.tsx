import React, {useEffect, useState} from 'react';
import {
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
import Prisma from '@prisma/client';
import {useSession} from 'next-auth/react';
import {useSnackbar} from 'notistack';
import AddressSchema, {Address} from '../schemas/AddressSchema';

const emptyAddress = {
  fullName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postcode: '',
  country: '',
};

export function AddressForm() {
  const {data: session} = useSession();
  const {enqueueSnackbar} = useSnackbar();
  const [billing, setBilling] = useState<Address>({
    ...emptyAddress,
    type: 'BillingAddress',
    status: 'CurrentAddress',
  });
  const [delivery, setDelivery] = useState<Address>({
    ...emptyAddress,
    type: 'DeliveryAddress',
    status: 'CurrentAddress',
  });
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange =
    (type: Prisma.$Enums.AddressType, field: keyof Address) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (field === 'type' || field === 'status') return;

      const update = type === 'BillingAddress' ? {...billing} : {...delivery};
      update[field] = event.target.value;

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      type === 'BillingAddress' ? setBilling(update) : setDelivery(update);
    };

  const validateAndSubmit = async () => {
    const billingResult = AddressSchema.safeParse(billing);
    const deliveryResult = AddressSchema.safeParse(delivery);

    const newErrors: Record<string, string> = {};

    if (!billingResult.success) {
      for (const issue of billingResult.error.issues) {
        newErrors[`BillingAddress.${issue.path[0]}`] = issue.message;
      }
    }

    if (!sameAsBilling && !deliveryResult.success) {
      for (const issue of deliveryResult.error.issues) {
        newErrors[`DeliveryAddress.${issue.path[0]}`] = issue.message;
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const submittedDelivery = sameAsBilling
        ? {...billing, type: 'DeliveryAddress'}
        : delivery;
      const res = await fetch(
        session?.user?.id
          ? `/api/users/${session.user.id}/addresses`
          : '/api/addresses',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            addresses: [billing, submittedDelivery],
          }),
        },
      );
      if (res.ok) {
        localStorage.setItem('addresses', JSON.stringify(await res.json()));
        enqueueSnackbar('Address Saved', {variant: 'success'});
      } else enqueueSnackbar('An error occured!', {variant: 'error'});
    }
  };

  const renderAddressFields = (
    prefix: 'BillingAddress' | 'DeliveryAddress',
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

  useEffect(() => {
    const getAddress = async () => {
      const local = localStorage.getItem('addresses');
      if (local) {
        const addresses = JSON.parse(local) as Address[];
        const _billing = addresses.find(a => a.type === 'BillingAddress');
        const _delivery = addresses.find(a => a.type === 'DeliveryAddress');

        console.log({addresses, _billing, _delivery});
        if (_billing) setBilling(_billing);
        if (_delivery) setDelivery(_delivery);
      } else if (session?.user.id) {
        const res = await fetch(`/api/users/${session?.user.id}/addresses`);
        const address = (await res.json()) as Address[];
        console.log({
          address: address.filter(a => a.status === 'CurrentAddress'),
        });
        const _billing = address.find(a => a.type === 'BillingAddress');
        const _delivery = address.find(a => a.type === 'DeliveryAddress');

        if (_billing) setBilling(_billing);
        if (_delivery) setDelivery(_delivery);
      }
    };

    getAddress();
  }, [session]);

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
          {renderAddressFields('BillingAddress', billing)}
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
              {renderAddressFields('DeliveryAddress', delivery)}
            </Grid>
          </CardContent>
        </>
      )}

      <CardContent>
        <Button
          variant="outlined"
          onClick={validateAndSubmit}
          fullWidth
          color="inherit"
          sx={{
            borderImage:
              'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%) 1',
          }}
        >
          Save
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
