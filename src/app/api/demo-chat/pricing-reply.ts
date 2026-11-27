import { createTranslator } from "next-intl";
import { isLocale, type Locale } from "@/i18n/config";
import { composePricingReply, type Translate } from "@/lib/landing-copy";
import { getPlans } from "@/lib/plans";
import type { LandingMessages } from "@/types/landing";

/** The demo chat's answer about prices, with the plan prices from the catalog. */
export async function getPricingReply(locale: Locale) {
  const safeLocale = isLocale(locale) ? locale : "en";
  const [landing, plans] = await Promise.all([
    import(`../../../../messages/${safeLocale}/landing.json`).then(
      (module) => module.default as LandingMessages,
    ),
    getPlans(),
  ]);
  const t = createTranslator({
    locale: safeLocale,
    messages: { landing },
    namespace: "landing",
  }) as unknown as Translate;

  return composePricingReply(plans, t);
}
