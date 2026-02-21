from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class PropertyFeatures(BaseModel):
    """Property details submitted from the frontend."""

    square_footage: float = Field(..., gt=0, description="Living area in square feet")
    bedrooms: float = Field(..., ge=0, description="Number of bedrooms")
    bathrooms: float = Field(..., ge=0, description="Number of bathrooms")
    year_built: float = Field(..., description="Year the house was built")
    lot_size: float = Field(..., ge=0, description="Lot size in square feet")
    distance_to_city_center: float = Field(
        ..., ge=0, description="Distance to city center in miles"
    )
    school_rating: float = Field(
        ..., ge=0, le=10, description="School district rating (0-10)"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "square_footage": 1850,
                "bedrooms": 3,
                "bathrooms": 2,
                "year_built": 1998,
                "lot_size": 7500,
                "distance_to_city_center": 5.6,
                "school_rating": 8.2,
            }
        }
    }


class EstimateResponse(BaseModel):
    """Response returned to the frontend for a single estimate."""

    id: str = Field(..., description="Unique identifier for this estimate")
    created_at: datetime = Field(..., description="Timestamp when the estimate was created")
    price: float = Field(..., description="Estimated property price in dollars")
    features: PropertyFeatures


class HistoryItem(BaseModel):
    """Single history entry."""

    id: str
    created_at: datetime
    price: float
    features: PropertyFeatures


class HistoryResponse(BaseModel):
    """List of previous estimates."""

    items: List[HistoryItem]
    count: int


class MarketSummary(BaseModel):
    """Aggregated market summary statistics."""

    total_estimates: int
    avg_price: Optional[float] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None


class MarketByBedrooms(BaseModel):
    """Average price broken down by bedroom count."""

    bedrooms: float
    avg_price: float


class MarketDataResponse(BaseModel):
    """Aggregated market data for dashboard."""

    summary: MarketSummary
    by_bedrooms: List[MarketByBedrooms]
    recent_estimates: List[HistoryItem]


class BulkEstimateResponse(BaseModel):
    """Response returned for bulk estimations."""

    items: List[HistoryItem]
    count: int

