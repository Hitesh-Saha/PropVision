from pydantic import BaseModel, Field


# Feature names from House Price Dataset.csv (excluding id and price)
FEATURE_NAMES = [
    "square_footage",
    "bedrooms",
    "bathrooms",
    "year_built",
    "lot_size",
    "distance_to_city_center",
    "school_rating",
]


class HousingFeatures(BaseModel):
    """Single housing record features."""

    square_footage: float = Field(..., gt=0, description="Living area in square feet")
    bedrooms: float = Field(..., ge=0, description="Number of bedrooms")
    bathrooms: float = Field(..., ge=0, description="Number of bathrooms")
    year_built: float = Field(..., description="Year the house was built")
    lot_size: float = Field(..., ge=0, description="Lot size in square feet")
    distance_to_city_center: float = Field(..., ge=0, description="Distance to city center in miles")
    school_rating: float = Field(..., ge=0, le=10, description="School district rating (0-10)")

    model_config = {"json_schema_extra": {"example": {
        "square_footage": 1850.0,
        "bedrooms": 3.0,
        "bathrooms": 2.0,
        "year_built": 1998.0,
        "lot_size": 7500.0,
        "distance_to_city_center": 5.6,
        "school_rating": 8.2,
    }}}


class PredictionResponse(BaseModel):
    """Single price prediction response."""

    prediction: list[float] = Field(..., description="Predicted house prices in dollars")
    count: int = Field(..., description="Number of predictions returned")

    model_config = {"json_schema_extra": {"example": {
        "predictions": [100000.0, 150000.0, 200000.0],
        "count": 3,
    }}}
