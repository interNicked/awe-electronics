import {Card, CardHeader, Chip, Typography} from '@mui/material';
import Prisma from '@prisma/client';

export function UserCard({user}: {user: Prisma.User}) {
  return (
    <Card>
      <CardHeader
        title={user.email}
        subheader={`ID: ${user.id}`}
        action={
          <Chip
            label={<Typography variant="overline">{user.role}</Typography>}
            color={user.role === 'admin' ? 'warning' : 'info'}
          />
        }
      />
    </Card>
  );
}

export default UserCard;
