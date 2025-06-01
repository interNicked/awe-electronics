import { Shipment } from '@/lib/classes/Shipment';
import prisma from '@/prisma/index';
import {GetServerSidePropsContext} from 'next';
import {notFound} from 'next/navigation';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {id} = context.query;
  if (!id || Array.isArray(id)) notFound();

  const shipment = await prisma.shipment.findUnique({
    where: {id},
  });

  if (!shipment) return {notFound: true};

  return {
    props: {
      shipment: Shipment.serialize(shipment),
    },
  };
}

export default function ManageOrderPage({
  shipment,
}: {
  shipment: ReturnType<typeof Shipment.serialize>;
}) {
  return <>
  </>;
}
