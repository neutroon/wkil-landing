import type { Locale } from "@/i18n/config";

export function getAuthPath(locale: Locale, route: "login" | "signup") {
  return `https://go.wkil.app/${locale}/auth/${route}`;
}
