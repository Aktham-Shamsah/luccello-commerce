# Local Architecture

The application uses regular Next.js/Node.js processes and PostgreSQL. Docker Compose coordinates the services on one Ubuntu host.

```mermaid
flowchart LR
  Shopper["Customer browser"] --> Storefront["Next.js storefront :3000"]
  Manager["Administrator browser"] --> Admin["Next.js admin :3001"]
  Storefront -->|"internal /backend proxy"| API["Express API :4000"]
  Admin -->|"authenticated server-side proxy"| API
  API --> DB["PostgreSQL :5432"]
  API --> Uploads["Persistent uploaded-image volume"]
  GitHub["GitHub repository"] --> Actions["CI checks + optional static Pages preview"]
```

The API and PostgreSQL ports are private to the Docker network; only the storefront and admin HTTP ports are published. Restrict access to a trusted LAN until TLS is configured.

## Checkout (current implementation)

```mermaid
sequenceDiagram
  participant C as Customer browser
  participant S as Storefront
  participant A as API
  participant D as PostgreSQL
  C->>S: Submit cart and delivery details
  S->>A: POST /checkout (cash on delivery)
  A->>D: Begin transaction, lock inventory rows
  A->>D: Validate product, quantity and authoritative prices
  A->>D: Create order/items and decrement stock
  D-->>A: Commit
  A-->>S: Confirmed COD order ID
  S-->>C: Order receipt and tracking link
```

Cancellation from the admin panel restores the ordered inventory. Card payment providers and shipping carriers are not integrated.

## Deployment

Use `compose.yaml` for the entire stack, or `docker-compose.yml` for a development-only PostgreSQL service while running Node.js processes on the host. See [Ubuntu deployment](ubuntu-docker.md).
