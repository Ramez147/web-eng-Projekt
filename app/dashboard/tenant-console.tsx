"use client";

import { FormEvent, ReactNode, useMemo, useState, useEffect, useCallback } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  Gauge,
  LineChart,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";

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

export function LoyaltyConsole() {
  const [organizationName, setOrganizationName] = useState("");
  const [pointsRatio, setPointsRatio] = useState("10");
  const [status, setStatus] = useState<string | null>(null);
  const [latestApiKey, setLatestApiKey] = useState<string>("");
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
          await new Promise(resolve => setTimeout(resolve, 100));
          await loadDashboardData();
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

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

  async function loadDashboardData() {
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
  }

  async function loadMemberships() {
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
  }

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
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
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
            </div>
          </section>

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

              <section className="grid gap-5 xl:grid-cols-[1fr,1.3fr]">
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
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Customer Profiles
                  </h3>
                  <div className="mt-4 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full min-w-170 border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          <th className="px-3 py-3">Kunde</th>
                          <th className="px-3 py-3">Punkte</th>
                          <th className="px-3 py-3">Gesamtumsatz</th>
                          <th className="px-3 py-3">Erstellt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profiles.map((profile) => (
                          <tr
                            key={profile.id}
                            className="border-t border-slate-100 text-slate-700 dark:border-slate-800 dark:text-slate-300"
                          >
                            <td className="px-3 py-3 font-medium dark:text-slate-100">
                              {profile.externalCustomerId}
                            </td>
                            <td className="px-3 py-3">{profile.pointsBalance}</td>
                            <td className="px-3 py-3">{profile.totalSpentEur.toFixed(2)} EUR</td>
                            <td className="px-3 py-3">
                              {new Date(profile.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
    </main>
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
