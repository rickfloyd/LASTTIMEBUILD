// src/QuantumAppContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

export type ViewMode = "LUCID" | "MINIMAL" | "CUSTOM";

export interface QuantumAppState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  selectedTool: string | null;
  setSelectedTool: (tool: string) => void;

  selectedMode: string | null;
  setSelectedMode: (mode: string) => void;

  timeframe: string;
  setTimeframe: (tf: string) => void;
}

const QuantumAppContext = createContext<QuantumAppState | undefined>(
  undefined
);

export const QuantumAppProvider = ({ children }: { children: ReactNode }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("LUCID");
  const [selectedTool, setSelectedTool] = useState<string | null>(
    "AI Price Prediction"
  );
  const [selectedMode, setSelectedMode] = useState<string | null>(
    "Long-Term Mode"
  );
  const [timeframe, setTimeframe] = useState<string>("1D");

  const value = useMemo(
    () => ({
      viewMode,
      setViewMode,
      selectedTool,
      setSelectedTool,
      selectedMode,
      setSelectedMode,
      timeframe,
      setTimeframe,
    }),
    [viewMode, selectedTool, selectedMode, timeframe]
  );

  return (
    <QuantumAppContext.Provider value={value}>
      {children}
    </QuantumAppContext.Provider>
  );
};

export const useQuantumApp = (): QuantumAppState => {
  const ctx = useContext(QuantumAppContext);
  if (!ctx) {
    throw new Error("useQuantumApp must be used inside QuantumAppProvider");
  }
  return ctx;
};
