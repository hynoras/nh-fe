# Noheir Frontend (nh-fe)

Frontend application for **Noheir** — a modern chemistry-focused Laboratory Information Management System (LIMS) designed for managing experiments, laboratory workflows, and role-based operational systems.

Built with a scalable App Router architecture, modular feature boundaries, and production-oriented frontend patterns using Next.js, refine, and Material UI.

🌐 Live: https://noheir.vercel.app

---

# ✨ Features

## 🧪 Experiment Management

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

## 🔐 Authentication & Authorization

- JWT-based authentication
- Support for:
  - Bearer token authorization
  - Cookie-based authentication (`credentials: include`)
- Role-Based Access Control (RBAC)
- Protected route architecture
- Permission-aware UI rendering

## 👥 User & Role Management

- User administration
- Role management
- Permission assignment system
- Detail views for identity and access management

## ⚙️ Settings & Preferences

- Profile management
- Preference configuration
- Modular settings routes

---

# 🏗️ Architecture

The frontend follows a hybrid **Layered + Feature-Based Architecture** to balance scalability, encapsulation, and maintainability.

```text
src/
├── app/                  # Next.js App Router routes
│   ├── (public)/         # Public routes
│   └── (protected)/      # Protected application routes
│       ├── experiment/   # Feature modules
│       ├── role/
│       └── user/
│
├── components/           # Shared reusable UI components
├── hooks/                # Custom hooks
├── lib/                  # Shared libraries/configurations
├── providers/            # App-level providers
├── service/              # Global service abstractions
├── store/                # Zustand global stores
├── types/                # Shared TypeScript types/interfaces
└── utils/                # Utility functions
```

Feature folders may contain localized modules such as:

```text
_components/
_domain/
_service/
_hooks/
```

This structure allows features to evolve independently while maintaining shared platform conventions.

---

# 🛠️ Tech Stack

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

# 🚀 Getting Started

## Prerequisites

- Node.js 20+
- pnpm 11+

---

# 📦 Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
pnpm install
```

---

# 🔧 Environment Variables

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

# 🧪 Development

Start the development server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

---

# 📜 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript validation
```

---

# 🚢 Deployment

The frontend is optimized for deployment on Vercel.

Deployment pipeline currently includes:

- Automatic production deployments
- App Router production builds
- Environment-based backend configuration
- Production optimization and manifest validation

---

# 📈 Engineering Focus

Current engineering priorities include:

- Production-grade frontend architecture
- Scalable feature modularization
- RBAC integration
- SSR/App Router optimization
- Type safety improvements
- Backend/frontend contract consistency
- Build reliability and deployment stability

---

# 🔮 Roadmap

Planned future modules include:

- Advanced procedure editor
- Compound management
- Laboratory inventory system
- Experiment branching/versioning
- Data visualization dashboards
- Realtime experiment updates
- Audit logging
- Collaborative workflows

---

# 📄 License

This project is currently private and under active development.

---

Built as part of the Noheir platform ecosystem.
