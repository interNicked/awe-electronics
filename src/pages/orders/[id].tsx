import {Admin} from '@/lib/classes/Admin';
import {Customer} from '@/lib/classes/Customer';
import {Order} from '@/lib/classes/Order';
import CartCard from '@/lib/components/cards/CartCard';
import {CartState} from '@/lib/components/hooks/useCart';
import prisma from '@/prisma/index';
import {Card, CardHeader, Chip, Typography} from '@mui/material';
import Prisma from '@prisma/client';
import {GetServerSidePropsContext} from 'next';
import {notFound} from 'next/navigation';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {id} = context.query;

  if (!id || Array.isArray(id)) notFound();

  console.log({id});

  const order = await prisma.order.findUnique({
    where: {id},
  });

  const items = await prisma.orderItem.findMany({
    where: {orderId: id},
  });

  console.log({order});

  if (!order) return {notFound: true};

  return {
    props: {order: Order.serialize({order, items})},
  };
}

export default function OrderPage({
  order,
}: {
  order: ReturnType<typeof Order.serialize>;
}) {
  const OrderStatusChip = () => (
    <Chip
      color={order.status === 'paid' ? 'success' : 'default'}
      label={<Typography variant="overline">{order.status}</Typography>}
    />
  );

  return (
    <>
      <Card>
        <CardHeader title={`Order: ${order.id}`} action={<OrderStatusChip />} />
        <CartCard
          editable={false}
          cart={{
            id: order.id,
            items: order.items.map(i => {
              return {...i, cartId: order.id};
            }),
          }}
        />
      </Card>
    </>
  );
}
