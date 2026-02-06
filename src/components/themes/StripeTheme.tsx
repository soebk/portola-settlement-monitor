"use client";

import { HIGH_VALUE_THRESHOLD } from "@/lib/mockData";
import type { ThemeProps } from "./types";

const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtTime = (t: string) => new Date(t).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
const fmtDate = (t: string) => new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const initials = (name: string) => name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
const avatarColors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#14b8a6"];
const getColor = (name: string) => avatarColors[name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % avatarColors.length];

export default function StripeTheme({ transactions, processing, stats, superAdmin, onToggleSuperAdmin, onClearFunds }: ThemeProps) {
  return (
    <div style={{ background: "#f8f9fb", fontFamily: "'DM Sans', -apple-system, sans-serif", minHeight: "100vh", color: "#1a1a2e" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8eaed", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>P</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Portola</span>
          <span style={{ color: "#94a3b8", fontSize: 14, marginLeft: 4 }}>Ops</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b", cursor: "pointer" }}>
            <span>Super Admin</span>
            <div
              onClick={onToggleSuperAdmin}
              style={{ width: 40, height: 22, borderRadius: 11, background: superAdmin ? "#6366f1" : "#e2e8f0", cursor: "pointer", position: "relative", transition: "all 0.2s" }}
            >
              <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", position: "absolute", top: 2, left: superAdmin ? 20 : 2, transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
            </div>
          </label>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Total Volume", value: fmt(stats.totalVolume), sub: `${stats.total} transactions` },
            { label: "Cleared", value: String(stats.cleared), sub: `${stats.total > 0 ? ((stats.cleared / stats.total) * 100).toFixed(0) : 0}% success rate` },
            { label: "Pending", value: String(stats.pending), sub: "Awaiting processing" },
            { label: "Failed", value: String(stats.failed), sub: "Requires attention" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "20px 22px", border: "1px solid #e8eaed" }}>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6, fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8eaed", overflow: "hidden" }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid #f1f3f5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>Transactions</span>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{stats.total} total</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f3f5" }}>
                {["Client", "Amount", "Status", "Time", ""].map((h, i) => (
                  <th key={h || i} style={{ padding: "10px 22px", textAlign: "left", color: "#94a3b8", fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => {
                const hv = t.amount > HIGH_VALUE_THRESHOLD;
                const locked = hv && !superAdmin;
                const isProcessing = processing.has(t.id);
                return (
                  <tr key={t.id} style={{ borderBottom: "1px solid #f8f9fb", transition: "background 0.1s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfd")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "12px 22px", display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: getColor(t.clientName), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#fff", flexShrink: 0 }}>{initials(t.clientName)}</div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                          {t.clientName}
                          {hv && <span style={{ fontSize: 10, color: "#f59e0b", background: "#fef3c7", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>HIGH VALUE</span>}
                        </div>
                        <div style={{ color: "#94a3b8", fontSize: 12 }}>{t.id}</div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 22px", fontWeight: 600, fontSize: 14, color: hv ? "#f59e0b" : "#1a1a2e" }}>{fmt(t.amount)}</td>
                    <td style={{ padding: "12px 22px" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500,
                        color: t.status === "Cleared" ? "#10b981" : t.status === "Pending" ? "#f59e0b" : "#ef4444",
                        background: t.status === "Cleared" ? "#ecfdf5" : t.status === "Pending" ? "#fffbeb" : "#fef2f2",
                        padding: "4px 10px", borderRadius: 6,
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 22px", color: "#94a3b8", fontSize: 13 }}>
                      {fmtDate(t.timestamp)} · {fmtTime(t.timestamp)}
                    </td>
                    <td style={{ padding: "12px 22px" }}>
                      {t.status === "Pending" && (
                        <button
                          onClick={() => !locked && onClearFunds(t.id)}
                          disabled={isProcessing || locked}
                          style={{
                            background: locked ? "#f1f3f5" : isProcessing ? "#e0e7ff" : "#6366f1",
                            color: locked ? "#94a3b8" : "#fff",
                            border: "none", padding: "6px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                            cursor: locked ? "not-allowed" : "pointer", transition: "all 0.15s",
                          }}
                        >
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
