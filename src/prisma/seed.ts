import Prisma, {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const userData = [
  {
    id: '00000000-00000000-00000000-00000001',
    email: 'admin@admin.com',
    passwordHash:
      '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // password
    role: Prisma.$Enums.UserRole.admin,
    isVerified: true,
  },
  {
    id: '00000000-00000000-00000000-00000002',
    email: 'user@user.com',
    passwordHash:
      '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // password
    role: Prisma.$Enums.UserRole.customer,
    isVerified: true,
  },
];

const productData = [
  {
    id: '491f95f6-afe3-4287-8f46-168825dc5e7d',
    title: 'iPhone',
    description: 'Made in California',
    basePrice: 1000,
    images: [
      'http://localhost:3000/_next/image?url=https%3A%2F%2Fwww.apple.com%2Fnewsroom%2Fimages%2F2024%2F09%2Fapple-debuts-iphone-16-pro-and-iphone-16-pro-max%2Farticle%2FApple-iPhone-16-Pro-hero-geo-240909_inline.jpg.large.jpg&w=256&q=75',
    ],
    status: Prisma.$Enums.ProductStatus.available,
    options: {
      createMany: {
        data: [
          {
            id: '491f95f6-afe3-4287-8f46-168825dc5e7d',
            attribute: 'SIZE',
            value: '500GB',
            stock: 10,
            extra: 0,
            sku: 'IPHONE-1',
          },
          {
            id: 'd08e4bd7-c81c-49ba-8674-f5546a37af29',
            attribute: 'SIZE',
            value: '750GB',
            stock: 10,
            extra: 250,
            sku: 'IPHONE-1b',
          },
          {
            id: 'e021a250-8162-41ab-b652-c049327807dd',
            attribute: 'SIZE',
            value: '1TB',
            stock: 10,
            extra: 400,
            sku: 'IPHONE-1c',
          },
        ],
      },
    },
  },
];

async function main() {
  console.log('Creating Users...');
  for (const u of userData) {
    const user = await prisma.user.upsert({
      where: {email: u.email},
      create: u,
      update: {},
    });
    console.log({user});
  }

  console.log('Creating Products...');
  for (const p of productData) {
    const product = await prisma.product.upsert({
      where: {id: p.id},
      create: p,
      update: {},
    });
    console.log({product});
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
