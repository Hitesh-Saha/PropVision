from contextlib import asynccontextmanager

from fastapi import FastAPI

from classifier.classifier import load_or_train_model
from api.v1.pricing import router as pricing_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load or train the model on startup using House Price Dataset.csv."""
    load_or_train_model()
    yield
    # Optional cleanup on shutdown


app = FastAPI(
    title="Housing Price Prediction API",
    description="Regression API that predicts house prices from features in House Price Dataset.csv. Supports single and batch predictions.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",   # Swagger UI
    redoc_url="/redoc", # ReDoc
    openapi_url="/openapi.json",
)


@app.get("/health", tags=["Health"])
async def health():
    """Simple health check endpoint."""
    return {"status": "healthy", "service": "housing-price-prediction-api"}


app.include_router(pricing_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080)
