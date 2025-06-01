import {Order} from '@/lib/classes/Order';
import {AddressTable} from '@/lib/components/AddressTable';
import CartCard from '@/lib/components/cards/CartCard';
import prisma from '@/prisma/index';
import {Card, CardHeader, Chip, IconButton, Typography} from '@mui/material';
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';
import {GetServerSidePropsContext} from 'next';
import {notFound} from 'next/navigation';
import {getRelativeTimeString} from '..';

import {Shipment} from '@/lib/classes/Shipment';
import {ShipmentCard} from '@/lib/components/cards/ShipmentCard';
import ContentCopy from '@mui/icons-material/ContentCopy';
import {useSnackbar} from 'notistack';
import OrderCard from '@/lib/components/cards/OrderCard';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {orderId: id} = context.query;

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
  return <OrderCard order={order} shipment={shipment} />
}

export default OrderPage;
