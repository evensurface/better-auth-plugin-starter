# Repository Guidelines

## Project Overview

This repository is a reusable starter for Better Auth plugin packages, not a standalone application. It provides server and client entry points plus shared build, test, validation, and release tooling. Customize plugin behavior, configuration, schemas, and endpoints without weakening the foundation.

Follow Better Auth's native plugin APIs and conventions. Keep the starter lightweight, type-safe, and compatible with database adapters and npm package exports. Separate server behavior, client integration, and shared utilities. Avoid plugin-specific business logic in reusable infrastructure, unnecessary abstractions or dependencies, and compatibility layers for authentication providers other than Better Auth.

## Project Structure & Module Organization

Source lives in `src/`. Assemble the public API in `src/index.ts`; keep entry points in `src/server.ts` and `src/client.ts`, shared code beside them, and HTTP endpoints in `src/routes/`. Tests live in `tests/`. Never hand-edit generated `dist/` output. Release metadata belongs in `.changeset/`, CI in `.github/`, and contributor notes in `docs/`.

## Build, Test, and Development Commands

Use Node.js 22.18.0 or newer and the pnpm version pinned in `package.json`.

- `pnpm install --frozen-lockfile` installs the exact locked dependency set.
- `pnpm dev` runs tsdown in watch mode.
- `pnpm build` creates the distributable package in `dist/`.
- `pnpm test` runs the Vitest suite once; `pnpm test:watch` reruns affected tests.
- `pnpm lint` checks Biome rules; `pnpm typecheck` and `pnpm typecheck:test` validate types.
- `pnpm check` runs linting, type checks, tests, and the build; run it before a PR.
- `pnpm publish:check` also validates exports and the packed artifact.

## Coding Style & Naming Conventions

Write strict TypeScript using ESM and NodeNext resolution. Retain `.js` extensions in relative imports of TypeScript source. Biome enforces two-space indentation, double quotes, organized imports, and 100-character lines. Use `camelCase` for values, `PascalCase` for types, and `UPPER_SNAKE_CASE` for public error constants. Keep exports explicit in `src/index.ts`.

## Testing Guidelines

Vitest discovers `tests/**/*.test.ts`. Name tests after observable behavior and group related cases with `describe`. Cover success, rejection, schema, adapter-relevant behavior, and the public API. No numeric coverage threshold is configured; every behavior change should include a regression test.

## Commit & Pull Request Guidelines

Only when preparing a commit, follow [`docs/git-convention.md`](docs/git-convention.md); do not load or apply it for unrelated work. Publishable changes require `pnpm changeset`. PRs should explain what changed and why, link relevant issues, list verification commands, and call out API changes, risks, or follow-ups. Screenshots are only needed for user-visible documentation or UI changes.
