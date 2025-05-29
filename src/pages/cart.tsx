import CartCard from '@/lib/components/cards/CartCard';
import {useCart} from '@/lib/components/hooks/useCart';
import {Box, Button} from '@mui/material';
import Link from 'next/link';

export function CartPage() {
  const {state, clearCart} = useCart();

  return (
    <>
      <CartCard />
      <Box sx={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
        <Button
          variant="outlined"
          fullWidth
          disabled={state.items.length === 0}
          onClick={clearCart}
          color='warning'
        >
          Empty Cart
        </Button>
        <Button
          variant="outlined"
          fullWidth
          disabled={state.items.length === 0}
          href="/checkout"
          LinkComponent={Link}
        >
          Checkout
        </Button>
      </Box>
    </>
  );
}

export default CartPage;
