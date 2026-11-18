"use client";

import { useEffect, useRef } from "react";

/*
 * The Wkil logo: the chat bubble is the letter و, followed by «كيل».
 * The letters are IBM Plex Sans Arabic Bold converted to outlines, so the logo
 * does not depend on a font loading. Geometry is in font units, baseline at 0.
 * The bubble is tucked under the kaf and drawn over the letters.
 */
const VIEW_BOX = "15 -772 2106 1197";
const LETTERS =
  "M316 240Q177 240 106 168.5Q35 97 35 -34Q35 -79 47.5 -135.5Q60 -192 82 -245L178 -217Q158 -174 146.5 -130Q135 -86 135 -54Q135 9 172.5 43.5Q210 78 276 78H356Q395 78 422 68.5Q449 59 465.5 37.5Q482 16 489.5 -18.5Q497 -53 497 -103V-740H617V-150H728V-30L698 0H609Q589 123 518 181.5Q447 240 316 240ZM698 -120 728 -150H758Q838 -150 838 -220V-363H948V-220Q948 -150 1018 -150H1058V-30L1028 0Q948 0 906.5 -32.5Q865 -65 851 -135H845Q831 -65 797 -32.5Q763 0 698 0ZM962 215Q936 215 919.5 199Q903 183 903 148Q903 113 919.5 97Q936 81 962 81H982Q1008 81 1024.5 97Q1041 113 1041 148Q1041 183 1024.5 199Q1008 215 982 215ZM804 215Q778 215 761.5 199Q745 183 745 148Q745 113 761.5 97Q778 81 804 81H824Q850 81 866.5 97Q883 113 883 148Q883 183 866.5 199Q850 215 824 215ZM1028 -120 1058 -150H1230Q1264 -150 1277 -157.5Q1290 -165 1290 -185Q1290 -203 1278 -216Q1266 -229 1229 -249L1068 -336V-600L1548 -752V-620L1118 -485V-479L1229 -417Q1274 -392 1305 -368.5Q1336 -345 1354.5 -320Q1373 -295 1381.5 -267.5Q1390 -240 1390 -206Q1390 -100 1343.5 -50Q1297 0 1190 0H1028Z";
const BUBBLE =
  "M48 13C64 13 78 25 80 43C82 60 72 74 56 80C49 83 40 84 30 84C38 80 44 76 48 72C35 71 24 63 21 50C17 33 30 17 48 13Z";
const BUBBLE_INNER =
  "M49 27C60 27 69 35 70 46C71 56 65 64 56 67C50 69 44.712 67.288 40 66C35.288 64.712 30.269 58.731 29 54C26 45 29 37 36 32C40 29 44 27 49 27Z";
const MARK_TRANSFORM =
  "translate(1288 -515.2) scale(11.9481) translate(-16 -10)";

/** How far the eyes can move, in the bubble's own units. */
const REACH = { x: 3.2, y: 2.6 };

export function LandingBrand() {
  const logoRef = useRef<SVGSVGElement>(null);

  // The eyes look toward the pointer. Without a pointer they only blink (see globals.css).
  useEffect(() => {
    const logo = logoRef.current;

    if (!logo || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;

    const look = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const eyes = logo.querySelector(".brand-eyes");

        if (!eyes) {
          return;
        }

        const box = eyes.getBoundingClientRect();
        const dx = event.clientX - (box.left + box.width / 2);
        const dy = event.clientY - (box.top + box.height / 2);
        const distance = Math.hypot(dx, dy) || 1;
        const pull = Math.min(1, distance / 160);

        logo.style.setProperty("--look-x", ((dx / distance) * REACH.x * pull).toFixed(2));
        logo.style.setProperty("--look-y", ((dy / distance) * REACH.y * pull).toFixed(2));
      });
    };

    const rest = () => {
      cancelAnimationFrame(frame);
      logo.style.removeProperty("--look-x");
      logo.style.removeProperty("--look-y");
    };

    window.addEventListener("pointermove", look, { passive: true });
    document.documentElement.addEventListener("pointerleave", rest);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", look);
      document.documentElement.removeEventListener("pointerleave", rest);
    };
  }, []);

  return (
    <svg
      aria-hidden="true"
      className="brand-logo"
      focusable="false"
      ref={logoRef}
      viewBox={VIEW_BOX}
    >
      <path className="brand-letters" d={LETTERS} />
      <g transform={MARK_TRANSFORM}>
        <path className="brand-bubble" d={BUBBLE} />
        <path className="brand-bubble-inner" d={BUBBLE_INNER} />
        <g className="brand-eyes">
          <circle className="brand-eye" cx="42.5" cy="47" r="4.9" />
          <circle className="brand-eye" cx="56.5" cy="47" r="4.9" />
        </g>
      </g>
    </svg>
  );
}
