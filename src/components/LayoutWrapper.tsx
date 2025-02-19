"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/ui/Header";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Routes that don't need the Header
  const excludedRoutes = ["/", "/cadastro", "/login"];

  return (
    <>
      {!excludedRoutes.includes(pathname) && <Header />}
      {children}
    </>
  );
}
