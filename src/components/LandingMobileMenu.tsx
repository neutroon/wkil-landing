"use client";

import { useEffect, useRef } from "react";

interface LandingMobileMenuProps {
  ariaLabel: string;
  links: Array<{ href: string; label: string }>;
  menuLabel: string;
}

/**
 * Native <details> so the menu still opens without JavaScript. The script only
 * adds what <details> lacks: closing on link tap, Escape and an outside click.
 */
export function LandingMobileMenu({
  ariaLabel,
  links,
  menuLabel,
}: LandingMobileMenuProps) {
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const closeOnOutsidePress = (event: PointerEvent) => {
      const menu = menuRef.current;

      if (menu?.open && !menu.contains(event.target as Node)) {
        menu.open = false;
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      const menu = menuRef.current;

      if (event.key === "Escape" && menu?.open) {
        menu.open = false;
        menu.querySelector("summary")?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const close = () => {
    if (menuRef.current) {
      menuRef.current.open = false;
    }
  };

  return (
    <details className="mobile-menu" ref={menuRef}>
      <summary aria-label={menuLabel}>
        <svg
          aria-hidden="true"
          fill="none"
          focusable="false"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.75"
          viewBox="0 0 20 20"
        >
          <path d="M3.5 6h13M3.5 10h13M3.5 14h13" />
        </svg>
      </summary>
      <nav aria-label={ariaLabel} className="mobile-menu-panel">
        {links.map((link) => (
          <a href={link.href} key={link.href} onClick={close}>
            {link.label}
          </a>
        ))}
      </nav>
    </details>
  );
}
