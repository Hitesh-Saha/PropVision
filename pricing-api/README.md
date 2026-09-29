# PropVision – Housing Price Prediction ML API

A high-performance machine learning inference microservice that predicts residential property prices using a Ridge Regression model trained on **`House Price Dataset.csv`**. Built with **Python 3.12+**, **FastAPI**, **Scikit-learn**, and **uv**.

---

## 🚀 Overview

The Pricing API serves as the analytical core of PropVision. At startup, it automatically loads and trains an optimized regression pipeline with feature scaling (`StandardScaler` + `Ridge`), computes evaluation metrics on a held-out test split, and exposes endpoints for single and batch predictions as well as model introspection.

- **Port**: `8080`
- **Interactive API Documentation (Swagger)**: [http://localhost:8080/docs](http://localhost:8080/docs)
- **Alternative Documentation (ReDoc)**: [http://localhost:8080/redoc](http://localhost:8080/redoc)
- **OpenAPI Schema**: [http://localhost:8080/openapi.json](http://localhost:8080/openapi.json)

---

## 🌟 Key Features

- **Automated Lifecycle Training**: Trains and validates on startup from `House Price Dataset.csv`. Fails fast if the dataset is missing or corrupt.
- **Unified Single & Batch Prediction**: `POST /api/v1/predict` accepts a JSON list of feature objects, efficiently converting records into vectorized NumPy arrays for low-latency batch inference.
- **Model Transparency & Introspection**: `GET /api/v1/model-info` exposes regression coefficients, intercept, dataset source, and performance metrics ($R^2$, MAE, MSE, RMSE).
- **Production-Ready**: Containerized with lightweight multi-stage Docker build, health check endpoint, and clean separation of concerns.

---

## 📊 Dataset & Features

The model expects the following 7 numerical features:

| Feature Name | Type | Description | Unit / Range |
| :--- | :--- | :--- | :--- |
| `square_footage` | `float` | Finished interior living space | Square feet ($>0$) |
| `bedrooms` | `float` | Number of bedrooms | Count ($\ge 0$) |
| `bathrooms` | `float` | Number of bathrooms | Count ($\ge 0$) |
| `year_built` | `float` | Year property was constructed | Calendar Year |
| `lot_size` | `float` | Total property lot footprint | Square feet ($\ge 0$) |
| `distance_to_city_center` | `float` | Straight-line distance to urban core | Miles ($\ge 0$) |
| `school_rating` | `float` | Public school district rating | Rating index ($0.0 - 10.0$) |

**Target Variable**: `price` (Property market valuation in USD).

---

## 🛠️ Quick Start (Local)

### Prerequisites
- Python 3.12 or newer
- [`uv`](https://docs.astral.sh/uv/) (recommended) or standard `pip`

### Using `uv` (Recommended)

```bash
cd pricing-api

# Install dependencies into virtualenv
uv sync

# Run the API with Uvicorn (Port 8080)
uv run app/main.py
```

### Using standard `python` & `pip`

```bash
cd pricing-api

python3 -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate

pip install -e .
python app/main.py
```

---

## 🐳 Docker Deployment

The service includes a production Docker configuration that mounts or copies the training dataset.

```bash
cd pricing-api

# Build container image
docker build -t pricing-api .

# Run container on port 8080
docker run -p 8080:8080 \
  -v "$(pwd)/House Price Dataset.csv:/app/House Price Dataset.csv:ro" \
  pricing-api
```

Once running, verify at [http://localhost:8080/health](http://localhost:8080/health).

---

## 🔌 API Reference

### Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Service health status check | No |
| `GET` | `/api/v1/model-info` | Model coefficients, intercept, and evaluation metrics | No |
| `POST` | `/api/v1/predict` | Single or batch property price inference | No |

---

### Request & Response Examples

#### 1. Predict Property Price (`POST /api/v1/predict`)

**Request:**
```bash
curl -X POST http://localhost:8080/api/v1/predict \
  -H "Content-Type: application/json" \
  -d '[
    {
      "square_footage": 2100,
      "bedrooms": 3,
      "bathrooms": 2.5,
      "year_built": 2005,
      "lot_size": 6500,
      "distance_to_city_center": 4.2,
      "school_rating": 8.5
    }
  ]'
```

**Response (`200 OK`):**
```json
{
  "prediction": [
    348520.15
  ],
  "count": 1
}
```

#### 2. Get Model Info & Metrics (`GET /api/v1/model-info`)

**Request:**
```bash
curl -X GET http://localhost:8080/api/v1/model-info
```

**Response (`200 OK`):**
```json
{
  "model_type": "Ridge",
  "intercept": 320450.22,
  "coefficients": {
    "square_footage": 65420.12,
    "bedrooms": 12840.45,
    "bathrooms": 18230.10,
    "year_built": 22100.80,
    "lot_size": 8940.30,
    "distance_to_city_center": -35120.90,
    "school_rating": 41250.75
  },
  "feature_names": [
    "square_footage",
    "bedrooms",
    "bathrooms",
    "year_built",
    "lot_size",
    "distance_to_city_center",
    "school_rating"
  ],
  "metrics": {
    "r2_score": 0.884,
    "mean_absolute_error": 24150.30,
    "mean_squared_error": 895420100.0,
    "root_mean_squared_error": 29923.57
  },
  "target_description": "House price in dollars",
  "dataset": "House Price Dataset.csv"
}
```

---

## 📂 Project Structure

```bash
pricing-api/
├── Dockerfile                  # Container packaging
├── House Price Dataset.csv     # Model training dataset
├── pyproject.toml              # Dependencies & project metadata
├── uv.lock                     # Deterministic dependency lockfile
└── app/
    ├── main.py                 # FastAPI app, lifespan setup, and routing
    ├── api/
    │   └── v1/
    │       └── pricing.py      # Route definitions (/predict, /model-info)
    ├── classifier/
    │   └── classifier.py       # Scikit-learn Ridge pipeline, training, & inference
    └── models/
        └── schemas.py          # Pydantic schemas (HousingFeatures, PredictionResponse)
```

---

## ⚖️ License

MIT License.
