// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../prisma';
import Prisma from '@prisma/client';
import z from 'zod';
import {notFound} from 'next/navigation';
import {getServerSession} from 'next-auth';
import {authOptions} from '../auth/[...nextauth]';
import OrderSchema from '@/lib/schemas/OrderSchema';

const PostSchema = OrderSchema

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

  switch (req.method) {
    case 'POST':
      const {error: postError, data: postData} = OrderSchema.safeParse({
        ...req.body,
        ...req.query,
      });
      if (postError) {
        res.status(400).send(postError);
        return;
      }

      const deliveryAddress = postData.addresses.find(
        a => a.type === 'DeliveryAddress',
      );

      const billingAddress = postData.addresses.find(
        a => a.type === 'DeliveryAddress',
      );

      if (!deliveryAddress?.id) {
        res.status(400).send('Error: Missing Address ID (delivery)');
        return;
      }

      if (!billingAddress?.id) {
        res.status(400).send('Error: Missing Address ID (billing)');
        return;
      }

      const order = await prisma.order.create({
        data: {
          total: postData.total,
          userId: session?.user.id,
          items: {create: postData.items},
          billingAddressId: billingAddress.id,
          shipment: {
            create: {
              address: {
                connect: {
                  id: deliveryAddress.id,
                },
              },
            },
          },
        },
      });

      res.send(order);
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
      const {id, userId} = getData;
      if (id || userId) {
        const order = id
          ? await prisma.order.findUnique({where: {id}})
          : await prisma.order.findMany({where: {userId}});

        if (!order) notFound();

        res.send(order);
      } else {
        if (session?.user.role !== 'admin') notFound();
        const orders = await prisma.order.findMany();

        res.send(orders);
      }

      break;
    default:
      res.status(405).send(`Error: method not allowed`);
      break;
  }
}
