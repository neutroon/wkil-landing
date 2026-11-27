import snapshot from "@/data/plans.snapshot.json";
import { isPublicPlans, type PublicPlans } from "./plans-schema";

export type { PlanId, PublicPlan, PublicPlans } from "./plans-schema";

const fetchTimeoutMs = 3_000;

/** An env var that is empty or only spaces counts as unset (`??` would keep it). */
function envValue(name: string) {
  return process.env[name]?.trim() || undefined;
}

function plansUrl() {
  const base =
    envValue("WKIL_BACKEND_URL") ??
    envValue("NEXT_PUBLIC_API") ??
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
 *
 * Known trade-off: this never throws, so a revalidation that happens during an outage
 * stores a page built from the snapshot, and it stays for up to an hour (the next
 * revalidation) even if the backend is back a minute later. The log line
 * `plans.fallback_snapshot` is the only signal.
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
