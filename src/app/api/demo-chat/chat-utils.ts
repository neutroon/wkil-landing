import type { Locale } from "@/i18n/config";

// Extracted pure utilities for NEU-2 testability
const rateLimitWindowMs = 60_000;
const rateLimitMaxRequests = 18;
const requestBuckets = new Map();

export function normalizeText(value: string) {
  return value
    .replace(/[\uFE00-\uFE0F\u200B-\u200D\u2060\uFEFF]/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}


export function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0];
  const realIp = request.headers.get("x-real-ip");

  return forwardedFor?.trim() || realIp?.trim() || "anonymous";
}


export function isRateLimited(key: string) {
  const now = Date.now();
  const bucket = requestBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    requestBuckets.set(key, {
      count: 1,
      resetAt: now + rateLimitWindowMs,
    });
    return false;
  }

  bucket.count += 1;
  return bucket.count > rateLimitMaxRequests;
}


export function localDemoReply(message: string, locale: Locale) {
  const text = message.toLowerCase();
  // original uses module-level requestBuckets; pure behavior verified in sequence
  const isArabic = locale === "ar";

  const hasAny = (terms: string[]) => terms.some((term) => text.includes(term));

  if (hasAny(["content", "post", "publish", "schedule", "caption", "ideas", "strategy", "محتوى", "منشور", "نشر", "ينشر", "بينشر", "بوست", "كابشن", "أفكار"])) {
    return isArabic
      ? "الوكيل بيجهز خطة محتوى ويكتب المنشورات ويولّد صور ليها. بعد ما تعتمدها، تتنشر أو تتجدول على صفحتك في فيسبوك."
      : "The agent drafts a content plan, writes the posts and generates images for them. After you approve them, they publish or schedule on your Facebook page.";
  }

  if (hasAny(["price", "pricing", "cost", "plan", "free", "سعر", "أسعار", "خطة", "خطط", "باقة", "باقات", "مجاني", "تكلف"])) {
    return isArabic
      ? "فيه 4 خطط: مجانية لشات الموقع وماسنجر، البداية بـ 699 ج.م في الشهر، النمو بـ 1,999 ج.م وهي الأكثر طلبًا، والتوسّع بـ 3,999 ج.م. والتفاصيل في قسم الأسعار."
      : "There are 4 plans: Free for web chat and Messenger, Starter at EGP 699 a month, Growth at EGP 1,999, the most popular, and Scale at EGP 3,999. The details are in the pricing section.";
  }

  if (hasAny(["easyorders", "store", "shop", "webhook", "متجر", "ويب هوك"])) {
    return isArabic
      ? "EasyOrders بيتربط مباشرة. وأي متجر تاني بيقدر يبعت الطلبات لويب هوك بيتربط برضه."
      : "EasyOrders connects directly. Any other store that can send orders to a webhook can connect too.";
  }

  if (hasAny(["order", "confirm", "cancel", "طلب", "تأكيد", "أكد", "إلغاء", "شحن"])) {
    return isArabic
      ? "كل طلب جديد من متجرك بيوصل للعميل كرسالة على واتساب، فيها زرار تأكيد وزرار إلغاء. ولما يرد، حالة الطلب بتتحدث في صفحة الطلبات."
      : "Every new order from your store reaches the customer as a WhatsApp message with a Confirm and a Cancel button. When they answer, the status updates on the orders page.";
  }

  if (hasAny(["whatsapp", "messenger", "facebook", "channel", "reply", "replies", "واتساب", "ماسنجر", "فيسبوك", "قنوات", "قناة", "بيرد", "يرد"])) {
    return isArabic
      ? "الوكيل بيرد على واتساب وماسنجر وشات الموقع. ولما حد يعلّق على صفحتك في فيسبوك، بيرد عليه ويبعتله التفاصيل على ماسنجر."
      : "The agent replies on WhatsApp, Messenger and web chat. When someone comments on your Facebook page, it replies and sends them the details in Messenger.";
  }

  if (hasAny(["system", "crm", "integration", "api", "نظام", "أنظمة", "ربط"])) {
    return isArabic
      ? "تقدر تربط الوكيل بأنظمتك الخارجية، فيتأكد من سعر أو توفر أو حالة طلب، أو ينفّذ حجز أو إلغاء أثناء المحادثة."
      : "You can connect the agent to your own systems so it can check a price, availability or order status, or book or cancel something during the conversation.";
  }

  if (hasAny(["report", "analytic", "تقرير", "تقارير", "تحليلات"])) {
    return isArabic
      ? "التقارير بتوريك عدد المحادثات، نسبة الردود اللي بعتها الوكيل، المحادثات اللي اتحولت لفريقك وأسبابها، ومتوسط وقت الرد."
      : "Reports show conversation counts, the share of replies sent by the agent, conversations handed to your team and why, and average reply time.";
  }

  if (hasAny(["lead", "customer", "follow", "team", "data", "عميل", "عملاء", "عملائ", "متابعة", "فريق", "بيانات"])) {
    return isArabic
      ? "الوكيل بيحفظ البيانات المهمة من المحادثة في ذاكرة العميل، وبيتابع اللي ما ردّش لو فعّلت المتابعة، وبيحوّل المحادثة لفريقك لما تحتاج موظف."
      : "The agent keeps the important details from each conversation in customer memory, follows up with customers who went quiet if you turn that on, and hands off to your team when a conversation needs a person.";
  }

  return isArabic
    ? "قول لوكيل تعمل إيه، وهو يخلّص الشغل: يجهز المحتوى وينشره، يرد على عملائك، يأكد طلبات متجرك، ويوصل لأنظمتك. ولما تطلب منه حاجة، بيعرضها عليك الأول."
    : "Tell Wkil what to do and it gets the work done: it plans and publishes content, replies to your customers, confirms your store orders and connects to your own systems. When you ask it for something, it shows you first.";
}
