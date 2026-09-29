"""
Application services.

The 'brain' of the application. Contains all business rules, data
manipulation, and multi-step transactions. The API routing layer stays
clean by delegating every non-HTTP concern to the appropriate service.

Services are stateless — they receive dependencies (database handle,
HTTP client, authenticated user) as parameters rather than holding them
as instance state, making them easy to test in isolation.
"""
from datetime import datetime, timezone
from uuid import uuid4

import httpx
from bson import ObjectId
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from utils.utils import create_access_token, hash_password, verify_password
from models.schemas import (
    BulkEstimateResponse,
    EstimateResponse,
    HistoryItem,
    HistoryResponse,
    MarketByBedrooms,
    MarketDataResponse,
    MarketSummary,
    PropertyFeatures,
    Token,
    UserProfile,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _estimate_from_doc(doc: dict) -> HistoryItem:
    """Convert a raw MongoDB estimate document into a HistoryItem schema."""
    return HistoryItem(
        id=doc["_id"],
        created_at=doc["created_at"],
        price=doc["price"],
        features=PropertyFeatures(**doc["features"]),
    )


# ---------------------------------------------------------------------------
# AuthService
# ---------------------------------------------------------------------------

class AuthService:
    """Handles user registration, authentication, and profile retrieval."""

    @staticmethod
    async def register_user(
        username: str,
        password: str,
        full_name: str | None,
        db: AsyncIOMotorDatabase,
    ) -> UserProfile:
        """
        Create a new user account.

        Raises HTTP 409 if the username is already taken.
        Returns the public profile of the newly created user.
        """
        existing = await db["users"].find_one({"username": username})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Username '{username}' is already taken",
            )

        user_doc = {
            "username": username,
            "hashed_password": hash_password(password),
            "full_name": full_name,
        }
        result = await db["users"].insert_one(user_doc)
        user_id = str(result.inserted_id)

        return UserProfile(user_id=user_id, username=username, full_name=full_name)

    @staticmethod
    async def authenticate_user(
        username: str,
        password: str,
        db: AsyncIOMotorDatabase,
    ) -> Token:
        """
        Validate credentials and return a signed JWT access token.

        The token's 'sub' claim carries the user's MongoDB ObjectId string
        (not the username) so the link survives username changes.

        Raises HTTP 401 on bad credentials.
        """
        user = await db["users"].find_one({"username": username})
        if not user or not verify_password(password, user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        token = create_access_token(data={"sub": str(user["_id"])})
        return Token(access_token=token)

    @staticmethod
    async def get_user_by_id(
        user_id_str: str,
        db: AsyncIOMotorDatabase,
    ) -> dict:
        """
        Fetch a user document by its ObjectId string.

        Raises HTTP 401 if the ID is malformed or the user does not exist.
        Used by the auth dependency to resolve the token subject.
        """
        try:
            object_id = ObjectId(user_id_str)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token subject is not a valid user ID",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user = await db["users"].find_one({"_id": object_id})
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user

    @staticmethod
    def build_profile(user: dict) -> UserProfile:
        """Convert a raw user document into a UserProfile response schema."""
        return UserProfile(
            user_id=str(user["_id"]),
            username=user["username"],
            full_name=user.get("full_name"),
        )


# ---------------------------------------------------------------------------
# EstimateService
# ---------------------------------------------------------------------------

class EstimateService:
    """Handles property valuation requests and market-data aggregation."""

    @staticmethod
    async def _call_pricing_api(
        features_payload: list[dict],
        http_client: httpx.AsyncClient,
        pricing_api_base_url: str,
    ) -> list[float]:
        """Call the Pricing API and return a list of predicted prices."""
        try:
            response = await http_client.post(
                f"{pricing_api_base_url}/api/v1/predict",
                json=features_payload,
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
        if not predictions:
            raise HTTPException(
                status_code=502,
                detail="Pricing API response missing or empty 'prediction' field",
            )
        return [float(p) for p in predictions]

    @staticmethod
    async def create_estimate(
        features: PropertyFeatures,
        http_client: httpx.AsyncClient,
        pricing_api_base_url: str,
        user: dict,
        db: AsyncIOMotorDatabase,
    ) -> EstimateResponse:
        """
        Get a price prediction for a single property and persist the result.
        The estimate is linked to the authenticated user via user_id (ObjectId).
        """
        prices = await EstimateService._call_pricing_api(
            [features.model_dump()], http_client, pricing_api_base_url
        )
        price = prices[0]
        now = datetime.now(timezone.utc)
        estimate_id = str(uuid4())
        user_id = str(user["_id"])

        await db["estimates"].insert_one({
            "_id": estimate_id,
            "user_id": user_id,
            "created_at": now,
            "price": price,
            "features": features.model_dump(),
        })

        return EstimateResponse(id=estimate_id, created_at=now, price=price, features=features)

    @staticmethod
    async def get_history(
        user: dict,
        db: AsyncIOMotorDatabase,
        limit: int = 50,
    ) -> HistoryResponse:
        """Return the most recent estimates belonging to the authenticated user."""
        user_id = str(user["_id"])
        cursor = (
            db["estimates"]
            .find({"user_id": user_id})
            .sort("created_at", -1)
            .limit(limit)
        )
        docs = await cursor.to_list(length=limit)
        items = [_estimate_from_doc(d) for d in docs]
        return HistoryResponse(items=items, count=len(items))

    @staticmethod
    async def get_market_data(db: AsyncIOMotorDatabase) -> MarketDataResponse:
        """
        Aggregate market statistics across ALL users' estimates.
        Returns an empty summary when no estimates exist yet.
        """
        all_docs = await db["estimates"].find().to_list(length=10_000)

        if not all_docs:
            return MarketDataResponse(
                summary=MarketSummary(
                    total_estimates=0,
                    avg_price=None,
                    min_price=None,
                    max_price=None,
                ),
                by_bedrooms=[],
                recent_estimates=[],
            )

        prices = [d["price"] for d in all_docs]
        summary = MarketSummary(
            total_estimates=len(all_docs),
            avg_price=sum(prices) / len(prices),
            min_price=min(prices),
            max_price=max(prices),
        )

        buckets: dict[float, list[float]] = {}
        for d in all_docs:
            b = float(d["features"]["bedrooms"])
            buckets.setdefault(b, []).append(d["price"])

        by_bedrooms = [
            MarketByBedrooms(bedrooms=bed, avg_price=sum(vals) / len(vals))
            for bed, vals in sorted(buckets.items())
        ]

        recent_docs = sorted(all_docs, key=lambda x: x["created_at"], reverse=True)[:10]
        return MarketDataResponse(
            summary=summary,
            by_bedrooms=by_bedrooms,
            recent_estimates=[_estimate_from_doc(d) for d in recent_docs],
        )

    @staticmethod
    async def bulk_estimate(
        features_list: list[PropertyFeatures],
        http_client: httpx.AsyncClient,
        pricing_api_base_url: str,
        user: dict,
        db: AsyncIOMotorDatabase,
    ) -> BulkEstimateResponse:
        """
        Get price predictions for multiple properties and persist all results.
        Calls the Pricing API once with the full batch for efficiency.
        """
        if not features_list:
            return BulkEstimateResponse(items=[], count=0)

        prices = await EstimateService._call_pricing_api(
            [f.model_dump() for f in features_list], http_client, pricing_api_base_url
        )

        if len(prices) != len(features_list):
            raise HTTPException(
                status_code=502,
                detail="Pricing API returned an unexpected number of predictions",
            )

        now = datetime.now(timezone.utc)
        user_id = str(user["_id"])
        results: list[HistoryItem] = []

        for features, price in zip(features_list, prices):
            estimate_id = str(uuid4())
            await db["estimates"].insert_one({
                "_id": estimate_id,
                "user_id": user_id,
                "created_at": now,
                "price": price,
                "features": features.model_dump(),
            })
            results.append(HistoryItem(
                id=estimate_id,
                created_at=now,
                price=price,
                features=features,
            ))

        return BulkEstimateResponse(items=results, count=len(results))
