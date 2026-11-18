import type { CSSProperties } from "react";
import { getAuthPath, supportEmail } from "@/lib/routes";
import type { Locale } from "@/i18n/config";
import type { LandingCopy } from "@/types/landing";
import { LandingBrand } from "./LandingBrand";
import { LandingHeader } from "./LandingHeader";
import { LandingPricing } from "./LandingPricing";
import { LandingTeamDemo } from "./LandingTeamDemo";
import { LandingTeamDiagram } from "./LandingTeamDiagram";
import { memberHue } from "./team-hues";

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
          <div className="shell hero-grid">
            <div>
              <h1>{copy.hero.title}</h1>
              <p className="hero-lead">{copy.hero.subtitle}</p>

              <div className="hero-actions">
                <a className="button button-primary" href={signupPath}>
                  {copy.hero.primaryCta}
                </a>
                <a className="button button-secondary" href="#benefits">
                  {copy.hero.secondaryCta}
                </a>
              </div>

              <p className="hero-note">{copy.hero.note}</p>
            </div>

            <LandingTeamDiagram
              channels={copy.channels.items}
              diagram={copy.diagram}
              members={copy.team.members}
            />
          </div>
        </section>

        <section className="section section-surface" id="benefits">
          <div className="shell">
            <h2 className="section-title">{copy.team.title}</h2>
            <p className="section-text">{copy.team.intro}</p>

            <ul className="team-grid">
              {copy.team.members.map((member) => (
                <li
                  className={`team-card team-card-${member.key}`}
                  key={member.key}
                  style={{ "--member-hue": memberHue(member.key) } as CSSProperties}
                >
                  <h3>
                    <span className="member-dot" aria-hidden="true" />
                    {member.name}
                  </h3>
                  <p>{member.role}</p>
                  <p className="team-spares">
                    <span>{copy.team.sparesLabel}</span>
                    {member.spares}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section" id="chat">
          <div className="shell split">
            <div className="split-head">
              <h2 className="section-title">{copy.teamDemo.sectionTitle}</h2>
              <p className="section-text">{copy.teamDemo.sectionIntro}</p>
            </div>
            <LandingTeamDemo demo={copy.teamDemo} members={copy.team.members} />
          </div>
        </section>

        <section className="section section-surface" id="audience">
          <div className="shell">
            <h2 className="section-title">{copy.audience.title}</h2>

            <ul className="audience-grid">
              {copy.audience.items.map((item) => (
                <li className="audience-card" key={item.name}>
                  <h3>{item.name}</h3>
                  <p className="audience-pain">{item.pain}</p>
                  <p>{item.gain}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section" id="steps">
          <div className="shell">
            <h2 className="section-title">{copy.steps.title}</h2>

            <ol className="steps-grid">
              {copy.steps.items.map((item, index) => (
                <li key={item.title}>
                  <span className="step-number" aria-hidden="true">
                    {index + 1}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <LandingPricing
          locale={locale}
          pricing={copy.pricing}
          signupPath={signupPath}
        />

        <section className="section" id="faq">
          <div className="shell">
            <h2 className="section-title">{copy.faq.title}</h2>

            <div className="accordion-group">
              {copy.faq.items.map((item) => (
                <details className="accordion" key={item.question}>
                  <summary>{item.question}</summary>
                  <div className="accordion-body">
                    <p>{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-surface" id="signup">
          <div className="shell signup-grid">
            <h2 className="section-title">{copy.signup.title}</h2>
            <div className="signup-actions">
              <a className="button button-primary" href={signupPath}>
                {copy.signup.primary}
              </a>
              <a className="button button-secondary" href="#pricing">
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
              <a className="header-link" href="#benefits">
                {copy.footer.team}
              </a>
              <a className="header-link" href="#pricing">
                {copy.footer.pricing}
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
