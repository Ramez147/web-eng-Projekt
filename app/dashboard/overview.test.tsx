import { describe, it, expect } from "vitest";

// Pure utility functions and types (extrahiert aus DashboardOverview)
export type TimeFrameType = "daily" | "weekly" | "monthly" | "yearly";

export type PropsType = {
  timeFrames?: {
    global?: string;
    paymentsOverview?: string;
    weeksProfit?: string;
    campaignVisitors?: string;
    transactionMix?: string;
  };
};

export type ResolvedTimeFrames = {
  globalTimeFrame: string;
  paymentsOverviewTimeFrame: string;
  campaignVisitorsTimeFrame: string;
  weeksProfitTimeFrame: string | undefined;
  transactionMixTimeFrame: string;
};

export type OverviewKpisType = {
  revenueEur: number;
  activeCustomers: number;
  redeemRate: number;
  avgPointsPerEarn: number;
};

export const VALID_TIME_FRAMES: TimeFrameType[] = ["daily", "weekly", "monthly", "yearly"];
export const DEFAULT_TIME_FRAME: TimeFrameType = "monthly";

export const HEADER_LABELS = {
  badge: "Multi-Tenant Dashboard",
  title: "Overview & Live-Kennzahlen",
  statusBadge: "Dashboard-Daten geladen",
  description: "Kennzahlen oben, Charts in der Mitte, Verwaltung unten.",
  globalTimeLabel: "Globaler Zeitraum",
} as const;

// Pure utility functions
export function isValidTimeFrame(timeFrame: any): timeFrame is TimeFrameType {
  return VALID_TIME_FRAMES.includes(timeFrame);
}

export function resolveTimeFrames(timeFrames?: PropsType["timeFrames"]): ResolvedTimeFrames {
  const globalTimeFrame = timeFrames?.global ?? DEFAULT_TIME_FRAME;

  return {
    globalTimeFrame,
    paymentsOverviewTimeFrame: timeFrames?.paymentsOverview ?? globalTimeFrame,
    campaignVisitorsTimeFrame: timeFrames?.campaignVisitors ?? globalTimeFrame,
    weeksProfitTimeFrame: timeFrames?.weeksProfit,
    transactionMixTimeFrame: timeFrames?.transactionMix ?? globalTimeFrame,
  };
}

export function isValidResolvedTimeFrames(resolved: any): boolean {
  return (
    typeof resolved === "object" &&
    resolved !== null &&
    typeof resolved.globalTimeFrame === "string" &&
    typeof resolved.paymentsOverviewTimeFrame === "string" &&
    typeof resolved.campaignVisitorsTimeFrame === "string" &&
    typeof resolved.transactionMixTimeFrame === "string"
  );
}

export function getGlobalTimeFrame(timeFrames?: PropsType["timeFrames"]): string {
  return resolveTimeFrames(timeFrames).globalTimeFrame;
}

export function getPaymentsOverviewTimeFrame(timeFrames?: PropsType["timeFrames"]): string {
  return resolveTimeFrames(timeFrames).paymentsOverviewTimeFrame;
}

export function getCampaignVisitorsTimeFrame(timeFrames?: PropsType["timeFrames"]): string {
  return resolveTimeFrames(timeFrames).campaignVisitorsTimeFrame;
}

export function getWeeksProfitTimeFrame(timeFrames?: PropsType["timeFrames"]): string | undefined {
  return resolveTimeFrames(timeFrames).weeksProfitTimeFrame;
}

export function getTransactionMixTimeFrame(timeFrames?: PropsType["timeFrames"]): string {
  return resolveTimeFrames(timeFrames).transactionMixTimeFrame;
}

export function validateKpisResponse(response: any): response is OverviewKpisType {
  return (
    typeof response === "object" &&
    response !== null &&
    typeof response.revenueEur === "number" &&
    typeof response.activeCustomers === "number" &&
    typeof response.redeemRate === "number" &&
    typeof response.avgPointsPerEarn === "number"
  );
}

export function getHeaderLabel(key: keyof typeof HEADER_LABELS): string {
  return HEADER_LABELS[key];
}

export function isRevenueValid(revenue: any): boolean {
  return typeof revenue === "number" && isFinite(revenue) && revenue >= 0;
}

export function isCustomerCountValid(count: any): boolean {
  return typeof count === "number" && isFinite(count) && count >= 0;
}

export function isRedeemRateValid(rate: any): boolean {
  return typeof rate === "number" && isFinite(rate) && rate >= 0 && rate <= 100;
}

export function isPointsPerEarnValid(points: any): boolean {
  return typeof points === "number" && isFinite(points) && points >= 0;
}

export function validateKpisData(kpis: OverviewKpisType): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!isRevenueValid(kpis.revenueEur)) {
    errors.push("Revenue muss eine nicht-negative Zahl sein");
  }
  if (!isCustomerCountValid(kpis.activeCustomers)) {
    errors.push("Kundenzahl muss eine nicht-negative Zahl sein");
  }
  if (!isRedeemRateValid(kpis.redeemRate)) {
    errors.push("Redeem-Quote muss zwischen 0 und 100 liegen");
  }
  if (!isPointsPerEarnValid(kpis.avgPointsPerEarn)) {
    errors.push("Durchschnittliche Points muss nicht-negativ sein");
  }

  return { valid: errors.length === 0, errors };
}

export function formatRevenueForDisplay(revenue: number): string {
  return `€${revenue.toLocaleString("de-DE")}`;
}

export function formatPercentageForDisplay(percentage: number): string {
  return `${percentage.toFixed(1)}%`;
}

describe("DashboardOverview - Pure Utility Functions", () => {
  describe("Valid TimeFrames", () => {
    it("sollte alle gültigen TimeFrames enthalten", () => {
      expect(VALID_TIME_FRAMES).toContain("daily");
      expect(VALID_TIME_FRAMES).toContain("weekly");
      expect(VALID_TIME_FRAMES).toContain("monthly");
      expect(VALID_TIME_FRAMES).toContain("yearly");
    });

    it("sollte genau 4 TimeFrames haben", () => {
      expect(VALID_TIME_FRAMES).toHaveLength(4);
    });

    it("sollte 'monthly' als Standard haben", () => {
      expect(DEFAULT_TIME_FRAME).toBe("monthly");
    });
  });

  describe("Header Labels", () => {
    it("sollte alle erforderlichen Labels enthalten", () => {
      expect(HEADER_LABELS.badge).toBe("Multi-Tenant Dashboard");
      expect(HEADER_LABELS.title).toBe("Overview & Live-Kennzahlen");
      expect(HEADER_LABELS.statusBadge).toBe("Dashboard-Daten geladen");
      expect(HEADER_LABELS.description).toBe("Kennzahlen oben, Charts in der Mitte, Verwaltung unten.");
      expect(HEADER_LABELS.globalTimeLabel).toBe("Globaler Zeitraum");
    });

    it("sollte alle Keys abrufbar sein", () => {
      const keys: (keyof typeof HEADER_LABELS)[] = ["badge", "title", "statusBadge", "description", "globalTimeLabel"];
      keys.forEach((key) => {
        expect(getHeaderLabel(key)).toBeTruthy();
      });
    });
  });

  describe("isValidTimeFrame", () => {
    it("akzeptiert alle gültigen TimeFrames", () => {
      expect(isValidTimeFrame("daily")).toBe(true);
      expect(isValidTimeFrame("weekly")).toBe(true);
      expect(isValidTimeFrame("monthly")).toBe(true);
      expect(isValidTimeFrame("yearly")).toBe(true);
    });

    it("lehnt ungültige TimeFrames ab", () => {
      expect(isValidTimeFrame("invalid")).toBe(false);
      expect(isValidTimeFrame("hourly")).toBe(false);
    });

    it("lehnt null und undefined ab", () => {
      expect(isValidTimeFrame(null)).toBe(false);
      expect(isValidTimeFrame(undefined)).toBe(false);
    });
  });

  describe("resolveTimeFrames", () => {
    it("verwendet Standard 'monthly' wenn nichts angegeben", () => {
      const result = resolveTimeFrames();
      expect(result.globalTimeFrame).toBe("monthly");
    });

    it("verwendet globalen TimeFrame für alle Charts standardmäßig", () => {
      const result = resolveTimeFrames({ global: "yearly" });
      expect(result.globalTimeFrame).toBe("yearly");
      expect(result.paymentsOverviewTimeFrame).toBe("yearly");
      expect(result.campaignVisitorsTimeFrame).toBe("yearly");
      expect(result.transactionMixTimeFrame).toBe("yearly");
    });

    it("erlaubt Überschreiben von einzelnen TimeFrames", () => {
      const result = resolveTimeFrames({
        global: "monthly",
        paymentsOverview: "weekly",
        campaignVisitors: "daily",
      });
      expect(result.globalTimeFrame).toBe("monthly");
      expect(result.paymentsOverviewTimeFrame).toBe("weekly");
      expect(result.campaignVisitorsTimeFrame).toBe("daily");
      expect(result.transactionMixTimeFrame).toBe("monthly");
    });

    it("weeksProfit kann undefined bleiben", () => {
      const result = resolveTimeFrames({ global: "weekly" });
      expect(result.weeksProfitTimeFrame).toBeUndefined();
    });

    it("weeksProfit kann gesetzt werden", () => {
      const result = resolveTimeFrames({ weeksProfit: "daily" });
      expect(result.weeksProfitTimeFrame).toBe("daily");
    });

    it("gibt alle erforderlichen Properties zurück", () => {
      const result = resolveTimeFrames();
      expect(result).toHaveProperty("globalTimeFrame");
      expect(result).toHaveProperty("paymentsOverviewTimeFrame");
      expect(result).toHaveProperty("campaignVisitorsTimeFrame");
      expect(result).toHaveProperty("weeksProfitTimeFrame");
      expect(result).toHaveProperty("transactionMixTimeFrame");
    });
  });

  describe("isValidResolvedTimeFrames", () => {
    it("validiert korrekte ResolvedTimeFrames", () => {
      const resolved = resolveTimeFrames({ global: "monthly" });
      expect(isValidResolvedTimeFrames(resolved)).toBe(true);
    });

    it("lehnt Objekt ohne globalTimeFrame ab", () => {
      const invalid = { paymentsOverviewTimeFrame: "monthly" };
      expect(isValidResolvedTimeFrames(invalid)).toBe(false);
    });

    it("lehnt null ab", () => {
      expect(isValidResolvedTimeFrames(null)).toBe(false);
    });

    it("lehnt undefined ab", () => {
      expect(isValidResolvedTimeFrames(undefined)).toBe(false);
    });
  });

  describe("TimeFrame Getter Functions", () => {
    it("getGlobalTimeFrame gibt globalen TimeFrame zurück", () => {
      expect(getGlobalTimeFrame({ global: "yearly" })).toBe("yearly");
      expect(getGlobalTimeFrame()).toBe("monthly");
    });

    it("getPaymentsOverviewTimeFrame gibt PaymentsOverview TimeFrame zurück", () => {
      expect(getPaymentsOverviewTimeFrame({ global: "weekly", paymentsOverview: "daily" })).toBe("daily");
    });

    it("getCampaignVisitorsTimeFrame gibt CampaignVisitors TimeFrame zurück", () => {
      expect(getCampaignVisitorsTimeFrame({ global: "weekly", campaignVisitors: "daily" })).toBe("daily");
    });

    it("getWeeksProfitTimeFrame gibt WeeksProfit TimeFrame zurück", () => {
      expect(getWeeksProfitTimeFrame({ weeksProfit: "daily" })).toBe("daily");
      expect(getWeeksProfitTimeFrame()).toBeUndefined();
    });

    it("getTransactionMixTimeFrame gibt TransactionMix TimeFrame zurück", () => {
      expect(getTransactionMixTimeFrame({ global: "weekly", transactionMix: "daily" })).toBe("daily");
    });
  });

  describe("validateKpisResponse", () => {
    it("validiert korrekte KPIs Response", () => {
      const kpis = {
        revenueEur: 15000,
        activeCustomers: 250,
        redeemRate: 45,
        avgPointsPerEarn: 120,
      };
      expect(validateKpisResponse(kpis)).toBe(true);
    });

    it("lehnt Response ohne revenueEur ab", () => {
      const invalid = { activeCustomers: 250, redeemRate: 45, avgPointsPerEarn: 120 };
      expect(validateKpisResponse(invalid)).toBe(false);
    });

    it("lehnt Response mit nicht-Zahlen ab", () => {
      const invalid = {
        revenueEur: "15000",
        activeCustomers: 250,
        redeemRate: 45,
        avgPointsPerEarn: 120,
      };
      expect(validateKpisResponse(invalid)).toBe(false);
    });

    it("lehnt null ab", () => {
      expect(validateKpisResponse(null)).toBe(false);
    });
  });

  describe("Revenue Validation", () => {
    it("akzeptiert nicht-negative Zahlen", () => {
      expect(isRevenueValid(15000)).toBe(true);
      expect(isRevenueValid(0)).toBe(true);
      expect(isRevenueValid(0.5)).toBe(true);
    });

    it("lehnt negative Zahlen ab", () => {
      expect(isRevenueValid(-100)).toBe(false);
    });

    it("lehnt Infinity ab", () => {
      expect(isRevenueValid(Infinity)).toBe(false);
    });

    it("lehnt NaN ab", () => {
      expect(isRevenueValid(NaN)).toBe(false);
    });

    it("lehnt nicht-Zahlen ab", () => {
      expect(isRevenueValid("15000")).toBe(false);
      expect(isRevenueValid(null)).toBe(false);
    });
  });

  describe("Customer Count Validation", () => {
    it("akzeptiert nicht-negative ganze Zahlen", () => {
      expect(isCustomerCountValid(250)).toBe(true);
      expect(isCustomerCountValid(0)).toBe(true);
    });

    it("lehnt negative Zahlen ab", () => {
      expect(isCustomerCountValid(-50)).toBe(false);
    });

    it("lehnt Infinity ab", () => {
      expect(isCustomerCountValid(Infinity)).toBe(false);
    });

    it("lehnt nicht-Zahlen ab", () => {
      expect(isCustomerCountValid("250")).toBe(false);
    });
  });

  describe("Redeem Rate Validation", () => {
    it("akzeptiert Raten zwischen 0 und 100", () => {
      expect(isRedeemRateValid(0)).toBe(true);
      expect(isRedeemRateValid(50)).toBe(true);
      expect(isRedeemRateValid(100)).toBe(true);
    });

    it("lehnt Raten unter 0 ab", () => {
      expect(isRedeemRateValid(-1)).toBe(false);
    });

    it("lehnt Raten über 100 ab", () => {
      expect(isRedeemRateValid(101)).toBe(false);
    });

    it("lehnt Infinity ab", () => {
      expect(isRedeemRateValid(Infinity)).toBe(false);
    });

    it("lehnt nicht-Zahlen ab", () => {
      expect(isRedeemRateValid("50")).toBe(false);
    });
  });

  describe("Points Per Earn Validation", () => {
    it("akzeptiert nicht-negative Zahlen", () => {
      expect(isPointsPerEarnValid(120)).toBe(true);
      expect(isPointsPerEarnValid(0)).toBe(true);
    });

    it("lehnt negative Zahlen ab", () => {
      expect(isPointsPerEarnValid(-50)).toBe(false);
    });

    it("lehnt Infinity ab", () => {
      expect(isPointsPerEarnValid(Infinity)).toBe(false);
    });

    it("lehnt nicht-Zahlen ab", () => {
      expect(isPointsPerEarnValid("120")).toBe(false);
    });
  });

  describe("validateKpisData", () => {
    it("validiert korrekte KPIs Daten", () => {
      const kpis: OverviewKpisType = {
        revenueEur: 15000,
        activeCustomers: 250,
        redeemRate: 45,
        avgPointsPerEarn: 120,
      };
      const result = validateKpisData(kpis);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("sammelt Fehler für ungültige Revenue", () => {
      const kpis: OverviewKpisType = {
        revenueEur: -1000,
        activeCustomers: 250,
        redeemRate: 45,
        avgPointsPerEarn: 120,
      };
      const result = validateKpisData(kpis);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Revenue muss eine nicht-negative Zahl sein");
    });

    it("sammelt Fehler für ungültige Redeem Rate", () => {
      const kpis: OverviewKpisType = {
        revenueEur: 15000,
        activeCustomers: 250,
        redeemRate: 150,
        avgPointsPerEarn: 120,
      };
      const result = validateKpisData(kpis);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Redeem-Quote muss zwischen 0 und 100 liegen");
    });

    it("sammelt mehrere Fehler", () => {
      const kpis: OverviewKpisType = {
        revenueEur: -1000,
        activeCustomers: -50,
        redeemRate: 150,
        avgPointsPerEarn: -30,
      };
      const result = validateKpisData(kpis);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe("Format Functions", () => {
    it("formatRevenueForDisplay formatiert Revenue korrekt", () => {
      expect(formatRevenueForDisplay(15000)).toContain("€");
      expect(formatRevenueForDisplay(15000)).toContain("15");
    });

    it("formatPercentageForDisplay formatiert Prozente korrekt", () => {
      expect(formatPercentageForDisplay(45)).toContain("%");
      expect(formatPercentageForDisplay(45)).toContain("45");
    });

    it("formatPercentageForDisplay zeigt eine Dezimalstelle", () => {
      const result = formatPercentageForDisplay(45.555);
      expect(result).toContain("45.6");
    });
  });

  describe("DashboardOverview Integration", () => {
    it("kompletter TimeFrame Flow funktioniert", () => {
      const timeFrames = { global: "yearly", paymentsOverview: "weekly" };
      expect(isValidTimeFrame(getGlobalTimeFrame(timeFrames))).toBe(true);
      expect(isValidTimeFrame(getPaymentsOverviewTimeFrame(timeFrames))).toBe(true);
    });

    it("kompletter KPIs Validierungs-Flow funktioniert", () => {
      const kpis = {
        revenueEur: 15000,
        activeCustomers: 250,
        redeemRate: 45,
        avgPointsPerEarn: 120,
      };

      expect(validateKpisResponse(kpis)).toBe(true);
      const validation = validateKpisData(kpis);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("TimeFrame Resolution mit verschiedenen Eingaben", () => {
      const inputs = [
        { global: "daily" },
        { global: "weekly", paymentsOverview: "daily" },
        { global: "monthly", campaignVisitors: "weekly" },
        { weeksProfit: "daily" },
      ];

      inputs.forEach((input) => {
        const resolved = resolveTimeFrames(input);
        expect(isValidResolvedTimeFrames(resolved)).toBe(true);
      });
    });

    it("KPIs mit Grenzverlauf validieren", () => {
      const kpis: OverviewKpisType = {
        revenueEur: 0,
        activeCustomers: 0,
        redeemRate: 0,
        avgPointsPerEarn: 0,
      };
      const result = validateKpisData(kpis);
      expect(result.valid).toBe(true);
    });

    it("KPIs mit Maximum-Werten validieren", () => {
      const kpis: OverviewKpisType = {
        revenueEur: 1000000,
        activeCustomers: 50000,
        redeemRate: 100,
        avgPointsPerEarn: 10000,
      };
      const result = validateKpisData(kpis);
      expect(result.valid).toBe(true);
    });
  });
});
