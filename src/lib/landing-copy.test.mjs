import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readLanding(locale) {
  const url = new URL(`../../messages/${locale}/landing.json`, import.meta.url);
  return JSON.parse(readFileSync(url, "utf8"));
}

const ar = readLanding("ar");
const en = readLanding("en");
const plans = JSON.parse(
  readFileSync(new URL("../data/plans.snapshot.json", import.meta.url), "utf8"),
);
const formatter = new Intl.NumberFormat("en-US");

function walkStrings(value, visit, path = "") {
  if (typeof value === "string") {
    visit(value, path);
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      walkStrings(child, visit, path ? `${path}.${key}` : key);
    }
  }
}

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

test("no pricing string holds a literal catalog number", () => {
  // Every number the catalog owns, as it is printed (grouped) or bare. Single digits are
  // skipped, and the agency line's maximum number of businesses is checked on its own.
  const numbers = new Set();
  const collect = (value) => {
    if (typeof value === "number" && value >= 10) numbers.add(value);
    if (value && typeof value === "object") Object.values(value).forEach(collect);
  };
  collect(plans);

  const literals = [...numbers].flatMap((n) => [String(n), formatter.format(n)]);
  const pattern = new RegExp(String.raw`(?<![\d,])(${literals.join("|")})(?![\d,])`);

  for (const [copy, name] of [[ar, "ar"], [en, "en"]]) {
    // metaFees quotes Meta's own free allowance (1,000 messages), which is not a Wkil number.
    const { metaFees, ...pricingCopy } = copy.pricing;
    assert.ok(metaFees);
    const checked = {
      seo: copy.seo,
      faq: copy.faq,
      hero: copy.hero,
      signup: copy.signup,
      audience: copy.audience,
      demoChat: copy.demoChat,
      pricing: pricingCopy,
    };

    walkStrings(checked, (text, path) => {
      assert.doesNotMatch(text, pattern, `${name} ${path} holds a catalog number`);
    });
    assert.doesNotMatch(copy.audience.items.agency.gain, /\b3\b/, `${name} agency line`);
    // The credit weights (4 and 1) are single digits, so they are checked only where they
    // are quoted: the credits note. Other small numbers (5 hours, 3 steps) stay free.
    assert.doesNotMatch(copy.pricing.notes.credits, /\b[41]\b/, `${name} credits note`);
  }
});

test("every pricing placeholder is one the composer fills", () => {
  const known = new Set([
    "freeReplies", "maxBusinesses", "replyCredits", "confirmationCredits",
    "confirmationCreditsText", "trialDays", "trialCredits", "packCredits", "packPriceEgp",
    "packReplies", "packConfirmations", "packValidDays", "scaleCredits", "customFromEgp",
    "credits", "replies", "confirmations", "tasksPerWeek", "starterPrice", "growthPrice",
    "scalePrice",
  ]);

  for (const copy of [ar, en]) {
    walkStrings(copy, (text, path) => {
      for (const [, name] of text.matchAll(/\{(\w+)[,}]/g)) {
        assert.ok(known.has(name), `${path} uses {${name}}`);
      }
    });
  }
});

test("Growth is the only recommended plan, and the copy has its badge", () => {
  assert.deepEqual(
    plans.plans.filter((plan) => plan.recommended).map((plan) => plan.id),
    ["growth"],
  );
  for (const copy of [ar, en]) {
    assert.ok(copy.pricing.recommendedBadge);
  }
});

// Since 19 Nov every plan has the same features and the cards list only the limits, so web
// chat is a channel of every plan (Free included) and the Free card names its chat badge.
test("web chat is a channel on every plan, Free included", () => {
  assert.ok(ar.channels.items.includes("شات الموقع"));
  assert.ok(en.channels.items.some((item) => /Site chat/.test(item)));
  assert.equal(plans.plans[0].poweredByBadge, true);
  assert.match(ar.pricing.poweredByBadge, /الشات/);
  assert.match(en.pricing.poweredByBadge, /chat/i);
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

// Instagram is not a channel. It may only appear in the one question that says so.
test("Instagram appears only in the question that says it isn't supported", () => {
  for (const [copy, pattern, no] of [
    [ar, /إنستجرام|انستجرام/, /^لأ./],
    [en, /instagram/i, /^No./],
  ]) {
    const { faq, ...rest } = copy;
    const mentions = faq.items.filter((item) => pattern.test(JSON.stringify(item)));

    assert.doesNotMatch(JSON.stringify(rest), pattern);
    assert.equal(mentions.length, 1);
    assert.match(mentions[0].answer, no);
  }
});

test("every member the team chat example names is on the team", () => {
  for (const copy of [ar, en]) {
    const keys = new Set(copy.team.members.map((member) => member.key));

    assert.equal(copy.team.members[0].key, "manager");
    for (const scenario of copy.teamDemo.scenarios) {
      for (const step of scenario.steps) {
        assert.ok(keys.has(step.from), step.from);
        assert.ok(!step.mention || keys.has(step.mention), step.mention);
      }
    }
  }
});

test("Meta fees are stated in the open on the pricing section", () => {
  assert.match(ar.pricing.metaFees, /لميتا مباشرة/);
  assert.match(en.pricing.metaFees, /to Meta directly/);
});

test("paid plans have their own button label and only Free reuses the main one", () => {
  for (const copy of [ar, en]) {
    const { free, ...paid } = copy.pricing.plans;

    assert.equal(free.cta, copy.hero.primaryCta);
    for (const plan of Object.values(paid)) {
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
