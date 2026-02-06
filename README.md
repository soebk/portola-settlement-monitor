# Portola Settlement Monitor

A real-time settlement monitoring dashboard built as a take-home project for Portola. Displays transaction data with live streaming, compliance controls, and multiple UI theme variants.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### Core Dashboard
- **Transaction Ledger** — 50 static transactions + real-time streaming of new transactions (every 2 seconds)
- **Summary Stats** — Total volume, pending count/value, cleared count, failed count
- **Clear Funds** — One-click clearing for pending transactions with 1.5s mock API delay, disabled state while processing
- **Status Badges** — Color-coded Pending (amber), Cleared (green), Failed (red)

### Compliance & Security
- **High-Value Flagging** — Transactions over $10,000 are visually flagged with an "HV" badge, highlighted row, and amber amount text
- **Super Admin Toggle** — When OFF (default), high-value "Clear Funds" buttons are locked. When ON, all transactions are clearable
- **22 of 50 base transactions are high-value** for easy demonstration

### Live Streaming
- **Live Mode** — New transactions stream in every 2 seconds at the top of the ledger
- **Hover-to-Pause** — Hovering over table rows pauses the stream, buffering incoming transactions. A "X new" badge appears to flush the buffer
- **Manual Mode** — Pauses auto-streaming. New transactions buffer and can be flushed manually via the refresh button
- **Dark/Light Mode** — Full theme toggle in the header

### Batch Settlement
- **Checkboxes** — Select individual pending transactions or use the header checkbox to select/deselect all
- **Clear Selected** — Batch action button appears when transactions are selected, showing count
- **Confirmation Modal** — Typing "clear" is required to confirm batch clearing (safety net for bulk operations)
- **Concurrent Processing** — All selected transactions are cleared concurrently via `Promise.allSettled`
- **Resilient Error Handling** — 10% random API failure rate. Successful clears become "Cleared", failures become "Failed", each handled independently
- **High-value aware** — Locked high-value transactions are excluded from selection when Super Admin is off

### Theme Switcher
- **6 UI Themes** — Default, Terminal, Stripe, Luxury, Brutalist, Portola Brand
- **Settings Gear** — Opens a theme picker modal with color swatches and descriptions
- **Lazy Loaded** — Alternate themes use `React.lazy()` + `Suspense` for code splitting
- **Persisted** — Theme choice saved to `localStorage` across sessions

## Architecture

```
src/
├── app/
│   ├── page.tsx          # Main dashboard (state, streaming, theme routing)
│   ├── layout.tsx         # Root layout with fonts
│   └── globals.css        # Global styles, logo theming
├── components/
│   ├── ThemePicker.tsx    # Theme selection modal
│   └── themes/
│       ├── types.ts       # Shared ThemeProps interface, ThemeId, THEME_OPTIONS
│       ├── TerminalTheme.tsx
│       ├── StripeTheme.tsx
│       ├── LuxuryTheme.tsx
│       ├── BrutalistTheme.tsx
│       └── PortolaBrandTheme.tsx
├── lib/
│   ├── mockData.ts        # 50 transactions, types, HIGH_VALUE_THRESHOLD
│   └── mockApi.ts         # clearFunds() (1.5s delay), generateTransaction()
└── public/
    └── logo.svg           # Portola logo
```

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19** with TypeScript
- **Tailwind CSS v4**
- Zero external UI libraries — all components are custom-built with inline styles

## Trade-offs & Notes

- **Inline styles over CSS modules** — Chose inline styles for rapid iteration and self-contained theme components. Each theme is a single file with no external style dependencies, making them easy to swap and compare. In production, I'd extract to CSS modules or a styled-components approach for better maintainability.
- **No virtualization** — The transaction list renders all rows. With 50-150 transactions this is fine, but at scale (10k+) I'd add windowing (e.g., `react-window`).
- **Mock API over real backend** — `setTimeout`-based mock keeps the project self-contained with no server dependencies. The `clearFunds()` and `generateTransaction()` functions are structured to be easily swapped for real API calls.
- **Theme components are presentational** — All state lives in `page.tsx`. Theme components receive props and render. This makes adding new themes trivial (implement `ThemeProps` interface) and keeps state management centralized.
- **No tests** — Given the time constraints, I prioritized a polished, feature-complete UI over test coverage. With more time, I'd add unit tests for the mock API, integration tests for the streaming logic, and visual regression tests for each theme.
- **No error boundaries** — The lazy-loaded themes would benefit from error boundaries for graceful fallback if a theme component fails to load.

## What I'd Improve With More Time

1. **Keyboard navigation** — Full arrow-key navigation through the transaction table
2. **Search/filter** — Filter by client name, amount range, status
3. **Transaction detail panel** — Click a row to see full transaction details in a slide-out panel
4. **Animations** — Row entrance animations for live-streamed transactions (currently instant)
5. **Responsive design** — Currently optimized for desktop; would add mobile breakpoints
6. **Accessibility audit** — ARIA labels, focus management, screen reader testing
