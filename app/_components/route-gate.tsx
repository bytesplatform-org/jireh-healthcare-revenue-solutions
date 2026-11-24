"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Routes that bring their own chrome (the home page has its own header) and skip the site nav. */
const STANDALONE = ["/"];

/** Renders its children everywhere except on standalone routes. */
export function RouteGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (STANDALONE.includes(pathname)) return null;
  return <>{children}</>;
}
