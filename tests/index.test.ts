import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { describe, expect, it } from "vitest";

import {
  assertEmailDomainAllowed,
  createAllowedDomainSet,
  EMAIL_DOMAIN_NOT_ALLOWED,
  emailDomainAllowlist,
  getEmailDomain,
  getEmailDomainAllowlistConfig,
  isEmailDomainAllowed,
  normalizeDomain,
} from "../src";

describe("email domain helpers", () => {
  it("normalizes domains and extracts the domain from valid email addresses", () => {
    expect(normalizeDomain(" @Example.COM ")).toBe("example.com");
    expect(getEmailDomain("person@Example.COM")).toBe("example.com");
    expect(getEmailDomain("not-an-email")).toBeNull();
  });

  it("only permits configured domains", () => {
    const domains = createAllowedDomainSet(["example.com", "@acme.test"]);
    expect(isEmailDomainAllowed("person@example.com", domains)).toBe(true);
    expect(isEmailDomainAllowed("person@other.test", domains)).toBe(false);
  });

  it("rejects an empty allowlist", () => {
    expect(() => createAllowedDomainSet([])).toThrow("at least one allowed domain");
  });

  it("returns the public error code for a rejected email", () => {
    const domains = createAllowedDomainSet(["example.com"]);

    try {
      assertEmailDomainAllowed("person@other.test", domains);
      throw new Error("Expected the allowlist assertion to throw.");
    } catch (error) {
      expect(error).toMatchObject({
        body: { code: EMAIL_DOMAIN_NOT_ALLOWED },
        statusCode: 403,
      });
    }
  });
});

describe("emailDomainAllowlist", () => {
  it("registers a nullable schema so existing user tables can be migrated safely", () => {
    const plugin = emailDomainAllowlist({
      allowedDomains: ["example.com"],
      exposeAllowedDomains: true,
    });

    expect(plugin.id).toBe("email-domain-allowlist");
    expect(plugin.schema.user.fields.emailDomain).toMatchObject({
      input: false,
      required: false,
      returned: true,
    });
    expect(plugin.hooks.before).toHaveLength(1);
    expect(plugin.endpoints.getEmailDomainAllowlistConfig).toBeDefined();
  });

  it("rejects disallowed users and stores the normalized domain for allowed users", async () => {
    const plugin = emailDomainAllowlist({ allowedDomains: ["example.com"] });
    const databaseHook = plugin.init?.()?.options?.databaseHooks?.user?.create?.before;

    expect(databaseHook).toBeDefined();
    await expect(databaseHook?.({ email: "person@other.test" } as never)).resolves.toBe(false);
    await expect(databaseHook?.({ email: "person@Example.COM" } as never)).resolves.toEqual({
      data: { email: "person@Example.COM", emailDomain: "example.com" },
    });
  });

  it("only exposes domains when explicitly configured", () => {
    const domains = createAllowedDomainSet(["example.com", "acme.test"]);

    expect(getEmailDomainAllowlistConfig({ allowedDomains: ["example.com"] }, domains)).toEqual({
      allowedDomains: [],
    });
    expect(
      getEmailDomainAllowlistConfig(
        { allowedDomains: ["example.com"], exposeAllowedDomains: true },
        domains,
      ),
    ).toEqual({ allowedDomains: ["acme.test", "example.com"] });
  });

  it("enforces the allowlist through a real Better Auth email sign-up", async () => {
    const auth = betterAuth({
      baseURL: "http://localhost:3000",
      database: memoryAdapter({
        account: [],
        session: [],
        user: [],
        verification: [],
      }),
      emailAndPassword: { enabled: true },
      plugins: [emailDomainAllowlist({ allowedDomains: ["example.com"] })],
      secret: "integration-test-secret-that-is-at-least-32-characters-long",
    });

    const allowed = await auth.api.signUpEmail({
      body: {
        email: "person@Example.COM",
        name: "Allowed User",
        password: "a-strong-password",
      },
    });

    expect(allowed.user.emailDomain).toBe("example.com");
    await expect(
      auth.api.signUpEmail({
        body: {
          email: "person@other.test",
          name: "Denied User",
          password: "a-strong-password",
        },
      }),
    ).rejects.toMatchObject({
      body: { code: EMAIL_DOMAIN_NOT_ALLOWED },
      statusCode: 403,
    });
  });
});
