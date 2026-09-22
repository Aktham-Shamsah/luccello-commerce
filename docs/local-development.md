# Local Development

```bash
corepack enable
pnpm install
docker compose up -d
pnpm dev:api
pnpm dev:storefront
pnpm dev:admin
```

Local URLs:

- Storefront: `http://localhost:3000/ar`
- Admin: `http://localhost:3001`
- API: `http://localhost:4000/version`

Copy `.env.example` to `.env.local` only for local machine use. Never commit real secrets.
