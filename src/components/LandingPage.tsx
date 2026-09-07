import { getAuthPath } from "@/lib/routes";
import type { Locale } from "@/i18n/config";
import type { LandingCopy } from "@/types/landing";
import { LandingChatShowcase } from "./LandingChatShowcase";
import { LandingHeader } from "./LandingHeader";
import { ServiceIcon } from "./ServiceIcon";

interface LandingPageProps {
  copy: LandingCopy;
  locale: Locale;
}

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

      <main id="main">
        <section className="hero hero-fullscreen" id="top">
          <LandingHeader
            alternateLocale={alternateLocale}
            copy={copy}
            signupPath={signupPath}
          />

          <div className="hero-body">
            <div className="hero-shell hero-shell-single">
              <div className="hero-copy">
                <h1>{copy.hero.title}</h1>
                <p className="hero-text">{copy.hero.subtitle}</p>

                <div className="hero-actions">
                  <a className="primary-button" href={signupPath}>
                    <span>{copy.hero.primaryCta}</span>
                  </a>
                  <a className="secondary-button" href="#chat">
                    {copy.hero.secondaryCta}
                  </a>
                </div>

                <div className="channel-strip" aria-label="Supported channels">
                  {copy.channels.items.map((channel) => (
                    <span className="channel-pill" key={channel}>
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="benefits">
          <div className="content-shell">
            <div className="section-heading">
              <h2>{copy.benefits.title}</h2>
            </div>
            <div className="services-grid">
              {copy.benefits.items.map((item) => (
                <article className="service-card" key={item.title}>
                  <div className="service-head">
                    <div className="service-icon">
                      <ServiceIcon name={item.icon} />
                    </div>
                    <h3>{item.title}</h3>
                  </div>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <LandingChatShowcase
          brand={copy.brand}
          chat={copy.chat}
          locale={locale}
          signupPath={signupPath}
        />

        <section className="section signup-section" id="signup">
          <div className="content-shell signup-layout">
            <div className="section-heading signup-copy">
              <h2>{copy.signup.title}</h2>
              <span>{copy.signup.subtitle}</span>
            </div>
            <div className="signup-card">
              <div className="signup-card-mark" aria-hidden="true">✓</div>
              <div>
                <strong>{copy.signup.cardTitle}</strong>
                <p>{copy.signup.note}</p>
              </div>
              <a className="primary-button" href={signupPath}>
                {copy.signup.button}
              </a>
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

      <footer className="footer footer-minimal">
        <div className="content-shell footer-shell-minimal">
          <a href={loginPath}>{copy.nav.login}</a>
          <a href={privacyPath}>{copy.footer.privacy}</a>
        </div>
      </footer>
    </>
  );
}
