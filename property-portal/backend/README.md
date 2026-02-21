# Property Portal Backend

FastAPI backend that orchestrates calls to the Pricing API.

## Features

- **Proxy/Orchestrate**: Calls to the Pricing API (`/predict` endpoint)
- **Estimate endpoint**: `/api/estimate` - Accepts property data, calls Pricing API, returns estimate
- **Market data endpoint**: `/api/market-data` - Aggregated market statistics
- **History endpoint**: `/api/history` - Previous estimates (in-memory storage)
- **Error handling**: Handles Pricing API downtime gracefully
- **Request/response validation**: Using Pydantic models

## Quick Start

```bash
pip install -r requirements.txt
export PRICING_API_BASE_URL=http://localhost:8000
uvicorn app.main:app --host 0.0.0.0 --port 8100
```

## Environment Variables

- `PRICING_API_BASE_URL`: Base URL for the Pricing API (default: `http://pricing-api:8000` for Docker, use `http://localhost:8000` for local)

## Docker

```bash
docker build -t property-portal-backend .
docker run -p 8100:8100 -e PRICING_API_BASE_URL=http://pricing-api:8000 property-portal-backend
```

## API Endpoints

- `GET /health` - Health check
- `POST /api/estimate` - Get property price estimate
- `GET /api/market-data` - Get aggregated market statistics
- `GET /api/history` - Get previous estimates

## Error Handling

- If Pricing API is unreachable: Returns HTTP 503
- If Pricing API returns an error: Returns HTTP 502 with error details
- All errors include descriptive messages for debugging
