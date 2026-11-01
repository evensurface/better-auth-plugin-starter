/** Normalizes a domain so configuration and email addresses compare reliably. */
export function normalizeDomain(domain: string): string {
  return domain.trim().toLowerCase().replace(/^@/, "");
}

/** Returns the normalized domain portion of an email address, if present. */
export function getEmailDomain(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at <= 0 || at === email.length - 1) return null;
  return normalizeDomain(email.slice(at + 1));
}

/** Creates the normalized, duplicate-free set used by the server hook. */
export function createAllowedDomainSet(domains: readonly string[]): ReadonlySet<string> {
  const normalized = domains.map(normalizeDomain).filter(Boolean);
  if (normalized.length === 0) {
    throw new Error("emailDomainAllowlist requires at least one allowed domain.");
  }
  return new Set(normalized);
}

/** Checks whether an email belongs to an allowed domain. */
export function isEmailDomainAllowed(email: string, allowedDomains: ReadonlySet<string>): boolean {
  const domain = getEmailDomain(email);
  return domain !== null && allowedDomains.has(domain);
}
