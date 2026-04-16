import type { Metadata, Viewport } from "next";
import { Patua_One, Arvo, Viga, Amatic_SC } from "next/font/google";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ServiceWorkerRegistrar } from "@/components/providers/ServiceWorkerRegistrar";
import { InstallPrompt } from "@/components/shared/InstallPrompt";
import "./globals.css";

const patuaOne = Patua_One({
  weight: "400",
  variable: "--font-brand",
  subsets: ["latin"],
  display: "swap",
});

const arvo = Arvo({
  weight: ["400", "700"],
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const viga = Viga({
  weight: "400",
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const amaticSC = Amatic_SC({
  weight: "700",
  variable: "--font-accent",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scooped — Discover Ice Cream",
  description:
    "Find ice cream shops, track flavors, and see what friends are scooping.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Scooped",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF7ED" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1030" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-flash: apply dark class synchronously before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("scooped:theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme:dark)").matches);if(d){document.documentElement.classList.add("dark");var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content","#1a1030")}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${patuaOne.variable} ${arvo.variable} ${viga.variable} ${amaticSC.variable} font-body antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>
              <ServiceWorkerRegistrar />
              {children}
              <InstallPrompt />
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
