import {Address} from '@/lib/schemas/AddressSchema';
import OrderSchema from '@/lib/schemas/OrderSchema';
import {
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import {useRouter} from 'next/router';
import {useSnackbar} from 'notistack';
import {useEffect, useState} from 'react';
import {useCart} from '../hooks/useCart';
import useProducts from '../hooks/useProducts';
import CartCard from './CartCard';

export function OrderConfirmCard() {
  const {products, productOptions} = useProducts();
  const {enqueueSnackbar} = useSnackbar();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const {state, getTotal, clearCart} = useCart();
  const router = useRouter();
  const [orderInvalid, setOrderInvalid] = useState(false);
  const {items} = state;

  useEffect(() => {
    const local = localStorage.getItem('addresses');

    if (local) {
      const addresses = JSON.parse(local) as Address[];
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
        setOrderInvalid(true);
        invalidItems.forEach(i =>
          enqueueSnackbar(
            'Invalid Order - Not Enough ' + i.title,
            {variant: 'error'},
          ),
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
      <CartCard editable={false} />
      <Card>
        <CardContent>
          <Table>
            <TableBody>
              {addresses.map((a, i) => (
                <TableRow key={a.type}>
                  <TableCell sx={{fontWeight: 'bold'}}>
                    {a.type === 'BillingAddress' ? 'Billing' : 'Delivery'}{' '}
                    Address
                  </TableCell>
                  <TableCell>{a.fullName}</TableCell>
                  <TableCell>
                    {a.addressLine1}
                    {a.addressLine2 && (
                      <>
                        <br /> {a.addressLine2}
                      </>
                    )}
                    , {a.city}, {a.state}, {a.country}, {a.postcode}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              mt: '1rem',
              borderImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%) 1',
            }}
            disabled={orderInvalid}
            onClick={validateAndSubmitOrder}
          >
            SUBMIT
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export default OrderConfirmCard;
