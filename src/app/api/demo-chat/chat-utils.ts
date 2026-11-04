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

  if (hasAny(["content", "post", "caption", "ideas", "strategy", "محتوى", "منشور", "بوست", "كابشن", "أفكار"])) {
    return isArabic
      ? "الوكيل بيجهز خطة محتوى ويكتب المنشورات. بعد ما تعتمدها، تتنشر أو تتجدول على صفحتك في فيسبوك."
      : "The agent drafts a content plan and writes the posts. After you approve them, they publish or schedule on your Facebook page.";
  }

  if (hasAny(["price", "pricing", "cost", "plan", "free", "سعر", "أسعار", "خطة", "خطط", "باقة", "باقات", "مجاني", "تكلف"])) {
    return isArabic
      ? "لحد 10 طلبات في اليوم، خطة البداية بـ 699 ج.م في الشهر. لحد 65 طلب في اليوم، خطة النمو بـ 1,999 ج.م. أكتر من كده، خطة التوسّع بـ 3,999 ج.م. وفيه خطة مجانية لشات الموقع وماسنجر، من غير تأكيد طلبات."
      : "For up to 10 orders a day, the Starter plan is EGP 699 a month. For up to 65 a day, Growth is EGP 1,999. Above that, Scale is EGP 3,999. There is also a Free plan for web chat and Messenger, without order confirmation.";
  }

  if (hasAny(["easyorders", "zammit", "store", "shop", "webhook", "متجر", "ويب هوك"])) {
    return isArabic
      ? "EasyOrders بيتربط مباشرة. أي متجر تاني بيقدر يبعت الطلبات لويب هوك بيتربط برضه. وZammit لسه مفيش معاه ربط مباشر."
      : "EasyOrders connects directly. Any other store that can send orders to a webhook can connect too. Zammit has no direct connection yet.";
  }

  if (hasAny(["order", "confirm", "cancel", "cod", "طلب", "تأكيد", "أكد", "إلغاء", "استلام", "شحن"])) {
    return isArabic
      ? "كل طلب جديد من متجرك بيوصل للعميل كرسالة على واتساب، فيها زرار تأكيد وزرار إلغاء. ولما يرد، حالة الطلب بتتحدث في صفحة الطلبات، فتعرف تشحن إيه."
      : "Every new order from your store reaches the customer as a WhatsApp message with a Confirm and a Cancel button. When they answer, the status updates on the orders page, so you know what to ship.";
  }

  if (hasAny(["whatsapp", "messenger", "facebook", "channel", "واتساب", "ماسنجر", "فيسبوك", "قنوات", "قناة"])) {
    return isArabic
      ? "الوكيل بيرد على واتساب وماسنجر وشات الموقع. ولما حد يعلّق على صفحتك في فيسبوك، بيبعتله التفاصيل على ماسنجر."
      : "The agent replies on WhatsApp, Messenger and web chat. When someone comments on your Facebook page, it sends them the details in Messenger.";
  }

  if (hasAny(["lead", "customer", "follow", "crm", "data", "عميل", "عملاء", "متابعة", "بيانات"])) {
    return isArabic
      ? "الوكيل بيحفظ البيانات المهمة من المحادثة في ذاكرة العميل، وبيتابع اللي ما ردّش، وبيحوّل المحادثة لفريقك لما تحتاج موظف."
      : "The agent keeps the important details from each conversation in customer memory, follows up with customers who went quiet, and hands off to your team when a conversation needs a person.";
  }

  return isArabic
    ? "قول لي عايز تعرف إيه: تأكيد الطلبات بيشتغل إزاي، أنهي خطة تناسبك، أو الوكيل بيرد على أنهي قنوات."
    : "Tell Wkil what you want to know: how order confirmation works, which plan fits you, or which channels the agent replies on.";
}
