const DEFAULT_WIDGET_ORIGIN = "https://go.wkil.app";
const DEFAULT_WIDGET_API_BASE = "https://api.wkil.app";

type WidgetEmbedEnvironment = Record<string, string | undefined>;

export type WidgetEmbedConfig = {
  scriptSrc: string;
  siteKey: string;
  apiBase: string;
};

function normalizeHttpBase(value: string): string | null {
  try {
    const url = new URL(value);
    if (
      (url.protocol !== "http:" && url.protocol !== "https:") ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      return null;
    }
    return `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
  } catch {
    return null;
  }
}

export function resolveWidgetEmbedConfig(
  environment: WidgetEmbedEnvironment,
): WidgetEmbedConfig | null {
  const siteKey = environment.WKIL_LANDING_WIDGET_SITE_KEY?.trim();
  if (!siteKey || !siteKey.startsWith("wsk_") || siteKey.length > 256) {
    return null;
  }

  const widgetOrigin = normalizeHttpBase(
    environment.WKIL_WIDGET_ORIGIN?.trim() || DEFAULT_WIDGET_ORIGIN,
  );
  const apiBase = normalizeHttpBase(
    environment.WKIL_WIDGET_API_BASE?.trim() || DEFAULT_WIDGET_API_BASE,
  );
  if (!widgetOrigin || !apiBase) return null;

  return {
    scriptSrc: `${widgetOrigin}/wkil-widget.js`,
    siteKey,
    apiBase,
  };
}
