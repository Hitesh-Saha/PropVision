from typing import List
from fastapi import APIRouter, HTTPException, Request
from config.config import settings
import httpx
from datetime import datetime, timezone
from uuid import uuid4
from models.schemas import HistoryItem, HistoryResponse, MarketByBedrooms, MarketDataResponse, MarketSummary, PropertyFeatures, EstimateResponse, BulkEstimateResponse

router = APIRouter()

# In-memory history store for demo purposes
_HISTORY: List[HistoryItem] = []

@router.post("/estimate", response_model=EstimateResponse, tags=["Estimate"])
async def estimate_property(features: PropertyFeatures, request: Request):
    """
    Accept property details from the frontend, call the Pricing API,
    and return an estimated price.
    """
    client: httpx.AsyncClient = request.app.state.http_client
    try:
        # Pricing API expects a list of features
        payload = [features.model_dump()]
        response = await client.post(
            f"{settings.pricing_api_base_url}/api/v1/predict",
            json=payload,
        )
        response.raise_for_status()
    except httpx.RequestError as exc:
        # Pricing API unreachable
        raise HTTPException(
            status_code=503,
            detail=f"Pricing API unreachable: {exc}",
        ) from exc
    except httpx.HTTPStatusError as exc:
        # Pricing API returned an error status
        raise HTTPException(
            status_code=502,
            detail=f"Pricing API error: {exc.response.text}",
        ) from exc

    data = response.json()
    if "prediction" not in data or not data["prediction"]:
        raise HTTPException(
            status_code=502,
            detail="Pricing API response missing or empty 'prediction' field",
        )

    price = float(data["prediction"][0])
    now = datetime.now(timezone.utc)
    estimate_id = str(uuid4())

    history_item = HistoryItem(
        id=estimate_id,
        created_at=now,
        price=price,
        features=features,
    )
    _HISTORY.append(history_item)

    return EstimateResponse(
        id=estimate_id,
        created_at=now,
        price=price,
        features=features,
    )


@router.get("/history", response_model=HistoryResponse, tags=["History"])
async def get_history(limit: int = 50):
    """
    Return previous estimates.
    Uses in-memory storage suitable for demo purposes.
    """
    items = list(reversed(_HISTORY))[:limit]
    return HistoryResponse(items=items, count=len(items))


@router.get("/market-data", response_model=MarketDataResponse, tags=["Market"])
async def market_data():
    """
    Return aggregated market stats based on in-memory history.
    If no history exists yet, returns mocked sample data.
    """
    if not _HISTORY:
        # Mocked sample data when we have no history
        mock_summary = MarketSummary(
            total_estimates=3,
            avg_price=280_000,
            min_price=190_000,
            max_price=410_000,
        )
        mock_by_bedrooms = [
            MarketByBedrooms(bedrooms=2, avg_price=210_000),
            MarketByBedrooms(bedrooms=3, avg_price=260_000),
            MarketByBedrooms(bedrooms=4, avg_price=395_000),
        ]
        return MarketDataResponse(
            summary=mock_summary,
            by_bedrooms=mock_by_bedrooms,
            recent_estimates=[],
        )

    prices = [h.price for h in _HISTORY]
    summary = MarketSummary(
        total_estimates=len(_HISTORY),
        avg_price=sum(prices) / len(prices),
        min_price=min(prices),
        max_price=max(prices),
    )

    # Aggregate by bedroom count (simple average)
    buckets: dict[float, list[float]] = {}
    for h in _HISTORY:
        b = float(h.features.bedrooms)
        buckets.setdefault(b, []).append(h.price)

    by_bedrooms = [
        MarketByBedrooms(
            bedrooms=bed,
            avg_price=sum(vals) / len(vals),
        )
        for bed, vals in sorted(buckets.items())
    ]

    recent_estimates = list(reversed(_HISTORY))[:10]
    return MarketDataResponse(
        summary=summary,
        by_bedrooms=by_bedrooms,
        recent_estimates=recent_estimates,
    )


@router.post("/bulk-estimate", response_model=BulkEstimateResponse, tags=["Bulk Estimate"])
async def bulk_estimate_properties(features_list: List[PropertyFeatures], request: Request):
    """
    Accept multiple property details, call the batch Pricing API,
    and return a list of estimated prices.
    """
    if not features_list:
        return BulkEstimateResponse(items=[], count=0)

    client: httpx.AsyncClient = request.app.state.http_client
    try:
        payload = [f.model_dump() for f in features_list]
        response = await client.post(
            f"{settings.pricing_api_base_url}/api/v1/predict",
            json=payload,
        )
        response.raise_for_status()
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Pricing API unreachable: {exc}",
        ) from exc
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Pricing API error: {exc.response.text}",
        ) from exc

    data = response.json()
    predictions = data.get("prediction", [])
    
    if len(predictions) != len(features_list):
        raise HTTPException(
            status_code=502,
            detail="Pricing API returned an unexpected number of predictions",
        )

    now = datetime.now(timezone.utc)
    results = []
    
    for features, price in zip(features_list, predictions):
        estimate_id = str(uuid4())
        item = HistoryItem(
            id=estimate_id,
            created_at=now,
            price=float(price),
            features=features,
        )
        _HISTORY.append(item)
        results.append(item)

    return BulkEstimateResponse(items=results, count=len(results))
