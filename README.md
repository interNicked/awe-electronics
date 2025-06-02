## Prerequisites

| Name | Link |
|------|------|
| Docker | https://www.docker.com/get-started/ |
| node | https://nodejs.org/en/download |
| yarn | https://classic.yarnpkg.com/lang/en/docs/install/ |

## Getting Started

First, start the database with Docker:

```bash
docker compose up -d

# Install Dependencies 
yarn 
# or
npm install

# Migrate DB and Generate Types 
# (note: `yarn` can be replaced with `npm run`)
cd src/
yarn migrate init

# Generate Types from Schema
yarn generate

# Seed DB (Create predefined objects defined in src/prisma/seed.ts)
yarn seed
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
