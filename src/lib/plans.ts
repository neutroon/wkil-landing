import snapshot from "@/data/plans.snapshot.json";
import { isPublicPlans, type PublicPlans } from "./plans-schema";

export type { PlanId, PublicPlan, PublicPlans } from "./plans-schema";

const fetchTimeoutMs = 3_000;

function plansUrl() {
  const base =
    process.env.WKIL_BACKEND_URL ??
    process.env.NEXT_PUBLIC_API ??
    "https://api.wkil.app";

  return `${base.replace(/\/$/, "")}/v1/public/plans`;
}

function fallback(reason: string): PublicPlans {
  // One line, no request data: the catalog is public and the reason is all that is useful.
  console.warn(`plans.fallback_snapshot reason=${reason}`);
  return snapshot as PublicPlans;
}

/**
 * The plan catalog every number on the page comes from. Fetched from the backend and cached
 * for an hour (ISR); when the backend is down or answers with something unexpected, the
 * committed snapshot is used so a build or render never fails.
 */
export async function getPlans(): Promise<PublicPlans> {
  try {
    const response = await fetch(plansUrl(), {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(fetchTimeoutMs),
    });

    if (!response.ok) {
      return fallback(`status_${response.status}`);
    }

    const body: unknown = await response.json();

    return isPublicPlans(body) ? body : fallback("invalid_body");
  } catch (error) {
    return fallback(error instanceof Error ? error.name : "error");
  }
}
