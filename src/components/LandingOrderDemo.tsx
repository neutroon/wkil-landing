"use client";

import { useEffect, useRef, useState } from "react";
import type { LandingCopy } from "@/types/landing";

type OrderStatus = "awaiting" | "confirmed" | "canceled";

interface LandingOrderDemoProps {
  demo: LandingCopy["orderDemo"];
}

/**
 * A worked example of the product's core loop: the customer answers the
 * confirmation message and the order row changes. Nothing is sent anywhere.
 */
export function LandingOrderDemo({ demo }: LandingOrderDemoProps) {
  const [status, setStatus] = useState<OrderStatus>("awaiting");
  const confirmRef = useRef<HTMLButtonElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);
  const shouldMoveFocus = useRef(false);

  // The pressed button becomes disabled, so focus has to move somewhere useful.
  useEffect(() => {
    if (!shouldMoveFocus.current) {
      return;
    }

    shouldMoveFocus.current = false;
    (status === "awaiting" ? confirmRef : resetRef).current?.focus({
      preventScroll: true,
    });
  }, [status]);

  const changeStatus = (nextStatus: OrderStatus) => {
    shouldMoveFocus.current = true;
    setStatus(nextStatus);
  };

  const hasAnswered = status !== "awaiting";

  return (
    <section className="demo-panel" aria-label={demo.ariaLabel}>
      <div className="demo-panel-head">
        <span>{demo.messageTitle}</span>
        <span className="demo-panel-tag">{demo.exampleTag}</span>
      </div>

      <div className="demo-panel-thread">
        <div className="order-bubble">
          <p className="order-bubble-text">{demo.message}</p>
          <div className="order-bubble-buttons">
            <button
              disabled={hasAnswered}
              onClick={() => changeStatus("confirmed")}
              ref={confirmRef}
              type="button"
            >
              {demo.confirmButton}
            </button>
            <button
              disabled={hasAnswered}
              onClick={() => changeStatus("canceled")}
              type="button"
            >
              {demo.cancelButton}
            </button>
          </div>
        </div>

        {hasAnswered ? (
          <>
            <p className="order-bubble order-bubble-own">
              {status === "confirmed" ? demo.confirmButton : demo.cancelButton}
            </p>
            <p className="order-bubble order-bubble-reply">
              {status === "confirmed" ? demo.confirmedReply : demo.canceledReply}
            </p>
          </>
        ) : null}
      </div>

      <div className="demo-orders">
        <div className="demo-orders-head">
          <span>{demo.ordersTitle}</span>
        </div>
        <div className="order-row">
          <div>
            <strong className="order-row-title">{demo.orderLabel}</strong>
            <span className="order-row-meta">
              <span>{demo.customer}</span>
              <span>{demo.total}</span>
            </span>
          </div>
          <span aria-live="polite" className={`status status-${status}`}>
            {demo.status[status]}
          </span>
        </div>
        {hasAnswered ? (
          <button
            className="demo-panel-reset"
            onClick={() => changeStatus("awaiting")}
            ref={resetRef}
            type="button"
          >
            {demo.reset}
          </button>
        ) : (
          <p className="demo-panel-hint">{demo.hint}</p>
        )}
      </div>
    </section>
  );
}
