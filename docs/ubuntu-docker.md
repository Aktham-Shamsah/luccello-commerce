# Run LU'CHÉLO on a local Ubuntu server

This deployment runs three application services and PostgreSQL on **one trusted Ubuntu machine**. It does not require AWS or external hosting. All orders are **cash on delivery** and must be fulfilled manually; no card gateway or carrier API is configured. WhatsApp is intentionally unchanged/disabled.

## Prerequisites

- Ubuntu 22.04+ / 24.04 LTS, Docker Engine and Docker Compose v2.
- Recommended 4 CPU cores, 8 GiB RAM, 20+ GiB free space for source, images, and database.
- Allow inbound TCP 3000 (store) and 3001 (admin) only from your trusted LAN.
- Keep ports 4000 and 5432 private (Compose does not publish them).

## First start

```bash
git clone https://github.com/Aktham-Shamsah/luccello-commerce.git
cd luccello-commerce
cp .env.docker.example .env
nano .env
```

Set **different** strong values for each of:

```
DB_PASSWORD
ADMIN_LOCAL_KEY
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
SESSION_HASH_SALT
```

Generate each secret with `openssl rand -hex 32`. Use hex for `DB_PASSWORD` to avoid URL-escaping issues. Do not use example placeholders and never commit `.env`. For a trusted HTTP-only LAN, set `COOKIE_SECURE=false`. Set it to true **only after** you terminate HTTPS at a reverse proxy.

```bash
docker compose up -d --build
docker compose ps
docker compose logs --tail=150 migrate api storefront admin
```

Visit:

- Storefront: `http://UBUNTU_SERVER_IP:3000/ar`
- Admin login: `http://UBUNTU_SERVER_IP:3001/login`

Log in with the `ADMIN_PASSWORD` from your private `.env`. The API and PostgreSQL are not exposed to the LAN. Images and PostgreSQL data persist in named Docker volumes.

The first-start migration service migrates the database and adds sample catalog products **only when the catalog is empty**. These are fictional products; update them in the admin panel before accepting customer orders.

## Basic operations

```bash
docker compose ps
docker compose logs -f api
docker compose up -d --build
docker compose down
```

`docker compose down` preserves named volumes. **Do not run `docker compose down -v`** unless you intend to delete orders, products, and uploaded files.

### Database backup

```bash
mkdir -p backups
docker compose exec -T postgres pg_dump -U postgres -d luccello --format=custom > backups/luccello-$(date +%Y%m%d-%H%M).dump
```

Keep the backup off-server and separately back up uploaded images:

```bash
docker run --rm -v luccello_uploaded_images:/data:ro -v "$PWD/backups":/backup alpine tar -czf /backup/uploads.tar.gz -C /data .
```

Before upgrades, back up the database, verify recovery on a separate test instance, and preserve the `.env` secrets. Rebuilding containers is safe; removing volumes is not.

## Security and known limits

- Use only on a trusted LAN until HTTPS, domain, backups, monitoring, email transport, payment webhooks, and business legal/privacy policies are configured.
- Admin login uses a single local credential and short-lived signed HTTP-only cookies. This is **not** multi-user identity management; a reverse proxy with TLS is required for untrusted networks.
- No customer account registration/login is active; guest buyers can track an order by UUID and email. Do not advertise account addresses or saved payments.
- Product submissions and ratings require moderation. Offline GitHub Pages is only a visual preview and cannot place orders.
- Inventory is decremented within a PostgreSQL transaction for a confirmed cash-on-delivery order. Cancelling from admin returns the stock. Fulfilment is manual.
- Manual delivery pricing is configured in application code. Confirm the regions, pricing, taxes, currency, delivery policies, and legal pages for the actual merchant before launch.
- The database is not exposed by the Compose file. Restrict admin access further with a firewall/VPN and add TLS before placing the server on an untrusted LAN.
