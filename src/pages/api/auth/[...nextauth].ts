import prisma from '@/prisma';
import {createHash} from 'crypto';
import NextAuth, {Session, User, SessionStrategy, AuthOptions} from 'next-auth';
import {JWT} from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {label: 'Email', type: 'text'},
        password: {label: 'Password', type: 'password'},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: {email: credentials.email},
        });
        console.log({user});

        if (!user || !user.passwordHash) return null;
        const hash = createHash('sha256')
          .update(credentials.password)
          .digest('hex');
        const isValid = hash === user.passwordHash;

        console.log({hash, pw: user.passwordHash});
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({token, user}: {token: JWT; user: User}) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({session, token}: {session: Session; token: JWT}) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
