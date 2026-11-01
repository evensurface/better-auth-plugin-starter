import { defineErrorCodes } from "@better-auth/core/utils/error-codes";
import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";

import { createAllowedDomainSet, getEmailDomain, isEmailDomainAllowed } from "./helpers";
import { createEmailDomainAllowlistConfigRoute } from "./routes";
import { emailDomainAllowlistSchema } from "./schema";
import type { EmailDomainAllowlistOptions } from "./types";

export const EMAIL_DOMAIN_ALLOWLIST_ERROR_CODES = defineErrorCodes({
  EMAIL_DOMAIN_NOT_ALLOWED: "This email domain is not allowed to create an account.",
});

export const EMAIL_DOMAIN_NOT_ALLOWED = "EMAIL_DOMAIN_NOT_ALLOWED";

declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    "email-domain-allowlist": {
      creator: typeof emailDomainAllowlist;
    };
  }
}

/** Throws Better Auth's typed error when an email is not on the allowlist. */
export function assertEmailDomainAllowed(
  email: unknown,
  allowedDomains: ReadonlySet<string>,
): asserts email is string {
  if (typeof email !== "string" || !isEmailDomainAllowed(email, allowedDomains)) {
    throw APIError.from("FORBIDDEN", EMAIL_DOMAIN_ALLOWLIST_ERROR_CODES.EMAIL_DOMAIN_NOT_ALLOWED);
  }
}

/** Restricts email/password sign-up to configured domains. */
export function emailDomainAllowlist(options: EmailDomainAllowlistOptions) {
  const allowedDomains = createAllowedDomainSet(options.allowedDomains);

  return {
    id: "email-domain-allowlist",
    schema: emailDomainAllowlistSchema,
    hooks: {
      before: [
        {
          matcher: (context) => context.path === "/sign-up/email",
          handler: createAuthMiddleware(async (context) => {
            assertEmailDomainAllowed(context.body.email, allowedDomains);
          }),
        },
      ],
    },
    init: () => ({
      options: {
        databaseHooks: {
          user: {
            create: {
              before: async (user) => {
                const emailDomain = getEmailDomain(user.email);
                if (emailDomain === null || !allowedDomains.has(emailDomain)) {
                  return false;
                }
                return { data: { ...user, emailDomain } };
              },
            },
          },
        },
      },
    }),
    endpoints: {
      getEmailDomainAllowlistConfig: createEmailDomainAllowlistConfigRoute(options, allowedDomains),
    },
    options,
    $ERROR_CODES: EMAIL_DOMAIN_ALLOWLIST_ERROR_CODES,
  } satisfies BetterAuthPlugin;
}
