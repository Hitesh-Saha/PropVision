from typing import List
from fastapi import APIRouter, HTTPException
from classifier.classifier import get_model_info, predict
from models.schemas import HousingFeatures, PredictionResponse

router = APIRouter()


@router.get("/model-info", tags=["Model"])
async def model_info():
    """Return model coefficients and performance metrics (R², MAE, RMSE, etc.)."""
    try:
        return get_model_info()
    except (RuntimeError, FileNotFoundError) as e:
        raise HTTPException(status_code=503, detail=str(e))


@router.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
async def predict_price(features: List[HousingFeatures]):
    """Accept a single/batch set of housing features and return the predicted price."""
    try:
        prediction = predict(features)
        return PredictionResponse(prediction=prediction, count=len(prediction))
    except (RuntimeError, FileNotFoundError) as e:
        raise HTTPException(status_code=503, detail=str(e))