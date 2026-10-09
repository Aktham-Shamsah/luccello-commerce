# Security — Local Deployment

- HTTP security headers are applied by the API and the Next.js applications.
- The admin app requires a server-validated short-lived signed HTTP-only session cookie; the proxy adds a separately configured secret when forwarding authorized admin requests.
- CSRF checks protect administrative mutations, and a basic in-memory login-attempt limit protects the login endpoint.
- The API and PostgreSQL ports are internal to Docker Compose, with the storefront and admin ports published for LAN use.
- Database credentials, signing secrets and the admin password belong in a private `.env`, never in Git.
- API request body validation and rate limiting are implemented, but a full external security assessment has not been conducted.
- Image uploads validate allowed types, file sizes and magic signatures and use randomized filenames.
- Online card payment is disabled; any future provider needs server-verified payments/webhooks.
- Deploy TLS and stronger identity controls before using the admin over untrusted networks.
- Keep off-server PostgreSQL and image backups; verify restore procedures periodically.

See [Ubuntu Docker setup](ubuntu-docker.md) for firewall and access constraints.
