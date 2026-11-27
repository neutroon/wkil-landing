// The public plan catalog, as served by `GET /v1/public/plans` (schemaVersion 1).
// Kept free of framework imports so the node:test files can load it directly.

export type PlanId = "free" | "starter" | "growth" | "scale";

export const planIds: readonly PlanId[] = ["free", "starter", "growth", "scale"];

export interface PublicPlan {
  id: PlanId;
  rank: number;
  priceEgp: number;
  monthlyCredits: number;
  aiReplies: number;
  confirmations: number;
  assistantTasksPerWeek: number;
  maxBusinesses: number;
  poweredByBadge: boolean;
  packs: { eligible: boolean; maxPerPeriod: number };
  recommended: boolean;
}

export interface PublicPlans {
  schemaVersion: 1;
  catalogVersion: string;
  currency: string;
  weights: {
    aiReply: number;
    orderConfirmation: number;
    thankYou: number;
    handoverNotice: number;
    staffMessage: number;
  };
  plans: PublicPlan[];
  trial: { planId: PlanId; days: number; credits: number; aiReplies: number };
  pack: {
    credits: number;
    priceEgp: number;
    validDays: number;
    aiReplies: number;
    confirmations: number;
  };
  custom: { fromPriceEgp: number };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && (planIds as readonly string[]).includes(value);
}

function isPublicPlan(value: unknown): value is PublicPlan {
  if (!isRecord(value)) return false;
  const packs = value.packs;

  return (
    isPlanId(value.id) &&
    isCount(value.rank) &&
    isCount(value.priceEgp) &&
    isCount(value.monthlyCredits) &&
    isCount(value.aiReplies) &&
    isCount(value.confirmations) &&
    isCount(value.assistantTasksPerWeek) &&
    isCount(value.maxBusinesses) &&
    typeof value.poweredByBadge === "boolean" &&
    isRecord(packs) &&
    typeof packs.eligible === "boolean" &&
    isCount(packs.maxPerPeriod) &&
    typeof value.recommended === "boolean"
  );
}

/**
 * Accepts only a v1 body the page can render: all four plans exactly once, in rank order,
 * and exactly one recommended plan. Extra fields are allowed (the contract adds them within v1).
 */
export function isPublicPlans(value: unknown): value is PublicPlans {
  if (!isRecord(value) || value.schemaVersion !== 1) return false;
  const { weights, plans, trial, pack, custom } = value;

  if (
    typeof value.catalogVersion !== "string" ||
    // The copy prints EGP / ج.م literally, so any other currency is not renderable.
    value.currency !== "EGP" ||
    !isRecord(weights) ||
    !isCount(weights.aiReply) ||
    weights.aiReply < 1 ||
    !isCount(weights.orderConfirmation) ||
    !Array.isArray(plans) ||
    !plans.every(isPublicPlan)
  ) {
    return false;
  }

  if (
    plans.length !== planIds.length ||
    !planIds.every((id, index) => plans[index].id === id) ||
    plans.filter((plan) => plan.recommended).length !== 1
  ) {
    return false;
  }

  return (
    isRecord(trial) &&
    isPlanId(trial.planId) &&
    isCount(trial.days) &&
    isCount(trial.credits) &&
    isCount(trial.aiReplies) &&
    isRecord(pack) &&
    isCount(pack.credits) &&
    isCount(pack.priceEgp) &&
    isCount(pack.validDays) &&
    isCount(pack.aiReplies) &&
    isCount(pack.confirmations) &&
    isRecord(custom) &&
    isCount(custom.fromPriceEgp)
  );
}
