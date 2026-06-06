import Image from "next/image";
import type { LandingCopy } from "@/types/landing";

type PreviewCopy = LandingCopy["preview"];
type BrandCopy = LandingCopy["brand"];

interface LandingProductPreviewProps {
  brand: BrandCopy;
  preview: PreviewCopy;
}

export function LandingProductPreview({
  brand,
  preview,
}: LandingProductPreviewProps) {
  return (
    <section className="product-card" aria-label={preview.ariaLabel}>
      <div className="product-card-top">
        <div>
          <strong>{preview.status}</strong>
        </div>
        <span className="preview-mode-chip">{preview.label}</span>
      </div>

      <div className="preview-stage operations-preview">
        <div className="ops-signal demo-reveal">
          <span>{preview.customerLabel}</span>
          <strong>{preview.customerMessage}</strong>
        </div>

        <div className="ops-center demo-reveal">
          <div className="ops-mark">
            <Image
              src="/assets/wkil-mark.svg"
              alt={brand.markAlt}
              width={72}
              height={72}
            />
          </div>
          <div>
            <span>{preview.agentTitle}</span>
            <p>{preview.agentText}</p>
          </div>
        </div>

        <div className="ops-board demo-reveal">
          <span>{preview.replyLabel}</span>
          <p>{preview.replyMessage}</p>
          <div className="ops-progress" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="result-strip demo-reveal">
          {preview.results.map((result) => (
            <article className="result-card" key={result.title}>
              <span>{result.title}</span>
              <strong>{result.text}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
