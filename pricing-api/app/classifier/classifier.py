from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from models.schemas import FEATURE_NAMES, HousingFeatures

# Path to House Price Dataset.csv (project root = parent of app/)
DATASET_PATH = Path(__file__).resolve().parent.parent.parent / "House Price Dataset.csv"

RANDOM_STATE = 42
TEST_SIZE = 0.2

# Global model and metrics (trained at startup)
_pipeline: Pipeline | None = None
_metrics: dict | None = None


def _get_pipeline() -> Pipeline:
    """Return the trained model pipeline. Raises if not initialized."""
    global _pipeline
    if _pipeline is None:
        raise RuntimeError("Model not loaded. Call load_or_train_model() at startup.")
    return _pipeline


def _get_metrics() -> dict:
    """Return cached performance metrics. Raises if not initialized."""
    global _metrics
    if _metrics is None:
        raise RuntimeError("Metrics not loaded. Call load_or_train_model() at startup.")
    return _metrics


def load_or_train_model() -> None:
    """Train the model on House Price Dataset.csv. Sets global _pipeline and _metrics."""
    global _pipeline, _metrics

    if not DATASET_PATH.exists():
        raise FileNotFoundError(f"Dataset not found: {DATASET_PATH}")

    X, y, _ = _load_data()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE
    )

    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("regressor", Ridge(alpha=1.0, random_state=RANDOM_STATE)),
    ])
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    _metrics = _compute_metrics(y_test, y_pred)
    _pipeline = pipeline


def _load_data():
    """Load House Price Dataset.csv. Returns (X, y, feature_names)."""
    df = pd.read_csv(DATASET_PATH)
    # Drop id; target is price
    df = df.drop(columns=["id"], errors="ignore")
    if "price" not in df.columns:
        raise ValueError("Dataset must contain a 'price' column.")
    for name in FEATURE_NAMES:
        if name not in df.columns:
            raise ValueError(f"Dataset must contain feature column: {name}")
    y = df["price"].astype(np.float64).to_numpy()
    X = df[FEATURE_NAMES].astype(np.float64).to_numpy()
    # Drop rows with any NaN in features or target
    mask = ~(np.isnan(X).any(axis=1) | np.isnan(y))
    X, y = X[mask], y[mask]
    return X, y, FEATURE_NAMES


def _compute_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> dict:
    """Compute regression metrics."""
    return {
        "r2_score": float(r2_score(y_true, y_pred)),
        "mean_absolute_error": float(mean_absolute_error(y_true, y_pred)),
        "mean_squared_error": float(mean_squared_error(y_true, y_pred)),
        "root_mean_squared_error": float(np.sqrt(mean_squared_error(y_true, y_pred))),
    }


def features_to_array(features: HousingFeatures) -> np.ndarray:
    """Convert a single HousingFeatures to a 1D array in FEATURE_NAMES order."""
    return np.array([[getattr(features, name) for name in FEATURE_NAMES]], dtype=np.float64)


def features_list_to_array(instances: list[HousingFeatures]) -> np.ndarray:
    """Convert a list of HousingFeatures to a 2D array."""
    return np.array(
        [[getattr(f, name) for name in FEATURE_NAMES] for f in instances],
        dtype=np.float64,
    )


def predict(features: list[HousingFeatures]) -> list[float]:
    """Predict prices for a single/batch of housing records."""
    X = features_list_to_array(features)
    return _get_pipeline().predict(X).tolist()


def get_model_info() -> dict:
    """Return model coefficients and performance metrics."""
    pipeline = _get_pipeline()
    metrics = _get_metrics()
    reg = pipeline.named_steps["regressor"]
    intercept = float(reg.intercept_)
    coef = reg.coef_.tolist()
    coefficients = dict(zip(FEATURE_NAMES, coef))
    return {
        "model_type": type(reg).__name__,
        "intercept": intercept,
        "coefficients": coefficients,
        "feature_names": FEATURE_NAMES,
        "metrics": metrics,
        "target_description": "House price in dollars",
        "dataset": str(DATASET_PATH.name),
    }
