# Incident Response

- Compromised admin: disable Cognito user, rotate sessions, review audit logs, require password reset and MFA review.
- Suspicious payments: pause fulfillment, compare provider events, reconcile orders, preserve logs.
- Leaked credentials: revoke immediately, rotate secret in Secrets Manager, redeploy affected functions.
- Unexpected AWS spend: inspect Budgets, disable noncritical workloads, review WAF/API spikes.
- DDoS or abuse: raise WAF rate rules, review CloudWatch, preserve request samples.
- Database incident: stop writes if needed, snapshot, restore to staging, validate integrity.
- Bad deployment: roll back Amplify/CloudFormation to prior known SHA.
- Provider outage: queue work, show checkout status, reconcile when provider recovers.
