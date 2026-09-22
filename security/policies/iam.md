# IAM Policy Notes

IAM roles must remain domain-specific: catalog read, cart, checkout, admin catalog, admin orders, webhooks, migration worker, and background worker. Avoid `Action: "*"` and `Resource: "*"` unless a documented AWS integration requires it.
