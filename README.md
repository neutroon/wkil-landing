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

- `NEXT_PUBLIC_SITE_URL` — canonical production URL used by metadata, JSON-LD, robots, and the sitemap. Defaults to `https://wkil.app` when unset.
- `WKIL_BACKEND_URL` — backend origin used by the waitlist API to create leads in the Wkil admin dashboard. Defaults to `NEXT_PUBLIC_API`, then `http://localhost:8080`.
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
```
