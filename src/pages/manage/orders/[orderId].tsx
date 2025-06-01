import {Order} from '@/lib/classes/Order';
import {Shipment} from '@/lib/classes/Shipment';
import OrderCard from '@/lib/components/cards/OrderCard';
import prisma from '@/prisma';
import {GetServerSidePropsContext} from 'next';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {orderId: id} = context.query;

  if (!id || Array.isArray(id)) return {notFound: true};

  console.log({id});

  const order = await prisma.order.findUnique({
    where: {id},
  });

  const items = await prisma.orderItem.findMany({
    where: {orderId: id},
  });

  console.log({order});

  if (!order) return {notFound: true};

  const addresses = await Promise.all([
    prisma.address.findUniqueOrThrow({
      where: {
        id: order.billingAddressId,
      },
    }),
    prisma.address.findUniqueOrThrow({
      where: {id: order.deliveryAddressId},
    }),
  ]);

  const shipment = await prisma.shipment.findFirstOrThrow({
    where: {orderId: id},
  });

  console.log({addresses});

  return {
    props: {
      order: Order.serialize({
        order,
        items,
        addresses,
      }),
      shipment: Shipment.serialize(shipment),
    },
  };
}

export function OrderPage({
  order,
  shipment,
}: {
  order: ReturnType<typeof Order.serialize>;
  shipment: ReturnType<typeof Shipment.serialize>;
}) {
  return <OrderCard order={order} shipment={shipment} />;
}

export default OrderPage;
