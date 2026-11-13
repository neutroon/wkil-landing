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

export interface LandingCopy {
  seo: LandingSeoCopy;
  brand: {
    logoAlt: string;
  };
  nav: {
    skip: string;
    ariaLabel: string;
    capabilities: string;
    where: string;
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
    belowButtons: string;
    supporting: string;
  };
  proof: {
    title: string;
    groups: Array<{
      title: string;
      cards: Array<{
        input: string;
        result: string;
        status: string;
      }>;
    }>;
  };
  capabilities: {
    title: string;
    items: Array<{
      id: string;
      title: string;
      intro: string;
      points: string[];
      tryIt: string;
    }>;
    advanced: {
      title: string;
      items: LandingLabelledText[];
    };
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
  where: {
    title: string;
    intro: string;
    items: Array<{
      name: string;
      text: string;
    }>;
  };
  control: {
    title: string;
    items: LandingLabelledText[];
    notDoTitle: string;
    notDo: string[];
  };
  chat: {
    title: string;
    limits: string;
    initialMessage: string;
    prompts: string[];
    inputPlaceholder: string;
    ctaButton: string;
    ariaLabel: string;
    agentName: string;
    liveLabel: string;
    statusReady: string;
    statusThinking: string;
    assistantLabel: string;
    customerLabel: string;
    inputLabel: string;
    sendLabel: string;
    sendingLabel: string;
    errorText: string;
  };
  pricing: {
    title: string;
    metaFees: string;
    metaLink: string;
    notes: string[];
    unit: string;
    plans: LandingPricingPlan[];
    trial: LandingLabelledText;
    accordions: Array<{
      question: string;
      answer: string;
      button?: string;
    }>;
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
    demo: string;
    privacy: string;
    trademarks: string;
  };
}
