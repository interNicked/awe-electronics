import Prisma, {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const userData = [
  {
    id: 'facade00-0000-4000-a000-000000000001',
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
    id: 'facade00-0000-4000-a000-000000000002',
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
  {
    id: 'facade00-0000-4000-a000-000000000003',
    title: 'Macbook Pro',
    description: 'Made in California',
    basePrice: 3000,
    images: [
      'https://www.apple.com/v/macbook-pro-13/p/images/meta/macbook-pro-13_overview__bcsyunk73i2a_og.jpg',
    ],
    status: Prisma.$Enums.ProductStatus.available,
    options: {
      createMany: {
        data: [
          {
            id: 'f84b2e4a-36a9-4c00-bfad-6c42b89ae09b',
            attribute: 'SIZE',
            value: '16 inch',
            stock: 10,
            extra: 250,
            sku: 'MACBOOKPRO-1a',
          },
          {
            id: 'a33217bc-fb98-481a-8a7b-00d2dc320600',
            attribute: 'SIZE',
            value: '14 inch',
            stock: 10,
            extra: 400,
            sku: 'MACBOOKPRO-1b',
          },
        ],
      },
    }
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
