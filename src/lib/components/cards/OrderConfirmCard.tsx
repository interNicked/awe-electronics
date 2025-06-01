import {Order} from '@/lib/classes/Order';
import OrderSchema from '@/lib/schemas/OrderSchema';
import {Alert, Box, Button, Card, CardContent} from '@mui/material';
import {useRouter} from 'next/router';
import {useSnackbar} from 'notistack';
import {useEffect, useState} from 'react';
import AddressTable from '../AddressTable';
import {useCart} from '../hooks/useCart';
import useProducts from '../hooks/useProducts';
import CartCard from './CartCard';

export function OrderConfirmCard() {
  const {products, productOptions} = useProducts();
  const {enqueueSnackbar} = useSnackbar();
  const [addresses, setAddresses] = useState<
    ReturnType<typeof Order.serialize>['addresses']
  >([]);
  const {state, getTotal, clearCart} = useCart();
  const router = useRouter();
  const {items} = state;
  const [orderInvalid, setOrderInvalid] = useState<
    {itemTitle: string; reason: string}[] | false
  >(false);

  useEffect(() => {
    const local = localStorage.getItem('addresses');

    if (local) {
      const addresses = JSON.parse(local) as ReturnType<
        typeof Order.serialize
      >['addresses'];
      setAddresses(addresses);
    }
  }, []);

  const validateAndSubmitOrder = async () => {
    const {data, success, error} = OrderSchema.safeParse({
      total: getTotal(),
      items,
      addresses,
    });

    if (error) {
      error.issues.forEach(i => enqueueSnackbar(i.message, {variant: 'error'}));
      console.error(error);
      return;
    } else if (success) {
      const invalidItems = data.items.filter(i => {
        const opt = productOptions.find(o => o.id === i.productOptionId);
        if (!opt) throw new Error('Cant find product option');

        return i.quantity > opt.stock;
      });
      console.log({invalidItems});
      if (invalidItems.length !== 0) {
        setOrderInvalid(
          invalidItems.map(i => {
            const reason = 'Invalid Order - Not Enough ' + i.title;

            enqueueSnackbar(reason, {
              variant: 'error',
            });

            return {itemTitle: i.title, reason};
          }),
        );

        return;
      }
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });
      const order = await res.json();
      console.table(order);
      if (res.ok) {
        enqueueSnackbar('Order Submitted', {variant: 'success'});
        router.push(`/orders/${order.id}`).finally(() => clearCart());
      }
    }
  };

  return (
    <>
      <Box
        sx={{display: 'flex', flexDirection: 'column', gap: '1rem'}}
      >
        <CartCard editable={false} />
        {orderInvalid && (
          <>
            {orderInvalid.map((a, i) => (
              <Alert key={`invalid-reason-${i}`} severity="error">
                {a.reason}
              </Alert>
            ))}
          </>
        )}
        <AddressTable addresses={addresses} />
        <Button
          variant="outlined"
          fullWidth
          sx={{
            mt: '1rem',
            borderImage:
              'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%) 1',
          }}
          disabled={!!orderInvalid}
          onClick={validateAndSubmitOrder}
        >
          SUBMIT
        </Button>
      </Box>
    </>
  );
}

export default OrderConfirmCard;
