import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { isPublicPlans } from "./plans-schema.ts";

const snapshot = JSON.parse(
  readFileSync(new URL("../data/plans.snapshot.json", import.meta.url), "utf8"),
);

test("the committed snapshot passes the type guard", () => {
  assert.equal(isPublicPlans(snapshot), true);
});

test("the type guard rejects bodies the page cannot render", () => {
  const broken = (change) => {
    const copy = structuredClone(snapshot);
    change(copy);
    return copy;
  };

  assert.equal(isPublicPlans(null), false);
  assert.equal(isPublicPlans({}), false);
  assert.equal(isPublicPlans(broken((c) => (c.schemaVersion = 2))), false);
  assert.equal(isPublicPlans(broken((c) => c.plans.pop())), false);
  assert.equal(isPublicPlans(broken((c) => c.plans.reverse())), false);
  assert.equal(isPublicPlans(broken((c) => (c.plans[1].recommended = true))), false);
  assert.equal(isPublicPlans(broken((c) => (c.plans[0].priceEgp = "0"))), false);
  assert.equal(isPublicPlans(broken((c) => delete c.pack)), false);
  assert.equal(isPublicPlans(broken((c) => (c.weights.aiReply = 0))), false);
  // Fields may be added within v1.
  assert.equal(isPublicPlans(broken((c) => (c.pricesIncludeVat = false))), true);
});

// CI sets WKIL_PLANS_URL (https://api.wkil.app/v1/public/plans). Any difference means the
// snapshot and the copy have to be reviewed together: run `npm run plans:snapshot`.
test("the snapshot equals the live catalog", async (t) => {
  const url = process.env.WKIL_PLANS_URL;

  if (!url) {
    t.skip("WKIL_PLANS_URL is not set, so there is no live catalog to compare with");
    return;
  }

  let live;

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });

    if (!response.ok) {
      t.skip(`${url} answered ${response.status}, so there is no live catalog to compare with`);
      return;
    }

    live = await response.json();
  } catch (error) {
    t.skip(`${url} is unreachable (${error instanceof Error ? error.message : error})`);
    return;
  }

  assert.deepEqual(
    snapshot,
    live,
    "plans.snapshot.json differs from the live catalog: run `npm run plans:snapshot`, then review the copy",
  );
});
