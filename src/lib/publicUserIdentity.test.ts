import { describe, expect, it } from "vitest";

import {
  hasPublicUserEmail,
  resolvePublicUserEmail,
} from "@lib/publicUserIdentity";

describe("publicUserIdentity", () => {
  it("hides guest email values from the public session payload", () => {
    expect(
      resolvePublicUserEmail({
        email: "sandbox@svc.plus",
        role: "guest",
      }),
    ).toBe("");
  });

  it("preserves non-guest emails", () => {
    expect(
      resolvePublicUserEmail({
        email: "admin@svc.plus",
        role: "admin",
      }),
    ).toBe("admin@svc.plus");
  });

  it("detects whether a public email should be rendered", () => {
    expect(hasPublicUserEmail({ email: "" })).toBe(false);
    expect(
      hasPublicUserEmail({
        email: "sandbox@svc.plus",
        role: "guest",
      }),
    ).toBe(false);
    expect(
      hasPublicUserEmail({
        email: "admin@svc.plus",
        role: "admin",
      }),
    ).toBe(true);
  });
});
