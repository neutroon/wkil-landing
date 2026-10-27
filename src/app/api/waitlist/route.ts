import { NextResponse } from "next/server";
import {
  hasRequiredFields,
  buildLeadPayload,
  getWaitlistUrl,
} from "./waitlist-utils";

const requiredFields = ["name", "email", "whatsapp"] as const;

const leadMessageMaxLength = 1000;
const backendBaseUrl =
  process.env.WKIL_BACKEND_URL ??
  process.env.NEXT_PUBLIC_API ??
  "http://localhost:8080";

function buildBackendUrl(path: string) {
  const normalizedBaseUrl = backendBaseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
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
