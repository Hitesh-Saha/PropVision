from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.prediction import router as prediction_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create a shared HTTP client for calling the Pricing API."""
    async with httpx.AsyncClient(timeout=5.0) as client:
        app.state.http_client = client
        yield


app = FastAPI(
    title="Property Portal Backend",
    description=(
        "Backend for the Property Portal application. "
        "Proxies estimation requests to the Pricing API and exposes market data endpoints."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Health"])
async def health():
    """Simple health check."""
    return {"status": "healthy", "service": "property-portal-backend"}

app.include_router(prediction_router, prefix='/api/v1')

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

