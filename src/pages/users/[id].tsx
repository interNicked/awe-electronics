import { Admin } from '@/lib/classes/Admin';
import { Customer } from '@/lib/classes/Customer';
import CartCard from '@/lib/components/cards/CartCard';
import UserCard from '@/lib/components/cards/UserCard';
import { CartState } from '@/lib/components/hooks/useCart';
import prisma from '@/prisma/index';
import Prisma from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import { notFound } from 'next/navigation';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {id} = context.query;
  let props: {user?: Partial<Prisma.User>, cart?: CartState | null} = { cart: null}

  if (!id || Array.isArray(id)) notFound();

  console.log({id});

  const user = await prisma.user.findUnique({
    where: {id},
  });

  console.log({user});

  if (!user) return {notFound: true};

  const _user = user.role === 'customer' ? new Customer(user) : new Admin(user);
  props['user'] = _user.serialize();

  const cart = await prisma.cart.findFirst({
    where: {userId: _user.id},
  });
  const cartItems: Prisma.CartItem[] = [];

  if (cart) {
    const items = await prisma.cartItem.findMany({
        where: {cartId: cart.id},
    })
    cartItems.push(
      ...(items ?? []),
    );
    props['cart'] = {id: cart.id, items: cartItems};
  }

  return {
    props
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
