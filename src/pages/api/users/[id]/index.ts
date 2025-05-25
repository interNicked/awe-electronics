// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../prisma';
import Prisma from '@/prisma/generated';
import z from 'zod';
import {notFound} from 'next/navigation';

const GetSchema = z.object({
  id: z.string().uuid(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    Prisma.User | Prisma.User[] | z.ZodError | `Error: ${string}`
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
        const user = await prisma.user.findUnique({
          where: {id},
        });

        if (!user) {
          notFound();
        }

        res.send(user);
      } else {
        const users = await prisma.user.findMany();

        res.send(users);
      }

      break;
    default:
      res.status(405).send(`Error: method not allowed`);
      break;
  }
}
