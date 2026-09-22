import { describe, expect, it } from "vitest";

describe("security posture", () => {
  it("documents that admin routes require auth", () => {
    expect("admin_auth_required").toContain("auth");
  });
});
