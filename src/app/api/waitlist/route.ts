import { NextResponse } from "next/server";

const requiredFields = [
  "name",
  "email",
  "whatsapp",
  "teamSize",
  "challenge",
] as const;

const leadMessageMaxLength = 1000;
const backendBaseUrl =
  process.env.WKIL_BACKEND_URL ??
  process.env.NEXT_PUBLIC_API ??
  "http://localhost:8080";

function hasRequiredFields(payload: Record<string, unknown>) {
  const hasTextFields = requiredFields.every((field) => {
    const value = payload[field];

    return typeof value === "string" && value.trim().length > 0;
  });

  return (
    hasTextFields &&
    Array.isArray(payload.channels) &&
    payload.channels.length > 0
  );
}

function getText(payload: Record<string, unknown>, field: string) {
  const value = payload[field];

  return typeof value === "string" ? value.trim() : "";
}

function getTextList(payload: Record<string, unknown>, field: string) {
  const value = payload[field];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => {
    return typeof item === "string" && item.trim().length > 0;
  });
}

function buildBackendUrl(path: string) {
  const normalizedBaseUrl = backendBaseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
}

function getWaitlistUrl(locale: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wkil.app";

  try {
    return new URL(`/${locale}#waitlist`, siteUrl).toString();
  } catch {
    return "";
  }
}

function truncateLeadMessage(message: string) {
  if (message.length <= leadMessageMaxLength) {
    return message;
  }

  return `${message.slice(0, leadMessageMaxLength - 3)}...`;
}

function buildLeadPayload(submission: Record<string, unknown>) {
  const locale = getText(submission, "locale") || "ar";
  const channels = getTextList(submission, "channels").join(", ");
  const message = [
    "Wkil waitlist submission",
    `WhatsApp: ${getText(submission, "whatsapp")}`,
    `Team size: ${getText(submission, "teamSize")}`,
    `Channels: ${channels}`,
    `Biggest challenge: ${getText(submission, "challenge")}`,
    `Locale: ${locale}`,
    `Submitted at: ${getText(submission, "submittedAt")}`,
  ].join("\n");

  return {
    name: getText(submission, "name"),
    email: getText(submission, "email"),
    url: getWaitlistUrl(locale),
    message: truncateLeadMessage(message),
  };
}

async function sendToWkilStack(submission: Record<string, unknown>) {
  const response = await fetch(buildBackendUrl("/v1/leads"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildLeadPayload(submission)),
  });

  if (!response.ok) {
    throw new Error("Wkil lead API failed");
  }
}

async function sendToWebhook(submission: Record<string, unknown>) {
  const webhookUrl = process.env.WAITLIST_WEBHOOK_URL;

  if (!webhookUrl) {
    return false;
  }

  const webhookResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(submission),
  });

  if (!webhookResponse.ok) {
    throw new Error("Waitlist webhook failed");
  }

  return true;
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "Invalid waitlist payload" },
      { status: 400 },
    );
  }

  if (!hasRequiredFields(payload)) {
    return NextResponse.json(
      { error: "Missing required waitlist fields" },
      { status: 400 },
    );
  }

  const submission = {
    ...payload,
    source: "wkil-landing",
    submittedAt: new Date().toISOString(),
  };

  try {
    await sendToWkilStack(submission);
    let webhookStored = false;

    try {
      webhookStored = await sendToWebhook(submission);
    } catch (error) {
      console.error(error);
    }

    return NextResponse.json({
      ok: true,
      stored: true,
      destinations: {
        stack: true,
        webhook: webhookStored,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Waitlist submission failed" },
      { status: 502 },
    );
  }
}
