// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import AddressSchema from '@/lib/schemas/AddressSchema';
import Prisma from '@prisma/client';
import type {NextApiRequest, NextApiResponse} from 'next';
import {getServerSession} from 'next-auth';
import {notFound} from 'next/navigation';
import z from 'zod';
import prisma from '../../../../prisma';
import {authOptions} from '../../auth/[...nextauth]';
import {v4} from 'uuid';

const PostSchema = z.object({
  userId: z.string().uuid(),
  addresses: z.array(AddressSchema),
});

const GetSchema = z.object({
  userId: z.string().uuid(),
  id: z.string().uuid().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    Prisma.Address | Prisma.Address[] | z.ZodError | `Error: ${string}`
  >,
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) notFound();

  switch (req.method) {
    case 'POST':
      const {data: postData, error: postError} = PostSchema.safeParse({
        ...req.query,
        ...req.body,
        userId: req.query.id,
      });

      if (postError) {
        res.status(400).json(postError);
        return;
      }

      const prevAddresses = await prisma.address.updateMany({
        where: {userId: postData.userId},
        data: {
          status: Prisma.$Enums.AddressStatus.PreviousAddress,
        },
      });

      console.log({prevAddresses});

      const addresses = await prisma.address.createManyAndReturn({
        data: postData.addresses.map(a => {
          return {...a, userId: session?.user.id, id: v4()};
        }),
      });

      res.json(addresses);
      break;

    case 'GET':
      const {data: getData, error: getError} = GetSchema.safeParse({
        ...req.body,
        ...req.query,
        userId: req.query.id,
      });
      if (getError) {
        res.status(400).json(getError);
        return;
      }

      if (getData.userId) {
        const addresses = await prisma.address.findMany({
          where: {userId: getData.userId},
        });

        res.send(addresses);
      } else {
        const address = await prisma.address.findUnique({
          where: {id: getData.id},
        });

        if (!address) {
          res.status(404).send('Error: Not found');
          return;
        }

        res.send(address);
      }

      break;
    default:
      res.status(405).send('Error: method not allowed');
      break;
  }
}
