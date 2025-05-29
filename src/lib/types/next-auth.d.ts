import Prisma from '@prisma/client';
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      role: Prisma.$Enums.UserRole;
      email: string;
      passwordHash: string;
      isVerified: boolean;
    };
  }

  interface User extends Prisma.User {}
}

declare module 'next-auth/jwt' {
  interface JWT extends Prisma.User {}
}
