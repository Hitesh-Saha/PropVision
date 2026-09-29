"""
Pydantic schemas.

Pure Pydantic models that establish strict schemas for:
  - Incoming HTTP request payloads (UserRegister, UserLogin, PropertyFeatures)
  - Outgoing HTTP responses (Token, UserProfile, EstimateResponse, …)

No business logic lives here — schemas are plain data containers.
"""
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Auth schemas
# ---------------------------------------------------------------------------

class UserRegister(BaseModel):
    """Payload for POST /auth/register."""

    username: str = Field(..., min_length=3, max_length=32)
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = Field(None)


class UserLogin(BaseModel):
    """Payload for POST /auth/login."""

    username: str
    password: str


class Token(BaseModel):
    """JWT token response."""

    access_token: str
    token_type: str = "bearer"


class UserProfile(BaseModel):
    """Public user profile returned by the API."""

    user_id: str = Field(..., description="Immutable MongoDB ObjectId string")
    username: str
    full_name: Optional[str] = None


# ---------------------------------------------------------------------------
# Property / Estimate schemas
# ---------------------------------------------------------------------------

class PropertyFeatures(BaseModel):
    """Property details submitted by the client."""

    square_footage: float = Field(..., gt=0)
    bedrooms: float = Field(..., ge=0)
    bathrooms: float = Field(..., ge=0)
    year_built: float
    lot_size: float = Field(..., ge=0)
    distance_to_city_center: float = Field(..., ge=0)
    school_rating: float = Field(..., ge=0, le=10)

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


class HistoryItem(BaseModel):
    """A single persisted estimate."""

    id: str
    created_at: datetime
    price: float
    features: PropertyFeatures


class EstimateResponse(BaseModel):
    """Response for a single estimate request."""

    id: str
    created_at: datetime
    price: float
    features: PropertyFeatures


class HistoryResponse(BaseModel):
    """Paginated list of estimates."""

    items: List[HistoryItem]
    count: int


class MarketSummary(BaseModel):
    """Aggregate price statistics across all estimates."""

    total_estimates: int
    avg_price: Optional[float] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None


class MarketByBedrooms(BaseModel):
    """Average price broken down by bedroom count."""

    bedrooms: float
    avg_price: float


class MarketDataResponse(BaseModel):
    """Aggregated market data for the dashboard."""

    summary: MarketSummary
    by_bedrooms: List[MarketByBedrooms]
    recent_estimates: List[HistoryItem]


class BulkEstimateResponse(BaseModel):
    """Response for a bulk estimate request."""

    items: List[HistoryItem]
    count: int
