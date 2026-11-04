import { getAuthPath, supportEmail } from "@/lib/routes";
import type { Locale } from "@/i18n/config";
import type { LandingCopy } from "@/types/landing";
import { LandingBrand } from "./LandingBrand";
import { LandingChatShowcase } from "./LandingChatShowcase";
import { LandingHeader } from "./LandingHeader";
import { LandingOrderDemo } from "./LandingOrderDemo";
import { LandingPricing } from "./LandingPricing";

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

      <LandingHeader
        alternateLocale={alternateLocale}
        copy={copy}
        loginPath={loginPath}
        signupPath={signupPath}
      />

      <main id="main">
        <section className="hero" id="top">
          <div className="shell">
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

            <p className="hero-note">{copy.hero.belowButtons}</p>
            <p className="hero-note">{copy.hero.supporting}</p>
          </div>
        </section>

        <section className="section section-surface" id="examples">
          <div className="shell">
            <h2 className="section-title">{copy.proof.title}</h2>

            <div className="proof-groups">
              {copy.proof.groups.map((group) => (
                <div key={group.title}>
                  <h3 className="proof-group-title">{group.title}</h3>
                  <ul className="proof-cards">
                    {group.cards.map((card) => (
                      <li className="proof-card" key={card.input}>
                        <p className="proof-input">{card.input}</p>
                        <p className="proof-result">{card.result}</p>
                        <span className="proof-status">{card.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="benefits">
          <div className="shell">
            <h2 className="section-title">{copy.capabilities.title}</h2>

            <div className="capabilities">
              {copy.capabilities.items.map((item) => (
                <article className="capability" id={item.id} key={item.id}>
                  <div>
                    <h3>{item.title}</h3>
                    <p className="capability-intro">{item.intro}</p>
                    <p className="capability-try">{item.tryIt}</p>
                  </div>
                  <div className="capability-detail">
                    <ul className="capability-points">
                      {item.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    {item.id === "orders" ? (
                      <LandingOrderDemo demo={copy.orderDemo} />
                    ) : null}
                  </div>
                </article>
              ))}
            </div>

            <details className="accordion capabilities-advanced">
              <summary>{copy.capabilities.advanced.title}</summary>
              <div className="accordion-body">
                {copy.capabilities.advanced.items.map((item) => (
                  <p key={item.label}>
                    <strong>{item.label}:</strong> {item.text}
                  </p>
                ))}
              </div>
            </details>
          </div>
        </section>

        <section className="section section-surface" id="where">
          <div className="shell">
            <h2 className="section-title">{copy.where.title}</h2>
            <p className="section-text">{copy.where.intro}</p>

            <dl className="where-list">
              {copy.where.items.map((item) => (
                <div key={item.name}>
                  <dt>{item.name}</dt>
                  <dd>{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="section" id="control">
          <div className="shell">
            <h2 className="section-title">{copy.control.title}</h2>

            <div className="control-grid">
              {copy.control.items.map((item) => (
                <div className="control-item" key={item.label}>
                  <h3>{item.label}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>

            <div className="not-do">
              <h3>{copy.control.notDoTitle}</h3>
              <ul>
                {copy.control.notDo.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <LandingChatShowcase
          chat={copy.chat}
          locale={locale}
          signupPath={signupPath}
        />

        <LandingPricing pricing={copy.pricing} signupPath={signupPath} />

        <section className="section section-surface" id="signup">
          <div className="shell signup-grid">
            <h2 className="section-title">{copy.signup.title}</h2>
            <div className="signup-actions">
              <a className="button button-primary" href={signupPath}>
                {copy.signup.primary}
              </a>
              <a className="button button-secondary" href="#chat">
                {copy.signup.secondary}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="shell footer-grid">
          <div className="footer-row">
            <a className="brand" href="#top" aria-label={copy.brand.logoAlt}>
              <LandingBrand />
            </a>
            <div className="footer-links">
              <a className="header-link" href="#pricing">
                {copy.footer.pricing}
              </a>
              <a className="header-link" href="#chat">
                {copy.footer.demo}
              </a>
              <a className="header-link" href={privacyPath}>
                {copy.footer.privacy}
              </a>
            </div>
          </div>
          <p className="footer-text">{copy.footer.tagline}</p>
          <p className="footer-text">
            {copy.footer.contactLabel}:{" "}
            <a className="text-link" dir="ltr" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
          </p>
          <p className="footer-text">{copy.footer.trademarks}</p>
        </div>
      </footer>
    </>
  );
}
