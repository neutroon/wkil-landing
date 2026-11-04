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
  };
  nav: {
    skip: string;
    ariaLabel: string;
    how: string;
    agent: string;
    demo: string;
    pricing: string;
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
    channels: string;
  };
  copilotDemo: {
    ariaLabel: string;
    title: string;
    exampleTag: string;
    request: string;
    reply: string;
    actionTitle: string;
    details: Array<{
      label: string;
      value: string;
    }>;
    allow: string;
    deny: string;
    allowedResult: string;
    deniedResult: string;
    hint: string;
    reset: string;
  };
  orderDemo: {
    ariaLabel: string;
    messageTitle: string;
    exampleTag: string;
    message: string;
    confirmButton: string;
    cancelButton: string;
    confirmedReply: string;
    canceledReply: string;
    ordersTitle: string;
    orderLabel: string;
    customer: string;
    total: string;
    status: {
      awaiting: string;
      confirmed: string;
      canceled: string;
    };
    hint: string;
    reset: string;
  };
  how: {
    title: string;
    steps: Array<{
      title: string;
      text: string;
    }>;
  };
  agent: {
    title: string;
    items: Array<{
      title: string;
      text: string;
    }>;
  };
  orders: {
    title: string;
    text: string;
    points: string[];
  };
  chat: {
    ariaLabel: string;
    title: string;
    subtitle: string;
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
  signup: {
    title: string;
    subtitle: string;
    button: string;
  };
  footer: {
    privacy: string;
  };
}
