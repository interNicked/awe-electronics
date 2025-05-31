// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import AddressSchema from '@/lib/schemas/AddressSchema';
import Prisma from '@prisma/client';
import type {NextApiRequest, NextApiResponse} from 'next';
import {getServerSession} from 'next-auth';
import {notFound} from 'next/navigation';
import z from 'zod';
import prisma from '../../../prisma';
import {authOptions} from '../auth/[...nextauth]';
import { v4 } from 'uuid';

const PostSchema = z.object({
  addresses: z.array(AddressSchema).min(2).max(2),
});

const GetSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    Prisma.Address | Prisma.Address[] | z.ZodError | `Error: ${string}`
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

      const address = await prisma.address.createManyAndReturn({
        data: postData.addresses.map(a => {
          return {...a, userId: session?.user.id, id: v4()};
        }),
      });

      res.send(address);
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
        const address = id
          ? await prisma.address.findUnique({where: {id}})
          : await prisma.address.findMany({where: {userId}});

        if (!address) notFound();

        res.send(address);
      } else {
        if (session?.user.role !== 'admin') notFound();
        const addresses = await prisma.address.findMany();

        res.send(addresses);
      }

      break;
    default:
      res.status(405).send(`Error: method not allowed`);
      break;
  }
}
