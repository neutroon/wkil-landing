// Extracted pure utilities for NEU-2 testability
const requiredFields = ["name","email","whatsapp"] as const;
const leadMessageMaxLength = 1000;
export function hasRequiredFields(payload: Record<string, unknown>) {

  return requiredFields.every((field) => {
    const value = payload[field];

    return typeof value === "string" && value.trim().length > 0;
  });
}

export function getWaitlistUrl(locale: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wkil.app";

  try {
    return new URL(`/${locale}#waitlist`, siteUrl).toString();
  } catch {
    return "";
  }
}


export function truncateLeadMessage(message: string) {
  if (message.length <= leadMessageMaxLength) {
    return message;
  }

  return `${message.slice(0, leadMessageMaxLength - 3)}...`;
}


export function buildLeadPayload(submission: Record<string, unknown>) {
  const locale = getText(submission, "locale") || "ar";
  const message = [
    "Wkil waitlist submission",
    `WhatsApp: ${getText(submission, "whatsapp")}`,
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

export function getText(payload: Record<string, unknown>, field: string) {
  const value = payload[field];

  return typeof value === "string" ? value.trim() : "";
}
