"use client";

import { Transaction, HIGH_VALUE_THRESHOLD } from "@/lib/mockData";
import type { ThemeProps } from "./types";

const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtTime = (t: string) => new Date(t).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

export default function TerminalTheme({ transactions, processing, stats, superAdmin, onToggleSuperAdmin, onClearFunds }: ThemeProps) {
  return (
    <div style={{ background: "#0a0e14", color: "#c5cdd9", fontFamily: "'IBM Plex Mono', 'Courier New', monospace", minHeight: "100vh", padding: "16px", fontSize: "13px" }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e2836", paddingBottom: "12px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ color: "#3d9970", fontWeight: 600, fontSize: "16px", letterSpacing: "2px" }}>PORTOLA</span>
          <span style={{ color: "#455568" }}>|</span>
          <span style={{ color: "#455568", fontSize: "11px", letterSpacing: "1px" }}>OPS DASHBOARD</span>
          <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#3d9970", marginLeft: 8, animation: "pulse 2s infinite" }} />
          <span style={{ color: "#3d9970", fontSize: "10px" }}>LIVE</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ color: "#455568", fontSize: "11px" }}>SUPER ADMIN</span>
          <div
            onClick={onToggleSuperAdmin}
            style={{ width: 36, height: 18, borderRadius: 9, background: superAdmin ? "#3d9970" : "#1e2836", cursor: "pointer", position: "relative", transition: "all 0.2s", border: "1px solid " + (superAdmin ? "#3d9970" : "#2a3545") }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 7, background: superAdmin ? "#fff" : "#455568", position: "absolute", top: 1, left: superAdmin ? 19 : 1, transition: "all 0.2s" }} />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: "flex", gap: "24px", marginBottom: "16px", fontSize: "11px" }}>
        {[
          { label: "VOLUME", value: fmt(stats.totalVolume), color: "#c5cdd9" },
          { label: "CLEARED", value: String(stats.cleared), color: "#3d9970" },
          { label: "PENDING", value: String(stats.pending), color: "#f2c94c" },
          { label: "FAILED", value: String(stats.failed), color: "#e74c3c" },
          { label: "HIGH VALUE", value: String(stats.highValue), color: "#e67e22" },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
            <span style={{ color: "#455568", letterSpacing: "1px" }}>{s.label}</span>
            <span style={{ color: s.color, fontWeight: 600, fontSize: "14px" }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ border: "1px solid #1e2836", borderRadius: 4, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0f1520", borderBottom: "1px solid #1e2836" }}>
              {["ID", "CLIENT", "AMOUNT", "STATUS", "TIME", "ACTION"].map((h) => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#455568", fontSize: "10px", letterSpacing: "1.5px", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => {
              const isHighValue = t.amount > HIGH_VALUE_THRESHOLD;
              const isLocked = isHighValue && !superAdmin;
              const isProcessing = processing.has(t.id);
              return (
                <tr
                  key={t.id}
                  style={{
                    borderBottom: "1px solid #111922",
                    background: isHighValue ? "rgba(230,126,34,0.06)" : i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(61,153,112,0.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = isHighValue ? "rgba(230,126,34,0.06)" : i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)")}
                >
                  <td style={{ padding: "7px 12px", color: "#455568" }}>{t.id}</td>
                  <td style={{ padding: "7px 12px", color: "#c5cdd9" }}>
                    {t.clientName}
                    {isHighValue && <span style={{ color: "#e67e22", fontSize: "9px", marginLeft: 6, letterSpacing: "1px", border: "1px solid rgba(230,126,34,0.3)", padding: "1px 4px", borderRadius: 2 }}>HV</span>}
                  </td>
                  <td style={{ padding: "7px 12px", color: isHighValue ? "#e67e22" : "#c5cdd9", fontWeight: isHighValue ? 600 : 400 }}>{fmt(t.amount)}</td>
                  <td style={{ padding: "7px 12px" }}>
                    <span style={{ color: t.status === "Cleared" ? "#3d9970" : t.status === "Pending" ? "#f2c94c" : "#e74c3c", fontSize: "11px" }}>
                      {t.status === "Cleared" ? "●" : t.status === "Pending" ? "◐" : "✕"} {t.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "7px 12px", color: "#455568" }}>{fmtTime(t.timestamp)}</td>
                  <td style={{ padding: "7px 12px" }}>
                    {t.status === "Pending" && (
                      <button
                        onClick={() => !isLocked && onClearFunds(t.id)}
                        disabled={isProcessing || isLocked}
                        style={{
                          background: isLocked ? "transparent" : isProcessing ? "#1e2836" : "rgba(61,153,112,0.15)",
                          color: isLocked ? "#455568" : "#3d9970",
                          border: "1px solid " + (isLocked ? "#1e2836" : "rgba(61,153,112,0.3)"),
                          padding: "3px 10px", borderRadius: 3, fontSize: "10px", letterSpacing: "1px",
                          cursor: isLocked ? "not-allowed" : "pointer", fontFamily: "inherit",
                        }}
                      >
                        {isLocked ? "🔒 LOCKED" : isProcessing ? "CLEARING..." : "CLEAR FUNDS"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}
