# Security

- Helmet/security headers are enabled in the API and Next apps.
- Admin routes require authentication by design; local UI is a seeded shell until Cognito is connected.
- Production admin requires Cognito, MFA, RBAC, short sessions, audit logs, and failed-auth logging.
- WAF rate limiting is defined in CDK.
- Database is private, encrypted, and accessed through RDS Proxy.
- File uploads must use signed URLs, MIME allowlists, size limits, random object keys, and private buckets.
- Payment success must be verified server-side through provider APIs/webhooks.
