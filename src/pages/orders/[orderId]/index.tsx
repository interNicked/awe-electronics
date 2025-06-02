import {Order} from '@/lib/classes/Order';
import prisma from '@/prisma/index';
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';
import {GetServerSidePropsContext} from 'next';
import {notFound} from 'next/navigation';

import {Shipment} from '@/lib/classes/Shipment';
import OrderCard from '@/lib/components/cards/OrderCard';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {orderId: id} = context.query;

  if (!id || Array.isArray(id)) notFound();

  const order = await prisma.order.findUnique({
    where: {id},
  });

  const items = await prisma.orderItem.findMany({
    where: {orderId: id},
  });

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

  let shipment;
  try {
    shipment = await prisma.shipment.findFirstOrThrow({
      where: {addressId: order.deliveryAddressId, orderId: order.id},
    });
  } catch (error: unknown) {
    const e = error as PrismaClientKnownRequestError;
    if (e.meta?.cause === 'No record was found for a query.')
      shipment = await prisma.shipment.create({
        data: {addressId: order.deliveryAddressId, orderId: order.id},
      });
    else throw error;
  }

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
