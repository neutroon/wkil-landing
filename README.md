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

## Environment

- `NEXT_PUBLIC_SITE_URL` — canonical production URL used by metadata, JSON-LD, robots, and the sitemap. Defaults to `https://pagespilot.com` when unset.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```
