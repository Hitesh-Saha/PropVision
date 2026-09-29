# PropVision Portal Frontend

A modern, responsive real estate analytics and property valuation web application built with **Next.js 15 (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, and **Recharts**.

---

## 🚀 Overview

The PropVision Portal Frontend delivers an intuitive interface for real estate professionals and home buyers to estimate property values instantly, batch-process housing portfolios via CSV upload, and inspect market pricing trends across neighborhoods.

- **Port**: `3000`
- **Application URL**: [http://localhost:3000](http://localhost:3000)
- **Target Backend API**: `http://localhost:8000`

---

## 🌟 Key Features

### 🔐 1. Authentication & Security
- **JWT Session Management**: Integrated login (`/login`) and registration (`/register`) flows.
- **Persistent Sessions**: Tokens are securely stored in `localStorage` and automatically injected into outbound Axios requests via Bearer headers.
- **Route Protection**: Client-side `AuthGuard` automatically redirects unauthenticated users to `/login` when accessing valuation tools or dashboards.

### 🏡 2. Property Valuation Suite (`/valuation`)
- **Single Property Valuation**:
  - Interactive form with real-time field validation for square footage, bedroom/bathroom count, construction year, lot size, city center proximity, and school rating.
  - Instant price projection card with clear financial formatting.
- **Bulk CSV Valuation**:
  - Drag-and-drop or file selector for CSV files.
  - Smart header detection & normalization to match required model features.
  - Client-side validation with row-by-row error detection.
  - One-click batch inference via `POST /api/v1/bulk-estimate` with tabular results preview.

### 📈 3. Market Analytics Dashboard (`/dashboard`)
- **Executive KPI Cards**: Real-time total estimates evaluated, average property price, minimum price, and maximum price recorded.
- **Dynamic Recharts Visualizations**:
  - **Price by Bedroom Count**: Bar chart comparing price variances across 1, 2, 3, 4, and 5+ bedroom properties.
  - **Market Pricing Trends**: Line chart showing historical valuation trajectory.
- **Recent Valuations Table**: Detailed breakdown of recently generated appraisals.

### 🌐 4. Premium Landing Page (`/`)
- Sleek hero section with quick-action CTAs, feature breakdowns, and direct entry points to valuation and analytics.

---

## ⚙️ Environment Variables

Create a `.env` file in `prop-vision-portal/frontend/` or set the environment variable:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:8000` | Base URL of the PropVision Portal Backend API |

---

## 🛠️ Quick Start (Local)

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- `npm` or `pnpm` / `yarn`
- PropVision Backend running on [http://localhost:8000](http://localhost:8000)

### Development Setup

```bash
cd prop-vision-portal/frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build production bundle
npm run build

# Start production server
npm start
```

---

## 🐳 Docker Deployment

```bash
cd prop-vision-portal/frontend

# Build container image
docker build -t propvision-frontend .

# Run container on port 3000
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_BACKEND_URL=http://localhost:8000 \
  propvision-frontend
```

---

## 📂 Project Structure

```bash
prop-vision-portal/frontend/
├── Dockerfile                  # Next.js standalone container packaging
├── package.json                # Dependencies and npm scripts
├── tailwind.config.ts          # Tailwind theme and typography styling
├── tsconfig.json               # TypeScript compiler config
└── app/
    ├── layout.tsx              # Root HTML shell, providers, and fonts
    ├── page.tsx                # Public landing page
    ├── globals.css             # Base styles, variables, and Tailwind directives
    ├── login/
    │   └── page.tsx            # Authentication login screen
    ├── register/
    │   └── page.tsx            # User registration screen
    ├── valuation/
    │   └── page.tsx            # Single & bulk property valuation interface
    └── dashboard/
        └── page.tsx            # Market analytics & KPI dashboard
├── components/
    ├── AuthGuard.tsx           # Route protection wrapper
    ├── Logo.tsx                # Brand vector logo
    ├── header/
    │   └── Header.tsx          # Navigation header with auth state
    ├── footer/
    │   └── Footer.tsx          # Application footer
    ├── valuation/
    │   ├── ValuationForm.tsx   # Single valuation input form
    │   ├── ValuationResult.tsx # Valuation summary card
    │   ├── BulkUpload.tsx      # CSV file processing & batch runner
    │   └── BulkResults.tsx     # Tabular batch results display
    └── dashboard/
        ├── SummarySection.tsx  # KPI metric cards container
        ├── SummaryCard.tsx     # Individual metric card
        ├── AveragePriceChart.tsx # Recharts bedroom price bar chart
        ├── TrendChart.tsx      # Recharts historical trend line chart
        └── RecentActivity.tsx  # Recent valuations table
├── lib/
    ├── api.ts                  # Axios instance with interceptors & API helpers
    └── schemas.ts              # TypeScript interfaces & types
└── hooks/
    └── useApi.ts               # Data-fetching hooks
```

---

## ⚖️ License

MIT License.
