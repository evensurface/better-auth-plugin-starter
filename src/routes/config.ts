import { createAuthEndpoint } from "better-auth/api";

import type { EmailDomainAllowlistOptions } from "../types";

export const configPath = "/email-domain-allowlist/config";

/** Builds the public response for the optional configuration endpoint. */
export function getEmailDomainAllowlistConfig(
  options: EmailDomainAllowlistOptions,
  allowedDomains: ReadonlySet<string>,
) {
  return {
    allowedDomains: options.exposeAllowedDomains ? [...allowedDomains].sort() : [],
  };
}

/** Creates the optional public config endpoint used by the client plugin. */
export function createEmailDomainAllowlistConfigRoute(
  options: EmailDomainAllowlistOptions,
  allowedDomains: ReadonlySet<string>,
) {
  return createAuthEndpoint(configPath, { method: "GET" }, async () =>
    getEmailDomainAllowlistConfig(options, allowedDomains),
  );
}
