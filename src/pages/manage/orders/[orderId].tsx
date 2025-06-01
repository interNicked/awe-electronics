import { Order } from '@/lib/classes/Order';
import { AddressTable } from '@/lib/components/AddressTable';
import CartCard from '@/lib/components/cards/CartCard';
import { getRelativeTimeString } from '@/pages/orders';
import prisma from '@/prisma/index';
import { Card, CardHeader, Chip, IconButton, Typography } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useSnackbar } from 'notistack';

import { Shipment } from '@/lib/classes/Shipment';
import ArrowRightIcon from '@mui/icons-material/ArrowForward';
import ContentCopy from '@mui/icons-material/ContentCopy';

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
    where: {orderId: id}
  })

  console.log({addresses});

  return {
    props: {
      order: Order.serialize({
        order,
        items,
        addresses,
      }),
      shipment: Shipment.serialize(shipment)
    },
  };
}

export default function OrderPage({
  order,
  shipment
}: {
  order: ReturnType<typeof Order.serialize>;
  shipment: ReturnType<typeof Shipment.serialize>;
}) {
  const {enqueueSnackbar} = useSnackbar();
  const OrderStatusChip = () => (
    <Chip
      color={order.status === 'paid' ? 'success' : 'default'}
      label={<Typography variant="overline">{order.status}</Typography>}
    />
  );

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar(`Copied ${field} to clipboard`, {
      variant: 'info',
      autoHideDuration: 800,
    });
  };

  return (
    <Card sx={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
      <CardHeader
        title={`Order: ${order.id}`}
        subheader={`Last Updated: ${getRelativeTimeString(order.updatedAt)}`}
        action={
          <>
            <OrderStatusChip />
            <IconButton onClick={() => handleCopy('Order Id', order.id)}>
              <ContentCopy />
            </IconButton>
          </>
        }
      />
      <CartCard
        cardProps={{sx: {p: 0}, variant: 'outlined'}}
        editable={false}
        cart={{
          id: order.id,
          items: order.items.map(i => {
            return {...i, cartId: order.id};
          }),
        }}
      />
      <Card variant="outlined">
        <AddressTable
          addresses={order.addresses.map((a, i) => {
            return {
              ...a,
              type: i === 0 ? 'BillingAddress' : 'DeliveryAddress',
            };
          })}
        />
      </Card>
     <Card variant="outlined">
        <CardHeader
          title={`Shipment: ${shipment.id}`}
          subheader={`Last Updated: ${getRelativeTimeString(shipment.updatedAt)}`}
          action={<>
            <Chip label={<Typography variant='overline'>{shipment.status}</Typography>}/>
            <IconButton href={`/manage/shipments/${shipment.id}`} LinkComponent={Link}>
              <ArrowRightIcon />
            </IconButton>
            </>
          }
        />
      </Card>
    </Card>
  );
}
