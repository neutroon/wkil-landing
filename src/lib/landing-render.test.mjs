import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createTranslator } from "next-intl";

import { composeLandingCopy, composePricingReply } from "./landing-copy.ts";

const plans = JSON.parse(
  readFileSync(new URL("../data/plans.snapshot.json", import.meta.url), "utf8"),
);
const messages = Object.fromEntries(
  ["ar", "en"].map((locale) => [
    locale,
    JSON.parse(
      readFileSync(new URL(`../../messages/${locale}/landing.json`, import.meta.url), "utf8"),
    ),
  ]),
);
const format = new Intl.NumberFormat("en-US");

function translatorFor(locale) {
  return createTranslator({
    locale,
    messages: { landing: messages[locale] },
    namespace: "landing",
  });
}

function compose(locale, catalog = plans) {
  return composeLandingCopy(messages[locale], catalog, translatorFor(locale));
}

function allStrings(value, found = []) {
  if (typeof value === "string") found.push(value);
  else if (value && typeof value === "object") Object.values(value).forEach((v) => allStrings(v, found));
  return found;
}

for (const locale of ["ar", "en"]) {
  test(`${locale}: each plan card shows its numbers from the catalog`, () => {
    const copy = compose(locale);

    assert.deepEqual(
      copy.pricing.plans.map((plan) => plan.id),
      ["free", "starter", "growth", "scale"],
    );

    copy.pricing.plans.forEach((card, index) => {
      const plan = plans.plans[index];
      const text = card.features.join("\n");

      assert.equal(card.price, format.format(plan.priceEgp));
      assert.equal(card.recommended, plan.recommended);
      assert.ok(card.features[0].includes(format.format(plan.monthlyCredits)), card.id);
      assert.ok(card.features[0].includes(format.format(plan.aiReplies)), card.id);
      assert.ok(card.features[0].includes(format.format(plan.confirmations)), card.id);
      assert.ok(card.features[1].includes(format.format(plan.assistantTasksPerWeek)), card.id);
      assert.equal(
        text.includes(messages[locale].pricing.poweredByBadge),
        plan.poweredByBadge,
        `${card.id} badge`,
      );
    });
  });

  test(`${locale}: the halved credits reach the page`, () => {
    const { pricing } = compose(locale);

    assert.deepEqual(
      pricing.plans.map((plan) => plan.features[0].match(/[\d,]+/)[0]),
      ["200", "1,500", "9,000", "20,000"],
    );
    assert.deepEqual(
      pricing.plans.map((plan) => plan.price),
      ["0", "699", "1,999", "3,999"],
    );
  });

  test(`${locale}: hero, signup, agency, trial, notes and accordions use the catalog`, () => {
    const copy = compose(locale);
    const [pack, , custom] = copy.pricing.accordions;

    assert.match(copy.hero.note, /\b50\b/);
    assert.match(copy.signup.title, /\b50\b/);
    assert.match(copy.audience.items[1].gain, /\b3\b/);
    assert.match(copy.pricing.trial.text, /\b14\b/);
    assert.match(copy.pricing.trial.text, /\b1,500\b/);
    assert.match(copy.pricing.notes[0], /\b4\b/);
    for (const n of ["4,000", "499", "1,000", "90"]) {
      assert.ok(pack.answer.includes(n), `pack ${n}`);
    }
    assert.ok(custom.question.includes("20,000"));
    assert.ok(custom.answer.includes("7,999"));
  });

  test(`${locale}: no placeholder or ICU syntax is left in the composed copy`, () => {
    for (const text of allStrings(compose(locale))) {
      assert.doesNotMatch(text, /[{}]/, text);
    }
  });

  test(`${locale}: a changed catalog number shows up without touching the copy`, () => {
    const changed = structuredClone(plans);
    changed.plans[1].monthlyCredits = 1600;
    changed.plans[1].aiReplies = 400;
    changed.plans[1].priceEgp = 749;
    changed.trial.days = 21;
    changed.pack.credits = 5000;

    const copy = compose(locale, changed);

    assert.ok(copy.pricing.plans[1].features[0].includes("1,600"));
    assert.ok(copy.pricing.plans[1].features[0].includes("400"));
    assert.equal(copy.pricing.plans[1].price, "749");
    assert.match(copy.pricing.trial.text, /\b21\b/);
    assert.ok(copy.pricing.accordions[0].answer.includes("5,000"));
  });

  test(`${locale}: the demo chat price reply names the four plans with catalog prices`, () => {
    const reply = composePricingReply(plans, translatorFor(locale));

    for (const price of ["699", "1,999", "3,999"]) {
      assert.ok(reply.includes(price), price);
    }
    assert.doesNotMatch(reply, /[{}]/);
    assert.doesNotMatch(reply, /messenger|ماسنجر|site chat|شات الموقع/i);
  });
}

test("ar: the order confirmation credit keeps its singular form and takes a plural otherwise", () => {
  const one = compose("ar").pricing.notes[0];
  assert.match(one, /بـ 4 نقط، وتأكيد الأوردر بنقطة\./);

  const two = structuredClone(plans);
  two.weights.orderConfirmation = 2;
  assert.match(compose("ar", two).pricing.notes[0], /وتأكيد الأوردر بـ 2 نقط\./);
});
