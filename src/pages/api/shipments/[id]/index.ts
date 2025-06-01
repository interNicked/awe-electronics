// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Prisma from '@prisma/client';
import type {NextApiRequest, NextApiResponse} from 'next';
import {getServerSession} from 'next-auth';
import {notFound} from 'next/navigation';
import z from 'zod';
import prisma from '../../../../prisma';
import {authOptions} from '../../auth/[...nextauth]';

const GetSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    Prisma.Order | Prisma.Order[] | z.ZodError | `Error: ${string}`
  >,
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) notFound();

  switch (req.method) {
    case 'GET':
      const {data: getData, error: getError} = GetSchema.safeParse({
        ...req.body,
        ...req.query,
      });
      if (getError) {
        res.status(400).json(getError);
        return;
      }
      const {id, userId} = getData;
      if (id || userId) {
        const order = id
          ? await prisma.order.findUnique({where: {id}})
          : await prisma.order.findMany({where: {userId}});

        if (!order) notFound();

        res.send(order);
      } else {
        if (session.user.role !== 'admin') notFound();
        const orders = await prisma.order.findMany();

        res.send(orders);
      }

      break;
    default:
      res.status(405).send('Error: method not allowed');
      break;
  }
}
