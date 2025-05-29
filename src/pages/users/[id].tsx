import {GetServerSidePropsContext} from 'next';
import prisma from '@/prisma/index';
import {notFound} from 'next/navigation';
import Prisma from '@prisma/client';
import {Card, CardHeader} from '@mui/material';
import {Customer} from '@/lib/classes/Customer';
import {Admin} from '@/lib/classes/Admin';
import CartCard from '@/lib/components/cards/CartCard';
import {v4} from 'uuid';
import {CartState} from '@/lib/components/hooks/useCart';
import UserCard from '@/lib/components/cards/UserCard';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {id} = context.query;

  if (!id || Array.isArray(id)) notFound();

  console.log({id});

  const user = await prisma.user.findUnique({
    where: {id},
  });

  console.log({user});

  if (!user) return {notFound: true};

  const _user = user.role === 'customer' ? new Customer(user) : new Admin(user);

  const cart = await prisma.cart.findFirst({
    where: {userId: _user.id},
  });
  const cartItems: Prisma.CartItem[] = [];

  if (cart) {
    cartItems.push(
      ...((await prisma.cartItem.findMany({
        where: {cartId: cart.id},
      })) ?? []),
    );
  }

  return {
    props: {
      user: _user.serialize(),
      cart: cart
        ? {
            id: cart.id,
          }
        : null,
    },
  };
}

export default function UserPage({
  user,
  cart: cart,
}: {
  user: Prisma.User;
  cart: CartState | null;
}) {
  return (
    <>
      <UserCard user={user} />
      <CartCard cart={cart} showDiscounts={false} />
    </>
  );
}
