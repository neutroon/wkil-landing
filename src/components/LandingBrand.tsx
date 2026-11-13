import Image from "next/image";

/** Same lockup as the dashboard: the mark plus the Arabic wordmark in both locales. */
export function LandingBrand() {
  return (
    <>
      <Image
        className="brand-mark"
        src="/assets/wkil-mark.svg"
        alt=""
        width={92}
        height={92}
        priority
      />
      <span className="brand-word" aria-hidden="true" lang="ar" dir="rtl">
        وكيل
      </span>
    </>
  );
}
