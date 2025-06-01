// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {ShipmentSchema} from '@/lib/schemas/Shipment';
import Prisma from '@prisma/client';
import type {NextApiRequest, NextApiResponse} from 'next';
import {getServerSession} from 'next-auth';
import {notFound} from 'next/navigation';
import z from 'zod';
import prisma from '../../../prisma';
import {authOptions} from '../auth/[...nextauth]';
import {v4} from 'uuid';

const PostSchema = ShipmentSchema;

const GetSchema = z.object({
  id: z.string().uuid().optional(),
  addressId: z.string().uuid().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    Prisma.Shipment | Prisma.Shipment[] | z.ZodError | `Error: ${string}`
  >,
) {
  const session = await getServerSession(req, res, authOptions);

  switch (req.method) {
    case 'POST':
      const {error: postError, data: postData} = PostSchema.safeParse({
        ...req.body,
        ...req.query,
      });
      if (postError) {
        res.status(400).send(postError);
        return;
      }

      const shipment = await prisma.shipment.update({
        where: {id: postData.id},
        data: {
          ...postData,
          shippedAt: postData.shippedAt ? new Date(postData.shippedAt) : null,
          eta: postData.eta ? new Date(postData.eta) : null,
          updatedAt: new Date(postData.updatedAt ?? new Date().valueOf()),
          createdAt: new Date(postData.createdAt ?? new Date().valueOf()),
        },
      });

      res.send(shipment);
      break;

    case 'GET':
      const {data: getData, error: getError} = GetSchema.safeParse({
        ...req.body,
        ...req.query,
      });
      if (getError) {
        res.status(400).json(getError);
        return;
      }
      const {id, addressId} = getData;
      if (id || addressId) {
        const shipment = id
          ? await prisma.shipment.findUnique({where: {id}})
          : await prisma.shipment.findMany({where: {addressId}});

        if (!shipment) notFound();

        res.send(shipment);
      } else {
        if (session?.user.role !== 'admin') notFound();
        const shipments = await prisma.shipment.findMany();

        res.send(shipments);
      }

      break;
    default:
      res.status(405).send(`Error: method not allowed`);
      break;
  }
}
