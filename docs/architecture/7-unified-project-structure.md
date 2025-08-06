# **7. Unified Project Structure**

This is the definitive, locked-in folder structure for the Turborepo monorepo.

```plaintext
/shikhilb-ielts-platform/
├── .github/
│   └── workflows/
├── apps/
│   ├── web/                # The Next.js frontend PWA
│   │   ├── app/            # Next.js App Router
│   │   │   ├── (auth)/     # Route group for auth pages (login, etc.)
│   │   │   │   ├── login/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── LoginForm.tsx # Co-located, page-specific component
│   │   │   ├── (main)/     # Route group for main app
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx  # Root layout
│   │   │   └── globals.css
│   │   ├── components/     # SHARED components for the WEB app (e.g., Navbar, Footer)
│   │   ├── lib/            # Helper functions, hooks, etc.
│   │   ├── public/         # Static assets
│   │   └── ...             # Next.js config files
│   └── api/                # Backend services
│       ├── src/
│       │   ├── courses/    # Example internal service structure
│       │   │   ├── index.ts        # Entry point for the service
│       │   │   ├── courses.routes.ts # Express router definitions
│       │   │   ├── courses.service.ts# Business logic
│       │   │   └── courses.validators.ts # Zod validation schemas
│       │   └── ...         # Other services following the same pattern
│       ├── Dockerfile      # Container definition for Cloud Run
│       └── .env.example    # Environment variable template
├── packages/
│   ├── ui/                 # "Clarity" Design System (e.g., ShikhiButton.tsx)
│   ├── shared/             # TS types, Zod schemas shared between apps
│   └── config/             # Shared ESLint, TSConfig
├── docs/
└── turbo.json
```

-----
