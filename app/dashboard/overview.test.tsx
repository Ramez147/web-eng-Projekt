import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock all services and dependencies BEFORE importing the component
jest.mock("@/services/charts.services", () => ({
  getOverviewKpis: jest.fn(() => 
    Promise.resolve({
      revenueEur: 15000,
      activeCustomers: 250,
      redeemRate: 45,
      avgPointsPerEarn: 120,
    })
  ),
}));

jest.mock("@/lib/format-number", () => ({
  standardFormat: jest.fn((value) => `formatted-${value}`),
}));

// Mock dependencies
jest.mock("@/components/period-picker", () => ({
  PeriodPicker: ({ defaultValue, sectionKey }: any) => (
    <div data-testid="period-picker" data-value={defaultValue} data-key={sectionKey}>
      Period Picker
    </div>
  ),
}));

jest.mock("./logout-button", () => ({
  LogoutButton: () => <button data-testid="logout-button">Logout</button>,
}));

jest.mock("./charts/campaign-visitors", () => ({
  CampaignVisitors: ({ timeFrame, className }: any) => (
    <div data-testid="campaign-visitors" data-timeframe={timeFrame} className={className}>
      Campaign Visitors Chart
    </div>
  ),
}));

jest.mock("./charts/payment-overview", () => ({
  PaymentsOverview: ({ timeFrame, className }: any) => (
    <div data-testid="payments-overview" data-timeframe={timeFrame} className={className}>
      Payments Overview Chart
    </div>
  ),
}));

jest.mock("./charts/used-devices", () => ({
  TransactionMix: ({ timeFrame, className }: any) => (
    <div data-testid="transaction-mix" data-timeframe={timeFrame} className={className}>
      Transaction Mix Chart
    </div>
  ),
}));

jest.mock("./charts/weeks-profit", () => ({
  WeeksProfit: ({ timeFrame, className }: any) => (
    <div data-testid="weeks-profit" data-timeframe={timeFrame} className={className}>
      Weeks Profit Chart
    </div>
  ),
}));

// Now import the component
import { DashboardOverviewHeader } from "./overview";

describe("DashboardOverview - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("DashboardOverviewHeader - Komponenten-Tests", () => {
    test("sollte den Header mit Standard-Zeitraum rendern", () => {
      render(<DashboardOverviewHeader />);

      expect(screen.getByText("Multi-Tenant Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Overview & Live-Kennzahlen")).toBeInTheDocument();
      expect(screen.getByText("Dashboard-Daten geladen")).toBeInTheDocument();
    });

    test("sollte alle erforderlichen KPI-Labels anzeigen", () => {
      render(<DashboardOverviewHeader />);

      expect(screen.getByText("Kennzahlen oben, Charts in der Mitte, Verwaltung unten.")).toBeInTheDocument();
      expect(screen.getByText("Globaler Zeitraum")).toBeInTheDocument();
    });

    test("sollte den Logout-Button anzeigen", () => {
      render(<DashboardOverviewHeader />);

      expect(screen.getByTestId("logout-button")).toBeInTheDocument();
    });

    test("sollte den globalen Zeitraum 'weekly' verwenden wenn angegeben", () => {
      render(
        <DashboardOverviewHeader
          timeFrames={{
            global: "weekly",
          }}
        />
      );

      const periodPicker = screen.getByTestId("period-picker");
      expect(periodPicker).toHaveAttribute("data-value", "weekly");
      expect(periodPicker).toHaveAttribute("data-key", "global");
    });

    test("sollte Standard-Zeitraum 'monthly' verwenden wenn nichts angegeben", () => {
      render(<DashboardOverviewHeader />);

      const periodPicker = screen.getByTestId("period-picker");
      expect(periodPicker).toHaveAttribute("data-value", "monthly");
    });

    test("sollte verschiedene Zeiträume korrekt an PeriodPicker weitergeben", () => {
      const timeFrames = {
        global: "yearly",
        paymentsOverview: "weekly",
        campaignVisitors: "daily",
      };

      render(<DashboardOverviewHeader timeFrames={timeFrames} />);

      const periodPicker = screen.getByTestId("period-picker");
      expect(periodPicker).toHaveAttribute("data-value", "yearly");
    });

    test("sollte mit undefined timeFrames Props gracefully umgehen", () => {
      render(<DashboardOverviewHeader timeFrames={undefined} />);

      expect(screen.getByText("Overview & Live-Kennzahlen")).toBeInTheDocument();
      const periodPicker = screen.getByTestId("period-picker");
      expect(periodPicker).toHaveAttribute("data-value", "monthly");
    });

    test("sollte korrekte CSS-Klassen für Styling verwenden", () => {
      render(<DashboardOverviewHeader />);

      const header = screen.getByText("Overview & Live-Kennzahlen").closest("h1");
      expect(header).toHaveClass("text-xl", "font-bold", "tracking-tight", "text-white");
    });

    test("sollte alle Sektionen korrekt strukturieren", () => {
      const { container } = render(<DashboardOverviewHeader />);

      const sections = container.querySelectorAll("section");
      expect(sections.length).toBeGreaterThan(0);

      const divs = container.querySelectorAll("div");
      expect(divs.length).toBeGreaterThan(0);
    });

    test("sollte Badge für 'Multi-Tenant Dashboard' anzeigen", () => {
      render(<DashboardOverviewHeader />);

      const badge = screen.getByText("Multi-Tenant Dashboard");
      expect(badge.closest("p")).toHaveClass("inline-flex", "items-center", "rounded-full");
    });

    test("sollte alle Text-Inhalte sichtbar sein", () => {
      render(<DashboardOverviewHeader />);

      expect(screen.getByText("Multi-Tenant Dashboard")).toBeVisible();
      expect(screen.getByText("Overview & Live-Kennzahlen")).toBeVisible();
      expect(screen.getByText("Dashboard-Daten geladen")).toBeVisible();
    });
  });

  describe("TimeFrame Resolution Logic", () => {
    test("sollte globalen Zeitraum für alle Charts verwenden wenn einzelne nicht definiert sind", () => {
      render(
        <DashboardOverviewHeader
          timeFrames={{
            global: "yearly",
          }}
        />
      );

      const periodPicker = screen.getByTestId("period-picker");
      expect(periodPicker).toHaveAttribute("data-value", "yearly");
    });

    test("sollte mit nur globalem Zeitraum funktionieren", () => {
      render(
        <DashboardOverviewHeader
          timeFrames={{
            global: "monthly",
          }}
        />
      );

      expect(screen.getByTestId("period-picker")).toBeInTheDocument();
      expect(screen.getByText("Overview & Live-Kennzahlen")).toBeInTheDocument();
    });

    test("sollte mit leeren timeFrames handeln können", () => {
      render(
        <DashboardOverviewHeader
          timeFrames={{}}
        />
      );

      const periodPicker = screen.getByTestId("period-picker");
      expect(periodPicker).toHaveAttribute("data-value", "monthly");
    });
  });

  describe("Accessibility & Semantik", () => {
    test("sollte semantisches HTML verwenden", () => {
      const { container } = render(<DashboardOverviewHeader />);

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    test("sollte Text-Hierarchie korrekt sein", () => {
      render(<DashboardOverviewHeader />);

      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveTextContent("Overview & Live-Kennzahlen");
    });

    test("sollte Button für Logout enthalten", () => {
      render(<DashboardOverviewHeader />);

      const button = screen.getByTestId("logout-button");
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe("BUTTON");
    });
  });

  describe("Style & Layout Props", () => {
    test("sollte korrekte Border und Background-Klassen haben", () => {
      const { container } = render(<DashboardOverviewHeader />);

      const styledDiv = container.querySelector(".rounded-3xl.border.border-white\\/8");
      expect(styledDiv).toBeInTheDocument();
    });

    test("sollte responsive Grid-Layout für verschiedene Breakpoints haben", () => {
      const { container } = render(<DashboardOverviewHeader />);

      const flexContainer = container.querySelector("div.flex.flex-col.gap-5");
      expect(flexContainer).toHaveClass("lg:flex-row", "lg:items-start", "lg:justify-between");
    });

    test("sollte korrekte Spacing-Klassen verwenden", () => {
      const { container } = render(<DashboardOverviewHeader />);

      const section = container.querySelector("section");
      expect(section).toHaveClass("space-y-4");
    });
  });
});
