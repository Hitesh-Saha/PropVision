"""
Application settings.

Leverages pydantic-settings to securely load, validate, and parse all
system configuration and secrets from environment variables (and an
optional .env file). A single `settings` singleton is imported
throughout the application.
"""
from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Validated application configuration loaded from environment variables."""

    # ── Pricing API ────────────────────────────────────────────────────────
    pricing_api_base_url: str = Field(
        default="http://localhost:8080",
        alias="PRICING_API_BASE_URL",
        description="Base URL for the Pricing API microservice",
    )

    # ── MongoDB ────────────────────────────────────────────────────────────
    mongodb_url: str = Field(
        default="mongodb://localhost:27017",
        alias="MONGODB_URL",
        description="Full MongoDB connection URL (include credentials if auth is enabled)",
    )

    mongodb_db_name: str = Field(
        default="propvision",
        alias="MONGODB_DB_NAME",
        description="MongoDB database name",
    )

    # ── JWT ────────────────────────────────────────────────────────────────
    jwt_secret_key: str = Field(
        default="change-me-in-production",
        alias="JWT_SECRET_KEY",
        description="HMAC secret used to sign JWT tokens",
    )

    jwt_algorithm: str = Field(
        default="HS256",
        alias="JWT_ALGORITHM",
        description="JWT signing algorithm",
    )

    jwt_access_token_expire_minutes: int = Field(
        default=1440,  # 24 hours
        alias="JWT_ACCESS_TOKEN_EXPIRE_MINUTES",
        description="Token lifetime in minutes",
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Module-level singleton — import this everywhere
settings = Settings()
