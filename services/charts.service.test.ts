import {
  getPaymentsOverviewData,
  getWeeksProfitData,
  getTransactionMixData,
  getCampaignVisitorsData,
  getOverviewKpis,
} from "./charts.services";
import { getCurrentMembershipContext } from "@/lib/loyalty/user-membership";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";

// Mock dependencies
jest.mock("@/lib/loyalty/user-membership");
jest.mock("@/lib/loyalty/db");
jest.mock("next/cache", () => ({
  unstable_cache: (fn: any) => fn,
}));

describe("Charts Service - Unit Tests", () => {
  const mockTransactions = [
    {
      transaction_type: "earn" as const,
      points: 100,
      eur_amount: "10.50",
      created_at: new Date().toISOString(),
      profile_id: "profile-1",
    },
    {
      transaction_type: "redeem" as const,
      points: 50,
      eur_amount: "5.00",
      created_at: new Date().toISOString(),
      profile_id: "profile-1",
    },
    {
      transaction_type: "earn" as const,
      points: 200,
      eur_amount: "20.00",
      created_at: new Date(Date.now() - 86400000).toISOString(), // yesterday
      profile_id: "profile-2",
    },
  ];

  const mockProfiles = [
    { id: "profile-1", external_customer_id: "cust-123" },
    { id: "profile-2", external_customer_id: "cust-456" },
  ];

  const mockSupabaseClient = {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }),
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getCurrentMembershipContext as jest.Mock).mockResolvedValue({
      organizationId: "org-123",
    });
    (getAdminSupabaseClient as jest.Mock).mockReturnValue(mockSupabaseClient);
  });

  describe("getPaymentsOverviewData", () => {
    test("sollte Zahlungsdaten mit monatlichem Timeframe zurückgeben", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null }) // transactions
        .mockResolvedValueOnce({ data: mockProfiles, error: null }); // profiles

      const result = await getPaymentsOverviewData("monthly");

      expect(result).toHaveProperty("revenueEur");
      expect(result).toHaveProperty("redeemedPoints");
      expect(Array.isArray(result.revenueEur)).toBe(true);
      expect(Array.isArray(result.redeemedPoints)).toBe(true);
    });

    test("sollte mit wöchentlichem Timeframe funktionieren", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getPaymentsOverviewData("weekly");

      expect(result.revenueEur).toBeDefined();
      expect(result.redeemedPoints).toBeDefined();
    });

    test("sollte mit jährlichem Timeframe funktionieren", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getPaymentsOverviewData("yearly");

      expect(result.revenueEur).toBeDefined();
      expect(result.redeemedPoints).toBeDefined();
    });

    test("sollte Standard-Timeframe 'monthly' verwenden wenn nicht angegeben", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getPaymentsOverviewData();

      expect(result).toBeDefined();
    });

    test("sollte mit leeren Transaktionen umgehen", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: [], error: null })
        .mockResolvedValueOnce({ data: [], error: null });

      const result = await getPaymentsOverviewData();

      expect(result.revenueEur).toBeDefined();
      expect(result.redeemedPoints).toBeDefined();
    });
  });

  describe("getWeeksProfitData", () => {
    test("sollte Wochenprofitdaten für diese Woche zurückgeben", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getWeeksProfitData("this week");

      expect(result).toHaveProperty("sales");
      expect(result).toHaveProperty("revenue");
      expect(Array.isArray(result.sales)).toBe(true);
      expect(Array.isArray(result.revenue)).toBe(true);
    });

    test("sollte Wochenprofitdaten für letzte Woche zurückgeben", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getWeeksProfitData("last week");

      expect(result.sales).toBeDefined();
      expect(result.revenue).toBeDefined();
    });

    test("sollte 7 Tage-Daten (Mo-So) zurückgeben", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getWeeksProfitData();

      expect(result.sales.length).toBe(7);
      expect(result.revenue.length).toBe(7);
    });

    test("sollte mit leeren Transaktionen umgehen", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: [], error: null })
        .mockResolvedValueOnce({ data: [], error: null });

      const result = await getWeeksProfitData();

      expect(result.sales.every((d) => d.y === 0)).toBe(true);
      expect(result.revenue.every((d) => d.y === 0)).toBe(true);
    });
  });

  describe("getTransactionMixData", () => {
    test("sollte Transaction Mix mit Earn, Redeem und Active Customers oder keine zurückgeben", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getTransactionMixData("monthly");

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(4);

      const names = result.map((item) => item.name);
      expect(names).toContain("Nur Earn");
      expect(names).toContain("Nur Redeem");
      expect(names).toContain("Beide aktiv");
      expect(names).toContain("Keine Aktivitat");
    });

    test("sollte korrekte Counts für Transaktionen zurückgeben", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getTransactionMixData("monthly");

      const earnTx = result.find((item) => item.name === "Nur Earn");
      const bothActiveTx = result.find((item) => item.name === "Beide aktiv");

      expect(earnTx?.amount).toBe(1); // profile-2 with only earn
      expect(bothActiveTx?.amount).toBe(1); // profile-1 with both earn and redeem
    });

    test("sollte Beide aktiv zählen", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getTransactionMixData();

      const bothActive = result.find((item) => item.name === "Beide aktiv");
      expect(bothActive?.amount).toBeGreaterThan(0);
    });

    test("sollte mit leeren Transaktionen umgehen", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: [], error: null })
        .mockResolvedValueOnce({ data: [], error: null });

      const result = await getTransactionMixData();

      expect(result.every((item) => item.amount === 0)).toBe(true);
    });
  });

  describe("getCampaignVisitorsData", () => {
    test("sollte Campaign Visitor Daten mit Chart zurückgeben", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getCampaignVisitorsData("monthly");

      expect(result).toHaveProperty("total_visitors");
      expect(result).toHaveProperty("performance");
      expect(result).toHaveProperty("chart");
      expect(Array.isArray(result.chart)).toBe(true);
    });

    test("sollte total_visitors berechnen", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getCampaignVisitorsData();

      expect(typeof result.total_visitors).toBe("number");
      expect(result.total_visitors).toBeGreaterThanOrEqual(0);
    });

    test("sollte Performance-Metrik berechnen", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getCampaignVisitorsData();

      expect(typeof result.performance).toBe("number");
    });

    test("sollte mit verschiedenen Timeframes funktionieren", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const resultMonthly = await getCampaignVisitorsData("monthly");
      expect(resultMonthly).toBeDefined();

      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const resultWeekly = await getCampaignVisitorsData("weekly");
      expect(resultWeekly).toBeDefined();
    });
  });

  describe("getOverviewKpis", () => {
    test("sollte alle KPI-Felder zurückgeben", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getOverviewKpis("monthly");

      expect(result).toHaveProperty("revenueEur");
      expect(result).toHaveProperty("activeCustomers");
      expect(result).toHaveProperty("redeemRate");
      expect(result).toHaveProperty("avgPointsPerEarn");
    });

    test("sollte revenueEur berechnen", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getOverviewKpis();

      expect(typeof result.revenueEur).toBe("number");
      expect(result.revenueEur).toBeGreaterThanOrEqual(0);
    });

    test("sollte activeCustomers zählen", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getOverviewKpis();

      expect(typeof result.activeCustomers).toBe("number");
      expect(result.activeCustomers).toBeGreaterThanOrEqual(0);
    });

    test("sollte redeemRate als Prozentangabe berechnen", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getOverviewKpis();

      expect(typeof result.redeemRate).toBe("number");
      expect(result.redeemRate).toBeGreaterThanOrEqual(0);
      expect(result.redeemRate).toBeLessThanOrEqual(100);
    });

    test("sollte avgPointsPerEarn berechnen", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getOverviewKpis();

      expect(typeof result.avgPointsPerEarn).toBe("number");
      expect(result.avgPointsPerEarn).toBeGreaterThanOrEqual(0);
    });

    test("sollte 0 redeemRate bei keinen Transaktionen zurückgeben", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: [], error: null })
        .mockResolvedValueOnce({ data: [], error: null });

      const result = await getOverviewKpis();

      expect(result.redeemRate).toBe(0);
    });

    test("sollte 0 avgPointsPerEarn bei keinen Earn-Transaktionen zurückgeben", async () => {
      const onlyRedeem = [
        {
          transaction_type: "redeem" as const,
          points: 50,
          eur_amount: "5.00",
          created_at: new Date().toISOString(),
          profile_id: "profile-1",
        },
      ];

      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: onlyRedeem, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getOverviewKpis();

      expect(result.avgPointsPerEarn).toBe(0);
    });

    test("sollte mit verschiedenen Timeframes funktionieren", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const resultMonthly = await getOverviewKpis("monthly");
      expect(resultMonthly).toBeDefined();

      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const resultWeekly = await getOverviewKpis("weekly");
      expect(resultWeekly).toBeDefined();

      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const resultYearly = await getOverviewKpis("yearly");
      expect(resultYearly).toBeDefined();
    });

    test("sollte Standard-Timeframe 'monthly' verwenden wenn nicht angegeben", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getOverviewKpis();

      expect(result).toBeDefined();
    });
  });

  describe("Service Integration", () => {
    test("sollte getCurrentMembershipContext aufrufen", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: [], error: null })
        .mockResolvedValueOnce({ data: [], error: null });

      await getOverviewKpis();

      expect(getCurrentMembershipContext).toHaveBeenCalled();
    });

    test("sollte getAdminSupabaseClient aufrufen", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: [], error: null })
        .mockResolvedValueOnce({ data: [], error: null });

      await getOverviewKpis();

      expect(getAdminSupabaseClient).toHaveBeenCalled();
    });

    test("sollte Transaktionen von Datenbank abrufen", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      await getOverviewKpis();

      const calls = mockSupabaseClient.from().select().eq.mock.calls;
      expect(calls.length).toBeGreaterThan(0);
    });
  });

  describe("Error Handling", () => {
    test("sollte Error werfen wenn Transaktionsabfrage fehlschlägt", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: null, error: { message: "Database error" } })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      await expect(getOverviewKpis()).rejects.toThrow();
    });

    test("sollte Error werfen wenn Profilabfrage fehlschlägt", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: null, error: { message: "Database error" } });

      await expect(getOverviewKpis()).rejects.toThrow();
    });
  });

  describe("Data Validation", () => {
    test("sollte Zahlen korrekt runden", async () => {
      const transactionsWithDecimals = [
        {
          transaction_type: "earn" as const,
          points: 333,
          eur_amount: "12.345",
          created_at: new Date().toISOString(),
          profile_id: "profile-1",
        },
      ];

      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: transactionsWithDecimals, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getOverviewKpis();

      // Zahlen sollten auf 2 Dezimalstellen gerundet sein
      const decimalPlaces = (result.revenueEur.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });

    test("sollte mit string eur_amount umgehen", async () => {
      mockSupabaseClient.from().select().eq
        .mockResolvedValueOnce({ data: mockTransactions, error: null })
        .mockResolvedValueOnce({ data: mockProfiles, error: null });

      const result = await getOverviewKpis();

      expect(typeof result.revenueEur).toBe("number");
    });
  });
});
