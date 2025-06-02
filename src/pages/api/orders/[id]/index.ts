// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Prisma, {OrderStatus} from '@prisma/client';
import type {NextApiRequest, NextApiResponse} from 'next';
import {getServerSession} from 'next-auth';
import {notFound} from 'next/navigation';
import z from 'zod';
import prisma from '../../../../prisma';
import {authOptions} from '../../auth/[...nextauth]';
import OrderSchema from '@/lib/schemas/OrderSchema';

const PostSchema = OrderSchema.extend({
  id: z.string().uuid(),
  userId: z.string().optional(),
  status: z.nativeEnum(OrderStatus),
  billingAddressId: z.string().uuid(),
  deliveryAddressId: z.string().uuid(),
});

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
    case 'POST':
      const {data, error} = PostSchema.safeParse({
        ...req.body,
        ...req.query,
      });
      if (error) {
        res.status(400).json(error);
        return;
      }

      const order = await prisma.order.update({
        where: {id: data.id},
        data: {
          status: data.status,
        },
      });

      res.json(order);
      return;

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
