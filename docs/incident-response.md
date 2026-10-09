# Local Incident Response

- Compromised admin: disconnect admin from the network, rotate the admin password and session-signing secret, restart the admin service, and review the audit log and product/order mutations.
- Leaked configuration: rotate affected secrets in the local `.env`, restart impacted services and verify no logs or repository files exposed the values.
- Suspicious orders: pause fulfillment, verify stock and order records against the database and preserve request logs.
- Unexpected traffic: restrict the Ubuntu firewall or reverse proxy to the trusted LAN, inspect `docker compose logs`, and review rate-limiting configuration.
- Database incident: halt writes if needed, make a snapshot, restore a known-good dump into an isolated instance and verify integrity.
- Failed deployment: switch to the prior Git commit, rebuild containers, and follow database migration compatibility and backup procedures.
- Disk pressure: inspect `docker system df`, volume usage and application logs. Avoid pruning persistent data volumes.
