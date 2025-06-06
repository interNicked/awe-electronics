import {Order} from '@/lib/classes/Order';
import RelativeTime from '@/lib/components/RelativeTime';
import prisma from '@/prisma';
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Link as MLink,
  Typography,
} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid/DataGrid';
import {GetServerSidePropsContext} from 'next';
import {getServerSession} from 'next-auth';
import Link from 'next/link';
import {authOptions} from '../../api/auth/[...nextauth]';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session || session.user.role !== 'admin') return {notFound: true};

  const orders = await prisma.order.findMany({
    orderBy: {createdAt: 'desc'},
  });

  return {props: {orders: orders.map(order => Order.serialize({order}))}};
}

export default function ManageOrdersPage({
  orders,
}: {
  orders: ReturnType<typeof Order.serialize>[];
}) {
  const StatusChip = (status: (typeof orders)[number]['status']) => (
    <Chip label={<Typography variant="overline">{status}</Typography>} />
  );

  return (
    <Card>
      <CardHeader title="Orders"></CardHeader>
      <CardContent>
        <DataGrid
          rows={orders}
          sx={{height: '75vh'}}
          columns={[
            {
              field: 'id',
              flex: 2,
              renderCell(params) {
                return (
                  <MLink
                    component={Link}
                    href={`/manage/orders/${params.row.id}`}
                  >
                    <Typography sx={{mt: '1rem'}}>{params.row.id}</Typography>
                  </MLink>
                );
              },
            },
            {
              field: 'status',
              flex: 1,
              headerName: 'Status',
              renderCell(params) {
                return StatusChip(params.row.status);
              },
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
                return <RelativeTime date={new Date(params.row.updatedAt)} />;
              },
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
