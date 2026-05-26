"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";
import type { LandingCopy } from "@/types/landing";
import { LandingBrand } from "./LandingBrand";

interface LandingHeaderProps {
  alternateLocale: Locale;
  copy: Pick<LandingCopy, "brand" | "nav">;
  loginPath: string;
  waitlistPath: string;
}

export function LandingHeader({
  alternateLocale,
  copy,
  loginPath,
  waitlistPath,
}: LandingHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateHeaderSurface = () => {
      const nextIsScrolled = window.scrollY > 8;
      setIsScrolled((current) =>
        current === nextIsScrolled ? current : nextIsScrolled,
      );
    };

    updateHeaderSurface();
    window.addEventListener("scroll", updateHeaderSurface, { passive: true });

    return () => window.removeEventListener("scroll", updateHeaderSurface);
  }, []);

  return (
    <header className={`site-header${isScrolled ? " is-scrolled" : ""}`}>
      <nav className="nav-shell" aria-label={copy.nav.ariaLabel}>
        <a
          className="brand-link"
          href="#top"
          aria-label={copy.brand.logoAlt}
          dir="rtl"
        >
          <LandingBrand />
        </a>

        <div className="nav-links">
          <a href="#services">{copy.nav.services}</a>
          <a href="#workflow">{copy.nav.workflow}</a>
          <a href="#trust">{copy.nav.trust}</a>
        </div>

        <div className="nav-actions">
          <Link
            className="language-toggle"
            href="/"
            hrefLang={alternateLocale}
            locale={alternateLocale}
          >
            {copy.nav.switchLanguage}
          </Link>
          <a className="login-link" href={loginPath}>
            {copy.nav.login}
          </a>
          <a className="primary-button compact" href={waitlistPath}>
            <span>{copy.nav.startFree}</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
