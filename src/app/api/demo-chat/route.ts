import { NextResponse } from "next/server";
import type { Locale } from "@/i18n/config";

const messageMaxLength = 800;
const visitorIdMaxLength = 128;
const rateLimitWindowMs = 60_000;
const rateLimitMaxRequests = 18;

const backendBaseUrl =
  process.env.WKIL_BACKEND_URL ??
  process.env.NEXT_PUBLIC_API ??
  "http://localhost:8080";

const demoSiteKey =
  process.env.WKIL_DEMO_WIDGET_SITE_KEY ??
  process.env.NEXT_PUBLIC_WKIL_DEMO_WIDGET_SITE_KEY;

const demoWidgetOrigin =
  process.env.WKIL_DEMO_WIDGET_ORIGIN ?? process.env.NEXT_PUBLIC_SITE_URL;

const requestBuckets = new Map<string, { count: number; resetAt: number }>();

type DemoChatBody = {
  conversationId?: number | null;
  locale?: Locale;
  message?: string;
  visitorId?: string;
};

function buildBackendUrl(path: string) {
  const normalizedBaseUrl = backendBaseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
}

function getWidgetOrigin(request: Request) {
  const configuredOrigin = demoWidgetOrigin?.trim();

  if (configuredOrigin) {
    try {
      return new URL(configuredOrigin).origin;
    } catch {
      // Fall through to the request origin below.
    }
  }

  const requestOrigin = request.headers.get("origin");

  if (requestOrigin) {
    try {
      return new URL(requestOrigin).origin;
    } catch {
      // Fall through to the default production origin.
    }
  }

  return "https://wkil.app";
}

function normalizeText(value: string) {
  return value
    .replace(/[\uFE00-\uFE0F\u200B-\u200D\u2060\uFEFF]/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0];
  const realIp = request.headers.get("x-real-ip");

  return forwardedFor?.trim() || realIp?.trim() || "anonymous";
}

function isRateLimited(key: string) {
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

function localDemoReply(message: string, locale: Locale) {
  const text = message.toLowerCase();
  const isArabic = locale === "ar";

  const hasAny = (terms: string[]) => terms.some((term) => text.includes(term));

  if (hasAny(["content", "post", "caption", "ideas", "strategy", "trend", "محتوى", "بوست", "كابشن", "أفكار", "خطة", "ترند", "استراتيج"])) {
    return isArabic
      ? "وكيل بيجمع أسئلة الشات ومشاكل العملاء وترندات البحث، وبعدين يجهز خطة محتوى فريقك يراجعها وينشرها."
      : "Wkil gathers chat questions, customer problems, and search trends, then builds a content plan your team can review and publish.";
  }

  if (hasAny(["price", "pricing", "cost", "free", "سعر", "باقات", "مجاني", "تكلف"])) {
    return isArabic
      ? "حاليًا وكيل متاح للتجربة الأولى. تقدر تجربه على رسايلك وتشوف إزاي يرد من بيانات نشاطك، وبعدها نرتب الباقات حسب احتياجك وحجم القنوات."
      : "Wkil is currently available for the first trial. You can test it on your messages, see how it replies from your business data, then choose the plan that fits your channels and team size.";
  }

  if (hasAny(["whatsapp", "messenger", "facebook", "instagram", "channel", "channels", "واتساب", "ماسنجر", "فيسبوك", "انستجرام", "قنوات"])) {
    return isArabic
      ? "ينفع تربط قنوات متعددة زي واتساب وماسنجر وتعليقات فيسبوك وشات الموقع. وكيل يحافظ على سياق كل قناة ويظهر لفريقك بيانات العميل والخطوة الجاية."
      : "You can connect multiple channels such as WhatsApp, Messenger, Facebook comments, and website chat. Wkil keeps each channel's context and shows your team the customer details and next step.";
  }

  if (hasAny(["lead", "customer", "follow", "crm", "data", "عميل", "عملاء", "متابعة", "بيانات"])) {
    return isArabic
      ? "وكيل يحفظ بيانات مهمة من المحادثة مثل اسم العميل، القناة، الاهتمام، وحالة المتابعة، بحيث فريقك يكمل من نقطة واضحة بدل ما يبدأ من الصفر."
      : "Wkil saves useful details from each conversation, such as customer name, source channel, interest, and follow-up status, so your team continues from a clear next step.";
  }

  return isArabic
    ? "وكيل بيرد على العملاء، يحفظ بياناتهم، ويجهز خطط محتوى من الشات وترندات البحث. اسأل عن الردود، خطط المحتوى، القنوات، أو العملاء."
    : "Wkil replies to customers, saves lead details, and builds content plans from chat and search trends. Ask about replies, content plans, channels, or leads.";
}

function localDemoResponse(
  payload: DemoChatBody,
  message: string,
  locale: Locale,
) {
  return NextResponse.json({
    conversationId: payload.conversationId ?? null,
    mode: "local-demo",
    reply: localDemoReply(message, locale),
  });
}

export async function POST(request: Request) {
  if (isRateLimited(getClientKey(request))) {
    return NextResponse.json(
      { error: "Too many demo chat requests" },
      { status: 429 },
    );
  }

  let payload: DemoChatBody;

  try {
    payload = (await request.json()) as DemoChatBody;
  } catch {
    return NextResponse.json({ error: "Invalid chat payload" }, { status: 400 });
  }

  const locale = payload.locale === "en" ? "en" : "ar";
  const message =
    typeof payload.message === "string" ? normalizeText(payload.message) : "";
  const visitorId =
    typeof payload.visitorId === "string" ? payload.visitorId.trim() : "";

  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  if (message.length > messageMaxLength) {
    return NextResponse.json(
      { error: "message is too long" },
      { status: 400 },
    );
  }

  if (visitorId.length < 8 || visitorId.length > visitorIdMaxLength) {
    return NextResponse.json(
      { error: "visitorId is invalid" },
      { status: 400 },
    );
  }

  if (!demoSiteKey) {
    return localDemoResponse(payload, message, locale);
  }

  try {
    const response = await fetch(buildBackendUrl("/v1/public/widget/chat"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: getWidgetOrigin(request),
        "X-Widget-Site-Key": demoSiteKey,
      },
      body: JSON.stringify({
        conversationId: payload.conversationId ?? null,
        message,
        stream: false,
        visitorId,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return localDemoResponse(payload, message, locale);
    }

    const result = (await response.json()) as {
      conversationId?: number | null;
      reply?: string;
    };

    return NextResponse.json({
      conversationId: result.conversationId ?? payload.conversationId ?? null,
      mode: "live-ai",
      reply: result.reply || localDemoReply(message, locale),
    });
  } catch {
    return localDemoResponse(payload, message, locale);
  }
}
