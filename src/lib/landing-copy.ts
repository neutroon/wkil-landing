import type { LandingCopy, LandingMessages } from "@/types/landing";
import type { PublicPlans } from "./plans-schema";

/** `t` of next-intl rooted at the `landing` namespace: key plus ICU values. */
export type Translate = (
  key: string,
  values?: Record<string, string | number>,
) => string;

const numberFormat = new Intl.NumberFormat("en-US");

/** Latin digits with comma grouping in both locales, as the pages have always shown. */
export function formatNumber(value: number) {
  return numberFormat.format(value);
}

function planOf(plans: PublicPlans, id: string) {
  const plan = plans.plans.find((candidate) => candidate.id === id);

  if (!plan) {
    throw new Error(`Plan catalog has no "${id}" plan`);
  }

  return plan;
}

/** Every catalog number the copy can mention, already formatted. */
function catalogValues(plans: PublicPlans) {
  const free = planOf(plans, "free");
  const scale = planOf(plans, "scale");
  const { weights, trial, pack, custom } = plans;

  return {
    freeReplies: formatNumber(free.aiReplies),
    maxBusinesses: formatNumber(scale.maxBusinesses),
    replyCredits: formatNumber(weights.aiReply),
    confirmationCredits: weights.orderConfirmation,
    confirmationCreditsText: formatNumber(weights.orderConfirmation),
    trialDays: formatNumber(trial.days),
    trialCredits: formatNumber(trial.credits),
    packCredits: formatNumber(pack.credits),
    packPriceEgp: formatNumber(pack.priceEgp),
    packReplies: formatNumber(pack.aiReplies),
    packConfirmations: formatNumber(pack.confirmations),
    packValidDays: formatNumber(pack.validDays),
    scaleCredits: formatNumber(scale.monthlyCredits),
    customFromEgp: formatNumber(custom.fromPriceEgp),
  };
}

/** The sentence the demo chat gives when asked about prices. */
export function composePricingReply(plans: PublicPlans, t: Translate) {
  return t("demoChat.pricingReply", {
    starterPrice: formatNumber(planOf(plans, "starter").priceEgp),
    growthPrice: formatNumber(planOf(plans, "growth").priceEgp),
    scalePrice: formatNumber(planOf(plans, "scale").priceEgp),
  });
}

/**
 * Fills every catalog number into the landing messages. Plain strings come from `messages`
 * as they are; strings with placeholders go through `t` (ICU). Plans render in catalog order.
 */
export function composeLandingCopy(
  messages: LandingMessages,
  plans: PublicPlans,
  t: Translate,
): LandingCopy {
  const shared = catalogValues(plans);
  // The demo chat's sentence is not part of the page, so it is not sent to the browser.
  const copy: Partial<LandingMessages> & Omit<LandingMessages, "demoChat"> = { ...messages };
  delete copy.demoChat;
  const { pricing, audience } = copy;

  const planCards = plans.plans.map((plan) => {
    const planCopy = pricing.plans[plan.id];

    if (!planCopy) {
      throw new Error(`Landing copy has no "${plan.id}" plan`);
    }

    const base = `pricing.plans.${plan.id}.features`;
    const features = [
      t(`${base}.credits`, {
        credits: formatNumber(plan.monthlyCredits),
        replies: formatNumber(plan.aiReplies),
        confirmations: formatNumber(plan.confirmations),
      }),
      t(`${base}.assistant`, {
        tasksPerWeek: formatNumber(plan.assistantTasksPerWeek),
      }),
    ];

    if (plan.poweredByBadge) {
      features.push(pricing.poweredByBadge);
    }

    if (planCopy.features.support) {
      features.push(planCopy.features.support);
    }

    return {
      id: plan.id,
      name: planCopy.name,
      tagline: planCopy.tagline,
      price: formatNumber(plan.priceEgp),
      recommended: plan.recommended,
      cta: planCopy.cta,
      features,
    };
  });

  const { pack, limit, custom } = pricing.accordions;

  return {
    ...copy,
    hero: { ...copy.hero, note: t("hero.note", shared) },
    audience: {
      title: audience.title,
      items: [
        audience.items.owner,
        {
          ...audience.items.agency,
          gain: t("audience.items.agency.gain", shared),
        },
        audience.items.freelancer,
      ],
    },
    pricing: {
      title: pricing.title,
      intro: pricing.intro,
      metaFees: pricing.metaFees,
      metaLink: pricing.metaLink,
      notes: [
        t("pricing.notes.credits", shared),
        pricing.notes.renewal,
        pricing.notes.assistant,
        pricing.notes.protection,
      ],
      unit: pricing.unit,
      recommendedBadge: pricing.recommendedBadge,
      included: pricing.included,
      plans: planCards,
      trial: {
        label: pricing.trial.label,
        text: t("pricing.trial.text", shared),
      },
      accordions: [
        { ...pack, answer: t("pricing.accordions.pack.answer", shared) },
        limit,
        {
          ...custom,
          question: t("pricing.accordions.custom.question", shared),
          answer: t("pricing.accordions.custom.answer", shared),
        },
      ],
    },
    signup: { ...copy.signup, title: t("signup.title", shared) },
  };
}
