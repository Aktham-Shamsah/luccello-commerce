# Deployment

Initial phase is local only. Do not deploy AWS until the exact command `DEPLOY TO AWS` is given.

Before deployment:

1. Verify clean Git working tree.
2. Run `pnpm verify`.
3. Record Git SHA.
4. Confirm no secrets are committed.
5. Confirm AWS CLI account and region.
6. Run `pnpm cdk:synth`.
7. Run `cdk diff` and review changes.
8. Deploy CDK stacks using GitHub OIDC or an explicitly authenticated local AWS profile.
9. Run migrations through a private-network migrator.
10. Smoke test storefront, admin, API, WAF, headers, and `/version`.

GitHub Actions must use OIDC federation. Do not store long-lived AWS keys in repository secrets unless a documented exception is accepted.
