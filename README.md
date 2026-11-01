# Better Auth Email-Domain Allowlist Plugin

A typed [Better Auth](https://www.better-auth.com/) plugin that restricts email/password sign-up to an allowlist of email domains. It also stores the normalized domain in the user table.

## Usage

```ts
// auth.ts
import { betterAuth } from "better-auth";
import { emailDomainAllowlist } from "@marinedotsh/better-auth-plugin-template";

export const auth = betterAuth({
  plugins: [
    emailDomainAllowlist({
      allowedDomains: ["example.com", "acme.test"],
      exposeAllowedDomains: false,
    }),
  ],
});
```

```ts
// auth-client.ts
import { createAuthClient } from "better-auth/client";
import { emailDomainAllowlistClient } from "@marinedotsh/better-auth-plugin-template";

export const authClient = createAuthClient({
  plugins: [emailDomainAllowlistClient()],
});
```

Run Better Auth's migration/generation command after installing the plugin. It adds a nullable `user.emailDomain` string column, so existing users do not block adoption. The plugin always sets this value for newly created users; backfill existing users before making the database column non-null. The value is never accepted from client input.

The plugin blocks email/password sign-up with `EMAIL_DOMAIN_NOT_ALLOWED` and aborts creation of users from other Better Auth flows (such as social sign-in) when their email domain is not allowlisted.

## Before publishing

1. Change `name` in `package.json` to your npm package name.
2. Set `private` to `false` and add the repository, bugs, and homepage metadata for your repository.
3. Rename the package and replace the example plugin if it does not match your product.
4. Configure npm trusted publishing for the GitHub Actions release workflow.

For a map of the starter's files and instructions for replacing the example
implementation, see [Creating your Better Auth plugin](docs/creating-a-plugin.md).

## Development

This project uses pnpm and requires Node.js 22.18.0 or newer.

```sh
corepack enable
pnpm install
pnpm check
```

Create a changeset for each publishable change:

```sh
pnpm changeset
```

The CI workflow runs checks and validates the packed artifact. The release workflow opens a version PR from pending changesets, then publishes once that PR is merged.
