import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readLanding(locale) {
  const url = new URL(`../../messages/${locale}/landing.json`, import.meta.url);
  return JSON.parse(readFileSync(url, "utf8"));
}

const ar = readLanding("ar");
const en = readLanding("en");

function shapeOf(value) {
  if (Array.isArray(value)) {
    return value.map(shapeOf);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, shapeOf(value[key])]),
    );
  }

  return typeof value;
}

test("Arabic and English copy have the same keys and list lengths", () => {
  assert.deepEqual(shapeOf(ar), shapeOf(en));
});

test("plan prices stay on the agreed numbers in both locales", () => {
  for (const copy of [ar, en]) {
    assert.deepEqual(
      copy.pricing.plans.map((plan) => [plan.id, plan.price]),
      [
        ["free", "0"],
        ["starter", "699"],
        ["growth", "1,999"],
        ["scale", "3,999"],
      ],
    );
  }
});

test("annual prices equal ten months, which is two months free", () => {
  for (const copy of [ar, en]) {
    const [, starter, growth, scale] = copy.pricing.plans;

    assert.match(starter.annual, /6,990/);
    assert.match(growth.annual, /19,990/);
    assert.match(scale.annual, /39,990/);
  }
});

test("Growth is the only featured plan and carries the badge", () => {
  for (const copy of [ar, en]) {
    const featured = copy.pricing.plans.filter((plan) => plan.featured);

    assert.equal(featured.length, 1);
    assert.equal(featured[0].id, "growth");
    assert.ok(featured[0].badge);
  }
});

test("web chat stays on the Free plan", () => {
  assert.match(ar.pricing.plans[0].features.join(" "), /شات الموقع/);
  assert.match(en.pricing.plans[0].features.join(" "), /Site chat/);
});

test("copy avoids promises the product cannot back up", () => {
  const banned = [
    /never stops/i,
    /no surprises/i,
    /مش بيقف/,
    /مفيش مفاجآت/,
    /\bRTO\b/i,
    /\d\s?%/,
    /saudi|\bSAR\b/i,
    /السعودية|ريال/,
  ];
  const text = `${JSON.stringify(ar)} ${JSON.stringify(en)}`;

  for (const pattern of banned) {
    assert.doesNotMatch(text, pattern);
  }
});

// Instagram is not a channel. It may only appear in the list of what Wkil doesn't do.
test("Instagram appears only as something Wkil doesn't do", () => {
  for (const [copy, pattern] of [[ar, /إنستجرام|انستجرام/], [en, /instagram/i]]) {
    const { notDo, ...restOfControl } = copy.control;

    assert.doesNotMatch(JSON.stringify({ ...copy, control: restOfControl }), pattern);
    assert.equal(notDo.filter((item) => pattern.test(item)).length, 1);
  }
});

test("Meta fees are stated in the open on the pricing section", () => {
  assert.match(ar.pricing.metaFees, /لميتا مباشرة/);
  assert.match(en.pricing.metaFees, /to Meta directly/);
});

test("paid plans are requested and only Free starts straight away", () => {
  for (const copy of [ar, en]) {
    const [free, ...paid] = copy.pricing.plans;

    assert.equal(free.cta, copy.hero.primaryCta);
    for (const plan of paid) {
      assert.notEqual(plan.cta, copy.hero.primaryCta);
    }
  }
});

test("Arabic copy follows the glossary", () => {
  const text = JSON.stringify(ar);
  const banned = [
    /يرجى|الرجاء|برجاء/,
    /(^|[\s"])قم ب/,
    /الخاص بك/,
    /بنجاح/,
    /Wkil/,
    /!/,
    /\.\.\./,
  ];

  for (const pattern of banned) {
    assert.doesNotMatch(text, pattern);
  }
});
