import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mesivta Library",
  description: "Announcements, resources, and services from the Mesivta Library.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
