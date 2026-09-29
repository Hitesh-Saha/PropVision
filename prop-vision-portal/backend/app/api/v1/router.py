"""
API v1 router — the interface layer.

Handles HTTP requests (GET, POST, etc.), applies route guards via
FastAPI dependencies, delegates all business logic to services.py,
and returns the final serialised response. Contains no business logic.
"""
from typing import List

from fastapi import APIRouter, Depends, Request

from core.config import settings
from db.database import get_database
from middlewares.middleware import get_current_user
from models.schemas import (
    BulkEstimateResponse,
    EstimateResponse,
    HistoryResponse,
    MarketDataResponse,
    PropertyFeatures,
    Token,
    UserLogin,
    UserProfile,
    UserRegister,
)
from services.services import AuthService, EstimateService

router = APIRouter()


# ---------------------------------------------------------------------------
# Auth routes  –  /api/v1/auth/*
# ---------------------------------------------------------------------------

@router.post(
    "/auth/register",
    response_model=UserProfile,
    status_code=201,
    tags=["Auth"],
    summary="Register a new user account",
)
async def register(payload: UserRegister):
    db = get_database()
    return await AuthService.register_user(
        username=payload.username,
        password=payload.password,
        full_name=payload.full_name,
        db=db,
    )


@router.post(
    "/auth/login",
    response_model=Token,
    tags=["Auth"],
    summary="Obtain a JWT access token",
)
async def login(payload: UserLogin):
    db = get_database()
    return await AuthService.authenticate_user(
        username=payload.username,
        password=payload.password,
        db=db,
    )


@router.get(
    "/auth/me",
    response_model=UserProfile,
    tags=["Auth"],
    summary="Return the authenticated user's profile",
)
async def get_me(current_user: dict = Depends(get_current_user)):
    return AuthService.build_profile(current_user)


# ---------------------------------------------------------------------------
# Estimate routes  –  /api/v1/*
# ---------------------------------------------------------------------------

@router.post(
    "/estimate",
    response_model=EstimateResponse,
    tags=["Estimate"],
    summary="Estimate the price of a single property",
)
async def estimate_property(
    features: PropertyFeatures,
    request: Request,
    current_user: dict = Depends(get_current_user),
):
    db = get_database()
    return await EstimateService.create_estimate(
        features=features,
        http_client=request.app.state.http_client,
        pricing_api_base_url=settings.pricing_api_base_url,
        user=current_user,
        db=db,
    )


@router.get(
    "/history",
    response_model=HistoryResponse,
    tags=["History"],
    summary="Retrieve the authenticated user's estimate history",
)
async def get_history(
    limit: int = 50,
    current_user: dict = Depends(get_current_user),
):
    db = get_database()
    return await EstimateService.get_history(user=current_user, db=db, limit=limit)


@router.get(
    "/market-data",
    response_model=MarketDataResponse,
    tags=["Market"],
    summary="Aggregate market statistics across all estimates",
)
async def market_data(current_user: dict = Depends(get_current_user)):
    db = get_database()
    return await EstimateService.get_market_data(db=db)


@router.post(
    "/bulk-estimate",
    response_model=BulkEstimateResponse,
    tags=["Bulk Estimate"],
    summary="Estimate prices for multiple properties in one request",
)
async def bulk_estimate_properties(
    features_list: List[PropertyFeatures],
    request: Request,
    current_user: dict = Depends(get_current_user),
):
    db = get_database()
    return await EstimateService.bulk_estimate(
        features_list=features_list,
        http_client=request.app.state.http_client,
        pricing_api_base_url=settings.pricing_api_base_url,
        user=current_user,
        db=db,
    )
