# Backup And Recovery

- Aurora automated backups are configured by environment.
- Production uses deletion protection and retained resources.
- S3 assets should be versioned.
- Restore tests should be run in staging before relying on production procedures.
- Recovery records must include Git SHA, migration version, database snapshot, and verification outcome.
