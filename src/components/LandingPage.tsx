import { getAuthPath } from "@/lib/routes";
import type { Locale } from "@/i18n/config";
import type { LandingCopy } from "@/types/landing";
import { LandingBrand } from "./LandingBrand";
import { LandingChatShowcase } from "./LandingChatShowcase";
import { LandingHeader } from "./LandingHeader";
import { LandingProductPreview } from "./LandingProductPreview";
import { LandingWaitlistForm } from "./LandingWaitlistForm";
import { ServiceIcon } from "./ServiceIcon";

interface LandingPageProps {
  copy: LandingCopy;
  locale: Locale;
}

export function LandingPage({ copy, locale }: LandingPageProps) {
  const alternateLocale: Locale = locale === "ar" ? "en" : "ar";
  const loginPath = getAuthPath(locale, "login");
  const waitlistPath = "#waitlist";

  return (
    <>
      <a className="skip-link" href="#main">
        {copy.nav.skip}
      </a>

      <LandingHeader
        alternateLocale={alternateLocale}
        copy={copy}
        loginPath={loginPath}
        waitlistPath={waitlistPath}
      />

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-shell">
            <div className="hero-copy">
              <p className="eyebrow">{copy.hero.eyebrow}</p>
              <h1>
                {copy.hero.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h1>
              <p className="hero-text">{copy.hero.subtitle}</p>

              <div className="hero-actions">
                <a className="primary-button" href={waitlistPath}>
                  <span>{copy.hero.primaryCta}</span>
                </a>
                <a className="secondary-button" href="#workflow">
                  {copy.hero.secondaryCta}
                </a>
              </div>

              <div className="assurance-row">
                {copy.hero.assurance.map((text) => (
                  <div className="assurance-pill" key={text}>
                    <span aria-hidden="true">✓</span>
                    <strong>{text}</strong>
                  </div>
                ))}
              </div>
            </div>

            <LandingProductPreview brand={copy.brand} preview={copy.preview} />
          </div>
        </section>

        <section className="trust-band" id="trust">
          <div className="content-shell trust-grid">
            {copy.trust.map((item) => (
              <article className="trust-card" key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <LandingChatShowcase
          brand={copy.brand}
          chat={copy.chat}
          locale={locale}
        />

        <section className="section" id="services">
          <div className="content-shell">
            <div className="section-heading">
              <h2>{copy.services.title}</h2>
            </div>
            <div className="services-grid">
              {copy.services.items.map((service) => (
                <article className="service-card" key={service.title}>
                  <div className="service-head">
                    <div className="service-icon">
                      <ServiceIcon name={service.icon} />
                    </div>
                    <h3>{service.title}</h3>
                  </div>
                  <p>{service.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section muted-section" id="workflow">
          <div className="content-shell workflow-layout">
            <div className="section-heading sticky-heading">
              <p>{copy.workflow.eyebrow}</p>
              <h2>{copy.workflow.title}</h2>
              <span>{copy.workflow.subtitle}</span>
            </div>
            <div className="workflow-list">
              {copy.workflow.steps.map((step) => (
                <article className="workflow-item" key={step.number}>
                  <div className="step-number">{step.number}</div>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section waitlist-section" id="waitlist">
          <div className="content-shell waitlist-layout">
            <div className="section-heading waitlist-copy">
              <h2>{copy.waitlist.title}</h2>
              <span>{copy.waitlist.subtitle}</span>
            </div>
            <LandingWaitlistForm copy={copy.waitlist} locale={locale} />
          </div>
        </section>

        <section className="final-cta">
          <div className="content-shell final-card">
            <div>
              <p>{copy.cta.eyebrow}</p>
              <h2>{copy.cta.title}</h2>
            </div>
            <a className="primary-button" href={waitlistPath}>
              <span>{copy.cta.button}</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="content-shell footer-shell">
          <div
            className="footer-brand brand-link"
            aria-label={copy.brand.logoAlt}
            dir="rtl"
          >
            <LandingBrand />
          </div>
          <p>{copy.footer.line}</p>
          <div className="footer-links">
            <a href={loginPath}>{copy.nav.login}</a>
            <a href={waitlistPath}>{copy.nav.startFree}</a>
          </div>
        </div>
      </footer>
    </>
  );
}
