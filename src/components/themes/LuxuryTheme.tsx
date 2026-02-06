"use client";

import { HIGH_VALUE_THRESHOLD } from "@/lib/mockData";
import type { ThemeProps } from "./types";

const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtTime = (t: string) => new Date(t).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

export default function LuxuryTheme({
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
    <div style={{ background: "#0b1121", color: "#c8d1dc", fontFamily: "'Cormorant Garamond', Georgia, serif", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ padding: "20px 40px", borderBottom: "1px solid rgba(198,163,107,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 600, color: "#c6a36b", letterSpacing: "3px", textTransform: "uppercase" as const }}>Portola</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: "#4a5568", letterSpacing: "2px", marginTop: 2 }}>MISSION CONTROL</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ textAlign: "right" as const }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: "#4a5568", letterSpacing: "1px" }}>TOTAL VOLUME</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: "#e8dcc8" }}>{fmt(stats.totalVolume)}</div>
          </div>
          <div style={{ width: 1, height: 36, background: "rgba(198,163,107,0.15)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: "#4a5568", letterSpacing: "1px" }}>OVERRIDE</span>
            <div onClick={onToggleSuperAdmin} style={{ width: 44, height: 24, borderRadius: 12, background: superAdmin ? "linear-gradient(135deg, #c6a36b, #a07d45)" : "#1a2332", border: "1px solid " + (superAdmin ? "#c6a36b" : "#2a3545"), cursor: "pointer", position: "relative", transition: "all 0.3s" }}>
              <div style={{ width: 18, height: 18, borderRadius: 9, background: superAdmin ? "#fff" : "#3a4a5c", position: "absolute", top: 2, left: superAdmin ? 23 : 2, transition: "all 0.3s" }} />
            </div>
          </div>
          <div style={{ width: 1, height: 36, background: "rgba(198,163,107,0.15)" }} />
          <button
            onClick={onOpenThemePicker}
            style={{
              background: "rgba(198,163,107,0.08)",
              border: "1px solid rgba(198,163,107,0.2)",
              color: "#c6a36b",
              padding: "6px 14px",
              borderRadius: 4,
              fontFamily: "'Outfit', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "1px",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 13 }}>&#9881;</span>
            THEMES
          </button>
        </div>
      </div>

      {/* Streaming Controls */}
      <div style={{ padding: "14px 40px", borderBottom: "1px solid rgba(198,163,107,0.08)", display: "flex", alignItems: "center", gap: 20 }}>
        {/* Live / Manual segmented toggle */}
        <div style={{ display: "flex", borderRadius: 4, overflow: "hidden", border: "1px solid rgba(198,163,107,0.2)" }}>
          <button
            onClick={() => onFeedModeChange("streaming")}
            style={{
              background: feedMode === "streaming" ? "linear-gradient(135deg, #c6a36b, #a07d45)" : "transparent",
              color: feedMode === "streaming" ? "#0b1121" : "#4a5568",
              border: "none",
              padding: "6px 16px",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "1px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            LIVE
          </button>
          <button
            onClick={() => onFeedModeChange("manual")}
            style={{
              background: feedMode === "manual" ? "linear-gradient(135deg, #c6a36b, #a07d45)" : "transparent",
              color: feedMode === "manual" ? "#0b1121" : "#4a5568",
              border: "none",
              borderLeft: "1px solid rgba(198,163,107,0.2)",
              padding: "6px 16px",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "1px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            MANUAL
          </button>
        </div>

        {/* Buffer badge */}
        {bufferCount > 0 && (
          <button
            onClick={onFlushBuffer}
            style={{
              background: "rgba(198,163,107,0.12)",
              border: "1px solid rgba(198,163,107,0.25)",
              color: "#c6a36b",
              padding: "5px 14px",
              borderRadius: 4,
              fontFamily: "'Outfit', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "1px",
              cursor: "pointer",
              transition: "all 0.2s",
              animation: "luxPulse 2s infinite",
            }}
          >
            {bufferCount} NEW
          </button>
        )}

        {/* Live / Paused indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <span
            style={{
              display: "inline-block",
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: isPaused ? "#cf6b6b" : "#6bcf97",
              boxShadow: isPaused ? "0 0 6px rgba(207,107,107,0.4)" : "0 0 6px rgba(107,207,151,0.4)",
              animation: isPaused ? "none" : "luxPulse 2s infinite",
            }}
          />
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: isPaused ? "#cf6b6b" : "#6bcf97", letterSpacing: "1px", fontWeight: 500 }}>
            {isPaused ? "PAUSED" : "LIVE"}
          </span>
        </div>
      </div>

      {/* Batch clear */}
      {selected.size > 0 && (
        <div style={{ padding: "16px 40px 0" }}>
          <button onClick={onClearSelected} disabled={batchProcessing} style={{ background: batchProcessing ? "rgba(198,163,107,0.1)" : "linear-gradient(135deg, #c6a36b, #a07d45)", color: batchProcessing ? "#c6a36b" : "#0b1121", border: "none", padding: "8px 24px", borderRadius: 4, fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "1px", cursor: batchProcessing ? "not-allowed" : "pointer" }}>
            {batchProcessing ? "PROCESSING..." : `CLEAR SELECTED (${selected.size})`}
          </button>
        </div>
      )}

      {/* Table */}
      <div style={{ padding: "32px 40px" }}>
        <div style={{ borderRadius: 4, overflow: "hidden", border: "1px solid rgba(198,163,107,0.1)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(198,163,107,0.04)" }}>
                <th style={{ padding: "14px 10px 14px 20px", width: 32, borderBottom: "1px solid rgba(198,163,107,0.08)" }}>
                  <input type="checkbox" checked={selectablePending.length > 0 && selectablePending.every((t) => selected.has(t.id))} onChange={onToggleSelectAll} style={{ accentColor: "#c6a36b", cursor: "pointer" }} />
                </th>
                {["Transaction", "Client", "Amount", "Status", "Time", "Action"].map((h) => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontFamily: "'Outfit', sans-serif", fontSize: 10, color: "#5a6a7c", letterSpacing: "2px", fontWeight: 500, textTransform: "uppercase" as const, borderBottom: "1px solid rgba(198,163,107,0.08)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody onMouseEnter={onTableMouseEnter} onMouseLeave={onTableMouseLeave}>
              {transactions.map((t) => {
                const hv = t.amount > HIGH_VALUE_THRESHOLD;
                const locked = hv && !superAdmin;
                const isProcessing = processing.has(t.id);
                return (
                  <tr key={t.id} style={{ borderBottom: "1px solid rgba(198,163,107,0.05)", background: hv ? "rgba(198,163,107,0.03)" : "transparent", transition: "background 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(198,163,107,0.06)")} onMouseLeave={(e) => (e.currentTarget.style.background = hv ? "rgba(198,163,107,0.03)" : "transparent")}>
                    <td style={{ padding: "14px 10px 14px 20px", width: 32 }}>
                      {t.status === "Pending" && !locked ? (
                        <input type="checkbox" checked={selected.has(t.id)} onChange={() => onToggleSelect(t.id)} style={{ accentColor: "#c6a36b", cursor: "pointer" }} />
                      ) : null}
                    </td>
                    <td style={{ padding: "14px 20px", fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "#4a5568" }}>{t.id}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ fontSize: 15, color: "#e8dcc8", fontWeight: 500 }}>{t.clientName}</div>
                      {hv && <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, color: "#c6a36b", letterSpacing: "1.5px", marginTop: 3 }}>&#9670; HIGH VALUE</div>}
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 16, fontWeight: 600, color: hv ? "#c6a36b" : "#e8dcc8" }}>{fmt(t.amount)}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 500, color: t.status === "Cleared" ? "#6bcf97" : t.status === "Pending" ? "#c6a36b" : "#cf6b6b", letterSpacing: "0.5px" }}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "#4a5568" }}>{fmtTime(t.timestamp)}</td>
                    <td style={{ padding: "14px 20px" }}>
                      {t.status === "Pending" && (
                        <button onClick={() => !locked && onClearFunds(t.id)} disabled={isProcessing || locked} style={{ background: locked ? "transparent" : isProcessing ? "rgba(198,163,107,0.1)" : "linear-gradient(135deg, #c6a36b, #a07d45)", color: locked ? "#4a5568" : "#0b1121", border: locked ? "1px solid #2a3545" : "none", padding: "7px 20px", borderRadius: 4, fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "1px", cursor: locked ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
                          {locked ? "RESTRICTED" : isProcessing ? "CLEARING..." : "CLEAR FUNDS"}
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
      <style>{`@keyframes luxPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </div>
  );
}
