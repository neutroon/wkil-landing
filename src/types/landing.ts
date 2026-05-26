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
    services: string;
    workflow: string;
    trust: string;
    login: string;
    startFree: string;
    switchLanguage: string;
  };
  hero: {
    eyebrow: string;
    title: string[];
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    assurance: string[];
  };
  preview: {
    ariaLabel: string;
    status: string;
    label: string;
    modeAriaLabel: string;
    customerLabel: string;
    customerMessage: string;
    agentTitle: string;
    agentText: string;
    replyLabel: string;
    replyMessage: string;
    results: Array<{
      title: string;
      text: string;
    }>;
    demo: {
      label: string;
      status: string;
      promptLabel: string;
      prompts: Array<{
        title: string;
        customerMessage: string;
        agentText: string;
        replyMessage: string;
        results: Array<{
          title: string;
          text: string;
        }>;
      }>;
    };
  };
  trust: Array<{
    title: string;
    text: string;
  }>;
  services: {
    eyebrow: string;
    title: string;
    items: Array<{
      icon: ServiceIconName;
      title: string;
      text: string;
    }>;
  };
  workflow: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: Array<{
      number: string;
      title: string;
      text: string;
    }>;
  };
  cta: {
    eyebrow: string;
    title: string;
    button: string;
  };
  waitlist: {
    eyebrow: string;
    title: string;
    subtitle: string;
    formTitle: string;
    formText: string;
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
      teamSize: string;
      channels: string;
      challenge: string;
    };
    placeholders: {
      name: string;
      email: string;
      whatsapp: string;
    };
    channels: Array<{
      value: string;
      label: string;
    }>;
    challenges: Array<{
      value: string;
      label: string;
    }>;
    teamSizes: Array<{
      value: string;
      label: string;
    }>;
    trust: string[];
  };
  footer: {
    line: string;
  };
}
