"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { LandingCopy } from "@/types/landing";

type PreviewCopy = LandingCopy["preview"];
type BrandCopy = LandingCopy["brand"];
type DemoStep = 0 | 1 | 2 | 3 | 4;

interface LandingProductPreviewProps {
  brand: BrandCopy;
  preview: PreviewCopy;
}

export function LandingProductPreview({
  brand,
  preview,
}: LandingProductPreviewProps) {
  const [activePromptIndex, setActivePromptIndex] = useState<number | null>(
    null,
  );
  const [demoStep, setDemoStep] = useState<DemoStep>(0);
  const [demoRunId, setDemoRunId] = useState(0);
  const previewStageRef = useRef<HTMLDivElement>(null);

  const activePrompt =
    activePromptIndex === null
      ? undefined
      : preview.demo.prompts[activePromptIndex];

  const conversation = activePrompt
    ? {
        customerMessage: activePrompt.customerMessage,
        replyMessage: activePrompt.replyMessage,
      }
    : undefined;

  const results = activePrompt?.results;
  const agentReviewText = activePrompt?.agentText?.trim() || preview.agentText;
  const showCustomerMessage = demoStep >= 1;
  const showAgentReview = demoStep >= 2;
  const showAgentReply = demoStep >= 3;
  const showResults = demoStep >= 4;
  const isProcessing = demoStep === 2;

  useEffect(() => {
    if (activePromptIndex === null) {
      return undefined;
    }

    setDemoStep(1);

    const timers = [
      window.setTimeout(() => setDemoStep(2), 520),
      window.setTimeout(() => setDemoStep(3), 2200),
      window.setTimeout(() => setDemoStep(4), 2900),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [activePromptIndex, demoRunId]);

  useEffect(() => {
    if (activePromptIndex === null || demoStep === 0) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      const previewStage = previewStageRef.current;

      previewStage?.scrollTo({
        behavior: "smooth",
        top: previewStage.scrollHeight,
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activePromptIndex, demoStep]);

  const selectPrompt = (index: number) => {
    setActivePromptIndex(index);
    setDemoStep(1);
    setDemoRunId((currentId) => currentId + 1);
  };

  return (
    <section className="product-card" aria-label={preview.ariaLabel}>
      <div className="product-card-top">
        <div>
          <strong>{preview.demo.status}</strong>
        </div>
        <span className="preview-mode-chip">{preview.demo.label}</span>
      </div>

      <div className="preview-stage" ref={previewStageRef}>
        <div className="demo-prompt-panel">
          <span>{preview.demo.promptLabel}</span>
          <div
            className="demo-prompt-list"
            role="group"
            aria-label={preview.demo.promptLabel}
          >
            {preview.demo.prompts.map((prompt, index) => (
              <button
                type="button"
                key={prompt.title}
                aria-pressed={index === activePromptIndex}
                onClick={() => selectPrompt(index)}
              >
                {prompt.title}
              </button>
            ))}
          </div>
        </div>

        {conversation && (
          <>
            <div className="conversation" aria-live="polite">
              {showCustomerMessage && (
                <div className="message customer demo-reveal">
                  <span>{preview.customerLabel}</span>
                  <p>{conversation.customerMessage}</p>
                </div>
              )}

              {showAgentReview && (
                <div
                  className={`agent-step demo-reveal${isProcessing ? " is-processing" : ""}`}
                  aria-busy={isProcessing}
                >
                  <Image
                    src="/assets/wkil-mark.svg"
                    alt={brand.markAlt}
                    width={92}
                    height={92}
                  />
                  <div>
                    <strong>{preview.agentTitle}</strong>
                    <p>{agentReviewText}</p>
                    {isProcessing && (
                      <span className="processing-dots" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </span>
                    )}
                  </div>
                </div>
              )}

              {showAgentReply && (
                <div className="message agent demo-reveal">
                  <span>{preview.replyLabel}</span>
                  <p>{conversation.replyMessage}</p>
                </div>
              )}
            </div>

            {results && showResults && (
              <div className="result-strip demo-reveal">
                {results.map((result) => (
                  <article className="result-card" key={result.title}>
                    <span>{result.title}</span>
                    <strong>{result.text}</strong>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
