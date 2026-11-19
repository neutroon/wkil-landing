import type { Locale } from "@/i18n/config";
import {
  getPlanCheckoutPath,
  metaPricingUrl,
  supportEmail,
} from "@/lib/routes";
import type { LandingCopy } from "@/types/landing";

interface LandingPricingProps {
  locale: Locale;
  pricing: LandingCopy["pricing"];
  signupPath: string;
}

function contactHref(subject: string) {
  return `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}`;
}

export function LandingPricing({
  locale,
  pricing,
  signupPath,
}: LandingPricingProps) {
  return (
    <section className="section" id="pricing">
      <div className="shell">
        <h2 className="section-title">{pricing.title}</h2>
        <p className="section-text">{pricing.intro}</p>

        <div className="pricing-grid">
          {pricing.plans.map((plan) => (
            <article
              className={
                plan.featured ? "pricing-card pricing-card-featured" : "pricing-card"
              }
              key={plan.id}
            >
              <div className="pricing-card-head">
                <h3>{plan.name}</h3>
                {plan.badge ? (
                  <span className="pricing-badge">{plan.badge}</span>
                ) : null}
              </div>
              <p className="pricing-tagline">{plan.tagline}</p>

              <p className="pricing-price">
                <span className="pricing-amount">{plan.price}</span>
                <span className="pricing-unit">{pricing.unit}</span>
              </p>
              <p className="pricing-annual">{plan.annual ?? " "}</p>

              <a
                className={`button pricing-cta ${
                  plan.featured ? "button-primary" : "button-secondary"
                }`}
                href={
                  plan.id === "free"
                    ? signupPath
                    : getPlanCheckoutPath(locale, plan.id)
                }
              >
                {plan.cta}
              </a>

              <ul className="pricing-features">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <svg
                      aria-hidden="true"
                      fill="none"
                      focusable="false"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.75"
                      viewBox="0 0 16 16"
                    >
                      <path d="m3.5 8.5 3 3 6-7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="pricing-included">
          <h3>{pricing.included.title}</h3>
          <ul className="pricing-features">
            {pricing.included.items.map((item) => (
              <li key={item}>
                <svg
                  aria-hidden="true"
                  fill="none"
                  focusable="false"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.75"
                  viewBox="0 0 16 16"
                >
                  <path d="m3.5 8.5 3 3 6-7" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="pricing-trial">
          <strong>{pricing.trial.label}:</strong> {pricing.trial.text}
        </p>

        <ul className="pricing-notes">
          {pricing.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>

        <div className="pricing-meta">
          <p>{pricing.metaFees}</p>
          <a
            className="text-link"
            href={metaPricingUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {pricing.metaLink}
          </a>
        </div>

        <div className="accordion-group">
          {pricing.accordions.map((item) => (
            <details className="accordion" key={item.question}>
              <summary>{item.question}</summary>
              <div className="accordion-body">
                <p>{item.answer}</p>
                {item.button ? (
                  <a
                    className="button button-secondary button-small"
                    href={contactHref(item.question)}
                  >
                    {item.button}
                  </a>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
