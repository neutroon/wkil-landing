/** A plan card with every number already filled in from the plan catalog. */
export interface LandingPricingPlan {
  id: string;
  name: string;
  tagline: string;
  /** Monthly price in EGP, grouped with commas ("1,999"). */
  price: string;
  recommended: boolean;
  cta: string;
  features: string[];
}

export interface LandingSeoCopy {
  title: string;
  description: string;
  keywords: string[];
  openGraphTitle: string;
  openGraphDescription: string;
  imageAlt: string;
}

export interface LandingLabelledText {
  label: string;
  text: string;
}

export interface LandingTitledText {
  title: string;
  text: string;
}

export interface LandingQuestion {
  question: string;
  answer: string;
  button?: string;
}

export interface LandingAudienceItem {
  name: string;
  pain: string;
  gain: string;
}

export interface LandingTeamMember {
  key: string;
  name: string;
  role: string;
  spares: string;
}

export interface LandingTeamDemoStep {
  from: string;
  mention?: string;
  text: string;
  tool?: string;
  approval?: {
    title: string;
    detail: string;
  };
}

export interface LandingTeamDemoScenario {
  label: string;
  prompt: string;
  steps: LandingTeamDemoStep[];
}

/** The composed copy the components render: every ICU placeholder is already filled in. */
export interface LandingCopy {
  seo: LandingSeoCopy;
  brand: {
    logoAlt: string;
  };
  nav: {
    skip: string;
    ariaLabel: string;
    team: string;
    audience: string;
    pricing: string;
    faq: string;
    login: string;
    startFree: string;
    switchLanguage: string;
    menu: string;
  };
  hero: {
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    note: string;
  };
  diagram: {
    ariaLabel: string;
    you: string;
    youHint: string;
    managerHint: string;
    teamLabel: string;
    customers: string;
    customersHint: string;
  };
  channels: {
    label: string;
    items: string[];
  };
  teamDemo: {
    sectionTitle: string;
    sectionIntro: string;
    ariaLabel: string;
    title: string;
    exampleTag: string;
    youLabel: string;
    promptsLabel: string;
    approve: string;
    approved: string;
    typing: string;
    scenarios: LandingTeamDemoScenario[];
  };
  team: {
    title: string;
    intro: string;
    sparesLabel: string;
    members: LandingTeamMember[];
  };
  audience: {
    title: string;
    items: LandingAudienceItem[];
  };
  steps: {
    title: string;
    items: LandingTitledText[];
  };
  pricing: {
    title: string;
    intro: string;
    metaFees: string;
    metaLink: string;
    notes: string[];
    unit: string;
    recommendedBadge: string;
    included: {
      title: string;
      items: string[];
    };
    plans: LandingPricingPlan[];
    trial: LandingLabelledText;
    accordions: LandingQuestion[];
  };
  faq: {
    title: string;
    items: LandingQuestion[];
  };
  signup: {
    title: string;
    primary: string;
    secondary: string;
  };
  footer: {
    tagline: string;
    contactLabel: string;
    pricing: string;
    team: string;
    privacy: string;
    trademarks: string;
  };
}

/** One plan's copy in messages/{locale}/landing.json. Numbers are ICU placeholders. */
export interface LandingPlanMessages {
  name: string;
  tagline: string;
  cta: string;
  features: {
    credits: string;
    assistant: string;
    support?: string;
  };
}

/**
 * The shape of messages/{locale}/landing.json: the same sections as LandingCopy, with the
 * pricing lists keyed (so each entry can take its own values) and ICU placeholders where
 * a number comes from the plan catalog. Use composeLandingCopy to get LandingCopy.
 */
export interface LandingMessages extends Omit<LandingCopy, "audience" | "pricing"> {
  audience: {
    title: string;
    items: Record<"owner" | "agency" | "freelancer", LandingAudienceItem>;
  };
  pricing: Omit<
    LandingCopy["pricing"],
    "notes" | "plans" | "accordions" | "trial"
  > & {
    poweredByBadge: string;
    notes: Record<"credits" | "renewal" | "assistant" | "protection", string>;
    plans: Record<"free" | "starter" | "growth" | "scale", LandingPlanMessages>;
    trial: LandingLabelledText;
    accordions: Record<"pack" | "limit" | "custom", LandingQuestion>;
  };
  demoChat: {
    pricingReply: string;
  };
}
