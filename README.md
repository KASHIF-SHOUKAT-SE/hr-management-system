# HR Management System

Shared starter repository for an HR management system built with Next.js App Router and TypeScript.

## Quick start

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open http://localhost:3000. The dashboard is at `/dashboard`.

## Structure

- `app/(auth)` contains login and password recovery routes.
- `app/(dashboard)` contains product routes and the shared dashboard layout.
- `app/api` contains starter API routes for auth, employees, departments, attendance, and leaves.
- `components` contains reusable UI, layout, form, grid, and common components.
- `features` is organized by domain for Redux and RTK Query work.
- `server` is reserved for database connections, models, and JWT verification.
- `services`, `types`, `lib`, `hooks`, `schemas`, and `config` contain shared contracts.

The API, database, authentication, Redux, form, and AG Grid files are intentionally starter contracts. Implement each domain in its matching `features/<domain>` folder and connect it through the existing service/API boundaries.

## Checks

```bash
npm run lint
npm run build
```

## Getting Started

First, run the development server:

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
