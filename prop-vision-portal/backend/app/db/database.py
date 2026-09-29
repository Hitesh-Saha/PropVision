"""MongoDB connection management using Motor (async PyMongo driver)."""
import logging

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import ASCENDING, DESCENDING

from core.config import settings

logger = logging.getLogger(__name__)


class Database:
    client: AsyncIOMotorClient = None


db = Database()


async def connect_db() -> None:
    """
    Open the Motor (async pymongo) connection pool and create indexes.

    The URL encodes credentials and authSource, e.g.:
        mongodb://admin:admin@localhost:27017/?authSource=admin
    """
    logger.info("Connecting to MongoDB at %s …", settings.mongodb_url)
    db.client = AsyncIOMotorClient(
        settings.mongodb_url,
        serverSelectionTimeoutMS=5_000,
        connectTimeoutMS=5_000,
    )

    # Verify connectivity early — fails fast if MongoDB is unreachable
    await db.client.admin.command("ping")
    logger.info("MongoDB connection established. DB: %s", settings.mongodb_db_name)

    await _ensure_indexes(db.client[settings.mongodb_db_name])


async def _ensure_indexes(database: AsyncIOMotorDatabase) -> None:
    """Create indexes for the collections used by the application."""

    # users: unique index on username
    await database["users"].create_index(
        [("username", ASCENDING)], unique=True, name="users_username_unique"
    )

    # estimates: compound index for per-user history queries sorted by time
    await database["estimates"].create_index(
        [("user_id", ASCENDING), ("created_at", DESCENDING)],
        name="estimates_user_id_created_at",
    )

    logger.info("MongoDB indexes ensured.")


async def close_db() -> None:
    """Close the Motor connection pool."""
    if db.client:
        db.client.close()
        logger.info("MongoDB connection closed.")


def get_database() -> AsyncIOMotorDatabase:
    """Return the application database handle."""
    return db.client[settings.mongodb_db_name]
