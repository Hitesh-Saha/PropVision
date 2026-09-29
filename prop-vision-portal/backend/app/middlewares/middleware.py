"""
Middleware registration.

Centralises all middleware configuration so that main.py stays clean.
Add new middleware here (rate limiting, request ID injection, logging, etc.)
without touching the application factory.
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from utils.utils import decode_access_token
from db.database import get_database
from services.services import AuthService

bearer_scheme = HTTPBearer()


def register_middlewares(app: FastAPI) -> None:
    """Register all application middlewares on the FastAPI instance."""

    # CORS — allow all origins for local dev; tighten in production
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    """
    Validate the JWT Bearer token and return the authenticated user document.

    Flow:
      1. Decode the token; reject if expired or tampered.
      2. Extract the 'sub' claim (MongoDB ObjectId string).
      3. Delegate the DB lookup to AuthService.get_user_by_id().

    Raises HTTP 401 on any failure.
    """
    token = credentials.credentials
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id_str: str = payload.get("sub") or ''
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject claim",
            headers={"WWW-Authenticate": "Bearer"},
        )

    db = get_database()
    return await AuthService.get_user_by_id(user_id_str, db)
