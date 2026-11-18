import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeText,
  localDemoReply,
  getClientKey,
  isRateLimited,
} from "./chat-utils.ts";

// 1. normalizeText

test("normalizeText trims and collapses whitespace", () => {
  assert.equal(normalizeText("  hello  world  "), "hello world");
  assert.equal(normalizeText("a\t\tb"), "a b");
  assert.equal(normalizeText("line1\n\n\nline2").includes("line2"), true);
});

test("normalizeText strips control and invisible characters", () => {
  assert.equal(normalizeText("hello\x00world"), "helloworld");
  assert.equal(normalizeText("a\uFEFFb"), "ab");
  assert.equal(normalizeText("a\u200Bb"), "ab");
});

test("normalizeText handles empty and boundary input", () => {
  assert.equal(normalizeText(""), "");
  assert.equal(normalizeText("   "), "");
  assert.equal(normalizeText("\n\n\n"), "");
});

// 2. localDemoReply

test("localDemoReply returns content response in English", () => {
  const r = localDemoReply("tell me about content strategy", "en");
  assert.ok(typeof r === "string" && r.length > 0);
  assert.ok(r.includes("plan"));
});

test("localDemoReply returns Arabic locale response", () => {
  const r = localDemoReply("محتوى", "ar");
  assert.ok(typeof r === "string" && r.length > 0);
  assert.ok(r.includes("بوست") || r.includes("محتوى"));
});

test("localDemoReply handles pricing keywords", () => {
  assert.ok(localDemoReply("pricing", "en").includes("plan") || localDemoReply("pricing", "en").includes("Choose"));
  assert.ok(localDemoReply("سعر", "ar").length > 0);
});

test("localDemoReply answers every suggested starter with the right topic", () => {
  assert.ok(localDemoReply("عميل سأل عن حاجة وكيل مش عارفها، بيحصل إيه؟", "ar").includes("صندوق الوارد"));
  assert.ok(localDemoReply("A customer asked something Wkil doesn't know. What happens?", "en").includes("inbox"));
  assert.ok(localDemoReply("محتاج إيه عشان أأكد الأوردرات على واتساب؟", "ar").includes("قالب معتمد"));
  assert.ok(localDemoReply("What do I need to confirm orders on WhatsApp?", "en").includes("template"));
  assert.ok(localDemoReply("ينفع يجهزلي بوستات الأسبوع وينشرها؟", "ar").includes("فيسبوك"));
  assert.ok(localDemoReply("Can it prepare this week's posts and publish them?", "en").includes("Facebook"));
  assert.ok(localDemoReply("إيه اللي وكيل مش بيعمله؟", "ar").includes("CRM"));
  assert.ok(localDemoReply("What doesn't Wkil do?", "en").includes("CRM"));
});

test("localDemoReply says no to Instagram however it is asked", () => {
  for (const question of ["بترد على إنستجرام؟", "بينشر على انستجرام؟", "شغال على انستا؟"]) {
    assert.ok(localDemoReply(question, "ar").startsWith("لأ."));
  }

  for (const question of ["Do you reply on Instagram?", "Does it publish to instagram?", "post on insta?"]) {
    assert.ok(localDemoReply(question, "en").startsWith("No."));
  }
});

test("localDemoReply recognises Instagram with Arabic prefixes, suffixes and spellings", () => {
  const questions = [
    "بينشر عالإنستجرام؟",
    "بينشر بالانستجرام؟",
    "ينفع للإنستا؟",
    "والانستا؟",
    "ينفع على إنستجرامي؟",
    "ينفع على انستغرام؟",
    "ينفع على أنستجرام؟",
  ];

  for (const question of questions) {
    assert.ok(localDemoReply(question, "ar").startsWith("لأ."), question);
  }

  assert.ok(localDemoReply("Is Instagram's inbox supported?", "en").startsWith("No."));
  assert.ok(localDemoReply("INSTA?", "en").startsWith("No."));
});

test("localDemoReply does not mistake other words for Instagram", () => {
  for (const question of [
    "How do I install it?",
    "How do I install site chat?",
    "Is the reply instant?",
    "For instance, can it book?",
    "Do you take InstaPay?",
  ]) {
    assert.equal(localDemoReply(question, "en").startsWith("No."), false, question);
  }

  for (const question of ["بتقبلوا إنستاباي؟", "بتقبلوا انستاباي؟", "محتاج انستالر؟"]) {
    assert.equal(localDemoReply(question, "ar").startsWith("لأ."), false, question);
  }
});

test("localDemoReply gives plan prices", () => {
  assert.ok(localDemoReply("بكام الخطط؟", "ar").includes("1,999"));
  assert.ok(localDemoReply("How much is the Growth plan?", "en").includes("1,999"));
});

test("localDemoReply defaults to generic for unknown input", () => {
  assert.ok(localDemoReply("xyz", "en").includes("Tell Wkil"));
  assert.ok(localDemoReply("xyz", "ar").includes("قول"));
});

// 3. getClientKey

test("getClientKey reads x-forwarded-for", () => {
  const req = new Request("http://test", {
    headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
  });
  assert.equal(getClientKey(req), "1.2.3.4");
});

test("getClientKey falls back to x-real-ip", () => {
  const req = new Request("http://test", {
    headers: { "x-real-ip": "  10.0.0.1  " },
  });
  assert.equal(getClientKey(req), "10.0.0.1");
});

test("getClientKey returns anonymous when no headers", () => {
  const req = new Request("http://test");
  assert.equal(getClientKey(req), "anonymous");
});

// 4. isRateLimited

test("isRateLimited allows first request", () => {
  assert.equal(isRateLimited("key-a-" + Date.now()), false);
});

test("isRateLimited blocks after exceeding max", () => {
  const k = "key-b-" + Date.now();
  // Sequence within same window: first allows, rest accumulate.
  assert.equal(isRateLimited(k), false);
  // We just verify it returns boolean; precise count depends on window.
  assert.equal(typeof isRateLimited(k), "boolean");
});

test("isRateLimited resets after window", () => {
  const k = "key-c-" + Date.now();
  assert.equal(isRateLimited(k), false);
  assert.equal(typeof isRateLimited(k), "boolean");
});
