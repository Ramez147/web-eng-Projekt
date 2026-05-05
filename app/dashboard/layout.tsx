"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  CreditCard,
  Download,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { DashboardSettingsPanel } from "@/app/dashboard/settings-panel";
import { LogoutButton } from "./logout-button";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "settings">("dashboard");
  const [activeSection, setActiveSection] = useState<
    "dashboard" | "analytics" | "payments" | "customers" | "export" | "settings"
  >("dashboard");

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
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const syncViewportState = (isDesktop: boolean) => {
      setIsDesktopViewport(isDesktop);
      setIsSidebarOpen(isDesktop);
    };

    syncViewportState(mediaQuery.matches);

    const handleViewportChange = (event: MediaQueryListEvent) => {
      syncViewportState(event.matches);
    };

    mediaQuery.addEventListener("change", handleViewportChange);

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

  useEffect(() => {
    const scope = scopeRef.current;

    if (!scope || activeTab !== "dashboard") {
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
  }, [activeTab]);

  const primaryNavItems: Array<{
    key: "dashboard" | "analytics" | "payments" | "customers" | "export";
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "payments", label: "Payments", icon: CreditCard },
    { key: "customers", label: "Customers", icon: Users },
    { key: "export", label: "Export", icon: Download },
  ];

  const scrollToSection = (sectionId: string) => {
    const scope = scopeRef.current;
    const section = document.getElementById(sectionId);

    if (!scope || !section) {
      return;
    }

    const targetTop = section.offsetTop;
    scope.scrollTo({
      top: Math.max(0, targetTop - 12),
      behavior: "smooth",
    });
  };

  const handleNavigate = (target: "dashboard" | "analytics" | "payments" | "customers" | "export" | "settings") => {
    setActiveSection(target);
    if (target === "settings") {
      setActiveTab("settings");
      if (!isDesktopViewport) {
        setIsSidebarOpen(false);
      }
      return;
    }

    setActiveTab("dashboard");
    if (!isDesktopViewport) {
      setIsSidebarOpen(false);
    }

    const sectionIdByTarget: Record<"dashboard" | "analytics" | "payments" | "customers" | "export", string> = {
      dashboard: "dashboard-top",
      analytics: "dashboard-analytics",
      payments: "dashboard-payments",
      customers: "dashboard-customers",
      export: "dashboard-export",
    };

    const targetSectionId = sectionIdByTarget[target];

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        scrollToSection(targetSectionId);
      });
    });
  };

  const navButtonClasses = (isActive: boolean) =>
    [
      "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
      isActive
        ? "bg-slate-900/80 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]"
        : "text-slate-300 hover:bg-slate-900/70 hover:text-white",
      "before:absolute before:bottom-2 before:left-0 before:top-2 before:w-0.5 before:rounded-full before:content-['']",
      isActive
        ? "before:bg-gradient-to-b before:from-cyan-400 before:to-violet-400"
        : "before:bg-transparent group-hover:before:bg-cyan-400/60",
    ].join(" ");

  return (
    <div className="relative flex h-screen bg-[#020202] text-slate-100">
      <div
        className={[
          "fixed inset-0 z-30 bg-black/70 transition-opacity md:hidden",
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => {
          setIsSidebarOpen(false);
        }}
      />

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800 bg-[#050505] transition-transform duration-300 md:z-30",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="border-b border-slate-800 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Loyalty</p>
          <p className="mt-1 text-lg font-semibold text-white">Control Center</p>
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1.5">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.key;

              return (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => {
                      handleNavigate(item.key);
                    }}
                    className={navButtonClasses(isActive)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-2 border-t border-slate-800 px-3 py-4">
          <button
            type="button"
            onClick={() => {
              handleNavigate("settings");
            }}
            className={navButtonClasses(activeSection === "settings")}
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <LogoutButton className="w-full justify-center border border-slate-700 bg-[#0b0b0b] text-slate-100 hover:border-cyan-400/50 hover:bg-slate-900" />
        </div>
      </aside>

      <section
        className={[
          "flex min-w-0 flex-1 flex-col transition-[padding] duration-300",
          isDesktopViewport && isSidebarOpen ? "md:pl-72" : "md:pl-0",
        ].join(" ")}
      >
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-[#050505]/95 px-4 py-3 backdrop-blur">
          <button
            type="button"
            onClick={() => {
              setIsSidebarOpen((previous) => !previous);
            }}
            className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-[#0b0b0b] p-2 text-slate-200"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <p className="text-sm font-semibold tracking-wide text-slate-200">Dashboard Navigation</p>
          <div className="h-9 w-9" />
        </header>

        <div ref={scopeRef} className="flex-1 overflow-y-auto">
          {activeTab === "settings" ? <DashboardSettingsPanel /> : children}
        </div>
      </section>
    </div>
  );
}
