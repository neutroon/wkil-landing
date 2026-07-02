"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { LandingCopy } from "@/types/landing";

type ChatCopy = LandingCopy["chat"];
type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

interface LandingChatShowcaseProps {
  brand: LandingCopy["brand"];
  chat: ChatCopy;
  locale: Locale;
}

function createVisitorId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `wkil-demo-${crypto.randomUUID()}`;
  }

  return `wkil-demo-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

export function LandingChatShowcase({
  brand,
  chat,
  locale,
}: LandingChatShowcaseProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "initial",
      role: "assistant",
      text: chat.initialMessage,
    },
  ]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [visitorId, setVisitorId] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  const userMessageCount = useMemo(
    () => messages.filter((message) => message.role === "user").length,
    [messages],
  );

  useEffect(() => {
    const storedVisitorId = window.sessionStorage.getItem("wkil-demo-visitor-id");
    const nextVisitorId = storedVisitorId || createVisitorId();

    window.sessionStorage.setItem("wkil-demo-visitor-id", nextVisitorId);
    setVisitorId(nextVisitorId);
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({
      behavior: "smooth",
      top: logRef.current.scrollHeight,
    });
  }, [messages, isSending]);

  const sendMessage = async (rawMessage: string) => {
    const message = rawMessage.trim();

    if (!message || isSending || !visitorId) {
      return;
    }

    setInput("");
    setError("");
    setIsSending(true);
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `user-${Date.now()}`,
        role: "user",
        text: message,
      },
    ]);

    try {
      const response = await fetch("/api/demo-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          locale,
          message,
          visitorId,
        }),
      });

      const result = (await response.json()) as {
        conversationId?: number | null;
        error?: string;
        reply?: string;
      };

      const reply = result.reply;

      if (!response.ok || !reply) {
        throw new Error(result.error || "Demo chat failed");
      }

      setConversationId(result.conversationId ?? conversationId);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: reply,
        },
      ]);
    } catch {
      setError(chat.errorText);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  return (
    <section className="section chat-section" id="chat">
      <div className="content-shell chat-layout">
        <div className="section-heading chat-copy">
          <h2>{chat.title}</h2>
        </div>

        <div className="chat-panel" aria-label={chat.ariaLabel}>
          <div className="chat-panel-top">
            <div className="chat-agent-title">
              <Image
                src="/assets/wkil-mark.svg"
                alt={brand.markAlt}
                width={58}
                height={58}
              />
              <div>
                <strong>{chat.agentName}</strong>
                <span>{isSending ? chat.statusThinking : chat.statusReady}</span>
              </div>
            </div>
            <span className="chat-status-pill">
              <span aria-hidden="true" />
              {chat.liveLabel}
            </span>
          </div>

          <div className="chat-log" ref={logRef} aria-live="polite">
            {messages.map((message) => (
              <article
                className={`chat-message ${message.role}`}
                key={message.id}
              >
                <span>
                  {message.role === "assistant"
                    ? chat.assistantLabel
                    : chat.customerLabel}
                </span>
                <p>{message.text}</p>
              </article>
            ))}

            {isSending && (
              <div className="chat-thinking" aria-label={chat.statusThinking}>
                <span />
                <span />
                <span />
              </div>
            )}

            {userMessageCount >= 1 && (
              <div className="chat-inline-cta">
                <strong>{chat.ctaText}</strong>
                <a href="#waitlist">{chat.ctaButton}</a>
              </div>
            )}
          </div>

          <div className="chat-prompt-block">
            <span>{chat.promptLabel}</span>
            <div className="chat-prompt-list">
              {chat.prompts.map((prompt) => (
                <button
                  type="button"
                  key={prompt}
                  onClick={() => void sendMessage(prompt)}
                  disabled={isSending || !visitorId}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <form className="chat-form" onSubmit={handleSubmit}>
            <label>
              <span>{chat.inputLabel}</span>
              <input
                value={input}
                maxLength={800}
                onChange={(event) => setInput(event.target.value)}
                placeholder={chat.inputPlaceholder}
                disabled={isSending || !visitorId}
              />
            </label>
            <button
              type="submit"
              disabled={!input.trim() || isSending || !visitorId}
            >
              {isSending ? chat.sendingLabel : chat.sendLabel}
            </button>
          </form>

          {error && <p className="chat-error">{error}</p>}
        </div>
      </div>
    </section>
  );
}
