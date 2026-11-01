/** Options for the email-domain allowlist plugin. */
export interface EmailDomainAllowlistOptions {
  /** Domains permitted to create accounts, for example `example.com`. */
  allowedDomains: readonly string[];
  /** Whether clients may retrieve configured domains from the config route. */
  exposeAllowedDomains?: boolean;
}

/** The value stored with each user by this plugin. */
export interface EmailDomainUserFields {
  emailDomain?: string | null;
}
