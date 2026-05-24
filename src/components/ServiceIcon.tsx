import type { ServiceIconName } from "@/types/landing";

export function ServiceIcon({ name }: { name: ServiceIconName }) {
  if (name === "lead") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 12.2a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z" />
        <path d="M5.8 19c.8-2.7 3.1-4.2 6.2-4.2 1.3 0 2.5.3 3.4.8" />
        <path d="m15.7 18.2 1.7 1.8 3.2-3.8" />
      </svg>
    );
  }

  if (name === "content") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 5h9.2L19 8.8V19H6V5Z" />
        <path d="M15 5v4h4" />
        <path d="M9 12h6M9 15h4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 7.5C5 5.6 6.6 4 8.5 4h7C17.4 4 19 5.6 19 7.5v4.8c0 1.9-1.6 3.5-3.5 3.5h-2.7L9 19v-3.2h-.5C6.6 15.8 5 14.2 5 12.3V7.5Z" />
      <path d="M8.8 9h6.4M8.8 12h4.2" />
    </svg>
  );
}
