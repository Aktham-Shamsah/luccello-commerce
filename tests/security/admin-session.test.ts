import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  issueAdminSession,
  isValidAdminSession,
  verifyAdminPassword,
} from "../../apps/admin/src/lib/admin-auth";

const previousPassword = process.env.ADMIN_PASSWORD;
const previousSecret = process.env.ADMIN_SESSION_SECRET;
beforeEach(() => {
  process.env.ADMIN_PASSWORD = "a-different-long-local-admin-password";
  process.env.ADMIN_SESSION_SECRET = "long-random-test-signing-secret-0123456789abcdef";
});
afterEach(() => {
  if (previousPassword === undefined) delete process.env.ADMIN_PASSWORD;
  else process.env.ADMIN_PASSWORD = previousPassword;
  if (previousSecret === undefined) delete process.env.ADMIN_SESSION_SECRET;
  else process.env.ADMIN_SESSION_SECRET = previousSecret;
});
describe("admin authorization", () => {
  it("requires a strong configured password", () => {
    expect(verifyAdminPassword("a-different-long-local-admin-password")).toBe(true);
    expect(verifyAdminPassword("incorrect-password")).toBe(false);
  });
  it("rejects tampered sessions", () => {
    const issued = issueAdminSession();
    expect(isValidAdminSession(issued)).toBe(true);
    expect(isValidAdminSession(issued.slice(0, -1) + (issued.endsWith("0") ? "1" : "0"))).toBe(
      false,
    );
    expect(isValidAdminSession("")).toBe(false);
  });
});
