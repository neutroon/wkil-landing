# WKIL Landing Site Agent Guide

## Scope and Stack

This repository contains the public marketing site. It uses Next.js App Router, React, TypeScript, and `next-intl`. Optimize for clarity, accessibility, search visibility, localization, and fast delivery.

## Setup and Commands

- Use npm and preserve `package-lock.json`. Do not introduce a pnpm or Yarn lockfile.
- Install dependencies with `npm ci` when reproducing the lockfile or `npm install` when intentionally updating it.
- Start development with `npm run dev`.
- Run lint with `npm run lint`.
- Run type checking with `npm run typecheck`.
- Run the production build with `npm run build`. The build script skips lint, so lint remains a separate required check.

## Implementation Standards

- Prefer Server Components and static rendering for marketing content. Use Client Components only where interaction requires them.
- Keep the dependency surface small. Prefer platform and framework capabilities over adding libraries for simple presentation behavior.
- Preserve metadata, canonical URLs, structured content, semantic heading order, social previews, and indexability when changing routes or page structure.
- Optimize images and fonts through supported Next.js mechanisms. Avoid layout shift and unnecessary client-side JavaScript.
- Use semantic HTML, full keyboard access, visible focus, adequate contrast, and descriptive link and image text.
- Keep responsive layouts usable from narrow mobile screens through wide desktop displays.

## Mandatory Skills and MCP Routing

- Follow the workspace `Required Capability Routing and No Silent Skips` policy. Announce applicable skills and MCPs before substantive work, and disclose any unavailable capability with the fallback used.
- Use every directly applicable capability listed below. If one is intentionally not used, explain why before continuing; never omit it silently.
- For every Next.js or React implementation task, read the version-matched Next.js documentation bundled under `node_modules/next/dist/docs/` before coding. This repository currently uses Next.js 15, while the official Next DevTools MCP requires Next.js 16 or newer, so use bundled documentation plus normal runtime and build diagnostics until the repository is upgraded.
- For React behavior not covered by the bundled Next.js documentation, consult current official React documentation through an available documentation tool.
- Do not attempt to force Next DevTools MCP against the unsupported Next.js version. State the compatibility reason and continue with bundled documentation plus the repository's reproducible lint, typecheck, and build checks.

### Reproducing Codex Capabilities

- No Next DevTools MCP setup is required while this repository remains on Next.js 15. After an approved upgrade to Next.js 16 or newer, register it with `codex mcp add next-devtools -- npx -y next-devtools-mcp@latest`.
- After any future MCP registration, verify from the same user profile that launches Codex with `codex mcp list`, start a new task to refresh the tool inventory, and start `npm run dev` before requesting live runtime evidence.
- Never place credentials or private configuration in committed MCP documentation or configuration files.

## Localization and Content

- Keep English and Arabic messages complete and aligned whenever visible copy changes.
- Verify Arabic right-to-left layout, punctuation, alignment, and responsive behavior separately from English.
- Preserve the established brand voice and avoid unsupported product, security, pricing, or performance claims.

## Security and Privacy

- Never expose server secrets through `NEXT_PUBLIC_` variables or client code.
- Collect only data required for the user flow. Validate submissions server-side and avoid logging personal data.
- Keep third-party scripts and analytics intentional, documented, consent-aware where required, and performance-conscious.

## Next.js Upgrade Discipline

- Establish a clean lint, typecheck, and build baseline before upgrading.
- Follow official migration guides in order for every crossed major release and use the official Next.js codemod where appropriate.
- Upgrade `next`, `eslint-config-next`, React, and React DOM as a compatible set; resolve peer dependencies without force flags.
- Recheck metadata, localization, rendering mode, caching, images, middleware or proxy behavior, and production output after the migration.

## Definition of Done

- Run `npm run lint`, `npm run typecheck`, and `npm run build` for code or configuration changes.
- Manually inspect affected English and Arabic pages at representative mobile and desktop widths when UI or copy changes.
- Review the final diff for secrets, broken links, accidental logs, generated output, and unrelated edits.
