# L'uccello Commerce

Arabic RTL ecommerce monorepo for a locally hosted handbag store. The repository uses original demo assets and sample Arabic content; it is not affiliated with the reference store.

## Stack

Next.js 15, React, TypeScript, Express, Zod, PostgreSQL, Drizzle ORM, pnpm, Turborepo, Docker Compose, Vitest, Playwright and GitHub Actions.

The local Ubuntu server is the deployment target. GitHub Pages remains an **optional static storefront preview**, not a place to take orders.

## Applications

- Customer storefront: `apps/storefront` (port 3000)
- Password-protected administrator dashboard: `apps/admin` (port 3001)
- Express API: `services/api` (private Docker network)
- PostgreSQL database: `database` (private Docker network)

## Ubuntu deployment

Follow [the Ubuntu Docker guide](docs/ubuntu-docker.md). The complete stack can be built and run without an external cloud provider.

```bash
cp .env.docker.example .env
# Replace CHANGE_ME placeholders with independent strong secrets.
docker compose up -d --build
docker compose ps
```

The storefront supports cash-on-delivery orders, inventory checks, order tracking and manual fulfillment; online card payment and carrier integrations are not configured. WhatsApp is intentionally left disabled.

## Develop on a computer

```bash
corepack enable
pnpm install
docker compose -f docker-compose.yml up -d
# Copy .env.example to .env and replace secrets in the local development environment
pnpm dev:api
pnpm dev:storefront
pnpm dev:admin
```

## Verification

```bash
pnpm format
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm security:scan
```

For container health checks and data backup/restore instructions, see [docs/deployment.md](docs/deployment.md) and [docs/backup-recovery.md](docs/backup-recovery.md).

This is still a development store; finish the real catalog, shipping policy, legal documents, HTTPS and end-to-end Docker/database testing before accepting actual orders.
