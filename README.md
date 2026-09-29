# PropVision – Housing Property Valuation System

A full-stack, cloud-ready property valuation and market analytics platform. PropVision couples an automated machine learning inference engine with an authenticated orchestration backend and a Next.js 15 analytics dashboard.

---

## 🚀 Quick Start

The easiest way to launch the entire platform is with the provided startup script:

```bash
# Option 1: Run all services with Docker Compose (Recommended)
./start.sh docker

# Option 2: Run all services locally (Requires Python 3.12+, uv, Node 18+, and MongoDB)
./start.sh local

# Stop Docker services
./start.sh stop
```

### Service Endpoints

| Service | Port | Local URL | Description |
| :--- | :--- | :--- | :--- |
| **Frontend Portal** | `3000` | [http://localhost:3000](http://localhost:3000) | Next.js 15 Valuation & Analytics Dashboard |
| **Portal Backend API** | `8000` | [http://localhost:8000/docs](http://localhost:8000/docs) | FastAPI Orchestrator, JWT Auth & MongoDB API |
| **Pricing ML API** | `8080` | [http://localhost:8080/docs](http://localhost:8080/docs) | Scikit-learn Ridge Regression Inference Engine |
| **MongoDB Database** | `27017` | `mongodb://localhost:27017` | Document Database for Users and Valuation Records |

---

## 🏗️ System Architecture

```
                    ┌─────────────────────────┐
                    │      Client Browser     │
                    └────────────┬────────────┘
                                 │
                                 │ HTTP / Port 3000
                                 ▼
                    ┌─────────────────────────┐
                    │  PropVision Frontend    │
                    │  (Next.js 15, Recharts) │
                    └────────────┬────────────┘
                                 │
                                 │ REST / Port 8000 (Bearer JWT)
                                 ▼
                    ┌─────────────────────────┐
                    │  Portal Backend API     │
                    │  (FastAPI Orchestrator) │
                    └──────┬────────────┬─────┘
                           │            │
             Internal REST │            │ Motor Async Driver
               Port 8080   │            │ Port 27017
                           ▼            ▼
        ┌──────────────────────┐    ┌──────────────────────┐
        │   Pricing ML API     │    │   MongoDB 7.0        │
        │ (Ridge Regression)   │    │  (Users & Estimates) │
        └──────────────────────┘    └──────────────────────┘
```

---

## 📂 Repository Structure

```bash
propvision/
├── docker-compose.yml              # Multi-container orchestration (MongoDB, Pricing, Backend, Frontend)
├── start.sh                        # Unified CLI startup script (docker | local | stop)
├── SYSTEM_DESIGN.md                # Comprehensive microservice architecture & engineering design doc
│
├── pricing-api/                    # Task 1: Machine Learning Inference Engine
│   ├── app/
│   │   ├── main.py                 # FastAPI application factory (Port 8080)
│   │   ├── api/v1/pricing.py       # Endpoints: /predict and /model-info
│   │   ├── classifier/classifier.py# Ridge regression pipeline & training logic
│   │   └── models/schemas.py       # Pydantic schemas (HousingFeatures, PredictionResponse)
│   ├── House Price Dataset.csv     # Training dataset
│   ├── Dockerfile                  # Container packaging
│   └── README.md                   # Dedicated Pricing API documentation
│
└── prop-vision-portal/
    ├── backend/                    # Task 2: Service Orchestrator & Persistence
    │   ├── app/
    │   │   ├── main.py             # FastAPI entrypoint (Port 8000)
    │   │   ├── api/v1/router.py    # Auth, Estimation, History, & Market Data routes
    │   │   ├── core/config.py      # Pydantic settings & environment management
    │   │   ├── db/database.py      # Motor async MongoDB connection & indexing
    │   │   ├── middlewares/        # CORS & JWT Bearer token authentication guard
    │   │   ├── models/schemas.py   # Request/response validation schemas
    │   │   ├── services/services.py# Business logic (AuthService, EstimateService)
    │   │   └── utils/utils.py      # Password hashing (bcrypt) & JWT encoding/decoding
    │   ├── Dockerfile
    │   └── README.md               # Dedicated Backend documentation
    │
    └── frontend/                   # Task 2: Real Estate Analytics Dashboard
        ├── app/                    # Next.js App Router (Landing, Login, Register, Valuation, Dashboard)
        ├── components/             # Reusable UI components (Forms, Charts, Bulk Upload, Tables)
        ├── lib/                    # Axios API client & TypeScript types
        ├── Dockerfile
        └── README.md               # Dedicated Frontend documentation
```

---

## ✨ Features Breakdown

### 🧠 1. Pricing Inference API (Task 1)
- **Automated Startup Training**: Fits a Scikit-learn `Pipeline([('scaler', StandardScaler()), ('regressor', Ridge())])` directly on `House Price Dataset.csv` with an 80/20 train/test split.
- **Unified Prediction API**: `POST /api/v1/predict` accepts single or batch property instances, converting inputs to vectorized NumPy arrays for low-latency inference.
- **Model Inspection**: `GET /api/v1/model-info` returns model coefficients, intercept, dataset name, and validation metrics ($R^2$, MAE, MSE, RMSE).

### 🏢 2. PropVision Portal Backend (Task 2)
- **JWT Authentication**: Secure user registration, password hashing (`bcrypt`), and token issuing (`HS256`) with automatic route protection.
- **Microservice Orchestration**: Proxies estimation requests to the Pricing API using a pooled `httpx.AsyncClient` with resilient error handling (returns HTTP 503 if ML API is offline, HTTP 502 on bad payloads).
- **Persistent Storage**: Stores user estimates and user accounts in MongoDB 7.0 using Motor async driver with compound indexing on `(user_id, created_at)`.
- **Market Intelligence**: Aggregates valuations across the entire database to compute real-time market stats, price variations by bedroom count, and recent transactions.

### 💻 3. PropVision Portal Frontend (Task 2)
- **Modern App Router**: Built on Next.js 15, React, TypeScript, and Tailwind CSS.
- **Instant Single Valuation**: Clean input form with client-side field validation and real-time estimate feedback.
- **High-Volume Bulk CSV Estimation**: Drag-and-drop CSV importer with smart header detection, validation, batch progress, and tabular results view.
- **Interactive Analytics**: Interactive Recharts visualizations (Average Price by Bedroom Bar Chart, Market Trends Line Chart, Summary KPI cards).

---

## ⚙️ Environment Configuration

| Variable | Default | Service | Description |
| :--- | :--- | :--- | :--- |
| `PRICING_API_BASE_URL` | `http://localhost:8080` | Backend | Upstream URL for Pricing ML API |
| `MONGODB_URL` | `mongodb://localhost:27017` | Backend | MongoDB connection URI |
| `MONGODB_DB_NAME` | `propvision` | Backend | MongoDB database name |
| `JWT_SECRET_KEY` | `change-me-in-production` | Backend | HMAC secret key for signing JWT tokens |
| `JWT_ALGORITHM` | `HS256` | Backend | Signature algorithm for JWT tokens |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | Backend | Token expiration (24 hours) |
| `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:8000` | Frontend | Backend URL accessed from client |

---

## 🛠️ Technology Stack

- **ML & Backend**: Python 3.12+, FastAPI, Uvicorn, Scikit-learn, Pandas, NumPy, Motor (Async PyMongo), Pydantic v2, PyJWT, passlib, httpx, uv.
- **Database**: MongoDB 7.0.
- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, Recharts, Axios, Lucide React.
- **DevOps & Infrastructure**: Docker, Docker Compose, Bash scripts.

---

## 📖 Detailed Documentation

- 📘 **[Pricing API Documentation](./pricing-api/README.md)**
- 📗 **[Portal Backend Documentation](./prop-vision-portal/backend/README.md)**
- 📙 **[Portal Frontend Documentation](./prop-vision-portal/frontend/README.md)**
- 📕 **[System Design & Architecture Guide](./SYSTEM_DESIGN.md)**
