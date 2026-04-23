"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

// Pure utility functions
export function isValidMediaQuery(query: string): boolean {
  if (typeof query !== "string") return false;
  if (query.trim().length === 0) return false;
  return true;
}

export function getBreakpointQuery(breakpoint: number): string {
  if (typeof breakpoint !== "number" || breakpoint <= 0) {
    return "(max-width: 767px)";
  }
  return `(max-width: ${breakpoint - 1}px)`;
}

export function extractBreakpointValue(query: string): number | null {
  const match = query.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

export function isMediaQuerySupported(): boolean {
  if (typeof window === "undefined") return false;
  return typeof window.matchMedia === "function";
}

export function createMediaQueryListener(
  query: string,
  callback: (matches: boolean) => void
): () => void {
  if (!isMediaQuerySupported()) {
    return () => {};
  }

  const mediaQuery = window.matchMedia(query);
  const onChange = (e: MediaQueryListEvent | Event) => {
    if ("matches" in e) {
      callback(e.matches);
    }
  };

  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(mediaQuery.matches);

    onChange();
    mediaQuery.addEventListener("change", onChange);

    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
