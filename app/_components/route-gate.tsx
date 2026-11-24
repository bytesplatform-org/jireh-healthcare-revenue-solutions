"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Routes that bring their own chrome (e.g. the hero concept) and skip the site nav. */
const STANDALONE = ["/hero-concept"];

/** Renders its children everywhere except on standalone routes. */
export function RouteGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (STANDALONE.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;
  return <>{children}</>;
}
