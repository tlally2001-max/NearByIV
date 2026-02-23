import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "NearbyIV — Find Mobile IV Therapy Providers Near You",
    template: "%s | NearbyIV",
  },
  // Trigger deployment refresh
  description:
    "The most trusted directory of RN-led mobile IV therapy providers. Find verified concierge IV hydration, NAD+, GLP-1, and wellness treatments delivered to your home or office.",
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
  ],
  authors: [{ name: "NearbyIV" }],
  creator: "NearbyIV",
  publisher: "NearbyIV",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    siteName: "NearbyIV",
    title: "NearbyIV — Find Mobile IV Therapy Providers Near You",
    description:
      "The most trusted directory of RN-led mobile IV therapy providers. Verified quality, transparent pricing.",
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
      "The most trusted directory of RN-led mobile IV therapy providers. Verified quality, transparent pricing.",
    images: ["/iv-bag-default.jpg"],
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
