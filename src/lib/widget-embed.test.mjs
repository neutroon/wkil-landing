import assert from "node:assert/strict";
import test from "node:test";

import { resolveWidgetEmbedConfig } from "./widget-embed.ts";

test("returns no embed when the landing widget site key is missing", () => {
  assert.equal(resolveWidgetEmbedConfig({}), null);
  assert.equal(
    resolveWidgetEmbedConfig({ WKIL_LANDING_WIDGET_SITE_KEY: "   " }),
    null,
  );
});

test("normalizes a configured public widget embed", () => {
  assert.deepEqual(
    resolveWidgetEmbedConfig({
      WKIL_LANDING_WIDGET_SITE_KEY: "  wsk_active  ",
      WKIL_WIDGET_ORIGIN: "https://go.wkil.app/",
      WKIL_WIDGET_API_BASE: "https://api.wkil.app/",
    }),
    {
      scriptSrc: "https://go.wkil.app/wkil-widget.js",
      siteKey: "wsk_active",
      apiBase: "https://api.wkil.app",
    },
  );
});

test("rejects non-HTTP widget origins instead of emitting an unsafe script", () => {
  assert.equal(
    resolveWidgetEmbedConfig({
      WKIL_LANDING_WIDGET_SITE_KEY: "wsk_active",
      WKIL_WIDGET_ORIGIN: "javascript:alert(1)",
    }),
    null,
  );
});
