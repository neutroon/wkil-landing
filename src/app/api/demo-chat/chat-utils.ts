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


const unknownReply = {
  ar: "وكيل بيقف، والمحادثة تستناك في صندوق الوارد لحد ما تفتحها، ومعاها نوعها: مبيعات، دعم، شكوى، أو غيره. والعميل بيستنى لحد ما ترد.",
  en: "Wkil stops, and the conversation waits in the inbox until you open it, labeled sales, support, complaint or other. The customer waits until you reply.",
};

// Whole words only, so "install", "instant" and InstaPay don't match. Arabic attaches
// prefixes and suffixes to the word itself, as in «عالإنستجرام» and «إنستجرامي».
const instagramMention =
  /(?<![\p{L}\p{M}\p{N}])(?:insta(?:gram)?|[وف]?[بلكع]?(?:ال|ل)?[إاأ]نست(?:ا|[جغق]رام)(?:ي|ك|كم|نا)?)(?![\p{L}\p{M}\p{N}])/u;

export function localDemoReply(message: string, locale: Locale) {
  const text = message.toLowerCase();
  // original uses module-level requestBuckets; pure behavior verified in sequence
  const isArabic = locale === "ar";

  const hasAny = (terms: string[]) => terms.some((term) => text.includes(term));

  if (instagramMention.test(text)) {
    return isArabic
      ? "لأ. وكيل مش بيرد ولا بينشر على إنستجرام. والنشر على فيسبوك بس."
      : "No. Wkil doesn't reply or publish on Instagram. Publishing is Facebook only.";
  }

  if (hasAny(["doesn't", "does not", "can't do", "مش بيعمل", "ميعملش", "مبيعملش"])) {
    if (hasAny(["doesn't know", "does not know", "doesn’t know"])) {
      return isArabic ? unknownReply.ar : unknownReply.en;
    }

    return isArabic
      ? "مش بيرد ولا بينشر على إنستجرام، والنشر على فيسبوك بس. مش مربوط بأي CRM جاهز، ومفيش ربط جاهز مع متاجر غير EasyOrders. تأكيد الأوردرات شغال على الأوردرات اللي بتيجي من متجر مربوط. ومش بيفهم الفويس والصور في الكومنتات وشات الموقع."
      : "It doesn't reply or publish on Instagram, and publishing is Facebook only. It has no ready-made CRM integration, and no ready-made store connections other than EasyOrders. Order confirmation works on orders from a connected store. It doesn't understand voice notes and images in comments or the site chat.";
  }

  if (hasAny(["مش عارف", "ميعرفش", "doesn’t know", "don't know", "unknown"])) {
    return isArabic ? unknownReply.ar : unknownReply.en;
  }

  if (hasAny(["content", "post", "publish", "schedule", "caption", "ideas", "strategy", "محتوى", "منشور", "نشر", "ينشر", "بوست", "كابشن", "أفكار", "جدول"])) {
    return isArabic
      ? "أيوه، بس على فيسبوك. قوله الهدف والتواريخ وعدد البوستات، يعملك خطة وتتحفظ مسودة، ويكتب نص كل بوست. وبعد موافقتك بينشر أو يجدول على صفحتك."
      : "Yes, on Facebook only. Give it the goal, dates and number of posts, and it makes a plan saved as a draft and writes each post. After you approve, it publishes or schedules to your page.";
  }

  if (hasAny(["price", "pricing", "cost", "plan", "free", "pay", "سعر", "أسعار", "بكام", "خطة", "خطط", "باقة", "باقات", "مجاني", "ببلاش", "دفع", "تكلف"])) {
    return isArabic
      ? "فيه 4 خطط: مجانية على ماسنجر وشات الموقع، البداية بـ 699 ج.م في الشهر، النمو بـ 1,999 ج.م، والتوسّع بـ 3,999 ج.م. ورسوم ميتا على واتساب منفصلة."
      : "There are 4 plans: Free on Messenger and your site chat, Starter at EGP 699 a month, Growth at EGP 1,999 and Scale at EGP 3,999. Meta's WhatsApp fees are separate.";
  }

  if (hasAny(["order", "confirm", "cancel", "طلب", "أوردر", "اوردر", "تأكيد", "أكد", "إلغاء", "شحن", "easyorders", "store", "shop", "webhook", "متجر", "ويب هوك"])) {
    return isArabic
      ? "هتحتاج خطة مدفوعة، ومتجر على EasyOrders أو بيبعت لويب هوك، ورقم واتساب متصل، وقالب معتمد من ميتا من النوع الخدمي، مش إعلان. وبعدها كل أوردر جديد بتروح عليه رسالة للعميل فيها زرار تأكيد وزرار إلغاء."
      : "You'll need a paid plan, a store on EasyOrders or one that sends to a webhook, a connected WhatsApp number, and a Meta-approved template of the service type, not an ad. Then each new order triggers a message to the customer with confirm and cancel buttons.";
  }

  if (hasAny(["whatsapp", "messenger", "facebook", "channel", "reply", "replies", "واتساب", "ماسنجر", "فيسبوك", "قنوات", "قناة", "بيرد", "يرد", "كومنت"])) {
    return isArabic
      ? "بيرد في 4 أماكن: واتساب، ماسنجر، شات الموقع، وكومنتات فيسبوك. وبينشر في مكان واحد: صفحة فيسبوك."
      : "It answers in 4 places: WhatsApp, Messenger, your site chat and Facebook comments. It publishes in 1: your Facebook page.";
  }

  if (hasAny(["system", "crm", "integration", "api", "نظام", "ربط"])) {
    return isArabic
      ? "لو نظامك ليه API، تعرّف إجراءات تستعلم عن سعر أو حالة أوردر، أو تحجز أو تلغي. بتشتغل لما العميل يطلب في الشات بس، وهتحتاج حد فني. ومفيش ربط جاهز مع أي CRM."
      : "If your system has an API, you can define actions that look up a price or order status, or that book or cancel. They run only when a customer asks in chat, and you'll need someone technical. There is no ready-made CRM integration.";
  }

  if (hasAny(["report", "analytic", "تقرير", "تقارير"])) {
    return isArabic
      ? "التقارير: المحادثات، ردود وكيل، اللي استناك وليه، ومتوسط وقت الرد، لآخر 7 أو 30 يوم."
      : "Reports show conversations, Wkil's replies, what waited for you and why, and average reply time, for the last 7 or 30 days.";
  }

  if (hasAny(["lead", "customer", "follow", "team", "data", "عميل", "عملاء", "عملائ", "متابعة", "فريق", "بيانات"])) {
    return isArabic
      ? "بيحفظ من المحادثة في ذاكرة العميل، وإنت تحدد يحفظ إيه. والمتابعة مقفولة لحد ما تشغّلها. ولو معاك حد، ادعيه بالإيميل أو بلينك."
      : "It saves from the conversation into customer memory, and you choose what. Follow-ups are off until you turn them on. If someone works with you, invite them by email or link.";
  }

  return isArabic
    ? "قول لوكيل عايز إيه، وهو يشيل عنك الرسايل والكومنتات وتأكيد الأوردرات وبوستات فيسبوك. اسألني عن أي حاجة فيهم، أو عن اللي مش بيعمله."
    : "Tell Wkil what you need, and it takes messages, comments, order confirmation and Facebook posts off your hands. Ask me about any of them, or about what it doesn't do.";
}
