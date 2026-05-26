"use client";

import { useState, type FormEvent } from "react";
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
  teamSize: string;
  channels: string[];
  challenge: string;
}

const initialFormData: WaitlistFormData = {
  name: "",
  email: "",
  whatsapp: "",
  teamSize: "",
  channels: [],
  challenge: "",
};

export function LandingWaitlistForm({
  copy,
  locale,
}: LandingWaitlistFormProps) {
  const [formData, setFormData] = useState<WaitlistFormData>(initialFormData);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const updateField = (field: keyof WaitlistFormData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const toggleChannel = (value: string) => {
    setFormData((current) => {
      const channels = current.channels.includes(value)
        ? current.channels.filter((channel) => channel !== value)
        : [...current.channels, value];

      return {
        ...current,
        channels,
      };
    });
  };

  const isComplete = Boolean(
    formData.name.trim() &&
      formData.email.trim() &&
      formData.whatsapp.trim() &&
      formData.teamSize &&
      formData.channels.length > 0 &&
      formData.challenge,
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isComplete) {
      setStatus("error");
      setStatusMessage(copy.requiredText);
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

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
      setStatusMessage(copy.successText);
      setFormData(initialFormData);
    } catch {
      setStatus("error");
      setStatusMessage(copy.errorText);
    }
  };

  return (
    <form className="waitlist-form" onSubmit={handleSubmit}>
      <div className="waitlist-form-head">
        <strong>{copy.formTitle}</strong>
        <p>{copy.formText}</p>
      </div>

      <div className="waitlist-contact-grid">
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

        <label>
          <span>{copy.fields.teamSize}</span>
          <select
            name="teamSize"
            onChange={(event) => updateField("teamSize", event.target.value)}
            required
            value={formData.teamSize}
          >
            <option value="">{copy.fields.teamSize}</option>
            {copy.teamSizes.map((teamSize) => (
              <option key={teamSize.value} value={teamSize.value}>
                {teamSize.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="waitlist-choice-group">
        <legend>{copy.fields.channels}</legend>
        <div className="waitlist-options-grid">
          {copy.channels.map((channel) => (
            <label className="waitlist-option" key={channel.value}>
              <input
                checked={formData.channels.includes(channel.value)}
                name="channels"
                onChange={() => toggleChannel(channel.value)}
                type="checkbox"
                value={channel.value}
              />
              <span>{channel.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="waitlist-choice-group">
        <legend>{copy.fields.challenge}</legend>
        <div className="waitlist-options-grid challenge-grid">
          {copy.challenges.map((challenge) => (
            <label className="waitlist-option" key={challenge.value}>
              <input
                checked={formData.challenge === challenge.value}
                name="challenge"
                onChange={() => updateField("challenge", challenge.value)}
                required
                type="radio"
                value={challenge.value}
              />
              <span>{challenge.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="waitlist-form-bottom">
        <button
          className="primary-button"
          disabled={status === "submitting"}
          type="submit"
        >
          <span>{status === "submitting" ? copy.submitting : copy.submit}</span>
        </button>

        {statusMessage && (
          <p className={`waitlist-alert ${status}`}>{statusMessage}</p>
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
