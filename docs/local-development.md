# Local Development

The development-only Compose file starts PostgreSQL; run the three Node.js applications on your computer:

```bash
corepack enable
pnpm install
docker compose -f docker-compose.yml up -d
cp .env.example .env
# Replace CHANGE_ME values with generated secrets
pnpm dev:api
pnpm dev:storefront
pnpm dev:admin
```

Local URLs:

- Storefront: `http://localhost:3000/ar`
- Admin: `http://localhost:3001/login`
- API: `http://localhost:4000/version`

For the full Ubuntu deployment use the separate `compose.yaml` and `.env.docker.example`, documented in [ubuntu-docker.md](ubuntu-docker.md). Never commit `.env`.
