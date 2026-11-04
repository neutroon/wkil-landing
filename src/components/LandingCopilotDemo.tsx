"use client";

import { useEffect, useRef, useState } from "react";
import type { LandingCopy } from "@/types/landing";

type Decision = "pending" | "allowed" | "denied";

interface LandingCopilotDemoProps {
  demo: LandingCopy["copilotDemo"];
}

/**
 * A worked example of how the dashboard chat behaves: the owner asks, Wkil
 * proposes the action and waits for approval. Nothing is sent anywhere.
 */
export function LandingCopilotDemo({ demo }: LandingCopilotDemoProps) {
  const [decision, setDecision] = useState<Decision>("pending");
  const allowRef = useRef<HTMLButtonElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);
  const shouldMoveFocus = useRef(false);

  // The pressed button disappears, so focus has to move somewhere useful.
  useEffect(() => {
    if (!shouldMoveFocus.current) {
      return;
    }

    shouldMoveFocus.current = false;
    (decision === "pending" ? allowRef : resetRef).current?.focus({
      preventScroll: true,
    });
  }, [decision]);

  const changeDecision = (nextDecision: Decision) => {
    shouldMoveFocus.current = true;
    setDecision(nextDecision);
  };

  return (
    <section className="demo-panel" aria-label={demo.ariaLabel}>
      <div className="demo-panel-head">
        <span>{demo.title}</span>
        <span className="demo-panel-tag">{demo.exampleTag}</span>
      </div>

      <div className="demo-panel-thread">
        <p className="order-bubble order-bubble-own">{demo.request}</p>
        <p className="order-bubble order-bubble-reply">{demo.reply}</p>

        <div className="copilot-action">
          <strong>{demo.actionTitle}</strong>
          <dl>
            {demo.details.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>

          {decision === "pending" ? (
            <div className="copilot-action-buttons">
              <button
                className="button button-small copilot-allow"
                onClick={() => changeDecision("allowed")}
                ref={allowRef}
                type="button"
              >
                {demo.allow}
              </button>
              <button
                className="button button-small button-secondary"
                onClick={() => changeDecision("denied")}
                type="button"
              >
                {demo.deny}
              </button>
            </div>
          ) : (
            <p aria-live="polite" className="copilot-result">
              {decision === "allowed" ? demo.allowedResult : demo.deniedResult}
            </p>
          )}
        </div>
      </div>

      <div className="demo-panel-foot">
        {decision === "pending" ? (
          <p className="demo-panel-hint">{demo.hint}</p>
        ) : (
          <button
            className="demo-panel-reset"
            onClick={() => changeDecision("pending")}
            ref={resetRef}
            type="button"
          >
            {demo.reset}
          </button>
        )}
      </div>
    </section>
  );
}
