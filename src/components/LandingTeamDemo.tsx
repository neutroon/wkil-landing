"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { LandingCopy, LandingTeamMember } from "@/types/landing";
import { memberHue } from "./team-hues";

interface LandingTeamDemoProps {
  demo: LandingCopy["teamDemo"];
  members: LandingTeamMember[];
}

const STEP_DELAY_MS = 1100;

function hueStyle(key: string): CSSProperties {
  return { "--member-hue": memberHue(key) } as CSSProperties;
}

/**
 * A scripted example of the team chat: the owner asks, the manager hands the
 * request to an employee, and the result comes back. Nothing is sent anywhere.
 */
export function LandingTeamDemo({ demo, members }: LandingTeamDemoProps) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [shownSteps, setShownSteps] = useState(0);
  const [approved, setApproved] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const scenario = demo.scenarios[scenarioIndex];
  const lastShown = scenario.steps[shownSteps - 1];
  const waitingForApproval = Boolean(lastShown?.approval) && !approved;
  const isPlaying = shownSteps < scenario.steps.length && !waitingForApproval;
  const nextSpeaker = isPlaying ? scenario.steps[shownSteps].from : null;

  const nameOf = (key: string) =>
    members.find((member) => member.key === key)?.name ?? key;

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timer = window.setTimeout(
      () => setShownSteps((count) => count + 1),
      reduceMotion ? 0 : STEP_DELAY_MS,
    );

    return () => window.clearTimeout(timer);
  }, [isPlaying, shownSteps]);

  useEffect(() => {
    const log = logRef.current;

    log?.scrollTo({ top: log.scrollHeight });
  }, [shownSteps, approved]);

  const play = (index: number) => {
    setScenarioIndex(index);
    setShownSteps(0);
    setApproved(false);
  };

  return (
    <section className="team-chat" aria-label={demo.ariaLabel}>
      <div className="team-chat-head">
        <span>{demo.title}</span>
        <span className="example-tag">{demo.exampleTag}</span>
      </div>

      <div aria-live="polite" className="team-chat-log" ref={logRef}>
        <div className="team-message team-message-own">
          <span className="team-speaker">{demo.youLabel}</span>
          <p>{scenario.prompt}</p>
        </div>

        {scenario.steps.slice(0, shownSteps).map((step, index) => (
          <div
            className="team-message"
            key={`${scenarioIndex}-${index}`}
            style={hueStyle(step.from)}
          >
            <span className="team-speaker">
              <span className="member-dot" />
              {nameOf(step.from)}
            </span>
            <p>
              {step.mention ? (
                <span className="team-mention" style={hueStyle(step.mention)}>
                  @{nameOf(step.mention)}
                </span>
              ) : null}{" "}
              {step.text}
            </p>
            {step.tool ? <span className="team-tool">{step.tool}</span> : null}
            {step.approval ? (
              <div className="team-approval">
                <strong>{step.approval.title}</strong>
                <span>{step.approval.detail}</span>
                {approved ? (
                  <span className="team-approved">{demo.approved}</span>
                ) : (
                  <button
                    className="button button-primary button-small"
                    onClick={() => setApproved(true)}
                    type="button"
                  >
                    {demo.approve}
                  </button>
                )}
              </div>
            ) : null}
          </div>
        ))}

        {nextSpeaker ? (
          <div className="team-typing" style={hueStyle(nextSpeaker)}>
            <span className="member-dot" />
            <span>
              {nameOf(nextSpeaker)} {demo.typing}
            </span>
            <span className="typing-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </div>
        ) : null}
      </div>

      <div className="team-chat-prompts">
        <span>{demo.promptsLabel}</span>
        <div>
          {demo.scenarios.map((item, index) => (
            <button
              aria-pressed={index === scenarioIndex}
              key={item.label}
              onClick={() => play(index)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
