export type ServiceIconName = "inbox" | "lead" | "content";

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
  heroVisual: {
    ariaLabel: string;
    customerMessage: string;
    replyMessage: string;
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
  cta: {
    eyebrow: string;
    title: string;
    button: string;
  };
  waitlist: {
    title: string;
    subtitle: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successText: string;
    successAction: string;
    errorText: string;
    requiredText: string;
    fields: {
      name: string;
      email: string;
      whatsapp: string;
    };
    placeholders: {
      name: string;
      email: string;
      whatsapp: string;
    };
    trust: string[];
  };
  footer: {
    privacy: string;
  };
}
