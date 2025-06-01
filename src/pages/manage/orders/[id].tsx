import {Order} from '@/lib/classes/Order';
import prisma from '@/prisma/index';
import {GetServerSidePropsContext} from 'next';
import {notFound} from 'next/navigation';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {id} = context.query;
  if (!id || Array.isArray(id)) notFound();

  console.log({id});

  const order = await prisma.order.findUnique({
    where: {id},
  });

  if (!order) return {notFound: true};

  return {
    props: {
      user: Order.serialize({order}),
    },
  };
}

export default function ManageOrderPage({
  order,
}: {
  order: ReturnType<typeof Order.serialize>;
}) {
  return <></>;
}
