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
  return (
    <>
      <header className="site-header">
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
              scroll={false}
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
      <script
        dangerouslySetInnerHTML={{
          __html: `
(() => {
  const updateHeaderSurface = () => {
    document.querySelectorAll(".site-header").forEach((header) => {
      header.classList.toggle("is-scrolled", window.scrollY > 0);
    });
  };

  if (window.__wkilHeaderSurfaceReady) {
    updateHeaderSurface();
    return;
  }

  window.__wkilHeaderSurfaceReady = true;
  let animationFrame = 0;

  const scheduleUpdate = () => {
    if (animationFrame) {
      return;
    }

    animationFrame = window.requestAnimationFrame(() => {
      animationFrame = 0;
      updateHeaderSurface();
    });
  };

  updateHeaderSurface();
  window.addEventListener("scroll", updateHeaderSurface, { passive: true });
  window.addEventListener("pageshow", updateHeaderSurface);
  window.addEventListener("resize", updateHeaderSurface);

  new MutationObserver(scheduleUpdate).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
          `,
        }}
      />
    </>
  );
}
