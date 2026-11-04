import type { Locale } from "@/i18n/config";

export const supportEmail = "support@wkil.app";

export const metaPricingUrl =
  "https://business.whatsapp.com/products/platform-pricing";

export function getAuthPath(locale: Locale, route: "login" | "signup") {
  return `https://go.wkil.app/${locale}/auth/${route}`;
}
