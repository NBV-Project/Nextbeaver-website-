# Project Context: NBVWEB

## Project Overview
**NBVWEB** is a modern Next.js 16 web application, designed as a portfolio or agency platform. It utilizes the App Router architecture and features a robust tech stack focused on performance, animation, and developer experience.

### Key Technologies
- **Framework:** Next.js 16.0.7 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, `tailwindcss-animate`, `class-variance-authority` (CVA), `tailwind-merge`
- **Animations:** GSAP, Motion (Framer Motion)
- **Backend/Database:** Supabase (`@supabase/supabase-js`)
- **Icons:** Lucide React
- **Internationalization:** Custom cookie-based solution (English/Thai)

## Building and Running

### Prerequisites
- Node.js (v20+ recommended) or Bun
- Supabase Project (URL and Anon Key)

### Environment Setup
1.  Copy `.env.example` to `.env.local`.
2.  Populate the following variables:
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Available Scripts
| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server at `http://localhost:3000`. |
| `npm run build` | Builds the application for production. |
| `npm run start` | Runs the built application in production mode. |
| `npm run lint` | Runs ESLint configuration. |
| `npm run gen:types` | Generates TypeScript definitions from your Supabase schema. Requires `SUPABASE_PROJECT_ID`. |

## Directory Structure

```text
C:\Users\Riew\Desktop\Nextgen\NBVWEB\
├── app/                  # Next.js App Router pages and layouts
│   ├── admin/            # Admin-specific routes
│   ├── api/              # API routes
│   ├── portfolio/        # Portfolio-specific routes
│   ├── globals.css       # Global styles and Tailwind directives
│   └── layout.tsx        # Root layout with providers
├── components/           # Reusable UI components
│   ├── layout/           # Header, Footer, etc.
│   ├── sections/         # Page sections (Hero, About, Contact)
│   ├── ui/               # Atomic UI components (shadcn-like)
│   └── portfolio/        # Portfolio-specific components
├── content/              # I18n dictionaries (en.ts, th.ts)
├── lib/                  # Utilities and configuration
│   ├── supabase/         # Supabase client and types
│   └── i18n.ts           # Locale handling logic
├── public/               # Static assets (images, fonts, icons)
└── scripts/              # Custom build/maintenance scripts
```

## Development Conventions

### Code Style
*   **Components:** PascalCase (e.g., `PortfolioGallery.tsx`).
*   **Files:** TypeScript (`.ts`, `.tsx`) throughout.
*   **Imports:** Use the `@/` alias for absolute imports (configured in `tsconfig.json`).
*   **Styling:** Use Tailwind utility classes. For conditional classes, use `cn()` (clsx + tailwind-merge).

### Internationalization (i18n)
*   The project uses a custom dictionary pattern located in `content/`.
*   Locales are managed via cookies.
*   Use `getDictionary(locale)` from `lib/i18n.ts` to fetch strings.

### Database (Supabase)
*   **Type Safety:** Always run `npm run gen:types` after modifying the database schema to keep `lib/supabase/types/index.ts` in sync.
*   **Client:** Use the typed client exported from `lib/supabase/client.ts`.

### Visual Design
*   **Theme:** Colors and styling tokens are defined in `globals.css` as CSS variables and referenced in `tailwind.config.ts`.
*   **Animations:** Use GSAP for complex timelines and Motion for component-level transitions.

## devbeaver Updates (Feb 2, 2026 - Session 2)
1. **Sticky Navbar Standardization:**
   - **Positioning:** Forced `top-[24px]` and `h-16` for the scrolled state across all pages.
   - **Architecture:** Moved `Header` outside page wrappers in `app/page.tsx` and `app/portfolio/page.tsx` to ensure `fixed` positioning is not affected by container styles.
   - **Symmetry:** Added symmetric `pl/pr` (8px-32px) to Logo and Control containers in scrolled state to prevent elements from touching the pill edges.
2. **UI/UX Contrast & Logic:**
   - **Contrast:** Implemented conditional `text-white` for Language Switcher (EN/TH) and Theme Toggle icon when `isScrolled` is true, ensuring readability on the orange background.
   - **Navigation Logic:** Removed the home link from the bear logo and brand name; "Home" nav link is now the primary return path.
3. **Build Stability:** Fixed JSX parsing errors by restoring missing closing fragments (`</>`) after structural refactoring.
