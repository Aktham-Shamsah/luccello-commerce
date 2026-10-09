# Local Backup and Recovery

PostgreSQL and uploaded image files persist in named Docker volumes. Stopping the stack preserves volumes; deleting volumes destroys data.

## Back up

```bash
mkdir -p backups
docker compose exec -T postgres pg_dump -U postgres -d luccello --format=custom > backups/luccello-$(date +%Y%m%d-%H%M).dump
docker run --rm -v luccello_uploaded_images:/data:ro -v "$PWD/backups":/backup alpine tar -czf /backup/uploads.tar.gz -C /data .
```

Copy backups off the Ubuntu server and protect them (they contain customer personal data). Document the code commit, migration version and backup date.

## Restore

Test recovery using a **separate staging Compose project and database**, not the live store. Restore the SQL dump with `pg_restore`, restore the upload archive into the correct volume, and verify product images, orders and user access.

Before any upgrade, take and verify a fresh backup. Never run `docker compose down -v` on a store whose data you want to preserve.
