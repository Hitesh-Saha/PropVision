# Deloitte HSBC Assignment - Property Valuation Portal

A premium, full-stack property valuation system featuring a machine learning inference engine, an orchestration backend, and a modern analytics dashboard.

## 🚀 Quick Start (Local)

The easiest way to run the entire system is using the provided startup script:

```bash
# To run all services locally (requires uv and node)
./start.sh local

# To run using Docker Compose (Recommended)
./start.sh docker
```

Once started, access the applications at:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Portal Backend**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Pricing ML API**: [http://localhost:8080/docs](http://localhost:8080/docs)

---

## 🏗️ Project Structure

```bash
.
├── pricing-api/             # Task 1: ML Inference Engine
│   ├── app/
│   │   ├── main.py         # Entrypoint (Port 8080)
│   │   ├── classifier/     # Scikit-learn Ridge model logic
│   │   └── api/            # API routing for predictions
│   └── Dockerfile          # Optimized Python 3.13 image
│
├── property-portal/
│   ├── backend/            # Task 2: Service Orchestrator
│   │   ├── app/
│   │   │   ├── main.py     # Entrypoint (Port 8000)
│   │   │   ├── api/        # Market & Estimation endpoints
│   │   │   └── models/     # Pydantic schemas
│   │   └── Dockerfile
│   │
│   └── frontend/           # Task 2: Analytics Dashboard
│       ├── app/            # Next.js App Router (Valuation & Dashboard)
│       ├── components/     # UI Components (Charts, Forms, Bulk Upload)
│       └── hooks/          # React Query hooks for data fetching
│
└── start.sh                # Consolidated startup script
```

## ✨ Features

### 🧠 Task 1: Pricing Inference API

- **Ridge Regression Model**: Trained on `House Price Dataset.csv` at startup.
- **Unified Prediction**: Supports both single-property and high-performance batch inference.
- **Model Transparency**: `/api/v1/model-info` provides coefficients, intercept, and R² metrics.

### 🏢 Task 2: Property Portal

- **Single Valuation**: Real-time estimation with premium UI and instant feedback.
- **Bulk Estimation**: Upload CSV files to process hundreds of properties at once. Features smart header mapping and results reporting.
- **Market Dashboard**:
  - **Dynamic Charts**: Average price by bedroom count (Bar) and Market Trends (Line).
  - **Responsive Design**: Mobile-first approach using Tailwind CSS.
  - **Hydration Guard**: Smooth client-side rendering with Recharts.
- **History Tracking**: All estimates are persisted in memory for analysis.

## ⚙️ Environment Variables

| Variable                  | Default                 | Description                           |
| :------------------------ | :---------------------- | :------------------------------------ |
| `PRICING_API_BASE_URL`    | `http://localhost:8080` | Backend's link to the Pricing service |
| `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:8000` | Frontend's link to the Portal Backend |

## 🛠️ Tech Stack

- **Pricing/Backend**: Python 3.13, FastAPI, **uv** (package manager), Scikit-learn, httpx.
- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS, **Recharts**, Lucide.
- **DevOps**: Docker, Docker Compose, Shell Scripting.

## 📖 Documentation

For a detailed breakdown of the microservice architecture, communication protocols, and CI/CD strategy, see:
👉 **[SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md)**
