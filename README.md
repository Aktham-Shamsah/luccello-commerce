# L'uccello Commerce Demo

Production-oriented Arabic RTL ecommerce monorepo inspired by the public `luccello-bag.com` storefront structure. This repository uses original generated assets and fictional Arabic demo content. It is not affiliated with LUCCELLO.

## Stack

Next.js 15, React, TypeScript, pnpm, Turborepo, Zod, Drizzle ORM, PostgreSQL, AWS CDK TypeScript, API Gateway/Lambda-ready API, Aurora PostgreSQL Serverless v2, RDS Proxy, DynamoDB extension point, S3, WAF, SQS, SES, CloudWatch, Vitest, Playwright, GitHub Actions.

## Apps

- Storefront: `apps/storefront`
- Admin: `apps/admin`
- API: `services/api`
- CDK: `infrastructure/cdk`

## Ubuntu Docker deployment

For a local Ubuntu server, use [docs/ubuntu-docker.md](docs/ubuntu-docker.md):

```bash
cp .env.docker.example .env
# Replace all CHANGE_ME secrets in .env
docker compose up -d --build
```

Storefront: port 3000. Password-protected admin: port 3001. The API and database are private to the Docker network. Orders use PostgreSQL-backed cash-on-delivery checkout, stock adjustments, order tracking, and admin fulfillment. Online payments, carrier integrations, and WhatsApp are not enabled.

This remains a development implementation; the commercial policies, actual product media, real shipping conditions, customer accounts, and HTTPS must be configured and verified before public launch.

## Local Setup

```bash
corepack enable
pnpm install
docker compose -f docker-compose.yml up -d # development-only database services
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
pnpm cdk:synth
pnpm security:scan
```

## Screenshots

Screenshots are captured under `docs/screenshots/` during the final acceptance pass.

## GitHub Publish

This local repo is committed and ready to push after a GitHub repository is created. See `docs/github-publish.md` and `scripts/publish-github.ps1`.

## AWS Status

AWS infrastructure is prepared as CDK, but AWS has not been deployed. Deployment should only happen after the exact command `DEPLOY TO AWS` and the checklist in `docs/deployment.md`.
