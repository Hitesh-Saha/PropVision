# Housing Price Prediction Model API

A simple regression API that predicts house prices from **House Price Dataset.csv**. Built with **Python 3.12+**, **FastAPI**, and **Scikit-learn**.

## Features

- **Single prediction**: `POST /predict` — one set of features → one price
- **Batch prediction**: `POST /predict/batch` — multiple features → list of prices
- **Model info**: `GET /model-info` — coefficients and performance metrics (R², MAE, RMSE)
- **Health check**: `GET /health` — service health

## Dataset

Place **House Price Dataset.csv** in the project root (same directory as `app/`). The model is trained on this file at startup.

Expected columns: `id`, `square_footage`, `bedrooms`, `bathrooms`, `year_built`, `lot_size`, `distance_to_city_center`, `school_rating`, `price` (target).

## Quick start (local)

```bash
# From project root (house-prediction-api/)
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
uv sync
uv run app/main.py
```

Then open:

- **Swagger UI**: http://localhost:8080/docs  
- **ReDoc**: http://localhost:8080/redoc  
- **OpenAPI JSON**: http://localhost:8080/openapi.json  

## Docker

```bash
docker build -t housing-price-api .
docker run -p 8080:8080 housing-price-api
```

The Dockerfile copies `House Price Dataset.csv` into the image. Swagger is at http://localhost:8000/docs when the container is running.

## API summary

| Method | Endpoint           | Description                          |
|--------|--------------------|--------------------------------------|
| GET    | `/health`          | Health check                         |
| GET    | `/model-info`      | Model coefficients and metrics       |
| POST   | `/predict`         | Single/Batch prediction                    |

### Example: prediction

```bash
curl -X POST http://localhost:8080/predict \
  -H "Content-Type: application/json" \
  -d '[{
    "square_footage": 1850,
    "bedrooms": 3,
    "bathrooms": 2,
    "year_built": 1998,
    "lot_size": 7500,
    "distance_to_city_center": 5.6,
    "school_rating": 8.2
  }]'
```

## Feature definitions

- `square_footage` — Living area (sq ft)
- `bedrooms` — Number of bedrooms
- `bathrooms` — Number of bathrooms
- `year_built` — Year built
- `lot_size` — Lot size (sq ft)
- `distance_to_city_center` — Distance to city center (miles)
- `school_rating` — School district rating (0–10)

Target: **price** (house price in dollars).

## Tech stack

- Python 3.12+
- FastAPI
- Scikit-learn (Ridge regression + StandardScaler)
- Pandas (CSV loading)
- Uvicorn

## License

MIT
