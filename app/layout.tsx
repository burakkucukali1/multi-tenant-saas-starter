import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Multi-Tenant SaaS Starter",
  description: "Reusable SaaS foundation (scaffold)",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
