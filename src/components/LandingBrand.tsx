import Image from "next/image";

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
      <span className="brand-wordmark" aria-hidden="true">
        <span className="brand-arabic">كيل</span>
        <span className="brand-latin">wkil.app</span>
      </span>
    </>
  );
}
