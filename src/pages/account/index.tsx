import {Address} from '@/lib/classes/Address';
import {Admin} from '@/lib/classes/Admin';
import {Customer} from '@/lib/classes/Customer';
import AddressTable from '@/lib/components/AddressTable';
import CartCard from '@/lib/components/cards/CartCard';
import UserCard from '@/lib/components/cards/UserCard';
import {CartState} from '@/lib/components/hooks/useCart';
import prisma from '@/prisma';
import Prisma from '@prisma/client';
import {GetServerSidePropsContext} from 'next';
import {getServerSession} from 'next-auth';
import {v4} from 'uuid';
import {authOptions} from '../api/auth/[...nextauth]';
import {Box, Card, CardHeader} from '@mui/material';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session?.user.id) return {notFound: true};

  const user = await prisma.user.findUnique({
    where: {id: session.user.id},
  });

  if (!user) return {notFound: true};

  const _user = user.role === 'customer' ? new Customer(user) : new Admin(user);

  const cart = await prisma.cart.findFirst({
    where: {userId: session.user.id},
  });
  const cartItems: Prisma.CartItem[] = [];

  if (cart) {
    const items = await prisma.cartItem.findMany({
      where: {cartId: cart.id},
    });
    items.forEach(i => cartItems.push(i));
  }

  const addresses = await prisma.address.findMany({
    where: {userId: user.id},
  });

  return {
    props: {
      user: _user.serialize(),
      cart: {id: cart?.id ?? v4(), items: cartItems},
      addresses: addresses.map(a => Address.serialize(a)),
    },
  };
}
export function AccountPage({
  user,
  cart,
  addresses,
}: {
  user: Prisma.User;
  cart: CartState | null;
  addresses: ReturnType<typeof Address.serialize>[];
}) {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
      <UserCard user={user} />
      <CartCard cart={cart} showDiscounts={false} />
      <Card>
        <CardHeader title="Addresses" />
        <AddressTable addresses={addresses} />
      </Card>
    </Box>
  );
}

export default AccountPage;
