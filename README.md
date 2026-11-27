# Wkil Landing

Standalone Next.js landing page for **وكيل / wkil**.

## Structure

- `src/app/` — App Router entry, metadata, and global styles
- `src/app/[locale]/` — localized landing route, metadata, and JSON-LD
- `src/components/` — landing UI components
- `src/i18n/` — `next-intl` routing, navigation, and request config
- `src/lib/` — route and SEO helpers
- `messages/` — Arabic Egyptian and English landing copy
- `public/assets/` — Wkil logo assets served by Next

## Design

The site follows the dashboard design system: `docs/design/design-system.md` and `docs/design/arabic-glossary.md` in the `wkil-app` repository. `src/app/globals.css` carries a copy of its `--wk-*` tokens, plus a larger type scale for marketing headings. There is no Tailwind here, so components use plain CSS classes built on those tokens.

`npm test` also checks that the English and Arabic copy match, and that prices and the product claims it covers stay accurate (`src/lib/landing-copy.test.mjs`). When a channel or store integration ships, update that test together with the copy.

The waitlist has an API route (`/api/waitlist`) but no form on the page.

## Environment

- `NEXT_PUBLIC_SITE_URL` — canonical production URL used by metadata, JSON-LD, robots, and the sitemap. Defaults to `https://wkil.app` when unset.
- `WKIL_BACKEND_URL` — backend origin used by the waitlist API to create leads in the Wkil admin dashboard. Defaults to `NEXT_PUBLIC_API`, then `http://localhost:8080`.
- `WKIL_BACKEND_URL` is also where the plan catalog is read from (`GET /v1/public/plans`, cached for an hour). For that read it falls back to `NEXT_PUBLIC_API`, then `https://api.wkil.app`; if the backend is down or answers with an invalid body, the page uses `src/data/plans.snapshot.json` and logs `plans.fallback_snapshot`.
- `WKIL_PLANS_URL` — full URL of the plan catalog for `npm test` and `npm run plans:snapshot`, normally `https://api.wkil.app/v1/public/plans` (CI sets it). When unset, the snapshot-drift test is skipped.
- `WKIL_DEMO_WIDGET_SITE_KEY` — optional public widget site key for the landing page demo chat. When set, `/api/demo-chat` proxies questions to the Wkil widget AI endpoint; when unset, it serves a local guided demo answer so the showcase still works.
- `WKIL_DEMO_WIDGET_ORIGIN` — optional origin sent from the server-side demo chat proxy to the widget API. Defaults to `NEXT_PUBLIC_SITE_URL`, then `https://wkil.app`; it must be listed in the widget install's allowed origins.
- `WKIL_LANDING_WIDGET_SITE_KEY` — active public `wsk_...` install key for the floating landing-page widget. The widget is not embedded when this is unset or invalid, avoiding a broken public launcher.
- `WKIL_WIDGET_ORIGIN` — optional hosted widget origin. Defaults to `https://go.wkil.app`.
- `WKIL_WIDGET_API_BASE` — optional public widget API base. Defaults to `https://api.wkil.app`.
- `WAITLIST_WEBHOOK_URL` — optional secondary webhook target if you also want to mirror waitlist submissions outside the Wkil stack.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
npm run plans:snapshot   # rewrite src/data/plans.snapshot.json from the live catalog
```

## Plan numbers

Every price, credit and limit on the page comes from the plan catalog in the backend (`GET /v1/public/plans`). Nothing in `messages/` or the code holds one: the copy has ICU placeholders (`{credits}`, `{freeReplies}`, ...) that `src/lib/landing-copy.ts` fills from `getPlans()` (`src/lib/plans.ts`), formatted with `Intl.NumberFormat("en-US")` in both languages. `npm test` fails on a literal catalog number in the copy, and on a committed snapshot that differs from the live catalog; when the catalog changes, run `npm run plans:snapshot` and review the copy together with it.
