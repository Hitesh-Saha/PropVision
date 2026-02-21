FROM python:3.13-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install uv
RUN curl -sSL https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin/:$PATH"

# Install dependencies
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-cache

# Copy application code
COPY . .

# Expose port for the API
EXPOSE 8000

# Run with uv run; bind to 0.0.0.0 for container access
CMD ["uv", "run", "app/main.py"]
