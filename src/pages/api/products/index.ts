// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../prisma';
import Prisma from '@prisma/client';
import z from 'zod';
import {notFound} from 'next/navigation';

const PostSchema = z.object({
  title: z.string().min(4),
  description: z.string(),
  basePrice: z.number(),
});

const GetSchema = z.object({
  id: z.string().uuid().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    Prisma.Product | Prisma.Product[] | z.ZodError | `Error: ${string}`
  >,
) {
  console.log(req.body);
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

      const product = await prisma.product.create({
        data: postData,
      });

      res.send(product);
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
      const {id} = getData;
      if (id) {
        const product = await prisma.product.findUnique({
          where: {id},
        });

        if (!product) {
          notFound();
        }

        res.send(product);
      } else {
        const products = await prisma.product.findMany({
          orderBy: {createdAt: 'desc'},
        });

        res.send(products);
      }

      break;
    default:
      res.status(405).send('Error: method not allowed');
      break;
  }
}
