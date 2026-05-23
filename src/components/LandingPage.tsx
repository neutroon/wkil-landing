"use client";

import { useEffect, useState } from "react";
import { content } from "@/content";

type Locale = keyof typeof content;
type ServiceIconName = (typeof content.ar.services.items)[number][0];

const storageKey = "wkilLandingLocale";

function getSavedLocale(): Locale {
  try {
    const savedLocale = window.localStorage.getItem(storageKey);
    return savedLocale === "en" || savedLocale === "ar" ? savedLocale : "ar";
  } catch {
    return "ar";
  }
}

function saveLocale(locale: Locale) {
  try {
    window.localStorage.setItem(storageKey, locale);
  } catch {
    /* Local storage can be disabled in privacy modes. */
  }
}

function ServiceIcon({ name }: { name: ServiceIconName }) {
  if (name === "lead") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 12.2a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z" />
        <path d="M5.8 19c.8-2.7 3.1-4.2 6.2-4.2 1.3 0 2.5.3 3.4.8" />
        <path d="m15.7 18.2 1.7 1.8 3.2-3.8" />
      </svg>
    );
  }

  if (name === "content") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 5h9.2L19 8.8V19H6V5Z" />
        <path d="M15 5v4h4" />
        <path d="M9 12h6M9 15h4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 7.5C5 5.6 6.6 4 8.5 4h7C17.4 4 19 5.6 19 7.5v4.8c0 1.9-1.6 3.5-3.5 3.5h-2.7L9 19v-3.2h-.5C6.6 15.8 5 14.2 5 12.3V7.5Z" />
      <path d="M8.8 9h6.4M8.8 12h4.2" />
    </svg>
  );
}

export function LandingPage() {
  const [locale, setLocale] = useState<Locale>("ar");
  const copy = content[locale];
  const signupPath = `/${locale}/auth/signup`;
  const loginPath = `/${locale}/auth/login`;

  useEffect(() => {
    setLocale(getSavedLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = locale === "ar" ? "وكيل | wkil" : "Wkil | وكيل";
    saveLocale(locale);
  }, [locale]);

  function toggleLocale() {
    setLocale((currentLocale) => (currentLocale === "ar" ? "en" : "ar"));
  }

  return (
    <>
      <a className="skip-link" href="#main">
        {copy.nav.skip}
      </a>

      <header className="site-header">
        <nav
          className="nav-shell"
          aria-label={locale === "ar" ? "التصفح الرئيسي" : "Main navigation"}
        >
          <a className="brand-link" href="#top" aria-label="Wkil home">
            <img src="/assets/wkil-logo.svg" alt="Wkil logo" />
          </a>

          <div className="nav-links">
            <a href="#services">{copy.nav.services}</a>
            <a href="#workflow">{copy.nav.workflow}</a>
            <a href="#trust">{copy.nav.trust}</a>
          </div>

          <div className="nav-actions">
            <button
              className="language-toggle"
              type="button"
              onClick={toggleLocale}
            >
              {copy.nav.switchLanguage}
            </button>
            <a className="login-link" href={loginPath}>
              {copy.nav.login}
            </a>
            <a className="primary-button compact" href={signupPath}>
              <span>{copy.nav.startFree}</span>
            </a>
          </div>
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-shell">
            <div className="hero-copy">
              <h1>
                {copy.hero.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h1>
              <p className="hero-text">{copy.hero.subtitle}</p>

              <div className="hero-actions">
                <a className="primary-button" href={signupPath}>
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

            <section
              className="product-card"
              aria-label={
                locale === "ar" ? "معاينة منتج وكيل" : "Wkil product preview"
              }
            >
              <div className="product-card-top">
                <div>
                  <strong>{copy.preview.status}</strong>
                </div>
                <span>{copy.preview.label}</span>
              </div>

              <div className="conversation">
                <div className="message customer">
                  <span>{copy.preview.customerLabel}</span>
                  <p>{copy.preview.customerMessage}</p>
                </div>

                <div className="agent-step">
                  <img src="/assets/wkil-mark.svg" alt="Wkil animated mark" />
                  <div>
                    <strong>{copy.preview.agentTitle}</strong>
                    <p>{copy.preview.agentText}</p>
                  </div>
                </div>

                <div className="message agent">
                  <span>{copy.preview.replyLabel}</span>
                  <p>{copy.preview.replyMessage}</p>
                </div>
              </div>

              <div className="result-strip">
                {copy.preview.results.map(([title, text]) => (
                  <article className="result-card" key={title}>
                    <span>{title}</span>
                    <strong>{text}</strong>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section className="trust-band" id="trust">
          <div className="content-shell trust-grid">
            {copy.trust.map(([title, text]) => (
              <article className="trust-card" key={title}>
                <strong>{title}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="services">
          <div className="content-shell">
            <div className="section-heading">
              <p>{copy.services.eyebrow}</p>
              <h2>{copy.services.title}</h2>
            </div>
            <div className="services-grid">
              {copy.services.items.map(([icon, title, text]) => (
                <article className="service-card" key={title}>
                  <div className="service-head">
                    <div className="service-icon">
                      <ServiceIcon name={icon} />
                    </div>
                    <h3>{title}</h3>
                  </div>
                  <p>{text}</p>
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
              {copy.workflow.steps.map(([number, title, text]) => (
                <article className="workflow-item" key={number}>
                  <div className="step-number">{number}</div>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="content-shell final-card">
            <div>
              <p>{copy.cta.eyebrow}</p>
              <h2>{copy.cta.title}</h2>
            </div>
            <a className="primary-button" href={signupPath}>
              <span>{copy.cta.button}</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="content-shell footer-shell">
          <div className="footer-brand">
            <img src="/assets/wkil-mark.svg" alt="Wkil mark" />
            <div>
              <strong>وكيل</strong>
              <span>wkil</span>
            </div>
          </div>
          <p>{copy.footer.line}</p>
          <div className="footer-links">
            <a href={loginPath}>{copy.nav.login}</a>
            <a href={signupPath}>{copy.nav.startFree}</a>
          </div>
        </div>
      </footer>
    </>
  );
}
