import type { ReactNode } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multi-Tenant SaaS Starter",
  description: "Reusable SaaS foundation (scaffold)",
};

/** Locale-specific `<html lang>` lives in `app/[locale]/layout.tsx`. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
