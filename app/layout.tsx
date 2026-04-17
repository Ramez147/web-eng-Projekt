import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Loyalty Engine Platform",
  description: "Multi-tenant B2B loyalty logic engine with API-first points transactions.",
};

const themeInitScript = `
(() => {
  const root = document.documentElement;
  const isDashboardRoute = window.location.pathname.startsWith("/dashboard");

  let resolvedTheme = isDashboardRoute
    ? "dark"
    : localStorage.getItem("vite-ui-theme") || "dark";

  if (resolvedTheme === "system") {
    resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  root.classList.remove("light", "dark");
  root.classList.add(resolvedTheme === "light" ? "light" : "dark");
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        {children}
      </body>
    </html>
  );
}
