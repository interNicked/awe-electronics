import {useCart} from '@/lib/components/hooks/useCart';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Link as MLink,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  Button,
} from '@mui/material';
import {DataGrid, GridCell} from '@mui/x-data-grid';
import Link from 'next/link';
import {useState} from 'react';

export function CartPage() {
  const {state} = useCart();
  const [discounts, setDiscounts] = useState([]);

  return (
    <>
      <Card>
        <CardHeader title="Cart" subheader={`Cart ID: ${state.id}`} />
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
              {state.items.map(i => (
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
              <TableRow>
                <TableCell>Discounts</TableCell>
                <TableCell>{discounts.length}</TableCell>
                <TableCell>
                  - ${discounts.reduce((pv, cv) => (pv += cv), 0).toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
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
          <Button
            variant="outlined"
            fullWidth
            sx={{my: '1rem'}}
            disabled={state.items.length === 0}
          >
            Checkout
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export default CartPage;
