# SocietyHub — Technical Stack & Infrastructure

> **Version:** 1.0 · **Date:** 2026-10-12
> **Companion document:** [`plan_society.md`](file:///d:/Hackathons/Code%20Apex/plan_society.md) — Problem statement & project plan
> **Philosophy:** Industrial-grade, multi-developer, production-ready from day one.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Version Control & Collaboration](#2-version-control--collaboration)
3. [Backend Stack](#3-backend-stack)
4. [Frontend Stack](#4-frontend-stack)
5. [Database — PostgreSQL](#5-database--postgresql)
6. [Infrastructure & DevOps](#6-infrastructure--devops)
7. [CI/CD Pipeline](#7-cicd-pipeline)
8. [Testing Strategy](#8-testing-strategy)
9. [Observability & Monitoring](#9-observability--monitoring)
10. [Security Tooling](#10-security-tooling)
11. [Mobile Strategy](#11-mobile-strategy)
12. [External Services & Integrations](#12-external-services--integrations)
13. [Developer Experience](#13-developer-experience)
14. [Tech Stack Summary](#14-tech-stack-summary)

---

## 1. Architecture Overview

### 1.1 High-Level System Architecture

```mermaid
flowchart TB
    subgraph Clients
        PWA["Web App (PWA)<br/>Next.js + TypeScript"]
        MOB["Mobile App (Future)<br/>React Native / Expo"]
    end

    subgraph Edge["Edge / Reverse Proxy"]
        NGINX["Nginx<br/>TLS · Rate Limit · Gzip · Cache"]
    end

    subgraph App["Application Layer — Modular Monolith"]
        API["NestJS API Server<br/>Node.js LTS · TypeScript"]
        subgraph Modules["Domain Modules"]
            M1["Identity & Society"]
            M2["Finance & Billing"]
            M3["Notices"]
            M4["Complaints"]
            M5["Meetings & Polls"]
            M6["Amenities"]
            M7["Notifications"]
            M8["Documents"]
            M9["Reports & Audit"]
        end
        WORKERS["Background Workers<br/>BullMQ Processors"]
    end

    subgraph Data["Data Layer"]
        PG[("PostgreSQL 16+<br/>+ PgBouncer")]
        REDIS[("Redis 7+<br/>Cache · Queue · Rate Limit")]
        S3[("Object Storage<br/>S3 / R2 / MinIO")]
    end

    subgraph Observe["Observability"]
        SENTRY["Sentry<br/>Error Tracking"]
        PROM["Prometheus<br/>Metrics"]
        GRAF["Grafana<br/>Dashboards"]
        LOGS["Structured Logs<br/>Pino → Loki / ELK"]
    end

    subgraph External["External Services"]
        PAY["Payment Gateway<br/>Razorpay / Cashfree"]
        EMAIL["Email<br/>SES / Resend"]
        SMS["SMS / WhatsApp"]
        PUSH["Push Notifications<br/>FCM / APNs"]
    end

    subgraph CI["CI/CD"]
        GHA["GitHub Actions"]
        REG["Container Registry<br/>GHCR / Docker Hub"]
    end

    PWA --> NGINX
    MOB --> NGINX
    NGINX --> API
    API --> Modules
    API --> WORKERS
    Modules --> PG
    Modules --> REDIS
    Modules --> S3
    WORKERS --> PG
    WORKERS --> REDIS
    WORKERS --> EMAIL
    WORKERS --> SMS
    WORKERS --> PUSH
    M2 <--> PAY
    API --> SENTRY
    API --> PROM
    PROM --> GRAF
    API --> LOGS
    GHA --> REG
    GHA -.-> NGINX
```

### 1.2 Design Principles

| Principle | What It Means |
|-----------|---------------|
| **Monorepo, Modular Monolith** | Single repo, clear module boundaries. Services can split later without rewrite. |
| **Infrastructure as Code** | Docker, Compose files, Nginx configs, CI pipelines — all versioned. |
| **Environment Parity** | Dev, staging, and production run the same containers with different configs. |
| **Automate Everything** | Linting, testing, building, deploying — triggered by Git events. No manual steps. |
| **Secure by Default** | TLS everywhere, secrets in vaults, dependency scanning, container scanning. |
| **Observable** | Structured logs, metrics, error tracking, and alerts from day one. |

---

## 2. Version Control & Collaboration

### 2.1 Git & GitHub

| Aspect | Standard |
|--------|----------|
| **Platform** | GitHub (private repository) |
| **Repository** | Single monorepo (`societyhub`) containing frontend, backend, shared packages, infra configs, docs |
| **Git LFS** | Enabled for binary assets (images, PDFs, design files) to keep repo fast |

### 2.2 Branching Strategy — Gitflow

```mermaid
gitgraph
    commit id: "init"
    branch develop
    checkout develop
    commit id: "setup monorepo"
    branch feature/auth
    checkout feature/auth
    commit id: "add OTP login"
    commit id: "add session mgmt"
    checkout develop
    merge feature/auth id: "PR #12 merged"
    branch feature/billing
    checkout feature/billing
    commit id: "fund heads"
    commit id: "charge rules"
    checkout develop
    merge feature/billing id: "PR #18 merged"
    branch release/1.0
    checkout release/1.0
    commit id: "bump version"
    commit id: "fix bug"
    checkout main
    merge release/1.0 id: "v1.0.0" tag: "v1.0.0"
    checkout develop
    merge release/1.0
```

| Branch | Purpose | Merges To | Protection |
|--------|---------|-----------|------------|
| `main` | Production-ready code. Tagged releases only. | — | Require PR, ≥2 approvals, passing CI, no force push |
| `develop` | Integration branch. All features merge here first. | `main` (via release branch) | Require PR, ≥1 approval, passing CI |
| `feature/<name>` | Individual features or tasks. | `develop` | — |
| `bugfix/<name>` | Bug fixes during development. | `develop` | — |
| `hotfix/<name>` | Critical production fixes. | `main` + `develop` | Require ≥1 approval |
| `release/<version>` | Release preparation, version bumps, final fixes. | `main` + `develop` | Require ≥1 approval |

### 2.3 Commit Conventions — Conventional Commits

All commits follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. Enforced via `commitlint` + Husky.

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**

| Type | When |
|------|------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, semicolons — no logic change) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `build` | Build system or external dependency changes |
| `ci` | CI/CD configuration changes |
| `chore` | Other changes that don't modify src or test |

**Scopes:** `api`, `web`, `shared`, `finance`, `auth`, `notices`, `complaints`, `polls`, `amenities`, `infra`, `ci`, `db`

**Examples:**
```
feat(finance): add late fee calculation engine
fix(auth): prevent OTP brute force with rate limiter
ci(api): add docker build caching to GitHub Actions
docs(api): update OpenAPI spec for payment endpoints
```

### 2.4 Pull Request Workflow

```mermaid
flowchart LR
    A["Create branch<br/>feature/xyz"] --> B["Write code<br/>+ tests"]
    B --> C["Push & open PR<br/>to develop"]
    C --> D{"CI Pipeline<br/>passes?"}
    D -- No --> B
    D -- Yes --> E["Code review<br/>≥1 approval"]
    E --> F{"Feedback?"}
    F -- Yes --> B
    F -- No --> G["Squash & merge"]
    G --> H["Auto-deploy<br/>to staging"]
```

**PR Rules:**
- Descriptive title following Conventional Commits format
- PR template with: summary, type of change, screenshots (UI), testing done, checklist
- Link to issue/task
- Max ~400 lines per PR (break large features into stacked PRs)
- Squash merge to keep history clean
- Auto-delete merged branches

### 2.5 Branch Protection Rules

```yaml
# Applied to 'main' and 'develop'
protection_rules:
  require_pull_request:
    required_approving_review_count: 2  # 1 for develop
    dismiss_stale_reviews: true
    require_code_owner_reviews: true
  require_status_checks:
    strict: true
    checks:
      - lint
      - typecheck
      - unit-tests
      - build
  require_conversation_resolution: true
  restrict_force_pushes: true
  restrict_deletions: true
  require_linear_history: true      # squash merges only
  require_signed_commits: false     # optional, enable if team uses GPG
```

### 2.6 CODEOWNERS

```
# .github/CODEOWNERS
*                         @team-lead
apps/api/src/modules/finance/  @treasurer-dev @team-lead
apps/api/src/modules/identity/ @auth-dev @team-lead
apps/web/                 @frontend-dev @team-lead
infra/                    @devops-dev @team-lead
packages/shared/          @team-lead
```

---

## 3. Backend Stack

### 3.1 Runtime & Language

| Component | Choice | Version | Why |
|-----------|--------|---------|-----|
| **Runtime** | Node.js | LTS (22.x+) | Non-blocking I/O suits this app's webhook-heavy, notification-heavy workload. Massive ecosystem. Same language as frontend. |
| **Language** | TypeScript | 5.x+ | Type safety across the full stack. Shared Zod schemas between frontend and backend eliminate contract drift. |
| **Package Manager** | pnpm | Latest | Fast, disk-efficient, strict dependency resolution. Ideal for monorepos with workspace protocol. |

### 3.2 Framework — NestJS

| Aspect | Detail |
|--------|--------|
| **Framework** | [NestJS](https://nestjs.com/) v10+ |
| **Why** | Opinionated module system maps perfectly to our modular monolith. Built-in support for guards (RBAC), interceptors (audit), pipes (validation), and decorators. |
| **Architecture** | Modular monolith — each domain (finance, notices, complaints, etc.) is a NestJS module with its own service, controller, DTOs, and tests. |
| **Alternative** | FastAPI (Python) — viable if the team prefers Python and wants to add ML features in the same codebase. |

### 3.3 Module Structure (Monorepo)

```
societyhub/                          # Root — monorepo
├── apps/
│   ├── api/                         # NestJS backend
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── common/              # Shared concerns
│   │   │   │   ├── guards/          # AuthGuard, RbacGuard, ScopeGuard
│   │   │   │   ├── decorators/      # @Roles, @CurrentUser, @Scopes
│   │   │   │   ├── interceptors/    # AuditInterceptor, TransformInterceptor
│   │   │   │   ├── filters/         # GlobalExceptionFilter
│   │   │   │   ├── pipes/           # ZodValidationPipe
│   │   │   │   ├── middleware/      # RequestIdMiddleware, LoggerMiddleware
│   │   │   │   └── utils/           # pagination, errors, constants
│   │   │   ├── modules/
│   │   │   │   ├── identity/        # Users, auth, OTP, sessions
│   │   │   │   ├── society/         # Society, wings, units, memberships, roles
│   │   │   │   ├── finance/
│   │   │   │   │   ├── charges/     # Fund heads, charge rules
│   │   │   │   │   ├── billing/     # Cycles, invoices, late fees
│   │   │   │   │   ├── payments/    # Gateway, offline, receipts
│   │   │   │   │   ├── expenses/    # Vendors, bills, approvals
│   │   │   │   │   ├── ledger/      # Immutable ledger + balances
│   │   │   │   │   └── reports/     # Collection, dues, fund-wise
│   │   │   │   ├── notices/
│   │   │   │   ├── complaints/
│   │   │   │   ├── meetings/
│   │   │   │   ├── polls/
│   │   │   │   ├── amenities/
│   │   │   │   ├── notifications/
│   │   │   │   ├── documents/
│   │   │   │   └── audit/
│   │   │   └── jobs/                # BullMQ queue processors
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── test/                    # E2E / integration tests
│   │   ├── Dockerfile
│   │   └── tsconfig.json
│   │
│   └── web/                         # Next.js frontend
│       ├── src/
│       │   ├── app/                  # App Router pages
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── lib/
│       │   └── styles/
│       ├── public/
│       ├── Dockerfile
│       └── next.config.ts
│
├── packages/
│   ├── shared/                      # Shared between web + api
│   │   ├── src/
│   │   │   ├── schemas/             # Zod schemas (used for API validation + form validation)
│   │   │   ├── types/               # TypeScript interfaces & enums
│   │   │   ├── constants/           # Roles, permissions, fund types, etc.
│   │   │   └── utils/               # Date, currency, formatting helpers
│   │   └── package.json
│   │
│   └── ui/                          # Shared component library (optional)
│       ├── src/
│       └── package.json
│
├── infra/
│   ├── docker/
│   │   ├── Dockerfile.api
│   │   ├── Dockerfile.web
│   │   └── Dockerfile.nginx
│   ├── nginx/
│   │   ├── nginx.conf
│   │   ├── sites/
│   │   │   ├── api.conf
│   │   │   └── web.conf
│   │   └── ssl/
│   ├── docker-compose.yml           # Full local dev stack
│   ├── docker-compose.prod.yml      # Production overrides
│   └── scripts/
│       ├── seed.ts                   # DB seed for dev/staging
│       ├── backup.sh
│       └── restore.sh
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                   # PR pipeline
│   │   ├── deploy-staging.yml       # Auto on develop merge
│   │   ├── deploy-production.yml    # Manual approval on main
│   │   └── nightly.yml              # Security scan, dependency audit
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CODEOWNERS
│   └── dependabot.yml
│
├── docs/
│   ├── 01-requirements.md
│   ├── 02-architecture.md
│   ├── 03-data-model.md
│   ├── 04-api-contract.yaml         # OpenAPI spec
│   ├── 05-ui-sitemap-wireframes/
│   ├── 06-rbac-matrix.md
│   ├── 07-finance-rules.md
│   ├── 08-runbook.md
│   └── adr/                         # Architecture Decision Records
│
├── .editorconfig
├── .eslintrc.cjs
├── .prettierrc
├── commitlint.config.cjs
├── turbo.json                       # Turborepo config
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

### 3.4 ORM — Prisma

| Aspect | Detail |
|--------|--------|
| **ORM** | [Prisma](https://www.prisma.io/) v5+ |
| **Why** | Typed client auto-generated from schema. Excellent migration system with history. Readable schema language. |
| **Migration discipline** | All schema changes go through `prisma migrate dev` → committed migration files → applied in CI/CD. Never run `db push` in staging/production. |
| **Seeding** | `prisma/seed.ts` — creates demo society, wings, units, roles, sample data for dev/staging. |

### 3.5 Queue & Background Jobs — BullMQ + Redis

| Job | Trigger | Queue |
|-----|---------|-------|
| Invoice generation | Billing cycle cron / admin action | `billing` |
| PDF receipt generation | Payment confirmed | `pdf` |
| Due reminders (T-5, T-1, overdue) | Daily cron | `reminders` |
| Notification dispatch (email, SMS, push) | Domain events | `notifications` |
| Payment reconciliation | Nightly cron | `reconciliation` |
| File processing (upload scanning, thumbnails) | File upload event | `files` |

**Configuration:**
- Separate queues per domain for isolation and independent scaling
- Dead letter queue for failed jobs after 3 retries with exponential backoff
- Redis-backed for persistence across restarts
- Dashboard: [Bull Board](https://github.com/felixmosh/bull-board) at `/admin/queues` (admin-only)

### 3.6 Authentication

| Aspect | Implementation |
|--------|----------------|
| **Primary login** | Mobile OTP (SMS) — residents are mobile-first |
| **Secondary** | Email + password (for committee members) |
| **Tokens** | JWT access token (15 min TTL) + refresh token (7 days, httpOnly cookie, rotating) |
| **Session management** | Device list with revoke; invalidation on password change or role change |
| **Rate limiting** | OTP: 3 attempts per 10 min per number. Login: 10 attempts per 15 min per IP. |
| **Library** | `@nestjs/passport` + `passport-jwt` + custom OTP strategy |

### 3.7 API Standards

```
Base URL:   /api/v1/
Format:     JSON
Auth:       Bearer token (Authorization header)
Versioning: URL prefix (/api/v1/, /api/v2/)
Spec:       OpenAPI 3.1 auto-generated via @nestjs/swagger
```

**Standard response envelope:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 142,
    "totalPages": 8
  }
}
```

**Standard error envelope:**
```json
{
  "success": false,
  "error": {
    "code": "INVOICE_NOT_FOUND",
    "message": "Invoice with ID xyz not found",
    "details": []
  },
  "requestId": "req-abc123"
}
```

---

## 4. Frontend Stack

### 4.1 Framework & Core

| Component | Choice | Why |
|-----------|--------|-----|
| **Framework** | Next.js 14+ (App Router) | File-based routing maps 1:1 to the page map. SSR/SSG for fast initial loads. React Server Components for data fetching. |
| **Language** | TypeScript (strict mode) | Type safety, shared types with backend via `packages/shared`. |
| **Styling** | Tailwind CSS 3+ | Utility-first, consistent design tokens, small bundle via purging. |
| **Component Library** | shadcn/ui | Copy-paste components built on Radix UI. Fully customisable, accessible (WCAG 2.1 AA). No vendor lock-in. |
| **Icons** | Lucide React | Consistent, tree-shakable icon set. |
| **Fonts** | Inter (Google Fonts) | Clean, modern, excellent readability on screens. |

### 4.2 State Management & Data Fetching

| Concern | Library | Why |
|---------|---------|-----|
| **Server state** | TanStack Query (React Query) v5 | Caching, background refetch, optimistic updates, pagination, infinite scroll. |
| **Client state** | Zustand | Lightweight, simple, no boilerplate. Used for UI state (sidebar, modals, theme). |
| **Forms** | React Hook Form v7 | Performant (uncontrolled), minimal re-renders. |
| **Validation** | Zod (via `packages/shared`) | Same schemas on frontend and backend — single source of truth. |
| **API client** | Axios + custom hooks | Interceptors for auth token refresh, error handling, request IDs. |

### 4.3 Advanced Frontend Features

| Feature | Technology |
|---------|------------|
| **Charts & analytics** | Recharts (React-native charts) or Chart.js via react-chartjs-2 |
| **Data tables** | TanStack Table — sorting, filtering, pagination, column visibility |
| **Calendar / scheduling** | FullCalendar or custom with date-fns |
| **PDF generation** | @react-pdf/renderer (client-side) or Puppeteer (server-side) |
| **File upload** | react-dropzone with drag & drop, preview, progress |
| **Real-time updates** | Server-Sent Events (SSE) for notifications; WebSocket (Socket.IO) if chat is added later |
| **Animations** | Framer Motion — page transitions, micro-interactions, skeleton loaders |
| **Date handling** | date-fns (tree-shakable, immutable) |
| **Currency formatting** | Intl.NumberFormat with INR locale |
| **i18n** | next-intl — prepared for Hindi/Marathi |
| **Theme** | next-themes — dark mode support |

### 4.4 PWA Configuration

```json
// next.config.ts — via next-pwa
{
  "name": "SocietyHub",
  "short_name": "SocietyHub",
  "description": "Society management platform",
  "start_url": "/app",
  "display": "standalone",
  "background_color": "#0F172A",
  "theme_color": "#3B82F6",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**PWA features:**
- Installable on Android/iOS home screen
- Offline fallback page (critical for Indian mobile networks)
- Push notification support via Service Worker
- App-like experience without app store

### 4.5 Design System

```
packages/ui/ or apps/web/src/components/ui/
├── primitives/           # Button, Input, Select, Checkbox, Radio, Switch, Badge
├── layout/               # Container, Stack, Grid, Divider, Card
├── feedback/             # Alert, Toast, Dialog, Drawer, Skeleton, Spinner
├── navigation/           # Navbar, Sidebar, Breadcrumbs, Tabs, BottomNav (mobile)
├── data-display/         # Table, DataTable, StatCard, Timeline, Avatar, List
├── forms/                # FormField, SearchInput, DatePicker, FileUpload, OTPInput
├── charts/               # BarChart, PieChart, LineChart, AreaChart
├── domain/               # InvoiceCard, ComplaintStatus, PollCard, BookingSlot
└── theme/                # tokens.css, fonts, colours, spacing scale
```

---

## 5. Database — PostgreSQL

### 5.1 Core Configuration

| Aspect | Detail |
|--------|--------|
| **Engine** | PostgreSQL 16+ |
| **Why** | Relational integrity critical for financial data. JSONB for flexible settings. Exclusion constraints for booking conflicts. Row-Level Security for multi-tenancy. Mature, battle-tested. |
| **Connection pooling** | PgBouncer (transaction mode) — prevents connection exhaustion under load |
| **Extensions** | `pgcrypto` (UUIDs), `pg_trgm` (text search), `btree_gist` (exclusion constraints for bookings) |

### 5.2 Schema Design Principles

1. **UUIDs as primary keys** — prevents ID enumeration attacks, safe for distributed systems.
2. **`society_id` on every tenant table** — enables multi-tenancy and RLS.
3. **Money as `NUMERIC(12,2)` or integer paise** — **never** floating point.
4. **Append-only for financial records** — `ledger_entries` and `audit_logs` have no UPDATE/DELETE permissions.
5. **Soft deletes where appropriate** — `deleted_at` timestamp, filtered by default in queries.
6. **Timestamps on everything** — `created_at`, `updated_at` (auto-managed by Prisma).

### 5.3 Row-Level Security (RLS)

Defence-in-depth: even if application code has a bug, the database prevents cross-society data access.

```sql
-- Enable RLS on tenant tables
ALTER TABLE units ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see units from their society
CREATE POLICY units_society_isolation ON units
    USING (society_id = current_setting('app.current_society_id')::uuid);

-- Set the session variable from the API (via PgBouncer session init)
SET app.current_society_id = '<society-uuid>';
```

### 5.4 Migration Strategy — Expand-Migrate-Contract

```mermaid
flowchart LR
    A["1. EXPAND<br/>Add new column/table<br/>(backwards compatible)"] --> B["2. MIGRATE<br/>Deploy new code<br/>that uses new schema"]
    B --> C["3. CONTRACT<br/>Remove old column/table<br/>(after verification)"]
```

**Rules:**
- Migrations are generated by `prisma migrate dev` and committed as files.
- Every migration is **backwards compatible** — the previous code version must still work.
- Never rename or drop columns in a single step. Use expand-migrate-contract.
- Migrations run automatically as a deploy step (before the new app version starts).
- Failed migrations block deployment.

### 5.5 Connection Pooling — PgBouncer

```ini
# pgbouncer.ini
[databases]
societyhub = host=postgres port=5432 dbname=societyhub

[pgbouncer]
listen_port = 6432
pool_mode = transaction          # Connections returned after each transaction
max_client_conn = 200
default_pool_size = 20
min_pool_size = 5
reserve_pool_size = 5
reserve_pool_timeout = 3
server_idle_timeout = 600
```

### 5.6 Backup & Disaster Recovery

| Aspect | Strategy |
|--------|----------|
| **Automated backups** | `pg_dump` daily via cron (or managed DB auto-backups) |
| **Point-in-time recovery** | WAL archiving enabled — recover to any second |
| **Backup storage** | Encrypted, offsite (S3 bucket in different region) |
| **Retention** | Daily: 30 days · Weekly: 6 months · Monthly: 2 years |
| **Restore drills** | Monthly — restore to staging, verify data integrity |
| **RPO** | ≤ 24 hours (WAL: near-zero) |
| **RTO** | ≤ 4 hours |

### 5.7 Indexing Strategy

```sql
-- Composite indexes for common query patterns
CREATE INDEX idx_units_society_wing ON units (society_id, wing_id);
CREATE INDEX idx_invoices_unit_cycle ON invoices (unit_id, billing_cycle_id);
CREATE INDEX idx_ledger_society_fund ON ledger_entries (society_id, fund_id, posted_at);
CREATE INDEX idx_complaints_wing_status ON complaints (wing_id, status);
CREATE INDEX idx_notices_society_published ON notices (society_id, publish_at) WHERE status = 'PUBLISHED';

-- Exclusion constraint for booking conflicts
ALTER TABLE bookings ADD CONSTRAINT no_overlapping_bookings
    EXCLUDE USING gist (amenity_id WITH =, tstzrange(start_at, end_at) WITH &&);

-- GIN index for JSONB settings search
CREATE INDEX idx_society_settings ON societies USING gin (settings);
```

---

## 6. Infrastructure & DevOps

### 6.1 Docker

#### Multi-Stage Dockerfile (API)

```dockerfile
# infra/docker/Dockerfile.api

# ── Stage 1: Dependencies ──
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile --prod=false

# ── Stage 2: Build ──
FROM deps AS builder
COPY . .
RUN pnpm --filter @societyhub/shared build
RUN pnpm --filter @societyhub/api build
RUN pnpm --filter @societyhub/api deploy --prod /app/deploy

# ── Stage 3: Production ──
FROM node:22-alpine AS runner
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder /app/deploy .
COPY --from=builder /app/apps/api/prisma ./prisma
USER app
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3001/health || exit 1
CMD ["node", "dist/main.js"]
```

#### Docker Compose — Local Development

```yaml
# infra/docker-compose.yml
version: "3.9"

services:
  # ── Database ──
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: societyhub
      POSTGRES_USER: societyhub
      POSTGRES_PASSWORD: localdev
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U societyhub"]
      interval: 5s
      timeout: 3s
      retries: 5

  # ── Connection Pooler ──
  pgbouncer:
    image: bitnami/pgbouncer:latest
    environment:
      POSTGRESQL_HOST: postgres
      POSTGRESQL_PORT: 5432
      POSTGRESQL_USERNAME: societyhub
      POSTGRESQL_PASSWORD: localdev
      POSTGRESQL_DATABASE: societyhub
      PGBOUNCER_POOL_MODE: transaction
      PGBOUNCER_MAX_CLIENT_CONN: 100
      PGBOUNCER_DEFAULT_POOL_SIZE: 20
    ports:
      - "6432:6432"
    depends_on:
      postgres:
        condition: service_healthy

  # ── Cache & Queue ──
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # ── Object Storage ──
  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data

  # ── Email (dev) ──
  mailhog:
    image: mailhog/mailhog:latest
    ports:
      - "1025:1025"    # SMTP
      - "8025:8025"    # Web UI

  # ── API ──
  api:
    build:
      context: ..
      dockerfile: infra/docker/Dockerfile.api
      target: deps       # Use deps stage for dev (with hot reload)
    command: pnpm --filter @societyhub/api dev
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://societyhub:localdev@pgbouncer:6432/societyhub
      REDIS_URL: redis://redis:6379
      S3_ENDPOINT: http://minio:9000
      S3_ACCESS_KEY: minioadmin
      S3_SECRET_KEY: minioadmin
      SMTP_HOST: mailhog
      SMTP_PORT: 1025
    ports:
      - "3001:3001"
    volumes:
      - ../apps/api/src:/app/apps/api/src
      - ../packages/shared/src:/app/packages/shared/src
    depends_on:
      - pgbouncer
      - redis
      - minio
      - mailhog

  # ── Web ──
  web:
    build:
      context: ..
      dockerfile: infra/docker/Dockerfile.web
      target: deps
    command: pnpm --filter @societyhub/web dev
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001/api/v1
    ports:
      - "3000:3000"
    volumes:
      - ../apps/web/src:/app/apps/web/src
      - ../packages/shared/src:/app/packages/shared/src
    depends_on:
      - api

  # ── Reverse Proxy ──
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ../infra/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ../infra/nginx/sites:/etc/nginx/conf.d:ro
    depends_on:
      - api
      - web

volumes:
  pg_data:
  redis_data:
  minio_data:
```

### 6.2 Nginx — Reverse Proxy

```nginx
# infra/nginx/nginx.conf

worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /run/nginx.pid;

events {
    worker_connections 1024;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # ── Logging ──
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    'rt=$request_time';
    access_log /var/log/nginx/access.log main;

    # ── Performance ──
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 10m;

    # ── Compression ──
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json
               application/javascript application/xml+rss
               application/atom+xml image/svg+xml;

    # ── Rate Limiting ──
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/s;
    limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=webhook_limit:10m rate=100r/s;

    # ── Security Headers ──
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # ── Upstream ──
    upstream api_backend {
        server api:3001;
        # For future horizontal scaling:
        # server api-2:3001;
        # server api-3:3001;
    }

    upstream web_frontend {
        server web:3000;
    }

    # ── Server ──
    server {
        listen 80;
        server_name societyhub.local;

        # API routes
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            proxy_pass http://api_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Request-ID $request_id;
        }

        # Auth routes (stricter rate limiting)
        location /api/v1/auth/ {
            limit_req zone=auth_limit burst=3 nodelay;
            proxy_pass http://api_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # Webhook routes (relaxed rate limiting, strict IP allowlist in production)
        location /api/v1/webhooks/ {
            limit_req zone=webhook_limit burst=50 nodelay;
            proxy_pass http://api_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Frontend
        location / {
            proxy_pass http://web_frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # Static asset caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://web_frontend;
            expires 30d;
            add_header Cache-Control "public, immutable";
        }

        # Health check
        location /health {
            proxy_pass http://api_backend/health;
        }
    }

    # ── TLS Server (Production) ──
    # server {
    #     listen 443 ssl http2;
    #     server_name societyhub.in;
    #     ssl_certificate     /etc/nginx/ssl/cert.pem;
    #     ssl_certificate_key /etc/nginx/ssl/key.pem;
    #     ssl_protocols       TLSv1.2 TLSv1.3;
    #     ssl_ciphers         HIGH:!aNULL:!MD5;
    #     ... (same location blocks as above)
    # }
}
```

### 6.3 Environments

| Environment | Purpose | Infrastructure | DB | Deployed Via |
|-------------|---------|----------------|-----|-------------|
| **Local** | Development | Docker Compose (all services) | Local PG + PgBouncer | `docker compose up` |
| **Staging** | Pre-production testing | Mirrors production, test payment keys | Managed PG (small) | Auto on merge to `develop` |
| **Production** | Live | Containerised services, managed PG, CDN | Managed PG (scaled) + PgBouncer | Manual approval on `main` merge |

**Config management:**
- All config via **environment variables** (12-factor app).
- Secrets via **GitHub Secrets** (CI) + cloud secrets manager (runtime).
- **No secrets in the repo. Ever.**
- `.env.example` committed with placeholder values and documentation.

---

## 7. CI/CD Pipeline

### 7.1 Pipeline Architecture

```mermaid
flowchart TB
    subgraph PR["Pull Request Pipeline"]
        direction TB
        A["Push to feature/*"] --> B["Trigger: ci.yml"]
        B --> C["Install deps<br/>(pnpm, cached)"]
        C --> D["Lint<br/>(ESLint + Prettier)"]
        C --> E["Typecheck<br/>(tsc --noEmit)"]
        C --> F["Unit Tests<br/>(Vitest/Jest)"]
        C --> G["Build<br/>(Next.js + NestJS)"]
        D & E & F & G --> H{"All pass?"}
        H -- Yes --> I["✅ Ready for review"]
        H -- No --> J["❌ Block merge"]
    end

    subgraph Staging["Staging Deploy"]
        direction TB
        K["Merge to develop"] --> L["Trigger: deploy-staging.yml"]
        L --> M["Build Docker images"]
        M --> N["Push to GHCR"]
        N --> O["Run DB migrations"]
        O --> P["Deploy containers"]
        P --> Q["E2E smoke tests"]
        Q --> R{"Pass?"}
        R -- Yes --> S["✅ Staging live"]
        R -- No --> T["🚨 Alert team"]
    end

    subgraph Prod["Production Deploy"]
        direction TB
        U["Merge to main<br/>(release branch)"] --> V["Trigger: deploy-production.yml"]
        V --> W["⏸ Manual approval<br/>(team lead)"]
        W --> X["Build + tag image<br/>(semver)"]
        X --> Y["Run DB migrations"]
        Y --> Z["Blue-green deploy"]
        Z --> AA["Health check"]
        AA --> AB{"Healthy?"}
        AB -- Yes --> AC["✅ Production live"]
        AB -- No --> AD["🔄 Auto rollback"]
    end

    subgraph Nightly["Nightly Jobs"]
        direction TB
        AE["Cron: 2 AM"] --> AF["npm audit"]
        AE --> AG["Snyk scan"]
        AE --> AH["Trivy container scan"]
        AE --> AI["License check"]
        AF & AG & AH & AI --> AJ["Report to Slack/Discord"]
    end
```

### 7.2 GitHub Actions — PR Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [develop, main]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    name: Lint & Format
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm format:check

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck

  test:
    name: Unit & Integration Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: societyhub_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @societyhub/api prisma migrate deploy
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/societyhub_test
      - run: pnpm test -- --coverage
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/societyhub_test
          REDIS_URL: redis://localhost:6379
      - uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/

  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build

  docker:
    name: Docker Build
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test, build]
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/build-push-action@v5
        with:
          context: .
          file: infra/docker/Dockerfile.api
          push: false
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### 7.3 GitHub Actions — Staging Deploy

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy Staging

on:
  push:
    branches: [develop]

jobs:
  deploy:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build & push API image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: infra/docker/Dockerfile.api
          push: true
          tags: ghcr.io/${{ github.repository }}/api:staging-${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build & push Web image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: infra/docker/Dockerfile.web
          push: true
          tags: ghcr.io/${{ github.repository }}/web:staging-${{ github.sha }}

      - name: Deploy to staging server
        run: |
          # SSH and pull new images, run migrations, restart
          echo "Deploying to staging..."
          # ssh staging "cd /opt/societyhub && ./deploy.sh staging-${{ github.sha }}"

      - name: Run E2E smoke tests
        run: |
          pnpm --filter @societyhub/web test:e2e -- --project=staging
```

### 7.4 Production Deploy (Manual Approval)

```yaml
# .github/workflows/deploy-production.yml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    environment:
      name: production       # Requires manual approval in GitHub
      url: https://societyhub.in
    steps:
      - uses: actions/checkout@v4
      # ... same build + push steps with :latest and :vX.Y.Z tags
      # ... migration + deploy + health check + rollback on failure
```

---

## 8. Testing Strategy

### 8.1 Test Pyramid

```mermaid
graph TB
    subgraph Pyramid["Testing Pyramid"]
        E2E["🔺 E2E Tests (Playwright)<br/>~20 critical journeys<br/>Runs: staging deploy"]
        INT["🔶 Integration Tests (Supertest)<br/>~100+ API tests<br/>Runs: every PR"]
        UNIT["🟩 Unit Tests (Vitest/Jest)<br/>~500+ tests<br/>Runs: every PR"]
    end
    style UNIT fill:#22C55E,color:#fff
    style INT fill:#F59E0B,color:#fff
    style E2E fill:#EF4444,color:#fff
```

### 8.2 Testing Tools

| Layer | Tool | Scope |
|-------|------|-------|
| **Unit** | Vitest (frontend) / Jest (backend) | Pure functions, services, utilities, Zod schemas |
| **Integration** | Supertest + NestJS Testing Module | API endpoints with real DB (test container), auth flows, RBAC |
| **E2E** | Playwright | Critical user journeys: login → pay dues → receipt; raise complaint; create poll → vote |
| **Visual** | Storybook + Chromatic (optional) | Component snapshots, visual regression |
| **Load** | k6 or Artillery | Billing-day peak simulation: concurrent invoice generation + payments |
| **Security** | OWASP ZAP (DAST) | Automated scan in staging |

### 8.3 Coverage Targets

| Area | Target | Why |
|------|--------|-----|
| **Finance module** | ≥ 90% | Money must be correct. Ledger, billing, payments, allocations. |
| **Voting / polls** | ≥ 85% | Tamper-evident voting, eligibility rules, one-vote-per-unit. |
| **Auth / RBAC** | ≥ 85% | Security-critical. Cross-wing, cross-society access tests. |
| **Other modules** | ≥ 70% | Business logic coverage. |
| **Frontend** | ≥ 60% | Critical flows + form validation. |
| **Overall** | ≥ 70% | CI blocks merge below threshold. |

### 8.4 Key Test Scenarios

```
Finance:
  ✓ Invoice generation is idempotent (re-run doesn't double-bill)
  ✓ Ledger entries balance (debits = credits per transaction)
  ✓ Late fee calculation respects bye-law configuration
  ✓ Payment webhook replay is safely deduplicated
  ✓ Partial payment allocates correctly (oldest invoice first)
  ✓ Period-locked months reject new entries

Security:
  ✓ Wing A resident cannot access Wing B data
  ✓ Tenant cannot access owner-only endpoints
  ✓ Expired JWT returns 401, not 500
  ✓ OTP brute force is rate-limited

Voting:
  ✓ One vote per unit enforced
  ✓ Secret ballot doesn't reveal voter identity
  ✓ Poll after close rejects new votes
  ✓ Quorum threshold correctly evaluated
```

---

## 9. Observability & Monitoring

### 9.1 Stack

```mermaid
flowchart LR
    APP["NestJS API"] -->|structured logs| PINO["Pino (JSON)"]
    PINO --> LOKI["Loki / ELK / CloudWatch"]
    APP -->|errors| SENTRY["Sentry"]
    APP -->|metrics| PROM["Prometheus"]
    PROM --> GRAF["Grafana Dashboards"]
    NGINX["Nginx"] -->|access logs| LOKI
    PG["PostgreSQL"] -->|pg_stat| PROM
    REDIS["Redis"] -->|info| PROM
```

### 9.2 Structured Logging — Pino

```typescript
// Every log line is JSON with context
{
  "level": "info",
  "time": "2026-10-12T10:30:00.000Z",
  "requestId": "req-abc123",
  "userId": "usr-xyz",
  "societyId": "soc-123",
  "module": "finance",
  "action": "invoice.created",
  "invoiceId": "inv-456",
  "unitId": "unit-789",
  "amount": 5500.00,
  "msg": "Invoice created for unit A-101, cycle Oct-2026"
}
```

### 9.3 Key Metrics & Alerts

| Metric | Alert Threshold | Action |
|--------|-----------------|--------|
| API response time (p95) | > 500ms for 5 min | Investigate slow queries |
| Error rate (5xx) | > 1% for 5 min | Page on-call |
| Failed payment webhooks | Any failure | Immediate alert — money is involved |
| Queue depth (billing) | > 1000 for 10 min | Scale workers |
| Database connections | > 80% pool | Check connection leaks |
| Disk usage (PG) | > 80% | Plan expansion |
| Failed login attempts | > 50/min from one IP | Auto-block + alert |
| Certificate expiry | < 14 days | Renew TLS cert |

### 9.4 Health Checks

```typescript
// GET /health — used by Nginx, Docker, load balancers
{
  "status": "healthy",
  "uptime": 86400,
  "version": "1.2.3",
  "checks": {
    "database": "connected",
    "redis": "connected",
    "storage": "accessible",
    "queue": "processing"
  }
}
```

---

## 10. Security Tooling

### 10.1 Dependency Security

| Tool | When | What |
|------|------|------|
| `pnpm audit` | Every CI run | Known vulnerabilities in npm packages |
| **Snyk** (or Socket) | PR + nightly | Deep vulnerability analysis + fix PRs |
| **Dependabot** | Weekly | Automated dependency update PRs |
| `npm-check-updates` | Monthly manual | Major version upgrades review |

### 10.2 Code Security

| Tool | When | What |
|------|------|------|
| **ESLint security plugins** | Every CI run | `eslint-plugin-security`, `eslint-plugin-no-secrets` |
| **GitHub Secret Scanning** | Always on | Prevents committing API keys, tokens, passwords |
| **git-secrets** | Pre-commit hook | Local guard against secret commits |
| **SonarQube** (optional) | PR | SAST — code smells, security hotspots, duplications |

### 10.3 Container Security

| Tool | When | What |
|------|------|------|
| **Trivy** | Docker build in CI | Scan images for OS and library vulnerabilities |
| **Distroless / Alpine base** | Always | Minimal attack surface in production images |
| **Non-root user** | Dockerfile | Containers run as `app` user, not root |

### 10.4 Runtime Security

| Measure | Implementation |
|---------|----------------|
| **CSP** | Content-Security-Policy header via Nginx |
| **CORS** | Strict origin allowlist (production domain only) |
| **HSTS** | `Strict-Transport-Security` with `includeSubDomains` |
| **Rate limiting** | Nginx zone-based (see §6.2) + API-level via `@nestjs/throttler` |
| **Input validation** | Zod schemas on every endpoint (via `ZodValidationPipe`) |
| **SQL injection** | Prisma parameterised queries (ORM-enforced) |
| **File uploads** | Type validation, size limits (10 MB), virus scan (ClamAV optional) |

### 10.5 Secrets Management

```
Development:  .env files (git-ignored) + .env.example (committed)
CI/CD:        GitHub Secrets (encrypted, environment-scoped)
Production:   Cloud secrets manager (AWS SSM / GCP Secret Manager / HashiCorp Vault)
```

**Never in the repo:** API keys, database credentials, JWT secrets, payment gateway keys, SMS provider tokens.

---

## 11. Mobile Strategy

### 11.1 Phase 1 — PWA (Immediate, with v1)

The web app is a **Progressive Web App** from day one:

| Feature | Implementation |
|---------|----------------|
| **Installable** | Web App Manifest + Service Worker (via `next-pwa`) |
| **Offline** | Offline fallback page, cached critical assets |
| **Push notifications** | Web Push API via Service Worker + FCM |
| **Responsive** | Mobile-first design, bottom navigation on small screens |
| **App-like** | Standalone display mode, splash screen, status bar theming |
| **Updates** | Automatic via Service Worker update lifecycle |

> PWA covers 80% of the mobile use case (pay dues, read notices, raise complaints, vote) without app store distribution. This is the **MVP mobile strategy**.

### 11.2 Phase 2 — React Native / Expo (Future, Post-Launch)

When a dedicated native app is justified (push reliability, biometric auth, offline-first):

| Aspect | Choice |
|--------|--------|
| **Framework** | React Native with Expo SDK |
| **Why React Native** | Same team (TypeScript/React), shared `packages/shared` (Zod schemas, types, constants) |
| **Navigation** | Expo Router (file-based, mirrors Next.js) |
| **UI** | NativeWind (Tailwind for RN) + custom components |
| **State** | TanStack Query + Zustand (same as web) |
| **Push** | Expo Notifications → FCM (Android) + APNs (iOS) |
| **Auth** | Biometric (FaceID/fingerprint) + secure token storage (expo-secure-store) |
| **Distribution** | Expo EAS Build + Submit → Google Play + App Store |
| **OTA Updates** | Expo Updates — push JS updates without app store review |

### 11.3 Code Sharing Strategy

```
packages/shared/        ← Used by web, api, AND mobile
├── schemas/             # Zod — validation on all platforms
├── types/               # TypeScript — shared interfaces
├── constants/           # Roles, permissions, fund types
└── utils/               # Date, currency, formatting

apps/mobile/             ← React Native app (future)
├── app/                 # Expo Router pages
├── components/          # RN-specific components
├── hooks/               # Reuse API hooks from web (TanStack Query)
└── lib/                 # RN-specific utilities
```

---

## 12. External Services & Integrations

| Service | Provider Options | Purpose | Integration |
|---------|-----------------|---------|-------------|
| **Payment Gateway** | Razorpay / Cashfree | UPI, cards, netbanking | Webhook-driven; SDK for checkout; reconciliation API |
| **Email** | AWS SES / Resend / SendGrid | Transactional emails (invoices, receipts, notices) | SMTP or API; templated via Handlebars/MJML |
| **SMS** | MSG91 / Twilio / Gupshup | OTP, due reminders, urgent notices | HTTP API; DLT registration for Indian SMS regulations |
| **WhatsApp** | Gupshup / Interakt / Meta Cloud API | Due reminders, notice alerts, complaint updates | Template-based messaging via approved templates |
| **Push Notifications** | Firebase Cloud Messaging (FCM) | In-app push for web (PWA) and mobile | Service Worker (web), Expo Notifications (mobile) |
| **Object Storage** | AWS S3 / Cloudflare R2 / MinIO (dev) | Bills, receipts, attachments, documents | S3-compatible API; signed URLs for private files |
| **CDN** | Cloudflare / AWS CloudFront | Static assets, images, PWA caching | Nginx proxies to CDN origin in production |
| **DNS** | Cloudflare | Domain, SSL, DDoS protection | Proxy mode for origin protection |

---

## 13. Developer Experience

### 13.1 Monorepo Tooling

| Tool | Purpose |
|------|---------|
| **Turborepo** | Task runner — parallel builds, intelligent caching, dependency-aware task execution |
| **pnpm workspaces** | Package management — workspace protocol for internal packages |
| **tsconfig paths** | Shared TypeScript config — `@societyhub/shared`, `@societyhub/ui` |

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "lint": {},
    "typecheck": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 13.2 Code Quality Tools

| Tool | Config File | Purpose |
|------|-------------|---------|
| **ESLint** | `.eslintrc.cjs` | Linting — `@typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-security` |
| **Prettier** | `.prettierrc` | Formatting — single quotes, semicolons, 100 char width, trailing commas |
| **Husky** | `.husky/` | Git hooks — pre-commit, commit-msg |
| **lint-staged** | `package.json` | Run lint + format only on staged files (fast) |
| **commitlint** | `commitlint.config.cjs` | Enforce Conventional Commits on every commit message |
| **EditorConfig** | `.editorconfig` | Consistent indentation, line endings, charset across editors |

### 13.3 Pre-Commit Hooks

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"],
    "*.prisma": ["prisma format"]
  }
}
```

```bash
# .husky/pre-commit
pnpm lint-staged

# .husky/commit-msg
pnpm commitlint --edit $1
```

### 13.4 VSCode Workspace Settings

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/dist": true
  }
}
```

```json
// .vscode/extensions.json — recommended extensions
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "ms-azuretools.vscode-docker",
    "eamodio.gitlens",
    "GitHub.copilot"
  ]
}
```

### 13.5 Documentation Standards

| Document | Location | Owner |
|----------|----------|-------|
| **README.md** | Root + each app | Team lead |
| **API contract** | `docs/04-api-contract.yaml` (OpenAPI) | Backend team |
| **ADRs** | `docs/adr/` (one file per decision) | Whoever proposes |
| **Runbook** | `docs/08-runbook.md` | DevOps / team lead |
| **Onboarding guide** | `docs/ONBOARDING.md` | Team lead |
| **Changelog** | `CHANGELOG.md` (auto-generated from Conventional Commits) | CI |

**ADR format:**
```markdown
# ADR-001: Use Prisma as ORM

## Status: Accepted
## Date: 2026-10-19

## Context
We need an ORM that provides type safety, migration management, and works well with PostgreSQL.

## Decision
Use Prisma v5+ with its migration system.

## Consequences
+ Typed client reduces bugs
+ Migration files are versioned and reviewable
- Raw SQL escape hatch needed for complex queries (ledger aggregations)
```

---

## 14. Tech Stack Summary

### Full Stack at a Glance

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | Next.js (App Router) + TypeScript | 14+ |
| **Styling** | Tailwind CSS + shadcn/ui | 3+ |
| **State** | TanStack Query + Zustand | 5+ / 4+ |
| **Forms** | React Hook Form + Zod | 7+ / 3+ |
| **Backend** | NestJS + TypeScript | 10+ |
| **Runtime** | Node.js | 22 LTS |
| **ORM** | Prisma | 5+ |
| **Database** | PostgreSQL + PgBouncer | 16+ |
| **Cache / Queue** | Redis + BullMQ | 7+ |
| **Object Storage** | S3 / R2 / MinIO | — |
| **Reverse Proxy** | Nginx | Latest |
| **Containerisation** | Docker + Docker Compose | 24+ |
| **CI/CD** | GitHub Actions | — |
| **Registry** | GitHub Container Registry (GHCR) | — |
| **Version Control** | Git + GitHub | — |
| **Monorepo** | Turborepo + pnpm workspaces | — |
| **Testing** | Vitest, Jest, Supertest, Playwright | — |
| **Error Tracking** | Sentry | — |
| **Monitoring** | Prometheus + Grafana | — |
| **Logging** | Pino (structured JSON) | — |
| **Security** | Snyk, Trivy, ESLint security, GitHub Secret Scanning | — |
| **PWA** | next-pwa + Service Worker | — |
| **Mobile (future)** | React Native + Expo | — |
| **Payment** | Razorpay / Cashfree | — |
| **Email** | AWS SES / Resend | — |
| **SMS / WhatsApp** | MSG91 / Gupshup | — |
| **Push** | Firebase Cloud Messaging | — |

### Developer Workflow Summary

```mermaid
flowchart LR
    A["Clone repo"] --> B["pnpm install"]
    B --> C["docker compose up"]
    C --> D["pnpm dev<br/>(Turborepo)"]
    D --> E["Code on<br/>feature/* branch"]
    E --> F["Pre-commit:<br/>lint + format"]
    F --> G["Push + open PR"]
    G --> H["CI: lint → test → build"]
    H --> I["Code review"]
    I --> J["Squash merge<br/>to develop"]
    J --> K["Auto-deploy<br/>to staging"]
    K --> L["E2E smoke tests"]
    L --> M["Release branch<br/>to main"]
    M --> N["Manual approval<br/>→ production"]
```

---

> **This document is a living reference.** Update it via PRs as the stack evolves. Log significant changes as ADRs in `docs/adr/`.
