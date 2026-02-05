# Repository Guidelines

## Project Structure & Module Organization
- `app/` is the Next.js App Router layer (`app/layout.tsx`, `app/page.tsx`, `app/portfolio/page.tsx`, `app/globals.css`).
- `components/` stores reusable UI and sections (`components/layout/`, `components/sections/`, `components/ui/`, `components/portfolio/`, `components/pwa/`).
- `lib/` contains shared utilities and integrations like `lib/i18n.ts` and `lib/supabase/`.
- `content/` holds locale dictionaries (`content/en.ts`, `content/th.ts`).
- `public/` contains static assets (flags, images, icons, and any portfolio previews).

## Build, Test, and Development Commands
- `npm run dev` starts the local dev server at `http://localhost:3000`.
- `npm run build` creates the production build output in `.next/`.
- `npm run start` serves the production build.
- `npm run lint` runs ESLint with the Next.js core web vitals + TypeScript rules.

## Coding Style & Naming Conventions
- Use 2-space indentation and double quotes to match existing `*.ts`/`*.tsx` files.
- Keep React components in PascalCase and files like `Hero.tsx`, `PortfolioGallery.tsx`.
- Use the `@/*` path alias from `tsconfig.json` for imports.
- Tailwind CSS drives styling; prefer utility classes over inline styles and keep class groups readable.
- Route segments live under `app/`, while shared UI stays under `components/`.

## Testing Guidelines
- No test runner is configured in this repo right now.
- If adding tests, use names like `ComponentName.test.tsx` and add scripts to `package.json`.

## Commit & Pull Request Guidelines
- Git history is not available in this workspace, so no repo-specific convention is visible.
- Use short, imperative commit messages and include screenshots in PRs for UI changes.

## Security & Configuration Tips
- Copy `.env.example` to `.env.local` and fill `NEXT_PUBLIC_SUPABASE_URL` plus `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Never commit secrets; keep credentials in environment files ignored by Git.
