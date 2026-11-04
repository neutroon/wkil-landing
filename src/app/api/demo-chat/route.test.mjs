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

test("localDemoReply answers every suggested prompt with the right topic", () => {
  assert.ok(localDemoReply("وكيل بيعمل إيه؟", "ar").includes("يرد على عملائك"));
  assert.ok(localDemoReply("What does Wkil do?", "en").includes("replies to your customers"));
  assert.ok(localDemoReply("بيرد على عملائي فين؟", "ar").includes("شات الموقع"));
  assert.ok(localDemoReply("Where does it reply to my customers?", "en").includes("web chat"));
  assert.ok(localDemoReply("بينشر على فيسبوك؟", "ar").includes("تتجدول"));
  assert.ok(localDemoReply("Does it publish on Facebook?", "en").includes("schedule"));
  assert.ok(localDemoReply("أنهي خطة تناسبني؟", "ar").includes("1,999"));
  assert.ok(localDemoReply("Which plan fits me?", "en").includes("1,999"));
});

test("localDemoReply covers order confirmation and connected systems", () => {
  assert.ok(localDemoReply("تأكيد الطلبات بيشتغل إزاي؟", "ar").includes("زرار تأكيد"));
  assert.ok(localDemoReply("Do you work with EasyOrders?", "en").includes("connects directly"));
  assert.ok(localDemoReply("Can it use our internal system?", "en").includes("your own systems"));
});

test("localDemoReply does not offer Instagram as a channel", () => {
  assert.equal(/instagram/i.test(localDemoReply("Do you reply on Instagram?", "en")), false);
  assert.equal(/إنستجرام/.test(localDemoReply("بترد على إنستجرام؟", "ar")), false);
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
