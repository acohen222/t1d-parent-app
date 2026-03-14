import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SugarWise — T1D Parent Companion",
  description: "SugarWise: A warm, supportive companion for families navigating Type 1 Diabetes — one moment at a time.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1A5FA8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ background: "var(--color-frost)" }}>
        {children}
      </body>
    </html>
  );
}
