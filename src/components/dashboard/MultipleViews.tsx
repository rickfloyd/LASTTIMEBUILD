// src/components/dashboard/MultipleViews.tsx

import React from "react";

/**
 * All dashboard view IDs live here.
 * Add new IDs instead of hard-coding strings in other files.
 */
export type DashboardViewId =
  | "v1_original"
  | "v2_experimental"
  | "v3_25_card_grid";

export interface DashboardViewDefinition {
  id: DashboardViewId;
  label: string;
  description: string;
  Component: React.FC;
}

/**
 * V1 – ORIGINAL LAYOUT (ARCHIVE)
 *
 * IMPORTANT:
 *  - Paste your current/old dashboard JSX into this component body
 *    so it is preserved forever as "v1_original".
 *  - Right now this is just a placeholder so the app compiles.
 */
export const DashboardViewV1_Original: React.FC = () => {
  return (
    <div className="border border-dashed border-fluorescent-pink rounded-2xl p-6 bg-charcoal/80 text-fluorescent-blue">
      <h2 className="text-xl font-bold mb-2 text-fluorescent-pink">
        Original Dashboard (Archive Placeholder)
      </h2>
      <p className="text-sm text-fluorescent-blue/80">
        Paste your original dashboard layout JSX here so it is preserved as
        <span className="font-mono ml-1">DashboardViewV1_Original</span>.
      </p>
    </div>
  );
};

/**
 * V2 – EXPERIMENTAL / OLD TEST LAYOUT
 *
 * Same idea as V1 – a safe place to park any experimental layouts
 * so they don&apos;t get lost when you move to new versions.
 */
export const DashboardViewV2_Experimental: React.FC = () => {
  return (
    <div className="border border-dashed border-electric-purple rounded-2xl p-6 bg-charcoal/80 text-fluorescent-blue">
      <h2 className="text-xl font-bold mb-2 text-electric-purple">
        Experimental Dashboard (Archive Placeholder)
      </h2>
      <p className="text-sm text-fluorescent-blue/80">
        Use this view to store older experimental layouts. Replace this
        placeholder with your archived JSX if you have one.
      </p>
    </div>
  );
};

/**
 * V3 – 25-CARD NEON GRID
 *
 * This is the new main layout:
 *  - 25 trading modes
 *  - Responsive neon grid (up to 5x5 on large screens)
 */

type AccentColor = "pink" | "blue" | "purple" | "orange" | "cyan";

interface ModeCardConfig {
  id: string;
  label: string;
  description: string;
  accent: AccentColor;
}

const MODE_CARDS: ReadonlyArray<ModeCardConfig> = [
  {
    id: "long_term",
    label: "Long-Term Mode",
    description: "Position trading, pensions, long arcs.",
    accent: "blue",
  },
  {
    id: "crypto",
    label: "Crypto Mode",
    description: "BTC, ETH and altcoin ecosystems.",
    accent: "orange",
  },
  {
    id: "futures",
    label: "Futures Mode",
    description: "Index, commodities & rate futures.",
    accent: "purple",
  },
  {
    id: "news_driven",
    label: "News-Driven Mode",
    description: "FOMC, CPI, NFP, earnings & headlines.",
    accent: "cyan",
  },
  {
    id: "options",
    label: "Options Mode",
    description: "Greeks, IV, spreads & volatility plays.",
    accent: "pink",
  },
  {
    id: "price_action",
    label: "Price Action Mode",
    description: "Naked charts, levels & structure only.",
    accent: "orange",
  },
  {
    id: "smc",
    label: "SMC Mode",
    description: "Smart money concepts & liquidity hunts.",
    accent: "blue",
  },
  {
    id: "algo",
    label: "Algo Mode",
    description: "Systematic trading & rule-based bots.",
    accent: "purple",
  },
  {
    id: "scalper",
    label: "Scalper’s Mode",
    description: "Ultra-low timeframe sniper entries.",
    accent: "pink",
  },
  {
    id: "swing",
    label: "Swing Mode",
    description: "Multi-day swing structure and flows.",
    accent: "cyan",
  },
  {
    id: "indices",
    label: "Index Mode",
    description: "S&P, Nasdaq, Dow & global indices.",
    accent: "blue",
  },
  {
    id: "metals",
    label: "Metals Mode",
    description: "Gold, silver, copper & metals complex.",
    accent: "orange",
  },
  {
    id: "forex_majors",
    label: "Forex Majors",
    description: "EURUSD, GBPUSD, USDJPY and more.",
    accent: "purple",
  },
  {
    id: "forex_minors",
    label: "Forex Minors",
    description: "Crosses, exotics and BRICS FX.",
    accent: "pink",
  },
  {
    id: "synthetics",
    label: "Synthetic Indices",
    description: "24/7 synthetic volatility markets.",
    accent: "cyan",
  },
  {
    id: "volatility",
    label: "Volatility Mode",
    description: "VIX, vol regimes & risk-on/off.",
    accent: "blue",
  },
  {
    id: "orderflow",
    label: "Orderflow Mode",
    description: "Footprints, DOM & tape reading.",
    accent: "orange",
  },
  {
    id: "liquidity",
    label: "Liquidity Maps",
    description: "Pools, resting orders & stop zones.",
    accent: "purple",
  },
  {
    id: "macro",
    label: "Macro Mode",
    description: "Rates, bonds, FX & global themes.",
    accent: "pink",
  },
  {
    id: "earnings",
    label: "Earnings Mode",
    description: "EPS surprises, gaps & reactions.",
    accent: "cyan",
  },
  {
    id: "onchain",
    label: "On-Chain Analytics",
    description: "Wallet flows, exchanges & supply.",
    accent: "blue",
  },
  {
    id: "copytrading",
    label: "Copy Trading",
    description: "Shadow verified traders with guardrails.",
    accent: "orange",
  },
  {
    id: "paper_trading",
    label: "Paper Trading",
    description: "Risk-free sim with real-time prices.",
    accent: "purple",
  },
  {
    id: "backtest",
    label: "Backtest Lab",
    description: "Replay history & stress-test ideas.",
    accent: "pink",
  },
  {
    id: "automation",
    label: "Automation Hub",
    description: "Live execution, bots & schedulers.",
    accent: "cyan",
  },
];

const ACCENT_CLASSES: Record<AccentColor, string> = {
  pink: "border-fluorescent-pink shadow-neon-pink",
  blue: "border-fluorescent-blue shadow-neon-blue",
  purple: "border-electric-purple shadow-neon-blue",
  orange: "border-electric-orange shadow-neon-orange",
  cyan: "border-pulsing-cyan shadow-neon-cyan",
};

export const DashboardViewV3_25CardGrid: React.FC = () => {
  return (
    <section className="mt-6">
      {/* Header row for this view */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-fluorescent-pink drop-shadow-lg">
            Quantum Modes Matrix
          </h2>
          <p className="text-sm md:text-base text-fluorescent-blue/80 mt-1">
            25 specialized trading modes — each card can link to its own tools,
            layouts and AI agents.
          </p>
        </div>
        <div className="text-xs md:text-sm text-pulsing-cyan bg-charcoal/80 border border-pulsing-cyan/50 rounded-xl px-4 py-2">
          <span className="font-semibold text-neon-green">Active view:</span>{" "}
          <span className="font-mono text-fluorescent-pink">
            v3_25_card_grid
          </span>
        </div>
      </div>

      {/* 25 cards – responsive grid.
         - Mobile: 1 per row
         - Small: 2 per row
         - Medium: 3 per row
         - XL: up to 5 per row (5x5 look)
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {MODE_CARDS.map((card) => (
          <button
            key={card.id}
            type="button"
            className={[
              "relative overflow-hidden rounded-2xl",
              "bg-charcoal-gradient",
              "border-2",
              "px-4 py-5",
              "text-left",
              "transition-transform transition-shadow duration-200",
              "hover:scale-[1.03] hover:shadow-neon-blue",
              "focus:outline-none focus:ring-2 focus:ring-fluorescent-pink",
              ACCENT_CLASSES[card.accent],
            ].join(" ")}
          >
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-[0.2em] text-pulsing-cyan">
                Mode
              </div>
              <div className="text-lg md:text-xl font-bold text-white drop-shadow-lg">
                {card.label}
              </div>
              <div className="text-xs md:text-sm text-fluorescent-blue/80">
                {card.description}
              </div>
            </div>

            {/* bottom neon bar */}
            <div className="absolute inset-x-4 bottom-3 h-[3px] rounded-full bg-fluorescent-gradient animate-gradient-pan" />
          </button>
        ))}
      </div>
    </section>
  );
};

/**
 * VIEW REGISTRY
 *
 * Other files should NEVER hard-code components – they should use this array.
 */
export const DASHBOARD_VIEWS: DashboardViewDefinition[] = [
  {
    id: "v1_original",
    label: "Original Layout",
    description: "Your original Quantum Charts dashboard (archived).",
    Component: DashboardViewV1_Original,
  },
  {
    id: "v2_experimental",
    label: "Experimental Layout",
    description: "Old experimental layout (archive / sandbox).",
    Component: DashboardViewV2_Experimental,
  },
  {
    id: "v3_25_card_grid",
    label: "25-Card Mode Grid",
    description: "Neon grid of 25 specialized trading modes.",
    Component: DashboardViewV3_25CardGrid,
  },
];

/**
 * Default view – used by DashboardStats as the starting layout.
 */
export const DEFAULT_DASHBOARD_VIEW_ID: DashboardViewId = "v3_25_card_grid";
