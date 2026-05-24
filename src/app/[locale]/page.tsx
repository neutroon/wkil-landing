import type { Metadata } from "next";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { LandingPage } from "@/components/LandingPage";
import { isLocale, locales, type Locale } from "@/i18n/config";
import {
  buildLandingJsonLd,
  getLanguageAlternates,
  getLocalePath,
  getOpenGraphLocale,
  siteName,
  siteUrl,
} from "@/lib/seo";
import type { LandingCopy } from "@/types/landing";

interface LandingPageRouteProps {
  params: Promise<{ locale: string }>;
}

function getRouteLocale(localeParam: string): Locale {
  if (!isLocale(localeParam)) {
    notFound();
  }

  return localeParam;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LandingPageRouteProps): Promise<Metadata> {
  const locale = getRouteLocale((await params).locale);
  const seo = await getTranslations({ locale, namespace: "landing.seo" });
  const openGraphTitle = seo("openGraphTitle");
  const openGraphDescription = seo("openGraphDescription");

  return {
    metadataBase: siteUrl,
    title: seo("title"),
    description: seo("description"),
    keywords: seo.raw("keywords") as string[],
    alternates: {
      canonical: getLocalePath(locale),
      languages: getLanguageAlternates(),
    },
    openGraph: {
      title: openGraphTitle,
      description: openGraphDescription,
      url: getLocalePath(locale),
      siteName,
      locale: getOpenGraphLocale(locale),
      type: "website",
      images: [
        {
          url: "/assets/wkil-logo.svg",
          alt: seo("imageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: openGraphTitle,
      description: openGraphDescription,
      images: ["/assets/wkil-logo.svg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default async function Page({ params }: LandingPageRouteProps) {
  const locale = getRouteLocale((await params).locale);
  setRequestLocale(locale);

  const messages = await getMessages({ locale });
  const copy = (messages as { landing: LandingCopy }).landing;

  return (
    <>
      <JsonLd
        data={buildLandingJsonLd({
          description: copy.seo.description,
          locale,
          title: copy.seo.title,
        })}
      />
      <LandingPage copy={copy} locale={locale} />
    </>
  );
}
