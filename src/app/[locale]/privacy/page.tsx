import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LandingBrand } from "@/components/LandingBrand";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { Link as LocaleLink } from "@/i18n/navigation";
import { getAuthPath } from "@/lib/routes";
import { getOpenGraphLocale, siteName, siteUrl } from "@/lib/seo";

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

const LAST_UPDATED = new Date(Date.UTC(2025, 3, 16));
const CONTACT_EMAIL = "support@wkil.app";

function formatLastUpdated(locale: Locale) {
  return LAST_UPDATED.toLocaleDateString(
    locale === "ar" ? "ar-EG-u-nu-latn" : "en-US",
    { day: "numeric", month: "long", timeZone: "UTC", year: "numeric" },
  );
}

const privacyCopy = {
  en: {
    title: "Privacy Policy",
    description:
      "How Wkil collects, uses, and protects account, business, and customer conversation data.",
    lastUpdated: "Last updated",
    home: "Home",
    login: "Sign in",
    switchLanguage: "العربية",
    contact: "Contact us",
    sections: [
      {
        title: "What we collect",
        body: [
          "Account details such as name, email, role, and authentication status.",
          "Business profile content such as services, policies, FAQs, brand assets, and reply rules.",
          "Connected channel data needed to receive, organize, and reply to customer messages.",
        ],
      },
      {
        title: "How we use data",
        body: [
          "We use your information to run the Wkil app, prepare AI-assisted replies, save customer context, and improve reliability and security.",
          "We do not sell personal, business, or customer conversation data.",
        ],
      },
      {
        title: "AI and customer conversations",
        body: [
          "Wkil uses the business knowledge you provide to draft replies and flag when a conversation needs human review.",
          "Customer memory is used to keep useful context, such as interests, follow-up needs, and channel details, available to your team.",
        ],
      },
      {
        title: "Security and retention",
        body: [
          "We use access controls, encrypted storage for sensitive credentials, and operational monitoring to protect the service.",
          "You can request account or data deletion, subject to legal, security, and operational retention requirements.",
        ],
      },
      {
        title: "Third-party services",
        body: [
          "When you connect services such as Meta, WhatsApp, or other channels, their own policies also apply.",
          "We only request the permissions needed to provide the connected Wkil features.",
        ],
      },
    ],
  },
  ar: {
    title: "سياسة الخصوصية",
    description:
      "كيف يجمع وكيل بيانات الحساب والنشاط ومحادثات العملاء ويستخدمها ويحميها.",
    lastUpdated: "آخر تحديث",
    home: "الرئيسية",
    login: "تسجيل الدخول",
    switchLanguage: "English",
    contact: "تواصل معنا",
    sections: [
      {
        title: "ما البيانات التي نجمعها",
        body: [
          "بيانات الحساب مثل الاسم والبريد الإلكتروني والدور وحالة التحقق.",
          "محتوى ملف الوكيل مثل الخدمات والسياسات والأسئلة الشائعة وملفات العلامة وتعليمات الرد.",
          "بيانات القنوات المرتبطة اللازمة لاستقبال رسائل العملاء وتنظيمها والرد عليها.",
        ],
      },
      {
        title: "كيف نستخدم البيانات",
        body: [
          "نستخدم بياناتك لتشغيل تطبيق وكيل، وتجهيز ردود مدعومة بالذكاء الاصطناعي، وحفظ سياق العملاء، وتحسين الاعتمادية والأمان.",
          "لا نبيع البيانات الشخصية أو بيانات النشاط أو محادثات العملاء.",
        ],
      },
      {
        title: "الذكاء الاصطناعي ومحادثات العملاء",
        body: [
          "يستخدم الوكيل معرفة النشاط التي تضيفها لصياغة الردود وتحديد المحادثات التي تحتاج مراجعة من موظف.",
          "تُستخدم ذاكرة العميل للاحتفاظ بسياق مفيد مثل الاهتمامات واحتياج المتابعة وتفاصيل القناة لفريقك.",
        ],
      },
      {
        title: "الأمان والاحتفاظ بالبيانات",
        body: [
          "نستخدم صلاحيات وصول، وتخزينًا مشفرًا للبيانات الحساسة، ومراقبة تشغيلية لحماية الخدمة.",
          "يمكنك طلب حذف الحساب أو البيانات، مع مراعاة متطلبات الاحتفاظ القانونية والأمنية والتشغيلية.",
        ],
      },
      {
        title: "الخدمات الخارجية",
        body: [
          "عند ربط خدمات مثل ميتا أو واتساب أو أي قنوات أخرى، تنطبق سياسات هذه الخدمات أيضًا.",
          "نطلب فقط الصلاحيات اللازمة لتشغيل مزايا وكيل المرتبطة.",
        ],
      },
    ],
  },
} satisfies Record<
  Locale,
  {
    title: string;
    description: string;
    lastUpdated: string;
    home: string;
    login: string;
    switchLanguage: string;
    contact: string;
    sections: Array<{ title: string; body: string[] }>;
  }
>;

function getRouteLocale(localeParam: string): Locale {
  if (!isLocale(localeParam)) {
    notFound();
  }

  return localeParam;
}

function getPrivacyPath(locale: Locale) {
  return `/${locale}/privacy`;
}

function getPrivacyLanguageAlternates() {
  return {
    ...Object.fromEntries(
      locales.map((locale) => [locale, getPrivacyPath(locale)]),
    ),
    "x-default": getPrivacyPath("ar"),
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const locale = getRouteLocale((await params).locale);
  const copy = privacyCopy[locale];
  const path = getPrivacyPath(locale);

  return {
    metadataBase: siteUrl,
    title: `${copy.title} | ${siteName}`,
    description: copy.description,
    alternates: {
      canonical: path,
      languages: getPrivacyLanguageAlternates(),
    },
    openGraph: {
      title: `${copy.title} | ${siteName}`,
      description: copy.description,
      url: path,
      siteName,
      locale: getOpenGraphLocale(locale),
      type: "article",
      images: [
        {
          url: "/assets/wkil-logo.svg",
          alt: siteName,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const locale = getRouteLocale((await params).locale);
  setRequestLocale(locale);

  const copy = privacyCopy[locale];
  const loginPath = getAuthPath(locale, "login");
  const alternateLocale: Locale = locale === "ar" ? "en" : "ar";

  return (
    <>
      <header className="site-header">
        <div className="shell header-row">
          <LocaleLink className="brand" href="/" locale={locale} aria-label={copy.home}>
            <LandingBrand />
          </LocaleLink>
          <div className="header-actions">
            <LocaleLink
              className="header-link"
              href="/privacy"
              hrefLang={alternateLocale}
              lang={alternateLocale}
              locale={alternateLocale}
            >
              {copy.switchLanguage}
            </LocaleLink>
            <a className="button button-secondary button-small header-cta" href={loginPath}>
              {copy.login}
            </a>
          </div>
        </div>
      </header>

      <main id="main" className="privacy-main">
        <h1>{copy.title}</h1>
        <p className="privacy-lead">{copy.description}</p>
        <p className="privacy-updated">
          {copy.lastUpdated}: {formatLastUpdated(locale)}
        </p>

        {copy.sections.map((section) => (
          <section className="privacy-section" key={section.title}>
            <h2>{section.title}</h2>
            <ul>
              {section.body.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}

        <section className="privacy-section">
          <h2>{copy.contact}</h2>
          <p>
            <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>
      </main>

      <footer className="footer">
        <div className="shell footer-row">
          <LocaleLink className="brand" href="/" locale={locale} aria-label={copy.home}>
            <LandingBrand />
          </LocaleLink>
          <div className="footer-links">
            <LocaleLink className="header-link" href="/" locale={locale}>
              {copy.home}
            </LocaleLink>
          </div>
        </div>
      </footer>
    </>
  );
}
