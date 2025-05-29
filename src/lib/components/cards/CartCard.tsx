import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Link as MLink,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { CartState, useCart } from '../hooks/useCart';

export function CartCard({
  cart: _cart,
  showDiscounts = true,
}: {
  cart?: CartState | null;
  showDiscounts?: boolean;
}) {
  const {state} = useCart();
  const [discounts, setDiscounts] = useState([]);

  const cart = _cart ?? state;

  console.log({cart})

  return (
    <Card>
      <CardHeader
        title="Cart"
        subheader={state.id ? `Cart ID: ${state.id}` : undefined}
      />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold'}}>Product</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Price</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Qty</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.items.map(i => (
              <TableRow key={i.id}>
                <TableCell>
                  <MLink component={Link} href={`/products/${i.productId}`}>
                    {i.title}
                  </MLink>
                </TableCell>
                <TableCell>{i.quantity}</TableCell>
                <TableCell>
                  $
                  {(i.productOptionId
                    ? i.basePrice + i.extraPrice
                    : i.basePrice
                  ).toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            {showDiscounts && (
              <TableRow>
                <TableCell>Discounts</TableCell>
                <TableCell>{discounts.length}</TableCell>
                <TableCell>
                  - ${discounts.reduce((pv, cv) => (pv += cv), 0).toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>
                {state.items.reduce((pv, cv) => (pv += cv.quantity), 0)}
              </TableCell>
              <TableCell colSpan={2} sx={{fontWeight: 'bold'}}>
                $
                {state.items
                  .reduce((pv, cv) => (pv += cv.basePrice + cv.extraPrice), 0)
                  .toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}

export default CartCard;
