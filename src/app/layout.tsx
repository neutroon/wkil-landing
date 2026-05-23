import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "وكيل | wkil",
  description:
    "وكيل يساعد نشاطك يرد على الرسايل والتعليقات، يحفظ بيانات العملاء، ويجهز محتوى السوشيال من مكان واحد.",
  icons: {
    icon: "/assets/wkil-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" data-wkil-theme="nile">
      <body>{children}</body>
    </html>
  );
}
