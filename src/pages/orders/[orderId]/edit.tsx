import {Order} from '@/lib/classes/Order';
import {Shipment} from '@/lib/classes/Shipment';
import {AddressTable} from '@/lib/components/AddressTable';
import CartCard from '@/lib/components/cards/CartCard';
import {ShipmentCard} from '@/lib/components/cards/ShipmentCard';
import RelativeTime from '@/lib/components/RelativeTime';
import {authOptions} from '@/pages/api/auth/[...nextauth]';
import prisma from '@/prisma/index';
import {Card, CardHeader, Chip, IconButton, Typography} from '@mui/material';
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';
import {GetServerSidePropsContext} from 'next';
import {getServerSession} from 'next-auth';
import {notFound} from 'next/navigation';
import {useSnackbar} from 'notistack';

import ContentCopy from '@mui/icons-material/ContentCopy';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session || session.user.role !== 'admin') return {notFound: true};

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

export default function OrderPage({
  order,
  shipment,
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
        subheader={
          <RelativeTime
            date={new Date(shipment.updatedAt)}
            prefix="Last Updated: "
          />
        }
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
      <ShipmentCard shipment={shipment} />
    </Card>
  );
}
