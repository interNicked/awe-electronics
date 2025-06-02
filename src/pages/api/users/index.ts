// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../prisma';
import Prisma from '@prisma/client';
import z from 'zod';
import {notFound} from 'next/navigation';
import {createHash} from 'crypto';

export const PostSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const GetSchema = z.object({
  email: z.string().email().optional(),
  id: z.string().uuid().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    Prisma.User | Prisma.User[] | z.ZodError | `Error: ${string}`
  >,
) {
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

      const user = await prisma.user.create({
        data: {
          email: postData.email,
          passwordHash: createHash('sha256')
            .update(postData.password)
            .digest('hex'),
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
      const {id, email} = getData;
      if (id || email) {
        const user = await prisma.user.findUnique({
          where: id ? {id} : {email},
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
      res.status(405).send('Error: method not allowed');
      break;
  }
}
