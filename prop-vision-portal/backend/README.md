# PropVision Portal Backend

A production-ready FastAPI microservice orchestrator that powers the PropVision Property Valuation Platform. Manages user authentication, persists valuation records in MongoDB, proxies ML inference requests to the Pricing API, and computes aggregated real estate market analytics.

---

## 🚀 Overview

The Portal Backend coordinates communication between the client frontend, the persistent MongoDB database, and the Pricing ML API. It enforces JWT authentication, ensures relational integrity via compound indexes in MongoDB, and handles network failures with upstream services gracefully.

- **Port**: `8000`
- **Interactive Swagger Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🌟 Key Features

- **JWT Authentication & Security**:
  - Secure password hashing using `bcrypt` via `passlib`.
  - Stateless JSON Web Tokens (JWT) signed with HMAC-SHA256 (`HS256`).
  - Route guards using FastAPI dependencies (`HTTPBearer`) with automatic subject claim verification.
- **Valuation Orchestration**:
  - Single property estimation (`POST /api/v1/estimate`) and bulk processing (`POST /api/v1/bulk-estimate`).
  - Persistent HTTP client (`httpx.AsyncClient`) with connection pooling for low-latency calls to the Pricing API (`http://localhost:8080`).
- **Data Persistence & Indexing (MongoDB)**:
  - Async MongoDB access powered by `Motor` (`AsyncIOMotorClient`).
  - `users` collection: Unique index on `username`.
  - `estimates` collection: Compound index on `(user_id, created_at)` for high-performance per-user history lookups.
- **Market Data Aggregations**:
  - Aggregates market statistics across all stored properties (count, average price, min/max price, average price segmented by bedroom count, and recent valuations).
- **Fault-Tolerant Error Handling**:
  - Upstream Pricing API unreachable $\rightarrow$ Clean HTTP 503 (`Service Unavailable`).
  - Upstream Pricing API returned an error $\rightarrow$ Clean HTTP 502 (`Bad Gateway`).
  - Invalid/expired JWT token $\rightarrow$ HTTP 401 (`Unauthorized`).
  - Duplicate username during registration $\rightarrow$ HTTP 409 (`Conflict`).

---

## ⚙️ Environment Variables

Create a `.env` file in `prop-vision-portal/backend/` or configure environment variables:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `MONGODB_URL` | `mongodb://localhost:27017` | MongoDB connection URI (e.g. with credentials `mongodb://admin:admin@localhost:27017/?authSource=admin`) |
| `MONGODB_DB_NAME` | `propvision` | Database name in MongoDB |
| `PRICING_API_BASE_URL` | `http://localhost:8080` | URL where the Pricing ML API is reachable |
| `JWT_SECRET_KEY` | `change-me-in-production` | Secret key used for signing JWT access tokens |
| `JWT_ALGORITHM` | `HS256` | JWT signature algorithm |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | Lifetime of an access token in minutes (24 hours) |

---

## 🛠️ Quick Start (Local)

### Prerequisites
- Python 3.12+
- [`uv`](https://docs.astral.sh/uv/) (recommended) or standard `pip`
- MongoDB running locally (default: `mongodb://localhost:27017`)
  ```bash
  # Quick start MongoDB via Docker
  docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin mongo:7.0
  ```

### Running with `uv`

```bash
cd prop-vision-portal/backend

# Synchronize dependencies
uv sync

# Copy environment template
cp .env.example .env

# Start FastAPI server on port 8000
uv run app/main.py
```

### Running with standard `pip` & `uvicorn`

```bash
cd prop-vision-portal/backend

python3 -m venv .venv
source .venv/bin/activate

pip install -e .
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 🐳 Docker Deployment

```bash
cd prop-vision-portal/backend

# Build Docker image
docker build -t propvision-backend .

# Run container connected to host network or Docker network
docker run -p 8000:8000 \
  -e MONGODB_URL="mongodb://admin:admin@host.docker.internal:27017/?authSource=admin" \
  -e PRICING_API_BASE_URL="http://host.docker.internal:8080" \
  propvision-backend
```

---

## 🔌 API Reference

All endpoints (except `/health` and auth endpoints) require an `Authorization: Bearer <TOKEN>` header.

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register a new user account (`username`, `password`, `full_name`) | No |
| `POST` | `/api/v1/auth/login` | Authenticate and obtain JWT access token | No |
| `GET` | `/api/v1/auth/me` | Fetch currently authenticated user's profile | **Yes** |

### Valuation & Market Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/estimate` | Estimate property valuation and persist record | **Yes** |
| `POST` | `/api/v1/bulk-estimate` | Batch estimation for multiple properties | **Yes** |
| `GET` | `/api/v1/history` | Retrieve user's historical estimates (supports `?limit=50`) | **Yes** |
| `GET` | `/api/v1/market-data` | Aggregated market data (summary, price by bedrooms, recent) | **Yes** |
| `GET` | `/health` | Application health status | No |

---

### Request & Response Examples

#### 1. Register User (`POST /api/v1/auth/register`)

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "janedoe",
    "password": "securepassword123",
    "full_name": "Jane Doe"
  }'
```

#### 2. Login (`POST /api/v1/auth/login`)

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "janedoe",
    "password": "securepassword123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
  "token_type": "bearer"
}
```

#### 3. Property Estimate (`POST /api/v1/estimate`)

```bash
curl -X POST http://localhost:8000/api/v1/estimate \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "square_footage": 1850,
    "bedrooms": 3,
    "bathrooms": 2,
    "year_built": 1998,
    "lot_size": 7500,
    "distance_to_city_center": 5.6,
    "school_rating": 8.2
  }'
```

**Response:**
```json
{
  "id": "e93f7734-7a35-4cb2-a7f4-d0ea3da3273e",
  "created_at": "2026-09-30T00:00:00Z",
  "price": 312500.0,
  "features": {
    "square_footage": 1850.0,
    "bedrooms": 3.0,
    "bathrooms": 2.0,
    "year_built": 1998.0,
    "lot_size": 7500.0,
    "distance_to_city_center": 5.6,
    "school_rating": 8.2
  }
}
```

---

## 📂 Project Structure

```bash
prop-vision-portal/backend/
├── Dockerfile                  # Production container packaging
├── pyproject.toml              # Dependencies and packaging config
├── uv.lock                     # Lockfile
└── app/
    ├── main.py                 # FastAPI application factory & lifespan
    ├── api/
    │   └── v1/
    │       └── router.py       # Route definitions & HTTP handlers
    ├── core/
    │   └── config.py           # Pydantic Settings & environment parsing
    ├── db/
    │   └── database.py         # Motor MongoDB connection pool & indexing
    ├── middlewares/
    │   └── middleware.py       # CORS & JWT get_current_user dependency
    ├── models/
    │   └── schemas.py          # Pydantic request/response models
    ├── services/
    │   └── services.py         # Business logic: AuthService & EstimateService
    └── utils/
        └── utils.py            # Password hashing & JWT generation/decoding
```

---

## ⚖️ License

MIT License.
