# Local Visibility — SOC Dashboard

Production-quality web frontend ("SOC dashboard") for **Local Visibility**, an endpoint software-supply-chain visibility platform.

The dashboard inventories browser extensions (Chrome, Edge, Brave, Arc, Firefox), IDE extensions (VS Code, Cursor, Windsurf, JetBrains), packages (npm, PyPI, Homebrew, Go), AI models (Ollama, Hugging Face), MCP servers, agentic skills, and Git repositories across macOS endpoints. Each asset is analyzed locally for risky permissions, dangerous AST patterns, and exfiltration flows, enriched centrally with threat intelligence (TPCI malicious-extension feed, OSV, VirusTotal, AbuseIPDB, registry provenance), and evaluated with a unified risk score.

---

## 1. Quick Start & Setup

### Prerequisites
- Node.js $\ge 18$
- npm $\ge 9$

### Installation & Run
```bash
# Install dependencies
npm install

# Start local dev server (default port 3000)
npm run dev

# Run type check and lint
npm run lint

# Build production bundle (static files in dist/)
npm run build
```

---

## 2. Environment Variables

| Variable | Default (Local) | Default (Preview) | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `""` | `""` | Base URL for the backend API. Empty string uses the same-origin proxy. |
| `VITE_USE_MOCKS` | `false` | `true` | When `true`, enables in-memory mock transport with realistic test fixtures. |

---

## 3. Connecting to the Real Backend

When `VITE_USE_MOCKS=false`, the frontend connects to the authoritative Local Visibility backend:
1. **Dev Server Proxy**: In `vite.config.ts`, `/api` is proxied to `http://127.0.0.1:8765` with `changeOrigin: false`. This ensures the `Host` and `Origin` headers match exactly, satisfying the backend's CSRF origin enforcement.
2. **Authentication**: All authenticated requests use the `HttpOnly` session cookie (`lv_session`) set by the backend upon login (`credentials: "same-origin"`). Session tokens are never cached in `localStorage`, `sessionStorage`, or JavaScript cookies.
3. **Request Tracing**: All requests send a cryptographically random `X-Request-ID` header for server correlation and auditing.

---

## 4. Extracted Design Tokens

The visual design is derived pixel-faithfully from the target platform screenshots:

### Color Palette
- **Canvas / Background**: `#F8FAFC` (`--bg-canvas`, neutral cool light slate)
- **Surfaces / Cards**: `#FFFFFF` (`--bg-surface`, hairline 1px border `#E2E8F0`)
- **Brand Wordmark**: `#E11D48` (`KOI` coral/red brand token)
- **Text Primary**: `#0F172A` (slate-900)
- **Text Secondary**: `#475569` (slate-600)
- **Text Muted**: `#94A3B8` (slate-400)
- **Critical / Malware**: `#DC2626` text, `#FEF2F2` background, `#FECACA` border
- **High Risk**: `#EA580C` text, `#FFF7ED` background, `#FED7AA` border
- **Medium Risk**: `#D97706` text, `#FFFBEB` background, `#FEF3C7` border
- **Low Risk**: `#0284C7` text, `#F0F9FF` background, `#BAE6FD` border
- **Informational**: `#64748B` text, `#F8FAFC` background, `#E2E8F0` border
- **Status Badges**:
  - `Blocked`: `#B91C1C` text, `#FEF2F2` background, `#FECACA` border
  - `Ungoverned`: `#475569` text, dashed `#CBD5E1` border
  - `Allowed`: `#047857` text, `#ECFDF5` background

### Typography Scale
- **Display & Navigation**: Plus Jakarta Sans (`--font-sans`)
- **Tabular Figures & Code**: JetBrains Mono (`--font-mono`), `font-variant-numeric: tabular-nums`
- **KPI Metrics**: 28px–32px font-bold
- **Section Headers**: 14px–16px font-semibold
- **Body & Data Tables**: 12px–13px font-normal/medium

---

## 5. Mapping: Screenshot Elements $\rightarrow$ Real API Fields

| Screenshot Element | Backend API Source | Field / Calculation |
| :--- | :--- | :--- |
| **Malware Detected Card** | `GET /api/v1/summary` | `intelligence.known_malware` + `device_count` |
| **Environment KPI Strip** | `GET /api/v1/summary` | `item_count` (unique), `device_count` (endpoints) |
| **Item Types Filter Chips** | `GET /api/v1/summary` | `categories[].count` mapped to display categories |
| **Platforms Quick Bar** | `GET /api/v1/endpoints` + `/items` | Aggregated platform totals (VS Code, Chrome, etc.) |
| **Risk Cards (Crit/High/Med/Low)** | `GET /api/v1/summary` | `intelligence.by_severity` and `risk.by_severity` |
| **Attack Surface Chart** | `GET /api/v1/summary` / `/items` | Stacked severity distribution across categories |
| **Risk Overtime Chart** | `GET /api/v1/runs` + `/summary` | Severity totals across scan run history |
| **Governed Items Progress Bar** | `GET /api/v1/summary` | `intelligence.completed` vs `known_malware` vs `pending` |
| **Insights Panel** | `GET /api/v1/items` | Real critical threats (e.g. `bert-tiny-torch-vuln`, `eicar`) |
| **Inventory Table Columns** | `GET /api/v1/items` | `name`, `platform`, `risk_severity`, `version`, `publisher` |
| **Asset Risk Drawer** | `GET /api/v1/items` | `risk_assessment.result`, `analysis.data_flows`, code evidence |

---

## 6. Design Elements Not Yet Backed by the API

Per Section 2.4 and 7.1 of the design brief, features shown in the screenshots that have no corresponding backend endpoints are handled transparently:

1. **Automated Remediation Daemon ("Auto remediated / last 30d" & "Open remediations")**:
   - *Status*: The Local Visibility collector is read-only; remediation is handled manually by SOC analysts through EDR/MDM.
   - *Handling*: Maintained in the KPI grid to preserve the 5-card layout integrity, displaying `0` with informative status ("No open remediation items").
2. **Saved Query AST Engine (`+ Group`, `+ Add Condition` in Query Builder)**:
   - *Status*: The backend supports full-text search (`q`), category filtering (`category`), and pagination (`limit`, `offset`).
   - *Handling*: The visual Query Builder bar is fully interactive with server-side text search `q`, execution keyboard shortcut (`Ctrl Enter`), and filter clearance. Advanced Boolean grouping buttons show an explanatory tooltip.
3. **Active Endpoint Blocking Daemon (Guardrails enforcement)**:
   - *Status*: The backend is an inventory & threat intelligence engine without a kernel extension blocking daemon.
   - *Handling*: The Guardrails view and "Version update cooldown configuration" modal (Screenshot 3) provide policy configuration and local preview without making non-existent mutation calls.

---

## 7. Security Hardening & Zero-Slop Discipline

- **No `dangerouslySetInnerHTML`**: All backend strings (names, descriptions, file paths, code excerpts, findings) are rendered strictly as text nodes.
- **Untrusted Network Indicators**: All external hostnames, IPs, and update URLs are rendered as copyable text with dedicated copy buttons, never as clickable hyperlinks.
- **Plaintext API Keys**: Shown **only once** upon generation in a dedicated modal with a copy button. Never stored in local storage, session storage, or query caches.
- **Local Bundled Assets**: All fonts (`@fontsource/plus-jakarta-sans`, `@fontsource/jetbrains-mono`) and icons (`lucide-react`) are bundled locally to comply with strict CSP policies (`default-src 'self'`).
- **Strict Zod Validation**: Every API endpoint response is validated at runtime against strict Zod schemas before being used in the UI.
