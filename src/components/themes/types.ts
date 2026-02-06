import { Transaction, TransactionStatus } from "@/lib/mockData";

export interface ThemeStats {
  total: number;
  pending: number;
  cleared: number;
  failed: number;
  totalVolume: number;
  pendingVolume: number;
  highValue: number;
}

export interface ThemeProps {
  transactions: Transaction[];
  processing: Set<string>;
  stats: ThemeStats;
  superAdmin: boolean;
  onToggleSuperAdmin: () => void;
  onClearFunds: (id: string) => void;
}

export type ThemeId = "default" | "terminal" | "stripe" | "luxury" | "brutalist" | "portola-brand";

export interface ThemeOption {
  id: ThemeId;
  name: string;
  description: string;
  colors: string[];
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "default",
    name: "Default",
    description: "Dark fintech dashboard with live streaming",
    colors: ["#0c0e12", "#e8a849", "#3dd68c", "#e85d75"],
  },
  {
    id: "terminal",
    name: "Terminal",
    description: "IBM Plex Mono, dark ops console aesthetic",
    colors: ["#0a0e14", "#3d9970", "#f2c94c", "#e74c3c"],
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Clean white SaaS with avatar initials",
    colors: ["#f8f9fb", "#6366f1", "#10b981", "#f59e0b"],
  },
  {
    id: "luxury",
    name: "Luxury",
    description: "Dark navy + gold, private banking feel",
    colors: ["#0b1121", "#c6a36b", "#6bcf97", "#cf6b6b"],
  },
  {
    id: "brutalist",
    name: "Brutalist",
    description: "Pure black & white, bold typography",
    colors: ["#ffffff", "#000000", "#0a0", "#e00"],
  },
  {
    id: "portola-brand",
    name: "Portola Brand",
    description: "Sage green sidebar, traditional layout",
    colors: ["#f5f7f6", "#6b9080", "#38a169", "#e53e3e"],
  },
];
