# IELTS Learning Platform

[![CI](https://github.com/your-username/shikhilb-ielts-platform/workflows/CI/badge.svg)](https://github.com/your-username/shikhilb-ielts-platform/actions)
[![codecov](https://codecov.io/gh/your-username/shikhilb-ielts-platform/branch/master/graph/badge.svg)](https://codecov.io/gh/your-username/shikhilb-ielts-platform)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.11.1-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-Private-red.svg)]()

A comprehensive fullstack monorepo for IELTS preparation built with Next.js, Express.js, and TypeScript.

## 🏗️ Architecture

This project uses a **Turborepo monorepo** structure with the following applications and packages:

```
shikhilb-ielts-platform/
├── apps/
│   ├── web/          # Next.js 14.2.3 frontend application
│   └── api/          # Express.js 4.19.2 backend API
├── packages/
│   ├── ui/           # Shared React UI components
│   ├── shared/       # Shared TypeScript types and Zod schemas
│   └── config/       # Shared ESLint, TypeScript, and Prettier configs
└── docs/            # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20.11.1+ (LTS)
- npm 10.9.2+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shikhilb-ielts-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the development servers:
```bash
npm run dev
```

This will start:
- Frontend (Next.js): http://localhost:3000
- Backend API (Express.js): http://localhost:3001

### Health Check

Verify the backend is running by visiting: http://localhost:3001/health

## 📦 Available Scripts

### Root Level Commands

- `npm run dev` - Start all applications in development mode
- `npm run build` - Build all applications for production
- `npm run lint` - Run ESLint across all packages
- `npm run test` - Run tests across all packages
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean all build artifacts

### Frontend (apps/web)

```bash
cd apps/web
npm run dev        # Start Next.js dev server on port 3000
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # TypeScript type checking
```

### Backend API (apps/api)

```bash
cd apps/api
npm run dev        # Start Express.js dev server on port 3001
npm run build      # Build TypeScript to JavaScript
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # TypeScript type checking
npm run test       # Run Jest tests

# Database Migrations
npm run migrate:up    # Apply all pending migrations
npm run migrate:down  # Rollback the last migration
npm run migrate:create <name>  # Create a new migration
npm run seed          # Seed database with initial data
```

## 🗄️ Database

The project uses **Google Cloud SQL (PostgreSQL)** with automated migrations powered by `node-pg-migrate`.

### Database Setup

1. **Environment Configuration**: Copy the environment template and configure your database connection:
   ```bash
   cd apps/api
   cp .env.example .env
   # Edit .env with your database credentials
   ```

2. **Run Migrations**: Apply all database schema changes:
   ```bash
   cd apps/api
   npm run migrate:up
   ```

3. **Seed Database**: Create initial data (admin user, etc.):
   ```bash
   cd apps/api
   npm run seed
   ```

### Migration Commands

```bash
# Create a new migration
npm run migrate:create create-users-table

# Apply all pending migrations
npm run migrate:up

# Rollback the last migration
npm run migrate:down

# Rollback specific number of migrations
npm run migrate:down 2
```

### Migration Best Practices

- **Always test migrations**: Test both `up` and `down` operations
- **Backup before production migrations**: Always backup production data
- **Version control**: All migrations are version controlled and tracked
- **No direct database changes**: Always use migrations for schema changes

## 🧪 Testing

The project uses Jest and React Testing Library for testing:

```bash
# Run all tests
npm run test

# Run tests for specific package
cd apps/api && npm run test
cd apps/web && npm run test
```

## 🔧 Development

### Tech Stack

- **Frontend Framework:** Next.js 14.2.3
- **Backend Framework:** Express.js 4.19.2
- **Language:** TypeScript 5.4.5
- **Monorepo Tool:** Turborepo 1.13.3
- **Package Manager:** npm
- **Linting:** ESLint + Prettier
- **Testing:** Jest + React Testing Library

### Project Structure

```
apps/web/                   # Next.js Frontend Application
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility functions
└── public/               # Static assets

apps/api/                  # Express.js Backend API
├── src/
│   ├── index.ts          # Main server file
│   └── routes/           # API route handlers
│       └── health.ts     # Health check endpoint
└── __tests__/           # Jest tests

packages/
├── ui/                   # Shared UI Components
│   ├── components/       # React components
│   └── index.tsx        # Package exports
├── shared/              # Shared Types & Schemas
│   ├── types.ts         # TypeScript type definitions
│   ├── schemas.ts       # Zod validation schemas
│   └── index.ts         # Package exports
└── config/             # Shared Configuration
    ├── tsconfig.base.json  # Base TypeScript config
    └── eslint-config.js    # ESLint configuration
```

### Adding New Packages

1. Create a new directory under `packages/`
2. Add a `package.json` with appropriate dependencies
3. Update the root `turbo.json` if needed
4. Add the package to relevant app dependencies

### Code Standards

- **TypeScript:** Strict mode enabled
- **ESLint:** Configured with TypeScript and React rules
- **Prettier:** Auto-formatting on save
- **File Naming:** kebab-case for files, PascalCase for components
- **Imports:** Use absolute imports with path mapping

## 🏃‍♂️ CI/CD

The project uses GitHub Actions for continuous integration:

- **Triggers:** Push to `main`/`develop` branches and PRs
- **Checks:** TypeScript compilation, ESLint, Jest tests, build verification
- **Node.js Version:** 20.x

## 🔍 API Endpoints

### Health Check
- **GET** `/health` - Returns server health status
- **Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-06T...",
  "uptime": 1234.567,
  "environment": "development",
  "version": "0.1.0"
}
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Ensure all tests pass: `npm run test`
4. Ensure linting passes: `npm run lint`
5. Create a pull request

## 📄 License

This project is private and proprietary.