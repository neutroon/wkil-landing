export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
