"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import type { LandingCopy } from "@/types/landing";

type WaitlistCopy = LandingCopy["waitlist"];
type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface LandingWaitlistFormProps {
  copy: WaitlistCopy;
  locale: Locale;
}

interface WaitlistFormData {
  name: string;
  email: string;
  whatsapp: string;
}

const initialFormData: WaitlistFormData = {
  name: "",
  email: "",
  whatsapp: "",
};

export function LandingWaitlistForm({
  copy,
  locale,
}: LandingWaitlistFormProps) {
  const successRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<WaitlistFormData>(initialFormData);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    if (status !== "success" || !successRef.current) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      successRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [status]);

  const clearFeedback = () => {
    if (status === "error") {
      setStatus("idle");
      setFeedbackMessage("");
    }
  };

  const updateField = (field: keyof WaitlistFormData, value: string) => {
    clearFeedback();
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const isComplete = Boolean(
    formData.name.trim() &&
      formData.email.trim() &&
      formData.whatsapp.trim(),
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isComplete) {
      setStatus("error");
      setFeedbackMessage(copy.requiredText);
      return;
    }

    setStatus("submitting");
    setFeedbackMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          locale,
        }),
      });

      if (!response.ok) {
        throw new Error("Waitlist request failed");
      }

      setStatus("success");
      setFeedbackMessage("");
    } catch {
      setStatus("error");
      setFeedbackMessage(copy.errorText);
    }
  };

  const handleEditSubmission = () => {
    setStatus("idle");
    setFeedbackMessage("");
  };

  if (status === "success") {
    return (
      <div ref={successRef} aria-live="polite" className="waitlist-form">
        <div className="waitlist-success-panel">
          <span aria-hidden="true" className="waitlist-success-mark">
            ✓
          </span>
          <div>
            <strong>{copy.successTitle}</strong>
            <p>{copy.successText}</p>
          </div>
          <button
            className="secondary-button waitlist-edit-button"
            onClick={handleEditSubmission}
            type="button"
          >
            {copy.successAction}
          </button>
        </div>

        <div className="waitlist-trust-row">
          {copy.trust.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit}>
      <div className="waitlist-contact-grid waitlist-contact-grid-simple">
        <label>
          <span>{copy.fields.name}</span>
          <input
            autoComplete="name"
            name="name"
            onChange={(event) => updateField("name", event.target.value)}
            placeholder={copy.placeholders.name}
            required
            type="text"
            value={formData.name}
          />
        </label>

        <label>
          <span>{copy.fields.email}</span>
          <input
            autoComplete="email"
            inputMode="email"
            name="email"
            onChange={(event) => updateField("email", event.target.value)}
            placeholder={copy.placeholders.email}
            required
            type="email"
            value={formData.email}
          />
        </label>

        <label>
          <span>{copy.fields.whatsapp}</span>
          <input
            autoComplete="tel"
            inputMode="tel"
            name="whatsapp"
            onChange={(event) => updateField("whatsapp", event.target.value)}
            placeholder={copy.placeholders.whatsapp}
            required
            type="tel"
            value={formData.whatsapp}
          />
        </label>
      </div>

      <div className="waitlist-form-bottom">
        <button
          className="primary-button"
          disabled={status === "submitting"}
          type="submit"
        >
          <span>{status === "submitting" ? copy.submitting : copy.submit}</span>
        </button>

        {feedbackMessage && (
          <p className="waitlist-alert error">{feedbackMessage}</p>
        )}
      </div>

      <div className="waitlist-trust-row">
        {copy.trust.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </form>
  );
}
