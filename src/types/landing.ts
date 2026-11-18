export interface LandingPricingPlan {
  id: string;
  name: string;
  tagline: string;
  price: string;
  annual?: string;
  badge?: string;
  featured?: boolean;
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
    items: Array<{
      name: string;
      pain: string;
      gain: string;
    }>;
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
