"""
MongoDB document models.

Defines the exact shape of documents stored in each collection using
TypedDicts — a lightweight, type-safe "ORM" layer for Motor/PyMongo.
These are used for reads/writes throughout services.py and database.py.
"""
from datetime import datetime
from typing import Optional, TypedDict


class UserDocument(TypedDict, total=False):
    """Shape of a document in the 'users' collection.

    MongoDB auto-generates _id (ObjectId) on insert.
    """

    username: str
    hashed_password: str
    full_name: Optional[str]


class FeaturesSubDocument(TypedDict):
    """Embedded property features inside an estimate document."""

    square_footage: float
    bedrooms: float
    bathrooms: float
    year_built: float
    lot_size: float
    distance_to_city_center: float
    school_rating: float


class EstimateDocument(TypedDict, total=False):
    """Shape of a document in the 'estimates' collection.

    _id is a UUID string assigned by the application.
    user_id is str(ObjectId) from users._id — links estimate to owner.
    """

    _id: str
    user_id: str
    created_at: datetime
    price: float
    features: FeaturesSubDocument
