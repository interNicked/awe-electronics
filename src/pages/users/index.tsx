import {useUsers} from '@/lib/components/hooks/useUsers';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Link as MLink,
} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid/DataGrid';
import Link from 'next/link';

import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Close';

export default function UsersIndexPage() {
  const {users} = useUsers();

  const UserTypeChip = (user: (typeof users)[number]) => (
    <Chip
      color={user.role !== 'customer' ? 'secondary' : 'primary'}
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
            columns={[
              {
                field: 'email',
                flex: 2,
                renderCell(params) {
                  return (
                    <MLink
                      component={Link}
                      href={`/users/${params.row.id}`}
                      sx={{mt: '20%'}}
                    >
                      <Typography>{params.row.email}</Typography>
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
