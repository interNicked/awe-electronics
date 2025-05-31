// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../prisma';
import Prisma from '@prisma/client';
import z from 'zod';
import {notFound} from 'next/navigation';
import {createHash} from 'crypto';

const PutSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(4),
  description: z.string(),
  basePrice: z.number(),
  images: z.array(z.string().url()),
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

    case 'PUT':
      const {data: putData, error: putError} = PutSchema.safeParse({
        ...req.body,
        ...req.query,
      });
      if (putError) {
        res.status(400).json(putError);
        return;
      }
      if (putData.id) {
        const product = await prisma.product.update({
          where: {id: putData.id},
          data: putData,
        });

        if (!product) {
          notFound();
        }

        res.send(product);
      }

      break;

    case 'DELETE':
      if (!req.query.id || Array.isArray(req.query.id)) {
        res.status(400).send('Error: Missing ID');
        return;
      } else {
        const p = await prisma.product.delete({where: {id: req.query.id}});

        res.json(p);
      }
      return;

    default:
      res.status(405).send(`Error: method not allowed`);
      break;
  }
}
