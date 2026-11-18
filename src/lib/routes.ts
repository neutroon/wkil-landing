import type { Locale } from "@/i18n/config";

export const supportEmail = "support@wkil.app";

export const metaPricingUrl =
  "https://business.whatsapp.com/products/platform-pricing";

/**
 * Where a paid plan's button goes. Today that is sign-up carrying the chosen plan;
 * once Paymob checkout is live in the app, only this function has to change.
 */
export function getPlanCheckoutPath(locale: Locale, planId: string) {
  return `${getAuthPath(locale, "signup")}?plan=${encodeURIComponent(planId)}`;
}

export function getAuthPath(locale: Locale, route: "login" | "signup") {
  return `https://go.wkil.app/${locale}/auth/${route}`;
}
