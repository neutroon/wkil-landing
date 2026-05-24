import type { MetadataRoute } from "next";
import { defaultLocale, locales } from "@/i18n/config";
import { getAbsoluteUrl, getLocalePath } from "@/lib/seo";

const languageAlternates = {
  ...Object.fromEntries(
    locales.map((locale) => [locale, getAbsoluteUrl(getLocalePath(locale))]),
  ),
  "x-default": getAbsoluteUrl(getLocalePath(defaultLocale)),
};

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: getAbsoluteUrl(getLocalePath(locale)),
    changeFrequency: "weekly",
    priority: locale === defaultLocale ? 1 : 0.9,
    alternates: {
      languages: languageAlternates,
    },
  }));
}
