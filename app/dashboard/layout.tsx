"use client";

import { useEffect, useRef } from "react";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;

    const hadLight = root.classList.contains("light");
    const hadDark = root.classList.contains("dark");

    root.classList.remove("light", "dark");
    root.classList.add("dark");

    return () => {
      root.classList.remove("dark");

      if (hadLight) {
        root.classList.add("light");
        return;
      }

      if (hadDark) {
        root.classList.add("dark");
      }
    };
  }, []);

  useEffect(() => {
    const scope = scopeRef.current;

    if (!scope) {
      return;
    }

    const widgetSelector = [
      "article[class*='rounded-'][class*='border']",
      "section[class*='rounded-'][class*='border']",
      "div[class*='rounded-'][class*='border']",
      "article[class*='rounded-'][class*='shadow-']",
      "section[class*='rounded-'][class*='shadow-']",
      "div[class*='rounded-'][class*='shadow-']",
      ".dashboard-widget-glow-target",
    ].join(",");

    const markWidgets = () => {
      const candidates = Array.from(scope.querySelectorAll<HTMLElement>(widgetSelector));

      candidates.forEach((widget) => {
        if (widget.closest("table")) {
          return;
        }

        // Only apply glow to top-level widget containers to avoid nested duplicate glows.
        const isNestedCandidate = candidates.some(
          (other) => other !== widget && other.contains(widget),
        );

        if (isNestedCandidate) {
          return;
        }

        widget.classList.add("dashboard-widget-glow");
      });
    };

    markWidgets();

    let activeWidget: HTMLElement | null = null;

    const clearActiveGlow = () => {
      if (!activeWidget) {
        return;
      }

      activeWidget.classList.remove("dashboard-widget-glow--active");
      activeWidget = null;
    };

    const updateGlowPosition = (widget: HTMLElement, clientX: number, clientY: number) => {
      const rect = widget.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

      widget.style.setProperty("--widget-glow-x", `${x}px`);
      widget.style.setProperty("--widget-glow-y", `${y}px`);
    };

    const handleCursorMove = (target: EventTarget | null, clientX: number, clientY: number) => {
      if (!(target instanceof Element)) {
        return;
      }

      const widget = target.closest<HTMLElement>(".dashboard-widget-glow");

      if (!widget) {
        clearActiveGlow();
        return;
      }

      if (activeWidget !== widget) {
        clearActiveGlow();
      }

      activeWidget = widget;
      widget.classList.add("dashboard-widget-glow--active");
      updateGlowPosition(widget, clientX, clientY);
    };

    const handlePointerMove = (event: PointerEvent) => {
      handleCursorMove(event.target, event.clientX, event.clientY);
    };

    const handleMouseMove = (event: MouseEvent) => {
      handleCursorMove(event.target, event.clientX, event.clientY);
    };

    const handlePointerLeave = () => {
      clearActiveGlow();
    };

    scope.addEventListener("pointermove", handlePointerMove);
    scope.addEventListener("mousemove", handleMouseMove);
    scope.addEventListener("pointerleave", handlePointerLeave);
    scope.addEventListener("mouseleave", handlePointerLeave);

    const observer = new MutationObserver(() => {
      markWidgets();
    });

    observer.observe(scope, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      scope.removeEventListener("pointermove", handlePointerMove);
      scope.removeEventListener("mousemove", handleMouseMove);
      scope.removeEventListener("pointerleave", handlePointerLeave);
      scope.removeEventListener("mouseleave", handlePointerLeave);

      clearActiveGlow();
    };
  }, []);

  return <div ref={scopeRef}>{children}</div>;
}
