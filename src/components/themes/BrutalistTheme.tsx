"use client";

import { HIGH_VALUE_THRESHOLD } from "@/lib/mockData";
import type { ThemeProps } from "./types";

const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtTime = (t: string) => new Date(t).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

export default function BrutalistTheme({
  transactions,
  processing,
  stats,
  superAdmin,
  onToggleSuperAdmin,
  onClearFunds,
  selected,
  onToggleSelect,
  onToggleSelectAll,
  onClearSelected,
  batchProcessing,
  feedMode,
  onFeedModeChange,
  bufferCount,
  onFlushBuffer,
  isPaused,
  onTableMouseEnter,
  onTableMouseLeave,
  onOpenThemePicker,
}: ThemeProps) {
  const selectablePending = transactions.filter((t) => t.status === "Pending" && !(t.amount > HIGH_VALUE_THRESHOLD && !superAdmin));
  return (
    <div style={{ background: "#fff", color: "#000", fontFamily: "'Space Grotesk', 'Helvetica Neue', sans-serif", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ borderBottom: "3px solid #000", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1, letterSpacing: "-1px" }}>PORTOLA</div>
          <div style={{ fontSize: 12, color: "#888", letterSpacing: "3px", marginTop: 4 }}>OPS DASHBOARD</div>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center", fontSize: 13 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{stats.pending} PENDING</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#e00" }}>{stats.failed} FAILED</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#c90" }}>{stats.highValue} FLAGGED</span>
          <div style={{ height: 20, width: 1, background: "#ddd" }} />
          <div onClick={onOpenThemePicker} style={{ cursor: "pointer", padding: "4px 12px", border: "2px solid #000", background: "#fff", color: "#000", fontSize: 11, fontWeight: 700, letterSpacing: "1px", transition: "all 0.15s", userSelect: "none" }}>
            THEMES
          </div>
          <div onClick={onToggleSuperAdmin} style={{ cursor: "pointer", padding: "4px 12px", border: "2px solid #000", background: superAdmin ? "#000" : "#fff", color: superAdmin ? "#fff" : "#000", fontSize: 11, fontWeight: 700, letterSpacing: "1px", transition: "all 0.15s", userSelect: "none" }}>
            {superAdmin ? "ADMIN: ON" : "ADMIN: OFF"}
          </div>
        </div>
      </div>

      {/* Streaming Controls */}
      <div style={{ borderBottom: "2px solid #000", padding: "10px 32px", display: "flex", alignItems: "center", gap: 24 }}>
        {/* Live / Manual segmented toggle */}
        <div style={{ display: "flex", border: "2px solid #000" }}>
          <div
            onClick={() => onFeedModeChange("streaming")}
            style={{
              padding: "4px 14px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "1px",
              cursor: "pointer",
              userSelect: "none",
              fontFamily: "'Space Grotesk', sans-serif",
              background: feedMode === "streaming" ? "#000" : "#fff",
              color: feedMode === "streaming" ? "#fff" : "#000",
              transition: "all 0.15s",
            }}
          >
            LIVE
          </div>
          <div
            onClick={() => onFeedModeChange("manual")}
            style={{
              padding: "4px 14px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "1px",
              cursor: "pointer",
              userSelect: "none",
              fontFamily: "'Space Grotesk', sans-serif",
              borderLeft: "2px solid #000",
              background: feedMode === "manual" ? "#000" : "#fff",
              color: feedMode === "manual" ? "#fff" : "#000",
              transition: "all 0.15s",
            }}
          >
            MANUAL
          </div>
        </div>

        {/* Buffer badge */}
        {bufferCount > 0 && (
          <div
            onClick={onFlushBuffer}
            style={{
              padding: "4px 14px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "1px",
              cursor: "pointer",
              userSelect: "none",
              fontFamily: "'JetBrains Mono', monospace",
              border: "2px solid #000",
              background: "#000",
              color: "#fff",
              transition: "all 0.15s",
            }}
          >
            {bufferCount} NEW
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Live / Paused indicator */}
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: isPaused ? "#888" : "#000" }}>
          {isPaused ? "PAUSED" : "LIVE"}
        </span>
      </div>

      {/* Batch clear */}
      {selected.size > 0 && (
        <div style={{ padding: "16px 32px 0" }}>
          <button onClick={onClearSelected} disabled={batchProcessing} style={{ background: batchProcessing ? "#fff" : "#000", color: batchProcessing ? "#888" : "#fff", border: "2px solid #000", padding: "6px 18px", fontSize: 11, fontWeight: 700, letterSpacing: "1px", cursor: batchProcessing ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {batchProcessing ? "PROCESSING..." : `CLEAR SELECTED (${selected.size}) →`}
          </button>
        </div>
      )}

      {/* Table */}
      <div style={{ padding: "0 32px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #000" }}>
              <th style={{ padding: "12px 8px 12px 0", width: 32 }}>
                <input type="checkbox" checked={selectablePending.length > 0 && selectablePending.every((t) => selected.has(t.id))} onChange={onToggleSelectAll} style={{ cursor: "pointer" }} />
              </th>
              {["ID", "CLIENT", "AMOUNT", "STATUS", "TIME", ""].map((h, i) => (
                <th key={h || i} style={{ padding: "12px 0", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#888" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody onMouseEnter={onTableMouseEnter} onMouseLeave={onTableMouseLeave}>
            {transactions.map((t) => {
              const isHv = t.amount > HIGH_VALUE_THRESHOLD;
              const locked = isHv && !superAdmin;
              const isProcessing = processing.has(t.id);
              return (
                <tr key={t.id} style={{ borderBottom: "1px solid #eee" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "10px 8px 10px 0", width: 32 }}>
                    {t.status === "Pending" && !locked ? (
                      <input type="checkbox" checked={selected.has(t.id)} onChange={() => onToggleSelect(t.id)} style={{ cursor: "pointer" }} />
                    ) : null}
                  </td>
                  <td style={{ padding: "10px 0", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#aaa" }}>{t.id}</td>
                  <td style={{ padding: "10px 0" }}>
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{t.clientName}</span>
                    {isHv && <span style={{ display: "inline-block", width: 8, height: 8, background: "#f5a623", marginLeft: 8 }} />}
                  </td>
                  <td style={{ padding: "10px 0", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: isHv ? 700 : 400, color: isHv ? "#c90" : "#000" }}>{fmt(t.amount)}</td>
                  <td style={{ padding: "10px 0" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, color: t.status === "Cleared" ? "#0a0" : t.status === "Pending" ? "#888" : "#e00" }}>
                      {t.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "10px 0", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#aaa" }}>{fmtTime(t.timestamp)}</td>
                  <td style={{ padding: "10px 0", textAlign: "right" }}>
                    {t.status === "Pending" && (
                      <button onClick={() => !locked && onClearFunds(t.id)} disabled={isProcessing || locked} style={{ background: locked ? "#fff" : "#000", color: locked ? "#aaa" : "#fff", border: locked ? "1px solid #ddd" : "2px solid #000", padding: "5px 16px", fontSize: 11, fontWeight: 700, letterSpacing: "1px", cursor: locked ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all 0.1s" }}>
                        {locked ? "LOCKED" : isProcessing ? "..." : "CLEAR →"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
