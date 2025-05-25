## Getting Started

First, start the database with Docker:

```bash
docker compose up -d

# Migrate DB and Generate Types
cd src/
npx prisma migrate dev --name init
npx prisma generate
```


Now, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Docker, Prisma, Next.js, take a look at the following resources:

- [Docker Documentation](https://docs.docker.com) - learn about Next.js features and API.
- [Prisma Documentation](https://www.prisma.io/docs) - learn about Next.js features and API.
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.
