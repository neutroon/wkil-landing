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

      <div className="preview-stage">
        <div className="conversation hero-workflow-preview">
          <div className="message customer demo-reveal">
            <span>{preview.customerLabel}</span>
            <p>{preview.customerMessage}</p>
          </div>

          <div className="agent-step demo-reveal">
            <Image
              src="/assets/wkil-mark.svg"
              alt={brand.markAlt}
              width={92}
              height={92}
            />
            <div>
              <strong>{preview.agentTitle}</strong>
              <p>{preview.agentText}</p>
            </div>
          </div>

          <div className="message agent demo-reveal">
            <span>{preview.replyLabel}</span>
            <p>{preview.replyMessage}</p>
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
