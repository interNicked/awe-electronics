import {useUsers} from '@/lib/components/hooks/useUsers';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Typography,
  Link as MLink,
} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid/DataGrid';
import Link from 'next/link';

import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Close';
import {GetServerSidePropsContext} from 'next';
import {getServerSession} from 'next-auth';
import {authOptions} from '../../api/auth/[...nextauth]';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session || session.user.role !== 'admin') return {notFound: true};
  return {props: {}};
}

export default function UsersIndexPage() {
  const {users} = useUsers();

  const UserTypeChip = (user: (typeof users)[number]) => (
    <Chip
      color={user.role !== 'customer' ? 'secondary' : 'default'}
      label={<Typography variant="overline">{user.role}</Typography>}
    />
  );

  return (
    <>
      <Card>
        <CardHeader title="Users"></CardHeader>
        <CardContent>
          <DataGrid
            rows={users}
            sx={{height: '75vh'}}
            columns={[
              {
                field: 'email',
                flex: 2,
                renderCell(params) {
                  return (
                    <MLink
                      component={Link}
                      href={`/manage/users/${params.row.id}`}
                      sx={{mt: '20%'}}
                    >
                      <Typography sx={{mt: '1rem'}}>
                        {params.row.email}
                      </Typography>
                    </MLink>
                  );
                },
              },
              {
                field: 'role',
                flex: 1,
                headerName: 'Role',
                renderCell(params) {
                  return UserTypeChip(params.row);
                },
              },
              {
                field: 'verified',
                headerName: 'Verified',
                renderCell: params => (
                  <Avatar
                    sx={{
                      height: '1.5rem',
                      width: '1.5rem',
                      margin: 'auto',
                      mt: '17.5%',
                      bgcolor: params.row.isVerified ? 'green' : 'red',
                    }}
                  >
                    {params.row.isVerified ? (
                      <CheckIcon fontSize="small" />
                    ) : (
                      <CancelIcon fontSize="small" />
                    )}
                  </Avatar>
                ),
              },
              {field: 'createdAt', flex: 1},
            ]}
          />
        </CardContent>
      </Card>
    </>
  );
}
