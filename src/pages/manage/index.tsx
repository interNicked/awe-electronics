import {Box, Card, CardHeader, IconButton} from '@mui/material';
import {GetServerSidePropsContext} from 'next';
import {getServerSession} from 'next-auth';
import Link from 'next/link';
import {authOptions} from '../api/auth/[...nextauth]';

import ArrowRightIcon from '@mui/icons-material/ArrowForward';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session || session.user.role !== 'admin') return {notFound: true};
  else return {props: {}};
}

export function ManagePage() {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
      <Card variant="outlined">
        <CardHeader
          title={`Users`}
          action={
            <IconButton href="/manage/users" LinkComponent={Link}>
              <ArrowRightIcon />
            </IconButton>
          }
        />
      </Card>
      <Card variant="outlined">
        <CardHeader
          title={`Orders`}
          action={
            <IconButton href="/manage/orders" LinkComponent={Link}>
              <ArrowRightIcon />
            </IconButton>
          }
        />
      </Card>
      <Card variant="outlined">
        <CardHeader
          title={`Shipments`}
          action={
            <IconButton href="/manage/shipments" LinkComponent={Link}>
              <ArrowRightIcon />
            </IconButton>
          }
        />
      </Card>
    </Box>
  );
}

export default ManagePage;
