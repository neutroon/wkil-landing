import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";
import type { LandingCopy } from "@/types/landing";
import { LandingBrand } from "./LandingBrand";
import { LandingMobileMenu } from "./LandingMobileMenu";

interface LandingHeaderProps {
  alternateLocale: Locale;
  copy: Pick<LandingCopy, "brand" | "nav">;
  loginPath: string;
  signupPath: string;
}

export function LandingHeader({
  alternateLocale,
  copy,
  loginPath,
  signupPath,
}: LandingHeaderProps) {
  const sectionLinks = [
    { href: "#benefits", label: copy.nav.capabilities },
    { href: "#where", label: copy.nav.where },
    { href: "#chat", label: copy.nav.demo },
    { href: "#pricing", label: copy.nav.pricing },
  ];

  return (
    <header className="site-header">
      <div className="shell header-row">
        <a className="brand" href="#top" aria-label={copy.brand.logoAlt}>
          <LandingBrand />
        </a>

        <nav className="header-nav" aria-label={copy.nav.ariaLabel}>
          {sectionLinks.map((link) => (
            <a className="header-link" href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <Link
            className="header-link"
            href="/"
            hrefLang={alternateLocale}
            lang={alternateLocale}
            locale={alternateLocale}
            scroll={false}
          >
            {copy.nav.switchLanguage}
          </Link>
          <a className="header-link header-login" href={loginPath}>
            {copy.nav.login}
          </a>
          <a className="button button-secondary button-small header-cta" href={signupPath}>
            {copy.nav.startFree}
          </a>
          <LandingMobileMenu
            ariaLabel={copy.nav.ariaLabel}
            links={[...sectionLinks, { href: loginPath, label: copy.nav.login }]}
            menuLabel={copy.nav.menu}
          />
        </div>
      </div>
    </header>
  );
}
