# portal (Next.js)

Unified portal hosting two apps that both use the ML model (via their backends):

- **Property Estimator** -> `property-estimator` (Python) backend
- **Market Analysis** -> `market-analysis` (Java) backend

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Recharts · jsPDF

## Architecture

```
Browser
  -> Next server components (RSC)  -- initial data --> backends (server-side, no CORS)
  -> Next route handlers /api/*    -- proxy         --> backends (for client actions)
```

- Server Components fetch initial data on the server (`app/estimator/page.tsx`, `app/market/page.tsx`).
- Route handlers (`app/api/**`) are a same-origin BFF proxy; they also map the Python
  backend's snake_case to the frontend's camelCase.
- Custom hooks (`useEstimates`, `useMarketStats`, `useWhatIf`) drive client interactions.

## Requirement coverage

| Requirement                     | Where                                                        |
|---------------------------------|--------------------------------------------------------------|
| Shared layout + navigation      | `app/layout.tsx`, `components/ui/Nav.tsx`                    |
| App Router routing              | `app/estimator`, `app/market`                                |
| Loading & error at layout level | `app/loading.tsx`, `app/error.tsx` (+ per-app)               |
| RSC initial data loading        | `app/*/page.tsx` (server components)                         |
| Form + client validation        | `components/estimator/EstimatorApp.tsx`, `lib/validation.ts` |
| Results: table + chart          | `EstimatorApp.tsx` + `ResultChart.tsx`                       |
| History + comparison            | `EstimatorApp.tsx` (history table + side-by-side)            |
| Dashboard + filters             | `components/market/MarketApp.tsx`                            |
| What-if tool                    | `components/market/WhatIfPanel.tsx`                          |
| CSV / PDF export                | `lib/export.ts` (used in `MarketApp.tsx`)                    |
| Sortable/filterable table       | `MarketApp.tsx` (sort) + filters                             |
| Custom hooks                    | `hooks/useEstimates.ts`, `hooks/useMarket.ts`                |
| Accessibility (WCAG)            | `aria-*`, `role`, labels in UI components                    |

## Run locally

```bash
npm install
cp .env.example .env.local     # point to the two backends
npm run dev                    # http://localhost:3000
```

Requires `property-estimator` (8080) and `market-analysis` (8081) running (and the ML
service they depend on). Easiest: run the whole stack with the infra compose (next step).

## Build / Docker

```bash
npm run build && npm start
# or
docker build -t portal:1.0.0 .
docker run -p 3000:3000 \
  -e ESTIMATOR_API_URL=http://host.docker.internal:8080 \
  -e MARKET_API_URL=http://host.docker.internal:8081 \
  portal:1.0.0
```
