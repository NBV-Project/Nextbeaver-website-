This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Generate Supabase types

The project keeps a TypeScript definition of your Supabase schema under `lib/supabase/types`. Run the generator after you change anything in the database schema so the client code is always strongly typed; the script will look for `SUPABASE_PROJECT_REF` in your environment or from `.env.local`/`.env` before falling back to an error:

```bash
SUPABASE_PROJECT_ID=your-project-id npm run gen:types
```

This script uses `npx supabase gen types typescript --project-id <id>` (the CLI now prints the output to stdout) and saves the result to `lib/supabase/types/index.ts`. By default it targets the `public` schema, but you can override it via `SUPABASE_SCHEMA` or relocate the file with `SUPABASE_TYPES_OUT_FILE`. `SUPABASE_PROJECT_ID` falls back to `SUPABASE_PROJECT_REF`, and if both are missing we derive the project ID from `NEXT_PUBLIC_SUPABASE_URL`. Make sure the required env var is set and commit the generated file so the rest of the team benefits from the updated schema. 
