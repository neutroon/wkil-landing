// Rewrites src/data/plans.snapshot.json from the live endpoint: `npm run plans:snapshot`.
// Set WKIL_PLANS_URL to read from somewhere else (it is the full URL of the endpoint).
import { writeFileSync } from "node:fs";

import { isPublicPlans } from "../src/lib/plans-schema.ts";

const url = process.env.WKIL_PLANS_URL ?? "https://api.wkil.app/v1/public/plans";
const target = new URL("../src/data/plans.snapshot.json", import.meta.url);

const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });

if (!response.ok) {
  console.error(`plans:snapshot: ${url} answered ${response.status}`);
  process.exit(1);
}

const body = await response.json();

if (!isPublicPlans(body)) {
  console.error("plans:snapshot: the response is not a valid v1 plan catalog, nothing written");
  process.exit(1);
}

writeFileSync(target, `${JSON.stringify(body, null, 2)}\n`);
console.log(`plans:snapshot: wrote catalog ${body.catalogVersion} from ${url}`);
