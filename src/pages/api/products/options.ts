// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../prisma';
import Prisma from '@prisma/client';
import z from 'zod';
import {notFound} from 'next/navigation';

const GetSchema = z.object({
  id: z.string().uuid().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | Prisma.ProductOption
    | Prisma.ProductOption[]
    | z.ZodError
    | `Error: ${string}`
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
        const product = await prisma.productOption.findUnique({
          where: {id},
        });

        if (!product) {
          notFound();
        }

        res.send(product);
      } else {
        const products = await prisma.productOption.findMany();

        res.send(products);
      }

      break;
    default:
      res.status(405).send('Error: method not allowed');
      break;
  }
}
