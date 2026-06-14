import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "IncidentIQ — Smarter Incident Resolution",
  description:
    "AI-powered incident response platform with organizational memory. Powered by Claude AI. Used by SRE and DevOps teams at top-tier tech companies.",
  keywords: "incident management, SRE, DevOps, AI, incident response, postmortem",
  openGraph: {
    title: "IncidentIQ — Smarter Incident Resolution",
    description: "AI-powered incident response with organizational memory",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans bg-[#0A0F1E] text-white antialiased`}>
        <AuthProvider>
          {children}
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
