export type ServiceIconName = "inbox" | "lead" | "content";

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

export interface LandingCopy {
  seo: LandingSeoCopy;
  brand: {
    logoAlt: string;
    markAlt: string;
  };
  nav: {
    skip: string;
    ariaLabel: string;
    benefits: string;
    demo: string;
    pricing: string;
    join: string;
    login: string;
    startFree: string;
    switchLanguage: string;
  };
  hero: {
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  };
  channels: {
    items: string[];
  };
  benefits: {
    title: string;
    items: Array<{
      icon: ServiceIconName;
      title: string;
      text: string;
    }>;
  };
  chat: {
    ariaLabel: string;
    title: string;
    agentName: string;
    liveLabel: string;
    statusReady: string;
    statusThinking: string;
    assistantLabel: string;
    customerLabel: string;
    initialMessage: string;
    promptLabel: string;
    prompts: string[];
    inputLabel: string;
    inputPlaceholder: string;
    sendLabel: string;
    sendingLabel: string;
    errorText: string;
    ctaText: string;
    ctaButton: string;
  };
  pricing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    billingNote: string;
    currency: string;
    period: string;
    plans: LandingPricingPlan[];
    overage: {
      title: string;
      text: string;
    };
    meta: {
      title: string;
      text: string;
    };
    addon: {
      title: string;
      text: string;
    };
    agency: {
      title: string;
      text: string;
      cta: string;
    };
    trialNote: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    button: string;
  };
  signup: {
    title: string;
    subtitle: string;
    cardTitle: string;
    button: string;
    note: string;
  };
  footer: {
    privacy: string;
  };
}
