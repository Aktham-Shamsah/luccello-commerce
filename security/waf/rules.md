# WAF Rules

The CDK `SecurityStack` creates a regional AWS WAF ACL with IP rate limiting. Production hardening should add managed rule groups for common exploits, known bad inputs, SQL injection, and bot control as cost allows.
