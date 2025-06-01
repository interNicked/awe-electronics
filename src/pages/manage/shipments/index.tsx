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
import {Shipment} from '@/lib/classes/Shipment';
import {getRelativeTimeString} from '@/pages/orders';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session || session.user.role !== 'admin') return {notFound: true};

  const shipments = await prisma.shipment.findMany({
    orderBy: {createdAt: 'desc'},
  });

  return {
    props: {shipments: shipments.map(shipment => Shipment.serialize(shipment))},
  };
}

export default function ManageOrdersPage({
  shipments,
}: {
  shipments: ReturnType<typeof Shipment.serialize>[];
}) {
  const StatusChip = (status: (typeof shipments)[number]['status']) => (
    <Chip label={<Typography variant="overline">{status}</Typography>} />
  );

  return (
    <Card>
      <CardHeader title="Shipments"></CardHeader>
      <CardContent>
        <DataGrid
          rows={shipments}
          columnVisibilityModel={{createdAt: false}}
          sx={{height: '75vh'}}
          columns={[
            {
              field: 'id',
              headerName: 'Shipment',
              flex: 2,
              renderCell(params) {
                return (
                  <MLink
                    component={Link}
                    href={`/manage/shipments/${params.row.id}`}
                  >
                    <Typography sx={{mt: '1rem'}}>{params.row.id}</Typography>
                  </MLink>
                );
              },
            },
            {
              field: 'orderId',
              headerName: 'Order',
              flex: 2,
              renderCell(params) {
                return (
                  <MLink
                    component={Link}
                    href={`/manage/orders/${params.row.orderId}`}
                  >
                    <Typography sx={{mt: '1rem'}}>
                      {params.row.orderId}
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
                return StatusChip(params.row.status);
              },
            },
            {
              field: 'createdAt',
              headerName: 'Created',
              flex: 1,
              renderCell: params => {
                return (
                  <>{getRelativeTimeString(new Date(params.row.createdAt))}</>
                );
              },
            },
            {
              field: 'updatedAt',
              headerName: 'Updated',
              flex: 1,
              renderCell: params => {
                return (
                  <>{getRelativeTimeString(new Date(params.row.updatedAt))}</>
                );
              },
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
