# Noheir Frontend (nh-fe)

Frontend application for **Noheir** — a modern chemistry-focused Laboratory Information Management System (LIMS) designed for managing experiments, laboratory workflows, and role-based operational systems.

Built with a scalable App Router architecture, modular feature boundaries, and production-oriented frontend patterns using Next.js, refine, and Material UI.

Live: https://noheir.vercel.app

---

# Features

## Experiment Management

- Experiment creation and lifecycle tracking
- Status transition workflow:
  - Draft
  - Planning
  - Running
  - Completed
  - Aborted
- Server-side paginated experiment tables
- Detailed experiment view with editable metadata
- Experiment categorization and timeline management
- Procedure module foundation for future workflow expansion

## Authentication & Authorization

- Session-based authentication
- OAuth 2.0 / Sign In & Sign Up with Google
- Role-Based Access Control (RBAC)
- Protected route architecture
- Permission-aware UI rendering

## User & Role Management

- User administration
- Role management
- Permission assignment system
- Detail views for identity and access management

## Settings & Preferences

- Profile management
- Preference configuration
- Modular settings routes

---

# Architecture

The frontend follows a hybrid **Feature-Sliced Design** (Clean Architecture) to guarantee maximum decoupling, testability, and a highly responsive page rendering workflow.

```text
src/
├── app/                  # Next.js App Router (Strictly Router-Only)
│   ├── (public)/         # Public entry routes
│   └── (protected)/      # Protected routes (Server-Side Authorization & Wiring Only)
│
├── domain/               # Enterprise core models, types, and DTOs (e.g., user, permission)
├── features/             # Feature-Sliced modules containing components, hooks, and types
│   ├── experiment/       # Isolated Experiment feature workspace
│   ├── role/             # Isolated Role/Permission-Group feature workspace
│   └── user/             # Isolated User management feature workspace
│
├── components/           # Shared reusable atomic UI components (e.g., overflows, table headers)
├── hooks/                # Core hooks (queries, mutations, responsive scaling)
├── lib/                  # Isomorphic utilities (API clients, authorization hooks)
├── providers/            # Root application context providers
├── services/             # Endpoint connection layers
└── utils/                # Small pure utility helper functions
```

### Architectural Principles

1. **Strictly Router-Only `/app`**: Files in the `src/app` directory are kept extremely lean. They function solely as route decoders and layout wrappers. They execute **Isomorphic Server-Side Authorization Guards** (`checkPermissionServer`), returning `<State.Forbidden>` instantly if unauthorized, or directly mounting a unified feature container from `src/features/`. They _never_ maintain component-specific client states or local UI logic.
2. **Encapsulated Features (`src/features/*`)**: Feature workspaces are independent and self-contained, encapsulating their own components, states, constants, and localized type schemas. This guarantees they can be refactored, extended, or tested in isolation.
3. **Enterprise Domain Core (`src/domain/*`)**: Contains global interfaces, entities, validation rules, and DTO mappers that are utilized across the entire project (e.g. `domain/permission/permission.entity.ts`).

---

# Tech Stack

## Core

- Next.js 15 (App Router)
- React 19
- TypeScript

## UI & Styling

- Material UI (MUI) v6
- Tailwind CSS v4

## Application Framework

- refine
- TanStack Query

## State Management

- Zustand v5

## Forms & Validation

- React Hook Form
- react-hook-form-mui

## Networking

- ky HTTP client
- Custom request/response abstraction layer

## Backend Integration

The frontend communicates directly with the Noheir Go backend via REST APIs.

Backend stack includes:

- Golang
- Gin
- PostgreSQL
- Redis
- NGINX
- Vault
- Docker

---

# Getting Started

## Prerequisites

- Node.js 20+
- pnpm 11+

---

# Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
pnpm install
```

---

# Environment Variables

Create environment files:

```bash
.env.development
.env.production
```

Example:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

---

# Development

Start the development server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

---

# Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript validation
```

---

# Deployment

The frontend is optimized for deployment on Vercel.

Deployment pipeline currently includes:

- Automatic production deployments
- App Router production builds
- Environment-based backend configuration
- Production optimization and manifest validation

---

# Engineering Focus

Current engineering priorities include:

- Production-grade frontend architecture
- Scalable feature modularization
- RBAC integration
- SSR/App Router optimization
- Type safety improvements
- Backend/frontend contract consistency
- Build reliability and deployment stability

---

# Roadmap

Planned future modules include:

- Procedure management
- Compound management
- Laboratory inventory system
- Experiment branching/versioning
- Data visualization dashboards
- Realtime experiment updates
- Audit logging
- Collaborative workflows

---

# License

This project is currently private and under active development.

---

Built as part of the Noheir platform ecosystem.
