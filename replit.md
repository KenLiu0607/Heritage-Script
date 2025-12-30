# ChickenOps - 雞肉產銷智能管理系統

## Overview

ChickenOps is a modern poultry production and sales management system designed for the Taiwanese market. It provides intelligent management of chicken farming operations, including contract deliveries, production scheduling, inventory management, and sales order tracking. The system transitions traditional Excel-based workflows into a web-based platform with real-time data management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS v4 with shadcn/ui component library
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a page-based architecture with shared components. Key pages include:
- Dashboard with analytics charts (Recharts)
- Contract Delivery (契作交貨) management
- Production scheduling
- Inventory management
- Sales order tracking

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful JSON endpoints under `/api/*`

The server uses a simple storage abstraction (`IStorage` interface) that currently implements in-memory storage (`MemStorage`). This design allows easy migration to database-backed storage.

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod with drizzle-zod integration
- **Database**: PostgreSQL (configured via `DATABASE_URL` environment variable)

The shared schema in `shared/schema.ts` defines database tables and generates both TypeScript types and Zod validation schemas, ensuring type safety across the full stack.

### Build System
- **Development**: Vite dev server with HMR for frontend, tsx for backend
- **Production**: Custom build script using esbuild for server bundling and Vite for client
- **Output**: Bundled server at `dist/index.cjs`, static files at `dist/public`

### Key Design Decisions

1. **Shared Schema Pattern**: Database schema definitions live in `shared/` directory, allowing both frontend and backend to import types and validation schemas. This eliminates type mismatches between client and server.

2. **Storage Abstraction**: The `IStorage` interface in `server/storage.ts` decouples business logic from data persistence, enabling testing with in-memory storage and production use with PostgreSQL.

3. **Component Library**: Uses shadcn/ui (new-york style) with extensive Radix UI primitives for accessible, customizable components.

4. **Chinese Localization**: The application is built for Traditional Chinese (Taiwan) users, with UI text in Chinese.

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migrations and schema push (`npm run db:push`)

### UI Component Libraries
- **Radix UI**: Full suite of accessible primitives (dialog, dropdown, tabs, etc.)
- **shadcn/ui**: Pre-styled component collection built on Radix
- **Lucide React**: Icon library

### Data & Charts
- **Recharts**: Chart library for dashboard visualizations
- **date-fns**: Date manipulation utilities

### Development Tools
- **Replit Plugins**: 
  - `@replit/vite-plugin-runtime-error-modal`: Error overlay
  - `@replit/vite-plugin-cartographer`: Development tooling
  - `@replit/vite-plugin-dev-banner`: Development banner

### Session Management (Available)
- **connect-pg-simple**: PostgreSQL session store (imported but storage currently in-memory)
- **express-session**: Session middleware

### Build Dependencies
- **esbuild**: Fast JavaScript bundler for server code
- **tsx**: TypeScript execution for development