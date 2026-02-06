"use client";

import { useState, useMemo, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import Image from "next/image";
import { mockTransactions, Transaction, TransactionStatus, HIGH_VALUE_THRESHOLD } from "@/lib/mockData";
import { clearFunds, generateTransaction } from "@/lib/mockApi";
import ThemePicker from "@/components/ThemePicker";
import type { ThemeId } from "@/components/themes/types";

const TerminalTheme = lazy(() => import("@/components/themes/TerminalTheme"));
const StripeTheme = lazy(() => import("@/components/themes/StripeTheme"));
const LuxuryTheme = lazy(() => import("@/components/themes/LuxuryTheme"));
const BrutalistTheme = lazy(() => import("@/components/themes/BrutalistTheme"));
const PortolaBrandTheme = lazy(() => import("@/components/themes/PortolaBrandTheme"));

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  const config = {
    Pending: {
      bg: "bg-accent-amber/10",
      text: "text-accent-amber",
      dot: "bg-accent-amber",
      border: "border-accent-amber/20",
    },
    Cleared: {
      bg: "bg-accent-green/10",
      text: "text-accent-green",
      dot: "bg-accent-green",
      border: "border-accent-green/20",
    },
    Failed: {
      bg: "bg-accent-red/10",
      text: "text-accent-red",
      dot: "bg-accent-red",
      border: "border-accent-red/20",
    },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase border ${config.bg} ${config.text} ${config.border}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}

function StatCard({ label, value, sub, accent }: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="bg-surface-1 border border-border-subtle rounded-lg px-5 py-4 flex flex-col gap-1 transition-colors duration-300">
      <span className="text-[11px] font-medium uppercase tracking-widest text-text-muted">{label}</span>
      <span className={`text-2xl font-mono font-light tracking-tight ${accent || "text-text-primary"}`}>{value}</span>
      {sub && <span className="text-xs text-text-muted font-mono">{sub}</span>}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="processing-spinner h-3 w-3" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20 12" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-text-muted">
      <rect x="2" y="5" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M8.5 5a3.5 3.5 0 1 1-1-2.45" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7 1v2h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThemeToggle({ theme, onToggle }: { theme: string; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative w-[42px] h-[22px] rounded-full transition-colors duration-300 cursor-pointer"
      style={{ background: "var(--toggle-track)" }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span
        className="absolute top-[3px] h-4 w-4 rounded-full transition-all duration-300"
        style={{
          background: "var(--toggle-thumb)",
          left: theme === "dark" ? "3px" : "23px",
        }}
      />
    </button>
  );
}

type FeedMode = "streaming" | "manual";
const MAX_TRANSACTIONS = 200;

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [processing, setProcessing] = useState<Set<string>>(new Set());
  const [theme, setTheme] = useState("dark");
  const [superAdmin, setSuperAdmin] = useState(false);
  const [uiTheme, setUiTheme] = useState<ThemeId>("default");
  const [showPicker, setShowPicker] = useState(false);

  // Load persisted UI theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("portola-ui-theme") as ThemeId | null;
    if (saved) setUiTheme(saved);
  }, []);

  function handleUiThemeChange(id: ThemeId) {
    setUiTheme(id);
    localStorage.setItem("portola-ui-theme", id);
  }

  // Phase 3: Live feed state
  const [feedMode, setFeedMode] = useState<FeedMode>("streaming");
  const [isTableHovered, setIsTableHovered] = useState(false);
  const [bufferCount, setBufferCount] = useState(0);
  const bufferRef = useRef<Transaction[]>([]);
  const txnCounterRef = useRef(51);
  const feedModeRef = useRef(feedMode);
  const isTableHoveredRef = useRef(isTableHovered);

  // Keep refs in sync for the interval callback
  useEffect(() => { feedModeRef.current = feedMode; }, [feedMode]);
  useEffect(() => { isTableHoveredRef.current = isTableHovered; }, [isTableHovered]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Stream interval — runs once, reads current state from refs
  useEffect(() => {
    const interval = setInterval(() => {
      const newTx = generateTransaction(txnCounterRef.current++);
      if (feedModeRef.current === "streaming" && !isTableHoveredRef.current) {
        setTransactions(prev => [newTx, ...prev].slice(0, MAX_TRANSACTIONS));
      } else {
        bufferRef.current = [newTx, ...bufferRef.current];
        setBufferCount(c => c + 1);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Flush buffered transactions into the main list
  const flushBuffer = useCallback(() => {
    const items = bufferRef.current;
    if (items.length === 0) return;
    bufferRef.current = [];
    setBufferCount(0);
    setTransactions(prev => [...items, ...prev].slice(0, MAX_TRANSACTIONS));
  }, []);

  function handleTableMouseEnter() {
    setIsTableHovered(true);
  }

  function handleTableMouseLeave() {
    setIsTableHovered(false);
    if (feedMode === "streaming") {
      flushBuffer();
    }
  }

  function handleFeedModeChange(mode: FeedMode) {
    setFeedMode(mode);
    if (mode === "streaming") {
      flushBuffer();
    }
  }

  const stats = useMemo(() => {
    const pending = transactions.filter((t) => t.status === "Pending");
    const cleared = transactions.filter((t) => t.status === "Cleared");
    const failed = transactions.filter((t) => t.status === "Failed");
    const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
    const pendingVolume = pending.reduce((sum, t) => sum + t.amount, 0);
    const highValue = transactions.filter((t) => t.amount > HIGH_VALUE_THRESHOLD);

    return {
      total: transactions.length,
      pending: pending.length,
      cleared: cleared.length,
      failed: failed.length,
      totalVolume,
      pendingVolume,
      highValue: highValue.length,
    };
  }, [transactions]);

  async function handleClearFunds(id: string) {
    setProcessing((prev) => new Set(prev).add(id));
    const result = await clearFunds(id);
    if (result.success) {
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === id ? { ...tx, status: "Cleared" as const } : tx))
      );
    }
    setProcessing((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  const rowBorderColor: Record<TransactionStatus, string> = {
    Pending: "border-l-accent-amber/40",
    Cleared: "border-l-accent-green/20",
    Failed: "border-l-accent-red/30",
  };

  const isPaused = feedMode === "manual" || (feedMode === "streaming" && isTableHovered);

  const sharedThemeProps = {
    transactions,
    processing,
    stats,
    superAdmin,
    onToggleSuperAdmin: () => setSuperAdmin(!superAdmin),
    onClearFunds: handleClearFunds,
  };

  // Alternate theme rendering
  if (uiTheme !== "default") {
    const ThemeComponent = {
      terminal: TerminalTheme,
      stripe: StripeTheme,
      luxury: LuxuryTheme,
      brutalist: BrutalistTheme,
      "portola-brand": PortolaBrandTheme,
    }[uiTheme];

    return (
      <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0c0e12", color: "#555" }}>Loading theme…</div>}>
        <div style={{ position: "relative" }}>
          {/* Floating settings button for alternate themes */}
          <button
            onClick={() => setShowPicker(true)}
            style={{
              position: "fixed", bottom: 20, right: 20, zIndex: 100,
              width: 44, height: 44, borderRadius: 12,
              background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.85)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.7)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
            aria-label="Open theme picker"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.3" />
              <path d="M13.5 8a5.5 5.5 0 0 1-.08.92l1.56 1.22a.37.37 0 0 1 .09.47l-1.48 2.56a.37.37 0 0 1-.45.16l-1.84-.74a5.47 5.47 0 0 1-1.59.92l-.28 1.96a.36.36 0 0 1-.36.31H6.13a.36.36 0 0 1-.36-.31l-.28-1.96a5.74 5.74 0 0 1-1.59-.92l-1.84.74a.36.36 0 0 1-.45-.16L.13 10.61a.36.36 0 0 1 .09-.47l1.56-1.22A5.62 5.62 0 0 1 1.7 8c0-.31.03-.62.08-.92L.22 5.86a.37.37 0 0 1-.09-.47l1.48-2.56a.37.37 0 0 1 .45-.16l1.84.74a5.47 5.47 0 0 1 1.59-.92l.28-1.96A.36.36 0 0 1 6.13.22h2.94c.18 0 .33.13.36.31l.28 1.96c.58.22 1.12.53 1.59.92l1.84-.74a.36.36 0 0 1 .45.16l1.48 2.56a.36.36 0 0 1-.09.47l-1.56 1.22c.05.3.08.61.08.92Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          </button>
          <ThemeComponent {...sharedThemeProps} />
          {showPicker && <ThemePicker current={uiTheme} onSelect={handleUiThemeChange} onClose={() => setShowPicker(false)} />}
        </div>
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-surface-0 font-sans transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border-subtle bg-surface-1/60 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
        <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Portola"
              width={114}
              height={28}
              className="logo-themed"
              priority
              unoptimized
            />
            <div className="h-4 w-px bg-border" />
            <span className="text-[11px] text-text-muted tracking-wide">Settlement Monitor</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted">
              <span className={`h-1.5 w-1.5 rounded-full ${isPaused ? "bg-accent-amber" : "bg-accent-green animate-pulse"}`} />
              {isPaused ? "Paused" : "Live"}
            </div>
            <button
              onClick={() => setShowPicker(true)}
              className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors duration-200 cursor-pointer"
              aria-label="Open theme picker"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.3" />
                <path d="M13.5 8a5.5 5.5 0 0 1-.08.92l1.56 1.22a.37.37 0 0 1 .09.47l-1.48 2.56a.37.37 0 0 1-.45.16l-1.84-.74a5.47 5.47 0 0 1-1.59.92l-.28 1.96a.36.36 0 0 1-.36.31H6.13a.36.36 0 0 1-.36-.31l-.28-1.96a5.74 5.74 0 0 1-1.59-.92l-1.84.74a.36.36 0 0 1-.45-.16L.13 10.61a.36.36 0 0 1 .09-.47l1.56-1.22A5.62 5.62 0 0 1 1.7 8c0-.31.03-.62.08-.92L.22 5.86a.37.37 0 0 1-.09-.47l1.48-2.56a.37.37 0 0 1 .45-.16l1.84.74a5.47 5.47 0 0 1 1.59-.92l.28-1.96A.36.36 0 0 1 6.13.22h2.94c.18 0 .33.13.36.31l.28 1.96c.58.22 1.12.53 1.59.92l1.84-.74a.36.36 0 0 1 .45.16l1.48 2.56a.36.36 0 0 1-.09.47l-1.56 1.22c.05.3.08.61.08.92Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </button>
            <ThemeToggle theme={theme} onToggle={() => setTheme(theme === "dark" ? "light" : "dark")} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-6">
        {/* Super Admin Toggle */}
        <div className="mb-5 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSuperAdmin(!superAdmin)}
              className={`
                relative w-[44px] h-[24px] rounded-full transition-colors duration-300 cursor-pointer
                ${superAdmin
                  ? "bg-accent-red"
                  : "bg-surface-3 border border-border"
                }
              `}
              aria-label="Toggle Super Admin mode"
            >
              <span
                className={`
                  absolute top-[3px] h-[18px] w-[18px] rounded-full transition-all duration-300
                  ${superAdmin ? "left-[23px] bg-white" : "left-[3px] bg-text-muted"}
                `}
              />
            </button>
            <div className="flex flex-col">
              <span className={`text-[12px] font-medium ${superAdmin ? "text-accent-red" : "text-text-secondary"}`}>
                Super Admin
              </span>
              <span className="text-[10px] text-text-muted font-mono">
                {superAdmin ? "HIGH-VALUE OVERRIDE ACTIVE" : "High-value transactions locked"}
              </span>
            </div>
          </div>
          {stats.highValue > 0 && (
            <span className="text-[11px] font-mono text-high-value-text">
              {stats.highValue} high-value ({">"}$10k)
            </span>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-fade-in">
          <StatCard label="Total Volume" value={formatCurrency(stats.totalVolume)} sub={`${stats.total} transactions`} />
          <StatCard label="Pending" value={String(stats.pending)} sub={formatCurrency(stats.pendingVolume)} accent="text-accent-amber" />
          <StatCard label="Cleared" value={String(stats.cleared)} accent="text-accent-green" />
          <StatCard label="Failed" value={String(stats.failed)} accent="text-accent-red" />
        </div>

        {/* Transaction Table — hover zone for stream pausing */}
        <div
          className="bg-surface-1 border border-border-subtle rounded-lg overflow-hidden animate-fade-in transition-colors duration-300"
          style={{ animationDelay: "100ms" }}
        >
          {/* Table header with feed controls */}
          <div className="px-5 py-3 border-b border-border flex items-center justify-between gap-4">
            <span className="text-[12px] font-medium text-text-secondary tracking-wide uppercase">
              Transaction Ledger
            </span>

            <div className="flex items-center gap-3">
              {/* Feed mode segmented control */}
              <div className="flex rounded-md border border-border overflow-hidden">
                <button
                  onClick={() => handleFeedModeChange("streaming")}
                  className={`px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
                    feedMode === "streaming"
                      ? "bg-accent-green/15 text-accent-green"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  Live
                </button>
                <button
                  onClick={() => handleFeedModeChange("manual")}
                  className={`px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors duration-200 cursor-pointer border-l border-border ${
                    feedMode === "manual"
                      ? "bg-accent-blue/15 text-accent-blue"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  Manual
                </button>
              </div>

              {/* Buffer badge / refresh button */}
              {bufferCount > 0 && (
                <button
                  onClick={flushBuffer}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-medium
                    bg-accent-amber/15 text-accent-amber border border-accent-amber/25
                    hover:bg-accent-amber/25 cursor-pointer transition-colors duration-200"
                >
                  <RefreshIcon />
                  {bufferCount} new
                </button>
              )}

              {/* Hover-pause indicator (streaming, no buffer yet) */}
              {feedMode === "streaming" && isTableHovered && bufferCount === 0 && (
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                  Paused
                </span>
              )}

              {/* Awaiting clearance count */}
              {stats.pending > 0 && (
                <span className="text-[11px] font-mono text-text-muted">
                  <span className="text-accent-amber">{stats.pending} awaiting clearance</span>
                </span>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">TXN ID</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">Client</th>
                  <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">Amount</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">Status</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">Time</th>
                  <th className="px-5 py-2.5 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">Action</th>
                </tr>
              </thead>
              <tbody
                onMouseEnter={handleTableMouseEnter}
                onMouseLeave={handleTableMouseLeave}
              >
                {transactions.map((tx, i) => {
                  const isHighValue = tx.amount > HIGH_VALUE_THRESHOLD;
                  const isLocked = isHighValue && !superAdmin;

                  return (
                    <tr
                      key={tx.id}
                      className={`
                        border-b border-border-subtle last:border-0
                        border-l-2 ${isHighValue ? "border-l-high-value-border" : rowBorderColor[tx.status]}
                        ${isHighValue ? "bg-high-value-bg" : "hover:bg-surface-2/50"}
                        transition-colors duration-150
                        animate-row-in
                      `}
                      style={{ animationDelay: `${Math.min(i * 20, 400)}ms` }}
                    >
                      <td className="px-5 py-3 text-[12px] font-mono font-medium text-text-secondary whitespace-nowrap">
                        {tx.id}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-text-primary whitespace-nowrap">
                        {tx.clientName}
                      </td>
                      <td className={`px-4 py-3 text-right text-[13px] font-mono font-light whitespace-nowrap tabular-nums ${isHighValue ? "text-high-value-text font-medium" : "text-text-primary"}`}>
                        {formatCurrency(tx.amount)}
                        {isHighValue && (
                          <span className="ml-1.5 inline-flex items-center text-[9px] font-sans font-semibold uppercase tracking-wider text-high-value-text opacity-70">
                            HV
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-[12px] font-mono text-text-secondary">{formatTime(tx.timestamp)}</span>
                          <span className="text-[10px] font-mono text-text-muted">{formatDate(tx.timestamp)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        {tx.status === "Pending" && (
                          isLocked ? (
                            <span className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-medium text-text-muted bg-surface-3 border border-border cursor-not-allowed">
                              <LockIcon />
                              Locked
                            </span>
                          ) : (
                            <button
                              onClick={() => handleClearFunds(tx.id)}
                              disabled={processing.has(tx.id)}
                              className={`
                                inline-flex items-center gap-1.5 rounded-md px-3 py-1.5
                                text-[11px] font-medium tracking-wide
                                transition-all duration-200 cursor-pointer
                                ${processing.has(tx.id)
                                  ? "bg-surface-3 text-text-muted border border-border cursor-not-allowed"
                                  : "bg-accent-amber/15 text-accent-amber border border-accent-amber/25 hover:bg-accent-amber/25 hover:border-accent-amber/40 btn-clear-pulse"
                                }
                              `}
                            >
                              {processing.has(tx.id) ? (
                                <>
                                  <Spinner />
                                  Processing
                                </>
                              ) : (
                                "Clear Funds"
                              )}
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between px-1">
          <span className="text-[10px] font-mono text-text-muted tracking-wide">PORTOLA SETTLEMENTS v1.0</span>
          <span className="text-[10px] font-mono text-text-muted">{stats.total} records</span>
        </div>
      </main>
      {showPicker && <ThemePicker current={uiTheme} onSelect={handleUiThemeChange} onClose={() => setShowPicker(false)} />}
    </div>
  );
}
