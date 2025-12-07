// src/components/dashboard/DashboardStats.tsx

import React, { useMemo, useState } from "react";
import {
  DASHBOARD_VIEWS,
  DashboardViewId,
  DEFAULT_DASHBOARD_VIEW_ID,
} from "./MultipleViews";

const DashboardStats: React.FC = () => {
  // Default to the new 25-card view
  const [activeViewId, setActiveViewId] =
    useState<DashboardViewId>(DEFAULT_DASHBOARD_VIEW_ID);

  const activeView = useMemo(() => {
    return (
      DASHBOARD_VIEWS.find((view) => view.id === activeViewId) ||
      DASHBOARD_VIEWS[0]
    );
  }, [activeViewId]);

  const ActiveViewComponent = activeView.Component;

  return (
    <div className="mt-4">
      {/* View selector bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {DASHBOARD_VIEWS.map((view) => {
            const isActive = view.id === activeViewId;
            return (
              <button
                key={view.id}
                type="button"
                onClick={() => setActiveViewId(view.id)}
                className={[
                  "px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold",
                  "border-2 transition-colors transition-shadow duration-150",
                  isActive
                    ? "bg-fluorescent-pink text-deep-black border-fluorescent-pink shadow-neon-pink"
                    : "bg-charcoal text-fluorescent-blue border-fluorescent-blue/40 hover:border-fluorescent-pink hover:text-fluorescent-pink",
                ].join(" ")}
              >
                {view.label}
              </button>
            );
          })}
        </div>

        <div className="text-[11px] md:text-xs text-pulsing-cyan bg-charcoal/80 border border-pulsing-cyan/40 rounded-full px-3 py-1 font-mono">
          activeViewId: <span className="text-fluorescent-pink">{activeViewId}</span>
        </div>
      </div>

      {/* Active view content */}
      <div className="rounded-3xl bg-charcoal-gradient border border-fluorescent-blue/40 shadow-neon-blue/40 p-4 md:p-6">
        <ActiveViewComponent />
      </div>
    </div>
  );
};

export default DashboardStats;
