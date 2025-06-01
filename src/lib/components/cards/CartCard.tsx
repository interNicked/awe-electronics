import {
  Card,
  CardProps,
  IconButton,
  Link as MLink,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from '@mui/material';
import Link from 'next/link';
import {useState} from 'react';
import {CartState, useCart} from '../hooks/useCart';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import useProducts from '../hooks/useProducts';

export function CartCard({
  cart: _cart,
  showDiscounts = true,
  editable = true,
  cardProps = { variant: 'outlined'},
}: {
  cart?: CartState | null;
  showDiscounts?: boolean;
  editable?: boolean;
  cardProps?: CardProps;
}) {
  const {state, removeItem, addItem, getTotal} = useCart();
  const [discounts, setDiscounts] = useState([]);
  const {products, productOptions} = useProducts();

  const cart = _cart ?? state;

  const handleRemoveFromCart = (id: string, quantity: number = 1) =>
    removeItem(id, quantity);
  const handleRemoveAllFromCart = (id: string) => removeItem(id);

  return (
    <Card {...cardProps}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{fontWeight: 'bold'}}>Product</TableCell>
            <TableCell sx={{fontWeight: 'bold'}}>Qty</TableCell>
            <TableCell sx={{fontWeight: 'bold'}}>Price</TableCell>
            {editable && <TableCell></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.items.map(i => {
            const opt = productOptions.find(o => o.id === i.productOptionId);

            return (
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
                {editable && (
                  <TableCell align="right">
                    <IconButton
                      sx={{':hover': {color: 'red'}}}
                      onClick={() => handleRemoveAllFromCart(i.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      sx={{':hover': {color: 'orange'}}}
                      onClick={() => handleRemoveFromCart(i.id)}
                      disabled={i.quantity <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <IconButton
                      sx={{':hover': {color: 'green'}}}
                      disabled={!opt || opt.stock <= i.quantity}
                      onClick={() => addItem({...i, quantity: 1})}
                    >
                      <AddIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          {showDiscounts && (
            <TableRow>
              <TableCell>Discounts</TableCell>
              <TableCell>{discounts.length}</TableCell>
              <TableCell>
                - ${discounts.reduce((pv, cv) => (pv += cv), 0).toFixed(2)}
              </TableCell>
              {editable && <TableCell></TableCell>}
            </TableRow>
          )}
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>
              {(cart ?? state).items.reduce((pv, cv) => (pv += cv.quantity), 0)}
            </TableCell>
            <TableCell colSpan={editable ? 2 : 1} sx={{fontWeight: 'bold'}}>
              $
              {(cart
                ? cart.items.reduce(
                    (pv, cv) =>
                      (pv += cv.quantity * (cv.basePrice + cv.extraPrice)),
                    0,
                  )
                : getTotal()
              ).toFixed(2)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  );
}

export default CartCard;
