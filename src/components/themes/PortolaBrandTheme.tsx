"use client";

import { HIGH_VALUE_THRESHOLD } from "@/lib/mockData";
import type { ThemeProps } from "./types";

const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtTime = (t: string) => new Date(t).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

export default function PortolaBrandTheme({ transactions, processing, stats, superAdmin, onToggleSuperAdmin, onClearFunds, selected, onToggleSelect, onToggleSelectAll, onClearSelected, batchProcessing }: ThemeProps) {
  const selectablePending = transactions.filter((t) => t.status === "Pending" && !(t.amount > HIGH_VALUE_THRESHOLD && !superAdmin));
  const brand = "#6b9080";
  const brandDark = "#4a7260";
  const brandLight = "#e8f0ec";

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Source Sans 3', -apple-system, sans-serif", color: "#2d3748", background: "#f5f7f6" }}>
      <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <div style={{ width: 220, background: brand, color: "#fff", padding: "24px 0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "0 24px 24px", borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "1px" }}>PORTOLA</div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>Mission Control</div>
        </div>
        <div style={{ padding: "16px 0", flex: 1 }}>
          {["transactions", "compliance", "analytics", "settings"].map((item) => (
            <div key={item} style={{ padding: "10px 24px", cursor: "pointer", background: item === "transactions" ? "rgba(255,255,255,0.15)" : "transparent", borderLeft: item === "transactions" ? "3px solid #fff" : "3px solid transparent", fontSize: 14, fontWeight: item === "transactions" ? 600 : 400, textTransform: "capitalize" as const, transition: "all 0.15s" }}>
              {item}
            </div>
          ))}
        </div>
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 8 }}>Super Admin</div>
          <div onClick={onToggleSuperAdmin} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <div style={{ width: 36, height: 20, borderRadius: 10, background: superAdmin ? "#fff" : "rgba(255,255,255,0.2)", position: "relative", transition: "all 0.2s" }}>
              <div style={{ width: 16, height: 16, borderRadius: 8, background: superAdmin ? brand : "rgba(255,255,255,0.5)", position: "absolute", top: 2, left: superAdmin ? 18 : 2, transition: "all 0.2s" }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 500 }}>{superAdmin ? "ON" : "OFF"}</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "28px 32px", overflow: "auto" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total Volume", value: fmt(stats.totalVolume), accent: false },
            { label: "Cleared", value: String(stats.cleared), accent: false },
            { label: "Pending", value: String(stats.pending), accent: false },
            { label: "Failed", value: String(stats.failed), accent: true },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 10, padding: "18px 20px", border: "1px solid #e2e8e5", borderLeft: s.accent ? "3px solid #e53e3e" : "3px solid " + brand }}>
              <div style={{ fontSize: 12, color: "#718096", fontWeight: 500, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#1a202c" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8e5", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8e5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Transactions</span>
            {selected.size > 0 && (
              <button onClick={onClearSelected} disabled={batchProcessing} style={{ background: batchProcessing ? "#edf2f7" : brand, color: batchProcessing ? "#a0aec0" : "#fff", border: "none", padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: batchProcessing ? "not-allowed" : "pointer" }}>
                {batchProcessing ? "Processing..." : `Clear Selected (${selected.size})`}
              </button>
            )}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: brandLight }}>
                <th style={{ padding: "10px 8px 10px 20px", width: 32 }}>
                  <input type="checkbox" checked={selectablePending.length > 0 && selectablePending.every((t) => selected.has(t.id))} onChange={onToggleSelectAll} style={{ accentColor: brand, cursor: "pointer" }} />
                </th>
                {["ID", "Client", "Amount", "Status", "Time", "Action"].map((h) => (
                  <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: brandDark, letterSpacing: "0.5px", textTransform: "uppercase" as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => {
                const hv = t.amount > HIGH_VALUE_THRESHOLD;
                const locked = hv && !superAdmin;
                const isProcessing = processing.has(t.id);
                return (
                  <tr key={t.id} style={{ borderBottom: "1px solid #f0f2f1", background: hv ? "#fef6e7" : "transparent", transition: "background 0.1s" }} onMouseEnter={(e) => (e.currentTarget.style.background = hv ? "#fdf0d5" : "#f9fbfa")} onMouseLeave={(e) => (e.currentTarget.style.background = hv ? "#fef6e7" : "transparent")}>
                    <td style={{ padding: "11px 8px 11px 20px", width: 32 }}>
                      {t.status === "Pending" && !locked ? (
                        <input type="checkbox" checked={selected.has(t.id)} onChange={() => onToggleSelect(t.id)} style={{ accentColor: brand, cursor: "pointer" }} />
                      ) : null}
                    </td>
                    <td style={{ padding: "11px 20px", fontSize: 13, color: "#a0aec0" }}>{t.id}</td>
                    <td style={{ padding: "11px 20px", fontSize: 14, fontWeight: 500 }}>
                      {t.clientName}
                      {hv && <span style={{ marginLeft: 8, fontSize: 10, color: "#dd6b20", background: "#fefcbf", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>HIGH VALUE</span>}
                    </td>
                    <td style={{ padding: "11px 20px", fontSize: 14, fontWeight: hv ? 700 : 500, color: hv ? "#c05621" : "#2d3748" }}>{fmt(t.amount)}</td>
                    <td style={{ padding: "11px 20px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, color: t.status === "Cleared" ? "#38a169" : t.status === "Pending" ? "#d69e2e" : "#e53e3e" }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "currentColor" }} />
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: "11px 20px", fontSize: 13, color: "#a0aec0" }}>{fmtTime(t.timestamp)}</td>
                    <td style={{ padding: "11px 20px" }}>
                      {t.status === "Pending" && (
                        <button onClick={() => !locked && onClearFunds(t.id)} disabled={isProcessing || locked} style={{ background: locked ? "#edf2f7" : brand, color: locked ? "#a0aec0" : "#fff", border: "none", padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: locked ? "not-allowed" : "pointer", transition: "all 0.15s" }}>
                          {locked ? "🔒 Locked" : isProcessing ? "Clearing..." : "Clear Funds"}
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
    </div>
  );
}
