// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../prisma';
import Prisma from '@/prisma/generated';
import z from 'zod';
import {notFound} from 'next/navigation';
import {ProductOptionsPostSchema} from '@/lib/schemas/ProductOptionPostSchema';

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
    case 'POST':
      const {error: postError, data: postData} =
        ProductOptionsPostSchema.safeParse({
          ...req.body,
          ...req.query,
          id: req.query.optionId,
        });
      if (postError) {
        res.status(400).send(postError);
        return;
      }

      const option = await prisma.productOption.create({
        data: {
          attribute: postData.attribute,
          sku: postData.sku,
          stock: postData.stock,
          value: postData.value,
          extra: postData.extra,
          productId: postData.productId,
          id: postData.id,
        },
      });

      res.send(option);
      break;

    case 'GET':
      const {data: getData, error: getError} = GetSchema.safeParse({
        ...req.body,
        ...req.query,
        id: req.query.optionId,
      });
      if (getError) {
        res.status(400).json(getError);
        return;
      }

      if (getData.id) {
        const option = await prisma.productOption.findUnique({
          where: {id: getData.id},
        });

        if (!option) {
          notFound();
        }

        res.send(option);
      } else {
        const options = await prisma.productOption.findMany();

        res.send(options);
      }

      break;

    case 'DELETE':
      const {data: deleteData, error: deleteError} = GetSchema.safeParse({
        ...req.body,
        ...req.query,
        id: req.query.optionId,
      });
      if (deleteError) {
        res.status(400).json(deleteError);
        return;
      }

      const opt = await prisma.productOption.delete({
        where: {id: deleteData.id},
      });

      res.send(opt)
      break;

    default:
      res.status(405).send(`Error: method not allowed`);
      break;
  }
}
