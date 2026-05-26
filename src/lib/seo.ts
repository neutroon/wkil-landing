import { defaultLocale, locales, type Locale } from "@/i18n/config";

export const siteName = "Wkil";

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://wkil.app",
);

export function getLocalePath(locale: Locale) {
  return `/${locale}`;
}

export function getLanguageAlternates() {
  return {
    ...Object.fromEntries(
      locales.map((locale) => [locale, getLocalePath(locale)]),
    ),
    "x-default": getLocalePath(defaultLocale),
  };
}

export function getAbsoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function getOpenGraphLocale(locale: Locale) {
  return locale === "ar" ? "ar_EG" : "en_US";
}

export function getLanguageTag(locale: Locale) {
  return locale === "ar" ? "ar-EG" : "en-US";
}

export function buildLandingJsonLd({
  description,
  locale,
  title,
}: {
  description: string;
  locale: Locale;
  title: string;
}) {
  const localePath = getLocalePath(locale);
  const canonicalUrl = getAbsoluteUrl(localePath);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl.origin}/#organization`,
        name: siteName,
        alternateName: "وكيل",
        url: siteUrl.origin,
        logo: getAbsoluteUrl("/assets/wkil-logo.svg"),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl.origin}/#website`,
        name: siteName,
        url: siteUrl.origin,
        inLanguage: getLanguageTag(locale),
        potentialAction: {
          "@type": "RegisterAction",
          target: getAbsoluteUrl(`/${locale}/auth/signup`),
          name: locale === "ar" ? "ابدأ ببلاش" : "Start Free",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${canonicalUrl}#software`,
        name: title,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: canonicalUrl,
        description,
        inLanguage: getLanguageTag(locale),
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };
}
