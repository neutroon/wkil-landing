import type { LandingCopy } from "@/types/landing";

interface LandingPricingProps {
  pricing: LandingCopy["pricing"];
  signupPath: string;
}

export function LandingPricing({ pricing, signupPath }: LandingPricingProps) {
  const notes = [pricing.meta, pricing.overage, pricing.addon];

  return (
    <section className="section" id="pricing">
      <div className="shell">
        <h2 className="section-title">{pricing.title}</h2>
        <p className="section-text">{pricing.subtitle}</p>
        <p className="pricing-billing-note">{pricing.billingNote}</p>

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
                <span className="pricing-unit">
                  {pricing.currency} {pricing.period}
                </span>
              </p>
              <p className="pricing-annual">{plan.annual ?? " "}</p>

              <a
                className={`button pricing-cta ${
                  plan.featured ? "button-primary" : "button-secondary"
                }`}
                href={signupPath}
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

        <div className="pricing-agency">
          <div>
            <h3>{pricing.agency.title}</h3>
            <p>{pricing.agency.text}</p>
          </div>
          <a className="button button-secondary" href={signupPath}>
            {pricing.agency.cta}
          </a>
        </div>

        <div className="pricing-notes">
          {notes.map((note) => (
            <div className="pricing-note" key={note.title}>
              <h3>{note.title}</h3>
              <p>{note.text}</p>
            </div>
          ))}
        </div>

        <p className="pricing-trial">{pricing.trialNote}</p>
      </div>
    </section>
  );
}
