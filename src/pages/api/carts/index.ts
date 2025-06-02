// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import Prisma from '@prisma/client';
import z from 'zod';
import {notFound} from 'next/navigation';
import prisma from '@/prisma';
import {getServerSession} from 'next-auth';
import {authOptions} from '../auth/[...nextauth]';

const CartItemSchema = z.object({
  title: z.string(),
  productId: z.string(),
  productOptionId: z.string().optional(),
  quantity: z.coerce.number(),
  basePrice: z.coerce.number(),
  extraPrice: z.coerce.number(),
});

const PostSchema = z.object({
  id: z.string().uuid().nullable(),
  items: z.array(CartItemSchema),
});

const GetSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    Prisma.Cart | Prisma.Cart[] | z.ZodError | `Error: ${string}`
  >,
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return notFound();

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

      const user = postData.id
        ? await prisma.cart.update({
            where: {id: postData.id},
            data: {
              items: {
                deleteMany: {cartId: postData.id},
                createMany: {data: postData.items},
              },
            },
          })
        : await prisma.cart.create({
            data: {
              userId: session.user.id,
              items: {
                createMany: {data: postData.items},
              },
            },
          });

      res.send(user);
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
        const cart = await prisma.cart.findUnique({
          where: id ? {id} : userId ? {userId} : {userId: session.user.id},
        });

        if (!cart) {
          notFound();
        }

        res.send(cart);
      } else {
        const carts = await prisma.cart.findMany();

        res.send(carts);
      }

      break;
    default:
      res.status(405).send('Error: method not allowed');
      break;
  }
}
