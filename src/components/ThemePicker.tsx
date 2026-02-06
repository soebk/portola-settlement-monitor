"use client";

import { useEffect, useRef } from "react";
import { ThemeId, THEME_OPTIONS } from "./themes/types";

interface ThemePickerProps {
  current: ThemeId;
  onSelect: (id: ThemeId) => void;
  onClose: () => void;
}

export default function ThemePicker({ current, onSelect, onClose }: ThemePickerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9998,
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "fadeBackdrop 0.2s ease-out",
      }}
    >
      <div
        ref={panelRef}
        style={{
          background: "#13161d", border: "1px solid #252a35", borderRadius: 16,
          padding: "28px 28px 24px", width: "100%", maxWidth: 560,
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          animation: "slidePanel 0.25s ease-out",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#e8eaed", letterSpacing: "-0.2px" }}>
              Dashboard Theme
            </div>
            <div style={{ fontSize: 12, color: "#555b69", marginTop: 3 }}>
              Switch between design approaches
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8, border: "1px solid #252a35",
              background: "transparent", color: "#555b69", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#1e232d"; e.currentTarget.style.color = "#e8eaed"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#555b69"; }}
          >
            ✕
          </button>
        </div>

        {/* Theme Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {THEME_OPTIONS.map((theme) => {
            const isActive = current === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => { onSelect(theme.id); onClose(); }}
                style={{
                  background: isActive ? "rgba(232,168,73,0.08)" : "#181c24",
                  border: isActive ? "1.5px solid rgba(232,168,73,0.4)" : "1px solid #252a35",
                  borderRadius: 10, padding: "14px 16px",
                  cursor: "pointer", textAlign: "left",
                  transition: "all 0.15s",
                  position: "relative", overflow: "hidden",
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.borderColor = "#3a3f4c"; e.currentTarget.style.background = isActive ? "rgba(232,168,73,0.1)" : "#1e232d"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = isActive ? "rgba(232,168,73,0.4)" : "#252a35"; e.currentTarget.style.background = isActive ? "rgba(232,168,73,0.08)" : "#181c24"; }}
              >
                {/* Color swatches */}
                <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                  {theme.colors.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        width: i === 0 ? 28 : 14,
                        height: 14,
                        borderRadius: i === 0 ? 4 : 7,
                        background: c,
                        border: c === "#ffffff" || c === "#f8f9fb" || c === "#f5f7f6" ? "1px solid #333" : "none",
                      }}
                    />
                  ))}
                </div>

                {/* Name + active badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? "#e8a849" : "#e8eaed" }}>
                    {theme.name}
                  </span>
                  {isActive && (
                    <span style={{
                      fontSize: 9, fontWeight: 600, color: "#e8a849",
                      background: "rgba(232,168,73,0.15)", padding: "1px 6px",
                      borderRadius: 4, letterSpacing: "0.5px",
                    }}>
                      ACTIVE
                    </span>
                  )}
                </div>

                {/* Description */}
                <div style={{ fontSize: 11, color: "#555b69", lineHeight: 1.4 }}>
                  {theme.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer hint */}
        <div style={{ marginTop: 16, textAlign: "center", fontSize: 10, color: "#3a3f4c", letterSpacing: "0.5px" }}>
          ESC to close · Theme persists across sessions
        </div>
      </div>

      <style>{`
        @keyframes fadeBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slidePanel {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
