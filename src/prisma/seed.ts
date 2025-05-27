import Prisma, { PrismaClient } from '@prisma/client'

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

console.log('Creating Users...')

async function main() {
  for (const u of userData) {
    const user = await prisma.user.upsert({
        where: { email: u.email },
        create: u,
        update: {}
    });
    console.log({user});
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
