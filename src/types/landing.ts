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
  footer: {
    line: string;
  };
}
