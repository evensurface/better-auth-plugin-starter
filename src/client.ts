import type { BetterAuthClientPlugin } from "better-auth/client";

import type { emailDomainAllowlist } from "./server";

/** Client companion for `emailDomainAllowlist`. */
export function emailDomainAllowlistClient() {
  return {
    id: "email-domain-allowlist",
    $InferServerPlugin: {} as ReturnType<typeof emailDomainAllowlist>,
    pathMethods: {
      "/email-domain-allowlist/config": "GET" as const,
    },
  } satisfies BetterAuthClientPlugin;
}
