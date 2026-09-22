# L'uccello Commerce Demo

Production-oriented Arabic RTL ecommerce monorepo inspired by the public `luccello-bag.com` storefront structure. This repository uses original generated assets and fictional Arabic demo content. It is not affiliated with LUCCELLO.

## Stack

Next.js 15, React, TypeScript, pnpm, Turborepo, Zod, Drizzle ORM, PostgreSQL, AWS CDK TypeScript, API Gateway/Lambda-ready API, Aurora PostgreSQL Serverless v2, RDS Proxy, DynamoDB extension point, S3, WAF, SQS, SES, CloudWatch, Vitest, Playwright, GitHub Actions.

## Apps

- Storefront: `apps/storefront`
- Admin: `apps/admin`
- API: `services/api`
- CDK: `infrastructure/cdk`

## Local Setup

```bash
corepack enable
pnpm install
docker compose up -d
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

## AWS Status

AWS infrastructure is prepared as CDK, but AWS has not been deployed. Deployment should only happen after the exact command `DEPLOY TO AWS` and the checklist in `docs/deployment.md`.
