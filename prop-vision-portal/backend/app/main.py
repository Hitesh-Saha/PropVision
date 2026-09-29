"""
Application entry point.

Wires together the FastAPI instance, lifespan (MongoDB + HTTP client),
middleware registration, and API router. Kept intentionally thin —
all business logic lives in services.py, all HTTP routing in api/v1/router.py.
"""
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI

from api.v1.router import router as api_router
from db.database import close_db, connect_db
from middlewares.middleware import register_middlewares


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown resources."""
    await connect_db()
    async with httpx.AsyncClient(timeout=5.0) as client:
        app.state.http_client = client
        yield
    await close_db()


app = FastAPI(
    title="PropVision Backend",
    description=(
        "Service orchestrator for the PropVision property valuation platform. "
        "Handles authentication, proxies estimation requests to the Pricing API, "
        "and exposes aggregated market data endpoints."
    ),
    version="2.0.0",
    lifespan=lifespan,
)

register_middlewares(app)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
async def health():
    """Simple health check."""
    return {"status": "healthy", "service": "propvision-backend"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
