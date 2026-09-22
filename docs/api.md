# API

| Route             | Method | Class          | Auth                           | Rate Limit | Schema           |
| ----------------- | ------ | -------------- | ------------------------------ | ---------- | ---------------- |
| `/version`        | GET    | Public read    | None                           | Standard   | version response |
| `/products`       | GET    | Public read    | None                           | Standard   | product list     |
| `/products/:slug` | GET    | Public read    | None                           | Standard   | product slug     |
| `/checkout`       | POST   | Customer write | Customer session in production | Strict     | `checkoutSchema` |
| `/admin/*`        | Any    | Admin          | Cognito admin role             | Strict     | route specific   |

Server recomputes price, discount, shipping, inventory, role, and payment state. The browser never supplies authoritative totals or successful payment state.
