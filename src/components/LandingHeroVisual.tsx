import Image from "next/image";
import type { LandingCopy } from "@/types/landing";

type HeroVisualCopy = LandingCopy["heroVisual"];
type BrandCopy = LandingCopy["brand"];

interface LandingHeroVisualProps {
  brand: BrandCopy;
  visual: HeroVisualCopy;
  customerLabel: string;
  assistantLabel: string;
}

export function LandingHeroVisual({
  brand,
  visual,
  customerLabel,
  assistantLabel,
}: LandingHeroVisualProps) {
  return (
    <div className="hero-visual" aria-label={visual.ariaLabel}>
      <div className="hero-visual-mark" aria-hidden="true">
        <Image
          src="/assets/wkil-mark.svg"
          alt=""
          width={48}
          height={48}
        />
      </div>

      <div className="hero-visual-thread">
        <article className="hero-visual-bubble customer">
          <span>{customerLabel}</span>
          <p>{visual.customerMessage}</p>
        </article>

        <article className="hero-visual-bubble assistant">
          <span>{assistantLabel}</span>
          <p>{visual.replyMessage}</p>
        </article>
      </div>
    </div>
  );
}
