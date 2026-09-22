import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../services/api/src/server.js";

let server: Server;
let baseUrl = "";

beforeAll(async () => {
  server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});

describe("API security middleware", () => {
  it("adds a request id and hides Express", async () => {
    const response = await fetch(`${baseUrl}/version`);
    expect(response.headers.get("x-request-id")).toBeTruthy();
    expect(response.headers.get("x-powered-by")).toBeNull();
  });

  it("rejects unauthenticated admin access", async () => {
    const response = await fetch(`${baseUrl}/admin/products`);
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ error: "admin_auth_required" });
  });

  it("requires an idempotency key for checkout", async () => {
    const response = await fetch(`${baseUrl}/checkout`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        cartId: "cart_123",
        contact: { name: "Demo", email: "demo@example.test", phone: "0500000000" },
        address: { line1: "Riyadh", city: "Riyadh", country: "SA" },
        paymentMethod: "mock",
      }),
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: "idempotency_key_required" });
  });

  it("rejects malformed product slugs", async () => {
    const response = await fetch(`${baseUrl}/products/%3Cscript%3E`);
    expect(response.status).toBe(400);
  });
});
