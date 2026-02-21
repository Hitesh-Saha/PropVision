from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    pricing_api_base_url: str = Field(
        default="http://localhost:8080",
        alias="PRICING_API_BASE_URL",
        description="Base URL for the Pricing API service",
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()

