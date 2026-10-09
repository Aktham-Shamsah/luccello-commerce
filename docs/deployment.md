# Ubuntu Server Deployment

The deployment target is a locally operated Ubuntu server using Docker Compose. There are no cloud infrastructure stacks in this project.

## Prepare

1. Confirm a trusted LAN host with Docker Engine and Docker Compose v2.
2. Copy `.env.docker.example` to `.env` and replace the independent secret values.
3. Ensure only the intended network can reach storefront port 3000 and admin port 3001.
4. Ensure PostgreSQL and the API are not published outside their Docker network.
5. Back up the database and uploaded-image volume before migrations or upgrades.

## Start

```bash
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 migrate api storefront admin
```

The `migrate` container applies database migrations before the API starts; the seed only adds demonstration products to an empty catalog.

Check the storefront at `http://SERVER_LAN_IP:3000/ar` and admin login at `http://SERVER_LAN_IP:3001/login`.

## Acceptance checks

- Admin login rejects unauthenticated requests and permits authenticated product edits.
- Storefront lists the published database products.
- Cash-on-delivery checkout writes the expected order/items and decrements inventory.
- Canceling an order restores stock; fulfilling an order does not.
- Review submission waits for approval before becoming public.
- Product images survive container restarts and database backups are recoverable.
- No private secrets are exposed in logs, browser bundles or committed files.

Do not open the admin to an untrusted network without HTTPS and a stronger identity/access-control model. See [Ubuntu guide](ubuntu-docker.md) and [backup and recovery](backup-recovery.md).
