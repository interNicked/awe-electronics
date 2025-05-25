import {GetServerSidePropsContext} from 'next';
import prisma from '@/prisma/index';
import {notFound} from 'next/navigation';
import Prisma from '@/prisma/generated';
import {Card, CardHeader} from '@mui/material';
import {Customer} from '@/lib/classes/Customer';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {id} = context.query;

  if (!id || Array.isArray(id)) notFound();

  const user = await prisma.user.findUnique({
    where: {id},
  });

  if (!user) notFound();

  const carts = await prisma.cart.findMany({
    where: {userId: id},
  });

  return {
    props: {user: Customer.serialize(user), carts},
  };
}

export default function UserPage({user}: {user: Prisma.User}) {
  return (
    <>
      <Card>
        <CardHeader
          title={user.email}
          subheader={`Joined ${new Date(user.createdAt).toDateString()}`}
        />
      </Card>
    </>
  );
}
