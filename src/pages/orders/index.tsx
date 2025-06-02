import {Order} from '@/lib/classes/Order';
import RelativeTime from '@/lib/components/RelativeTime';
import prisma from '@/prisma/index';
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  InputAdornment,
  Link as MLink,
  TextField,
  Typography,
} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid/DataGrid';
import Prisma from '@prisma/client';
import {GetServerSidePropsContext} from 'next';
import {getServerSession} from 'next-auth';
import Link from 'next/link';
import {authOptions} from '../api/auth/[...nextauth]';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session?.user.id) return {notFound: true};

  const orders = await prisma.order.findMany({
    where: {userId: session.user.id},
  });

  if (!orders) return {notFound: true};

  return {
    props: {orders: orders.map(order => Order.serialize({order}))},
  };
}

export default function OrdersIndexPage({orders}: {orders: Prisma.Order[]}) {
  const OrderStatusChip = (order: (typeof orders)[number]) => (
    <Chip
      color={order.status === 'paid' ? 'success' : 'default'}
      label={<Typography variant="overline">{order.status}</Typography>}
    />
  );

  return (
    <>
      <Card>
        <CardHeader title="My Orders" />
        <CardContent>
          <DataGrid
            rows={orders}
            sx={{height: '75vh'}}
            columns={[
              {
                field: 'id',
                headerName: 'ID',
                flex: 2,
                renderCell(params) {
                  return (
                    <MLink component={Link} href={`/orders/${params.row.id}`}>
                      <Typography sx={{mt: '0.75rem'}}>
                        {params.row.id}
                      </Typography>
                    </MLink>
                  );
                },
              },
              {
                field: 'status',
                flex: 1,
                headerName: 'Status',
                renderCell(params) {
                  return OrderStatusChip(params.row);
                },
              },
              {
                field: 'total',
                headerName: '$',
                renderCell: params => (
                  <TextField
                    disabled
                    variant="standard"
                    sx={{mt: '0.75rem'}}
                    value={params.row.total.toFixed(2)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      },
                    }}
                  />
                ),
              },
              {
                field: 'createdAt',
                headerName: 'Created',
                flex: 1,
                renderCell: params => {
                  return <RelativeTime date={new Date(params.row.createdAt)} />;
                },
              },
              {
                field: 'updatedAt',
                headerName: 'Updated',
                flex: 1,
                renderCell: params => {
                  return <RelativeTime date={new Date(params.row.createdAt)} />;
                },
              },
            ]}
          />
        </CardContent>
      </Card>
    </>
  );
}
