import type { LandingCopy } from "@/types/landing";

interface LandingPricingProps {
  pricing: LandingCopy["pricing"];
  signupPath: string;
}

export function LandingPricing({ pricing, signupPath }: LandingPricingProps) {
  return (
    <section className="section pricing-section" id="pricing">
      <div className="content-shell">
        <div className="section-heading pricing-heading">
          <p className="pricing-eyebrow">{pricing.eyebrow}</p>
          <h2>{pricing.title}</h2>
          <span>{pricing.subtitle}</span>
        </div>

        <p className="pricing-billing-note">{pricing.billingNote}</p>

        <div className="pricing-grid">
          {pricing.plans.map((plan) => (
            <article
              className={
                plan.featured ? "pricing-card pricing-card-featured" : "pricing-card"
              }
              key={plan.id}
              aria-label={plan.name}
            >
              {plan.badge ? (
                <span className="pricing-badge">{plan.badge}</span>
              ) : null}

              <div className="pricing-card-head">
                <h3>{plan.name}</h3>
                <p className="pricing-tagline">{plan.tagline}</p>
              </div>

              <div className="pricing-price">
                <span className="pricing-amount">{plan.price}</span>
                <span className="pricing-unit">
                  <span>{pricing.currency}</span>
                  <span>{pricing.period}</span>
                </span>
              </div>
              <p className="pricing-annual">
                {plan.annual ?? " "}
              </p>

              <a
                className={
                  plan.featured
                    ? "primary-button pricing-cta"
                    : "secondary-button pricing-cta"
                }
                href={signupPath}
              >
                {plan.cta}
              </a>

              <ul className="pricing-features">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <span className="pricing-check" aria-hidden="true">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="pricing-notes">
          <div className="pricing-note">
            <strong>{pricing.overage.title}</strong>
            <p>{pricing.overage.text}</p>
          </div>
          <div className="pricing-note">
            <strong>{pricing.meta.title}</strong>
            <p>{pricing.meta.text}</p>
          </div>
          <div className="pricing-note">
            <strong>{pricing.addon.title}</strong>
            <p>{pricing.addon.text}</p>
          </div>
          <div className="pricing-note pricing-note-agency">
            <strong>{pricing.agency.title}</strong>
            <p>{pricing.agency.text}</p>
            <a className="pricing-text-link" href={signupPath}>
              {pricing.agency.cta}
            </a>
          </div>
        </div>

        <p className="pricing-trial">{pricing.trialNote}</p>
      </div>
    </section>
  );
}
