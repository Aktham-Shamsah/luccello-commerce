# Security Headers

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

For untrusted networks, terminate HTTPS at a locally managed reverse proxy. Add and test a restrictive Content-Security-Policy after external script/image/payment domains are finalized.
