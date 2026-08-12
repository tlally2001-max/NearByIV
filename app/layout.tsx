import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const defaultUrl = "https://nearbyiv.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Mobile IV Therapy Near Me | Hangover IV, NAD+, GLP-1 | NearbyIV",
    template: "%s | NearbyIV",
  },
  description:
    "A national directory of reviewed mobile IV therapy listings. Compare locations, services, ratings, and published directory evidence.",
  keywords: [
    "mobile IV therapy",
    "IV therapy near me",
    "concierge IV drip",
    "NAD+ therapy",
    "GLP-1 weight loss",
    "hangover IV",
    "mobile hydration",
    "RN IV therapy",
    "at-home IV therapy",
    "IV therapy directory",
  ],
  authors: [{ name: "NearbyIV" }],
  creator: "NearbyIV",
  publisher: "NearbyIV",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NearbyIV",
  },
  openGraph: {
    type: "website",
    siteName: "NearbyIV",
    title: "NearbyIV — Find Mobile IV Therapy Providers Near You",
    description:
      "Browse reviewed mobile IV therapy listings with transparent directory evidence.",
    url: defaultUrl,
    images: [
      {
        url: "/iv-bag-default.jpg",
        width: 1200,
        height: 630,
        alt: "NearbyIV — Mobile IV Therapy Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NearbyIV — Find Mobile IV Therapy Providers Near You",
    description:
      "Browse reviewed mobile IV therapy listings with transparent directory evidence.",
    images: ["/iv-bag-default.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-RHH8EB4R4Z" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-RHH8EB4R4Z');
        `}} />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
