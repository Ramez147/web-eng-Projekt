"use client";

import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  Building2,
  Download,
  Gauge,
  LineChart,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { generateApiKey } from "./actions";

type RegisterResponse = {
  organization: {
    id: string;
    name: string;
    pointsRatio: number;
  };
  apiKey: string;
};

type AnalyticsResponse = {
  membership: {
    userId: string;
    role: "admin" | "member";
  };
  organization: {
    id: string;
    name: string;
    pointsRatio: number;
  };
  analytics: {
    customersCount: number;
    totalTransactions: number;
    totalRevenueEur: number;
    pointsHistoryByDay: Record<string, { earn: number; redeem: number }>;
    history: Array<{
      id: string;
      type: "earn" | "redeem";
      points: number;
      eurAmount: number;
      createdAt: string;
      externalCustomerId: string;
    }>;
  };
};

type ProfilesResponse = {
  organizationId: string;
  profiles: Array<{
    id: string;
    externalCustomerId: string;
    pointsBalance: number;
    totalSpentEur: number;
    createdAt: string;
  }>;
};

type ErrorResponse = { error: string };

type MembershipListResponse = {
  memberships: Array<{
    userId: string;
    email: string | null;
    role: "admin" | "member";
    createdAt: string;
  }>;
};

function hasError(response: unknown): response is ErrorResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "error" in response &&
    typeof (response as { error: unknown }).error === "string"
  );
}

export function LoyaltyConsole({ compact = false }: { compact?: boolean }) {
  const [organizationName, setOrganizationName] = useState("");
  const [pointsRatio, setPointsRatio] = useState("10");
  const [status, setStatus] = useState<string | null>(null);
  const [latestApiKey, setLatestApiKey] = useState<string>("");
  const [isGeneratingApiKey, setIsGeneratingApiKey] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [profiles, setProfiles] = useState<ProfilesResponse["profiles"]>([]);

  // Auth states
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authError, setAuthError] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [needsOrganizationSetup, setNeedsOrganizationSetup] = useState(false);
  const [memberships, setMemberships] = useState<MembershipListResponse["memberships"]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [isAssigningMember, setIsAssigningMember] = useState(false);
  const [alertsTimeframe, setAlertsTimeframe] = useState<"7d" | "14d" | "30d" | "all">("7d");

  const orderedHistoryDays = useMemo(() => {
    if (!analytics) {
      return [] as Array<[string, { earn: number; redeem: number }]>;
    }

    return Object.entries(analytics.analytics.pointsHistoryByDay).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
  }, [analytics]);

  const pointsSummary = useMemo(() => {
    if (!analytics) {
      return { earned: 0, redeemed: 0 };
    }

    return analytics.analytics.history.reduce(
      (acc, tx) => {
        if (tx.type === "earn") {
          acc.earned += tx.points;
        } else {
          acc.redeemed += tx.points;
        }

        return acc;
      },
      { earned: 0, redeemed: 0 }
    );
  }, [analytics]);

  const topCustomers = useMemo(() => {
    return [...profiles]
      .sort((left, right) => {
        if (right.totalSpentEur !== left.totalSpentEur) {
          return right.totalSpentEur - left.totalSpentEur;
        }

        if (right.pointsBalance !== left.pointsBalance) {
          return right.pointsBalance - left.pointsBalance;
        }

        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      })
      .slice(0, 5);
  }, [profiles]);

  const activityWindow = useMemo(() => {
    if (!analytics) {
      return null;
    }

    const now = new Date();
    let windowDays = 7;
    if (alertsTimeframe === "14d") {
      windowDays = 14;
    } else if (alertsTimeframe === "30d") {
      windowDays = 30;
    } else if (alertsTimeframe === "all") {
      windowDays = Infinity;
    }

    const lastWindowStart = new Date(now);
    lastWindowStart.setDate(lastWindowStart.getDate() - windowDays);
    const prevWindowStart = new Date(now);
    prevWindowStart.setDate(prevWindowStart.getDate() - windowDays * 2);

    const lastWindow = analytics.analytics.history.filter((tx) => {
      const createdAt = new Date(tx.createdAt);
      return createdAt >= lastWindowStart;
    });

    const previousWindow = analytics.analytics.history.filter((tx) => {
      const createdAt = new Date(tx.createdAt);
      return createdAt >= prevWindowStart && createdAt < lastWindowStart;
    });

    const reduceRevenue = (items: AnalyticsResponse["analytics"]["history"]) =>
      items.reduce((sum, tx) => sum + tx.eurAmount, 0);

    const reduceEarnPoints = (items: AnalyticsResponse["analytics"]["history"]) =>
      items.reduce((sum, tx) => sum + (tx.type === "earn" ? tx.points : 0), 0);

    const reduceRedeemPoints = (items: AnalyticsResponse["analytics"]["history"]) =>
      items.reduce((sum, tx) => sum + (tx.type === "redeem" ? tx.points : 0), 0);

    const countUniqueCustomers = (items: AnalyticsResponse["analytics"]["history"]) =>
      new Set(items.map((tx) => tx.externalCustomerId)).size;

    return {
      lastWindow,
      previousWindow,
      revenueLastWindow: reduceRevenue(lastWindow),
      revenuePreviousWindow: reduceRevenue(previousWindow),
      earnPointsLastWindow: reduceEarnPoints(lastWindow),
      redeemPointsLastWindow: reduceRedeemPoints(lastWindow),
      activeCustomersLastWindow: countUniqueCustomers(lastWindow),
      activeCustomersPreviousWindow: countUniqueCustomers(previousWindow),
      windowLabel: alertsTimeframe === "all" ? "Alle Daten" : `${windowDays}d`,
    };
  }, [analytics, alertsTimeframe]);

  const dashboardAlerts = useMemo(() => {
    if (!analytics) {
      return [] as Array<{ tone: "info" | "warning" | "success"; title: string; body: string }>;
    }

    const alerts: Array<{ tone: "info" | "warning" | "success"; title: string; body: string }> = [];
    const revenueShare =
      analytics.analytics.totalRevenueEur > 0 && topCustomers[0]
        ? (topCustomers[0].totalSpentEur / analytics.analytics.totalRevenueEur) * 100
        : 0;

    if (activityWindow) {
      const revenueChange =
        activityWindow.revenuePreviousWindow === 0
          ? activityWindow.revenueLastWindow > 0
            ? 100
            : 0
          : ((activityWindow.revenueLastWindow - activityWindow.revenuePreviousWindow) /
              activityWindow.revenuePreviousWindow) * 100;

      const customerChange =
        activityWindow.activeCustomersPreviousWindow === 0
          ? activityWindow.activeCustomersLastWindow > 0
            ? 100
            : 0
          : ((activityWindow.activeCustomersLastWindow - activityWindow.activeCustomersPreviousWindow) /
              activityWindow.activeCustomersPreviousWindow) * 100;

      if (activityWindow.lastWindow.length === 0) {
        alerts.push({
          tone: "warning",
          title: `Keine Aktivität in ${activityWindow.windowLabel}`,
          body: "Es gab in diesem Zeitraum keine Transaktionen. Prüfe Kampagnen, API-Clients oder Segmentierung.",
        });
      } else {
        alerts.push({
          tone: revenueChange >= 15 ? "success" : revenueChange <= -15 ? "warning" : "info",
          title: `Trend Umsatz (${activityWindow.windowLabel})`,
          body:
            activityWindow.revenuePreviousWindow === 0
              ? `Im letzten Fenster wurden ${activityWindow.revenueLastWindow.toFixed(2)} EUR erfasst.`
              : `Umsatz ${revenueChange >= 0 ? "gestiegen" : "gefallen"} um ${Math.abs(Math.round(revenueChange))}% gegenüber der Vorperiode.`,
        });

        alerts.push({
          tone: customerChange >= 15 ? "success" : customerChange <= -15 ? "warning" : "info",
          title: `Trend aktive Kunden (${activityWindow.windowLabel})`,
          body:
            activityWindow.activeCustomersPreviousWindow === 0
              ? `${activityWindow.activeCustomersLastWindow} aktive Kunden im letzten Fenster.`
              : `Aktive Kunden ${customerChange >= 0 ? "gestiegen" : "gefallen"} um ${Math.abs(Math.round(customerChange))}% zur Vorperiode.`,
        });
      }
    }

    if (profiles.length === 0) {
      alerts.push({
        tone: "warning",
        title: "Noch keine Kundenprofile",
        body: "Sobald neue Kunden gesammelt werden, erscheinen hier die Top-Kunden und Umsatzmuster.",
      });
    }

    if (analytics.analytics.totalTransactions === 0) {
      alerts.push({
        tone: "warning",
        title: "Noch keine Transaktionen",
        body: "Sammel- und Redeem-Endpunkte sind aktiv, aber es liegen noch keine Bewegungen vor.",
      });
    }

    if (pointsSummary.earned > 0 && pointsSummary.redeemed === 0) {
      alerts.push({
        tone: "info",
        title: "Nur Earn-Aktivität",
        body: "Es wurden Punkte gesammelt, aber noch nichts eingelöst. Prüfe Kampagnen oder Redeem-Kommunikation.",
      });
    }

    if (pointsSummary.earned > 0 && pointsSummary.redeemed > pointsSummary.earned * 0.8) {
      alerts.push({
        tone: "warning",
        title: "Hoher Redeem-Anteil",
        body: "Ein großer Teil der Punkte wird bereits eingelöst. Das ist gut für Nutzung, kann aber auf hohe Kosten im Reward-Topf hinweisen.",
      });
    }

    if (revenueShare >= 45 && topCustomers.length > 0) {
      alerts.push({
        tone: "warning",
        title: "Stark konzentrierter Umsatz",
        body: `Der Top-Kunde macht rund ${Math.round(revenueShare)}% des Gesamtumsatzes aus. Ein breiterer Kundenmix wäre stabiler.`,
      });
    }

    if (analytics.analytics.totalRevenueEur >= 1000 && topCustomers.length > 0) {
      alerts.push({
        tone: "success",
        title: "Verlässliche Nutzung",
        body: `Die stärksten Kunden treiben bereits ${topCustomers.length} sichtbare Profile im aktuellen Snapshot an.`,
      });
    }

    return alerts.slice(0, 5);
  }, [analytics, activityWindow, pointsSummary.earned, pointsSummary.redeemed, profiles.length, topCustomers]);

  function downloadDashboardSnapshot(format: "json" | "csv") {
    if (!analytics) {
      setStatus("Es sind noch keine Dashboard-Daten zum Export vorhanden.");
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const baseName = `loyalty-dashboard-${timestamp}`;

    if (format === "json") {
      const payload = {
        organization: analytics.organization,
        analytics: analytics.analytics,
        profiles,
        topCustomers,
        alerts: dashboardAlerts,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${baseName}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatus("Dashboard-Snapshot als JSON exportiert.");
      return;
    }

    const header = ["customer_id", "points_balance", "total_spent_eur", "created_at"];
    const rows = profiles.map((profile) => [
      profile.externalCustomerId,
      String(profile.pointsBalance),
      profile.totalSpentEur.toFixed(2),
      profile.createdAt,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${baseName}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus("Customer-Profiles als CSV exportiert.");
  }

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError("");
    setIsAuthSubmitting(true);

    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError("Email und Passwort sind erforderlich.");
      setIsAuthSubmitting(false);
      return;
    }

    try {
      const endpoint = authMode === "signin" ? "/api/auth/signin" : "/api/auth/signup";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: authEmail,
          password: authPassword,
        }),
      });

      const result = (await response.json()) as
        | { user?: unknown; session?: unknown; error?: string }
        | undefined;

      if (!response.ok) {
        setAuthError(result?.error ?? "Authentifizierung fehlgeschlagen.");
        setIsAuthSubmitting(false);
        return;
      }

      setAuthEmail("");
      setAuthPassword("");
      setAuthError("");
      
      // Wait a moment for cookies to be set, then verify auth
      await new Promise(resolve => setTimeout(resolve, 200));
      
      try {
        const checkResponse = await fetch("/api/auth/session", {
          credentials: "include",
        });
        const sessionResult = (await checkResponse.json()) as { authenticated?: boolean };
        
        if (checkResponse.ok && sessionResult.authenticated) {
          setIsAuthenticated(true);
          await loadDashboardData();
        } else {
          setAuthError("Session-Authentifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.");
          setIsAuthSubmitting(false);
          return;
        }
      } catch {
        setAuthError("Netzwerkfehler bei der Authentifizierung.");
        setIsAuthSubmitting(false);
        return;
      }
    } catch {
      setAuthError("Netzwerkfehler. Bitte versuchen Sie es erneut.");
      setIsAuthSubmitting(false);
    }
  }

  const statusTone =
    status?.toLowerCase().includes("fehler") || status?.toLowerCase().includes("error")
      ? "error"
      : "info";

  const currentRole = analytics?.membership.role;
  const isAdmin = currentRole === "admin";
  const canCreateOrganization = isAdmin || needsOrganizationSetup;

  async function registerOrganization(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canCreateOrganization) {
      setStatus("Nur Admins dürfen Organisationen erstellen.");
      return;
    }

    setStatus("Erstelle Organisation...");

    try {
      const response = await fetch("/api/v1/organizations/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: organizationName,
          pointsRatio: Number(pointsRatio),
        }),
      });

      const data = (await response.json()) as RegisterResponse | ErrorResponse;

      if (!response.ok) {
        throw new Error(hasError(data) ? data.error : "Registration failed");
      }

      if (hasError(data)) {
        throw new Error(data.error);
      }

      setLatestApiKey(data.apiKey);
      setNeedsOrganizationSetup(false);
      setStatus("Organisation erstellt und als Admin-Mitglied zugewiesen.");
      await loadDashboardData();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Fehler bei der Registrierung");
    }
  }

  const loadMemberships = useCallback(async () => {
    const response = await fetch("/api/v1/dashboard/memberships", {
      credentials: "include",
    });

    const data = (await response.json()) as MembershipListResponse | ErrorResponse;

    if (!response.ok) {
      throw new Error(hasError(data) ? data.error : "Membership load failed");
    }

    if (hasError(data)) {
      throw new Error(data.error);
    }

    setMemberships(data.memberships);
  }, []);

  const loadDashboardData = useCallback(async () => {
    setStatus("Lade Dashboard-Daten...");

    try {
      const [analyticsResponse, profilesResponse] = await Promise.all([
        fetch("/api/v1/dashboard/analytics", { credentials: "include" }),
        fetch("/api/v1/dashboard/profiles", { credentials: "include" }),
      ]);

      const analyticsData = (await analyticsResponse.json()) as AnalyticsResponse | ErrorResponse;
      const profilesData = (await profilesResponse.json()) as ProfilesResponse | ErrorResponse;

      if (!analyticsResponse.ok) {
        throw new Error(hasError(analyticsData) ? analyticsData.error : "Analytics load failed");
      }

      if (!profilesResponse.ok) {
        throw new Error(hasError(profilesData) ? profilesData.error : "Profiles load failed");
      }

      if (hasError(analyticsData)) {
        throw new Error(analyticsData.error);
      }

      if (hasError(profilesData)) {
        throw new Error(profilesData.error);
      }

      setAnalytics(analyticsData);
      setProfiles(profilesData.profiles);
      setOrganizationName(analyticsData.organization.name);
      setPointsRatio(String(analyticsData.organization.pointsRatio));
      setNeedsOrganizationSetup(false);

      if (analyticsData.membership.role === "admin") {
        await loadMemberships();
      } else {
        setMemberships([]);
      }

      setStatus("Dashboard-Daten geladen.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Fehler beim Laden des Dashboards";

      if (
        message.toLowerCase().includes("no organization membership") ||
        message.toLowerCase().includes("forbidden")
      ) {
        setNeedsOrganizationSetup(true);
        setAnalytics(null);
        setProfiles([]);
        setStatus("Kein Unternehmen verbunden. Bitte zuerst eine Organisation erstellen.");
        return;
      }

      setStatus(message);
    }
  }, [loadMemberships]);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          credentials: "include",
        });
        const result = (await response.json()) as { authenticated?: boolean };

        if (response.ok && result.authenticated) {
          setIsAuthenticated(true);
          // Delay slightly to ensure cookies are fully set
          await new Promise((resolve) => setTimeout(resolve, 100));
          await loadDashboardData();
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [loadDashboardData]);

  async function updateRatio(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAdmin) {
      setStatus("Nur Admins dürfen die Ratio aktualisieren.");
      return;
    }

    setStatus("Aktualisiere Ratio...");

    try {
      const response = await fetch("/api/v1/dashboard/settings/ratio", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ pointsRatio: Number(pointsRatio) }),
      });

      const data = (await response.json()) as { pointsRatio: number } | ErrorResponse;

      if (!response.ok) {
        throw new Error(hasError(data) ? data.error : "Ratio update failed");
      }

      if (hasError(data)) {
        throw new Error(data.error);
      }

      setStatus(`Neue Ratio gespeichert: 1 EUR = ${data.pointsRatio} Punkte.`);
      await loadDashboardData();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Fehler beim Ratio-Update");
    }
  }

  async function assignMembership(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAdmin) {
      setStatus("Nur Admins dürfen User zuweisen.");
      return;
    }

    if (!inviteEmail.trim()) {
      setStatus("Bitte eine E-Mail-Adresse angeben.");
      return;
    }

    setIsAssigningMember(true);
    setStatus("Weise User zu...");

    try {
      const response = await fetch("/api/v1/dashboard/memberships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      const data = (await response.json()) as
        | { role: "admin" | "member"; email: string }
        | ErrorResponse;

      if (!response.ok) {
        throw new Error(hasError(data) ? data.error : "Membership assignment failed");
      }

      if (hasError(data)) {
        throw new Error(data.error);
      }

      setInviteEmail("");
      await loadMemberships();
      setStatus(`User ${data.email} wurde als ${data.role} zugewiesen.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Fehler bei der User-Zuweisung");
    } finally {
      setIsAssigningMember(false);
    }
  }

  async function regenerateApiKey() {
    if (!isAdmin || !analytics?.organization.id) {
      setStatus("Nur Admins dürfen API-Keys neu generieren.");
      return;
    }

    setIsGeneratingApiKey(true);
    setStatus("API-Key wird neu generiert...");

    try {
      const apiKey = await generateApiKey(analytics.organization.id);
      setLatestApiKey(apiKey);
      setStatus("API-Key wurde neu generiert und wird nur einmal angezeigt.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Fehler bei der API-Key-Generierung");
    } finally {
      setIsGeneratingApiKey(false);
    }
  }

  async function handleLogout() {
    setStatus("Melde ab...");

    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });

      const result = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? "Abmeldung fehlgeschlagen");
      }

      setAnalytics(null);
      setProfiles([]);
      setMemberships([]);
      setLatestApiKey("");
      setNeedsOrganizationSetup(false);
      setIsAuthenticated(false);
      setStatus("Erfolgreich abgemeldet.");
      window.location.assign("/");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Fehler bei der Abmeldung");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
      {isAuthenticated === false && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:max-w-md sm:mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Anmelden erforderlich
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Melden Sie sich an, um auf Ihr Loyalty Dashboard zuzugreifen.
          </p>

          <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="name@beispiel.de"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Passwort
              </label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-900"
              />
            </div>

            {authError && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isAuthSubmitting}
              className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-sky-600 dark:hover:bg-sky-500"
            >
              {isAuthSubmitting
                ? authMode === "signin"
                  ? "Anmeldung läuft..."
                  : "Registrierung läuft..."
                : authMode === "signin"
                  ? "Anmelden"
                  : "Registrieren"}
            </button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === "signin" ? "signup" : "signin");
                  setAuthError("");
                }}
                className="text-sky-600 hover:underline dark:text-sky-400"
              >
                {authMode === "signin"
                  ? "Noch kein Konto? Registrieren"
                  : "Schon ein Konto? Anmelden"}
              </button>
            </div>
          </form>
        </section>
      )}

      {isAuthenticated === null && (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          Authentifizierung wird überprüft...
        </section>
      )}

      {isAuthenticated === true && (
        <>
          {!compact ? (
            <section className="relative overflow-hidden rounded-3xl border border-sky-100 bg-linear-to-br from-white via-sky-50 to-cyan-100 p-6 shadow-sm md:p-8 dark:border-sky-900/60 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950/70">
              <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-cyan-300/20 blur-2xl dark:bg-cyan-400/10" />
              <div className="pointer-events-none absolute -bottom-20 left-8 h-44 w-44 rounded-full bg-sky-400/20 blur-2xl dark:bg-sky-500/10" />

              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="inline-flex items-center gap-2 rounded-full border border-sky-300/50 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:border-sky-800 dark:bg-slate-900/70 dark:text-sky-300">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Membership Scoped Dashboard
                  </p>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </button>
                </div>
                {currentRole ? (
                  <p className="mt-3 inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white dark:bg-slate-100 dark:text-slate-900">
                    Rolle: {currentRole}
                  </p>
                ) : null}
                <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-slate-100">
                  Multi-Tenant Dashboard
                </h1>
                <p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base dark:text-slate-300">
                  Daten werden automatisch über deine Membership geladen. Jeder Nutzer sieht nur die
                  eigene Organisation.
                </p>
              </div>
            </section>
          ) : null}

          {isAdmin ? (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                User zuweisen
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Weise registrierte User dieser Organisation als Member oder Admin zu.
              </p>

              <form onSubmit={assignMembership} className="mt-4 grid gap-3 md:grid-cols-[1.4fr,0.8fr,auto]">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  placeholder="user@beispiel.de"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-900"
                />
                <select
                  value={inviteRole}
                  onChange={(event) => setInviteRole(event.target.value as "admin" | "member")}
                  className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-900"
                >
                  <option value="member">member</option>
                  <option value="admin">admin</option>
                </select>
                <button
                  type="submit"
                  disabled={isAssigningMember}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-sky-600 dark:hover:bg-sky-500"
                >
                  {isAssigningMember ? "Speichern..." : "Zuweisen"}
                </button>
              </form>

              <div className="mt-5 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full min-w-170 border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <th className="px-3 py-3">E-Mail</th>
                      <th className="px-3 py-3">Rolle</th>
                      <th className="px-3 py-3">Seit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberships.map((item) => (
                      <tr
                        key={item.userId}
                        className="border-t border-slate-100 text-slate-700 dark:border-slate-800 dark:text-slate-300"
                      >
                        <td className="px-3 py-3 font-medium dark:text-slate-100">
                          {item.email ?? "(keine E-Mail)"}
                        </td>
                        <td className="px-3 py-3">{item.role}</td>
                        <td className="px-3 py-3">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          <section className="grid gap-5 lg:grid-cols-2">
            {canCreateOrganization ? (
              <form
                onSubmit={registerOrganization}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    <Building2 className="h-5 w-5 text-sky-700 dark:text-sky-400" />
                    Unternehmen registrieren
                  </h2>
                </div>

                <label className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Name
                </label>
                <input
                  value={organizationName}
                  onChange={(event) => setOrganizationName(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-900"
                  placeholder="ACME GmbH"
                />

                {analytics ? (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Verbundene Firma: {analytics.organization.name}
                  </p>
                ) : null}

                <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Punkte-Ratio (1 EUR = X Punkte)
                </label>
                <input
                  value={pointsRatio}
                  onChange={(event) => setPointsRatio(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-900"
                  type="number"
                  min="0.01"
                  step="0.01"
                />

                <button className="mt-6 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-sky-600 dark:hover:bg-sky-500">
                  Tenant erstellen
                </button>

                {latestApiKey ? (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
                    Neuer API-Key (nur hier sichtbar): {latestApiKey}
                  </div>
                ) : null}
              </form>
            ) : (
              <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Read-only Ansicht
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Du bist als Member angemeldet und kannst nur Dashboard-Daten ansehen.
                </p>
              </article>
            )}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                <Gauge className="h-5 w-5 text-sky-700 dark:text-sky-400" />
                Organization Settings
              </h2>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Nur Admin-Mitglieder dürfen die Punkte-Ratio anpassen.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={loadDashboardData}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
                >
                  <LineChart className="h-4 w-4" />
                  Dashboard neu laden
                </button>
              </div>

              <form
                onSubmit={updateRatio}
                className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-800"
              >
                {isAdmin ? (
                  <>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Ratio aktualisieren
                    </label>
                    <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                      <input
                        value={pointsRatio}
                        onChange={(event) => setPointsRatio(event.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
                        type="number"
                        min="0.01"
                        step="0.01"
                      />
                      <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500">
                        <RefreshCw className="h-4 w-4" />
                        Speichern
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Aktuelle Ratio: 1 EUR = {analytics?.organization.pointsRatio ?? "-"} Punkte
                  </p>
                )}
              </form>

              {isAdmin ? (
                <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-800">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        API-Key neu generieren
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        Der alte Key wird sofort ungültig. Der neue Klartext-Key wird nur einmal angezeigt.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={regenerateApiKey}
                      disabled={isGeneratingApiKey}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-amber-500 disabled:opacity-50"
                    >
                      {isGeneratingApiKey ? "Generiere..." : "API-Key neu generieren"}
                    </button>
                  </div>

                  {latestApiKey ? (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
                      <p className="font-medium">Neuer API-Key (nur hier sichtbar):</p>
                      <p className="mt-1 break-all font-mono text-[11px]">{latestApiKey}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </section>

          {status ? (
            <section
              className={`rounded-2xl border px-4 py-3 text-sm ${
                statusTone === "error"
                  ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
                  : "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300"
              }`}
            >
              {status}
            </section>
          ) : null}

          {analytics ? (
            <>
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <MetricCard
                  title="Kundenprofile"
                  value={String(analytics.analytics.customersCount)}
                  icon={<Users className="h-4 w-4 text-sky-700 dark:text-sky-400" />}
                />
                <MetricCard
                  title="Transaktionen"
                  value={String(analytics.analytics.totalTransactions)}
                  icon={<LineChart className="h-4 w-4 text-fuchsia-700 dark:text-fuchsia-400" />}
                />
                <MetricCard
                  title="Gesamtumsatz"
                  value={`${analytics.analytics.totalRevenueEur.toFixed(2)} EUR`}
                  icon={<Wallet className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />}
                />
                <MetricCard
                  title="Punkte Earn"
                  value={String(pointsSummary.earned)}
                  icon={<ArrowUpRight className="h-4 w-4 text-cyan-700 dark:text-cyan-400" />}
                />
                <MetricCard
                  title="Punkte Redeem"
                  value={String(pointsSummary.redeemed)}
                  icon={<ArrowDownLeft className="h-4 w-4 text-orange-700 dark:text-orange-400" />}
                />
              </section>

              <section className="grid gap-5 xl:grid-cols-[1.1fr,0.9fr]">
                <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Punkte-Historie pro Tag
                  </h3>
                  <div className="mt-4 space-y-2">
                    {orderedHistoryDays.length === 0 ? (
                      <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                        Noch keine Transaktionen vorhanden.
                      </p>
                    ) : (
                      orderedHistoryDays.map(([day, data]) => (
                        <div
                          key={day}
                          className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700"
                        >
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {day}
                          </p>
                          <div className="flex items-center gap-3 text-xs sm:text-sm">
                            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2.5 py-1 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300">
                              <ArrowUpRight className="h-3.5 w-3.5" />
                              {data.earn}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300">
                              <ArrowDownLeft className="h-3.5 w-3.5" />
                              {data.redeem}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Top-Kunden
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        Sortiert nach Umsatz, danach nach Punktestand.
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {topCustomers.length} sichtbar
                    </span>
                  </div>

                  <div className="mt-4 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full min-w-170 border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          <th className="px-3 py-3">#</th>
                          <th className="px-3 py-3">Kunde</th>
                          <th className="px-3 py-3">Punkte</th>
                          <th className="px-3 py-3">Umsatz</th>
                          <th className="px-3 py-3">Erstellt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topCustomers.length === 0 ? (
                          <tr>
                            <td
                              className="px-3 py-6 text-center text-slate-500 dark:text-slate-400"
                              colSpan={5}
                            >
                              Noch keine Kundendaten vorhanden.
                            </td>
                          </tr>
                        ) : (
                          topCustomers.map((profile, index) => (
                            <tr
                              key={profile.id}
                              className="border-t border-slate-100 text-slate-700 dark:border-slate-800 dark:text-slate-300"
                            >
                              <td className="px-3 py-3 font-medium text-slate-500 dark:text-slate-400">
                                {index + 1}
                              </td>
                              <td className="px-3 py-3 font-medium dark:text-slate-100">
                                {profile.externalCustomerId}
                              </td>
                              <td className="px-3 py-3">{profile.pointsBalance}</td>
                              <td className="px-3 py-3">{profile.totalSpentEur.toFixed(2)} EUR</td>
                              <td className="px-3 py-3">
                                {new Date(profile.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </article>
              </section>

              <section className="grid gap-5 xl:grid-cols-[0.95fr,1.05fr]">
                <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Hinweise
                      </h3>
                    </div>
                    <div className="inline-flex gap-1 rounded-lg border border-slate-300 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-900">
                      {(["7d", "14d", "30d", "all"] as const).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setAlertsTimeframe(option)}
                          className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                            alertsTimeframe === option
                              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                          }`}
                        >
                          {option === "all" ? "Alle" : option}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {dashboardAlerts.length === 0 ? (
                      <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                        Keine Auffälligkeiten im aktuellen Datensatz.
                      </p>
                    ) : (
                      dashboardAlerts.map((alert) => (
                        <div
                          key={alert.title}
                          className={`rounded-xl border px-4 py-3 text-sm ${
                            alert.tone === "warning"
                              ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                              : alert.tone === "success"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300"
                          }`}
                        >
                          <p className="font-semibold">{alert.title}</p>
                          <p className="mt-1 leading-6">{alert.body}</p>
                        </div>
                      ))
                    )}
                  </div>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-sky-700 dark:text-sky-400" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Export
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Lade den aktuellen Stand als JSON-Snapshot oder Kundendaten als CSV herunter.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => downloadDashboardSnapshot("json")}
                      className="inline-flex items-center gap-2 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
                    >
                      JSON exportieren
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadDashboardSnapshot("csv")}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                    >
                      CSV exportieren
                    </button>
                  </div>
                </article>
              </section>
            </>
          ) : (
            <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              Noch keine Analytics geladen. Melde dich an und lade dann dein Dashboard.
            </section>
          )}
        </>
      )}
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-slate-600 dark:text-slate-400">{title}</p>
        {icon}
      </div>
      <p className="mt-2 text-xl font-semibold text-slate-900 md:text-2xl dark:text-slate-100">
        {value}
      </p>
    </article>
  );
}
