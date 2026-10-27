import { NextResponse } from "next/server";
import type { Locale } from "@/i18n/config";
import {
  normalizeText,
  getClientKey,
  isRateLimited,
  localDemoReply,
} from "./chat-utils";

const messageMaxLength = 800;
const visitorIdMaxLength = 128;

const backendBaseUrl =
  process.env.WKIL_BACKEND_URL ??
  process.env.NEXT_PUBLIC_API ??
  "http://localhost:8080";

const demoSiteKey =
  process.env.WKIL_DEMO_WIDGET_SITE_KEY ??
  process.env.NEXT_PUBLIC_WKIL_DEMO_WIDGET_SITE_KEY;

const demoWidgetOrigin =
  process.env.WKIL_DEMO_WIDGET_ORIGIN ?? process.env.NEXT_PUBLIC_SITE_URL;

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

type DemoChatBody = {
  conversationId?: number | null;
  locale?: Locale;
  message?: string;
  visitorId?: string;
};

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
