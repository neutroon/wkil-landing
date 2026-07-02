import { getAuthPath } from "@/lib/routes";
import type { Locale } from "@/i18n/config";
import type { LandingCopy } from "@/types/landing";
import { LandingChatShowcase } from "./LandingChatShowcase";
import { LandingHeader } from "./LandingHeader";
import { LandingHeroVisual } from "./LandingHeroVisual";
import { LandingWaitlistForm } from "./LandingWaitlistForm";
import { ServiceIcon } from "./ServiceIcon";

interface LandingPageProps {
  copy: LandingCopy;
  locale: Locale;
}

export function LandingPage({ copy, locale }: LandingPageProps) {
  const alternateLocale: Locale = locale === "ar" ? "en" : "ar";
  const loginPath = getAuthPath(locale, "login");
  const privacyPath = `/${locale}/privacy`;
  const waitlistPath = "#waitlist";

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
            waitlistPath={waitlistPath}
          />

          <div className="hero-body">
            <div className="hero-shell hero-shell-focused">
              <div className="hero-copy">
                <h1>{copy.hero.title}</h1>
                <p className="hero-text">{copy.hero.subtitle}</p>

                <div className="hero-actions">
                  <a className="primary-button" href={waitlistPath}>
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

              <LandingHeroVisual
                assistantLabel={copy.chat.assistantLabel}
                brand={copy.brand}
                customerLabel={copy.chat.customerLabel}
                visual={copy.heroVisual}
              />
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
        />

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

      <footer className="footer footer-minimal">
        <div className="content-shell footer-shell-minimal">
          <a href={loginPath}>{copy.nav.login}</a>
          <a href={privacyPath}>{copy.footer.privacy}</a>
        </div>
      </footer>
    </>
  );
}
