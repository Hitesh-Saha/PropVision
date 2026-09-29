# from pytest import fixture
# import httpx
# from config.config import settings
# pyrefly: ignore [missing-import]
from main import app
from fastapi.testclient import TestClient

def test_health():
    client = TestClient(app)
    payload = {
                "square_footage": 1850,
                "bedrooms": 3,
                "bathrooms": 2,
                "year_built": 1998,
                "lot_size": 7500,
                "distance_to_city_center": 5.6,
                "school_rating": 8.2,
            }
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}

