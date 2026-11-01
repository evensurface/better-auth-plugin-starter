export { emailDomainAllowlistClient } from "./client";
export {
  createAllowedDomainSet,
  getEmailDomain,
  isEmailDomainAllowed,
  normalizeDomain,
} from "./helpers";
export {
  createEmailDomainAllowlistConfigRoute,
  getEmailDomainAllowlistConfig,
} from "./routes";
export { emailDomainAllowlistSchema } from "./schema";
export {
  assertEmailDomainAllowed,
  EMAIL_DOMAIN_ALLOWLIST_ERROR_CODES,
  EMAIL_DOMAIN_NOT_ALLOWED,
  emailDomainAllowlist,
} from "./server";
export type {
  EmailDomainAllowlistOptions,
  EmailDomainUserFields,
} from "./types";
