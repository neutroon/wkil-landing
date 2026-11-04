import { getAuthPath } from "@/lib/routes";
import type { Locale } from "@/i18n/config";
import type { LandingCopy } from "@/types/landing";
import { LandingBrand } from "./LandingBrand";
import { LandingChatShowcase } from "./LandingChatShowcase";
import { LandingCopilotDemo } from "./LandingCopilotDemo";
import { LandingHeader } from "./LandingHeader";
import { LandingOrderDemo } from "./LandingOrderDemo";
import { LandingPricing } from "./LandingPricing";

interface LandingPageProps {
  copy: LandingCopy;
  locale: Locale;
}

const SUPPORT_EMAIL = "support@wkil.app";

export function LandingPage({ copy, locale }: LandingPageProps) {
  const alternateLocale: Locale = locale === "ar" ? "en" : "ar";
  const loginPath = getAuthPath(locale, "login");
  const privacyPath = `/${locale}/privacy`;
  const signupPath = getAuthPath(locale, "signup");

  return (
    <>
      <a className="skip-link" href="#main">
        {copy.nav.skip}
      </a>

      <LandingHeader
        alternateLocale={alternateLocale}
        copy={copy}
        loginPath={loginPath}
        signupPath={signupPath}
      />

      <main id="main">
        <section className="hero" id="top">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <h1>{copy.hero.title}</h1>
              <p className="hero-lead">{copy.hero.subtitle}</p>

              <div className="hero-actions">
                <a className="button button-primary" href={signupPath}>
                  {copy.hero.primaryCta}
                </a>
                <a className="button button-secondary" href="#chat">
                  {copy.hero.secondaryCta}
                </a>
              </div>

              <p className="hero-note">{copy.hero.channels}</p>
            </div>

            <LandingCopilotDemo demo={copy.copilotDemo} />
          </div>
        </section>

        <LandingChatShowcase
          chat={copy.chat}
          locale={locale}
          signupPath={signupPath}
        />

        <section className="section" id="how">
          <div className="shell">
            <h2 className="section-title">{copy.how.title}</h2>

            <ol className="steps">
              {copy.how.steps.map((step, index) => (
                <li className="step" key={step.title}>
                  <span aria-hidden="true" className="step-number">
                    {index + 1}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section section-surface" id="benefits">
          <div className="shell">
            <h2 className="section-title">{copy.agent.title}</h2>

            <ul className="agent-list">
              {copy.agent.items.map((item) => (
                <li className="agent-item" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section" id="orders">
          <div className="shell split">
            <div className="split-head">
              <h2 className="section-title">{copy.orders.title}</h2>
              <p className="section-text">{copy.orders.text}</p>
              <ul className="orders-points">
                {copy.orders.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>

            <LandingOrderDemo demo={copy.orderDemo} />
          </div>
        </section>

        <LandingPricing pricing={copy.pricing} signupPath={signupPath} />

        <section className="section" id="signup">
          <div className="shell signup-grid">
            <div>
              <h2 className="section-title">{copy.signup.title}</h2>
              <p className="section-text">{copy.signup.subtitle}</p>
            </div>
            <div className="signup-actions">
              <a className="button button-primary" href={signupPath}>
                {copy.signup.button}
              </a>
              <a className="button button-secondary" href={loginPath}>
                {copy.nav.login}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="shell footer-row">
          <a className="brand" href="#top" aria-label={copy.brand.logoAlt}>
            <LandingBrand />
          </a>
          <div className="footer-links">
            <a className="header-link" href={privacyPath}>
              {copy.footer.privacy}
            </a>
            <a className="header-link" href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
