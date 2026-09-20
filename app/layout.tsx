import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { APP_NAME, APP_SUBTITLE, APP_DESCRIPTION } from "@/lib/config/app";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: `${APP_NAME} — ${APP_SUBTITLE}`,
  description: APP_DESCRIPTION,
  keywords: [
    "Resume Analyzer",
    "Job Description Match",
    "Skill Gap Analysis",
    "Explainable AI",
    "Privacy Resume Tool",
    "JDAlign",
  ],
  authors: [{ name: "JDAlign Team" }],
  openGraph: {
    title: `${APP_NAME} — ${APP_SUBTITLE}`,
    description: APP_DESCRIPTION,
    url: "https://jdalign.vercel.app",
    siteName: APP_NAME,
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — ${APP_SUBTITLE}`,
    description: APP_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
