import {Admin} from '@/lib/classes/Admin';
import {Customer} from '@/lib/classes/Customer';
import CartCard from '@/lib/components/cards/CartCard';
import UserCard from '@/lib/components/cards/UserCard';
import {CartState} from '@/lib/components/hooks/useCart';
import prisma from '@/prisma';
import Prisma from '@prisma/client';
import {GetServerSidePropsContext} from 'next';
import {getServerSession, Session} from 'next-auth';
import {authOptions} from './api/auth/[...nextauth]';
import {v4} from 'uuid';
import {useSession} from 'next-auth/react';

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
    cartItems.push(...(items ?? []));
  }

  return {
    props: {
      user: _user.serialize(),
      cart: {id: cart?.id ?? v4(), items: cartItems},
    },
  };
}
export function AccountPage({
  user,
  cart,
}: {
  user: Session['user'];
  cart: CartState | null;
}) {
  return (
    <>
      <UserCard user={user} />
      <CartCard cart={cart} showDiscounts={false} />
    </>
  );
}

export default AccountPage;
