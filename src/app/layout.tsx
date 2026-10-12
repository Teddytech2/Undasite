import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TEDDY AI Studio",
  description: "Build websites with AI, manage bot projects, and prepare deployments."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
