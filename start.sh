#!/bin/bash

# PropVision – Housing Property Valuation System - Start All Script

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}PropVision – Housing Property Valuation System${NC}"
echo "---------------------------------------------"

# Function to display help
usage() {
    echo "Usage: $0 [MODE]"
    echo ""
    echo "Modes:"
    echo "  docker    Run all services using Docker Compose (recommended)"
    echo "            Includes MongoDB, Pricing API, Backend, and Frontend."
    echo "  local     Run all services locally (requires uv, node, and a running MongoDB)"
    echo "            Set MONGODB_URL env var if MongoDB is not on localhost:27017."
    echo "  stop      Stop all running services (Docker mode)"
    echo ""
    exit 1
}

# Check for arguments
if [ $# -eq 0 ]; then
    usage
fi

case "$1" in
    docker)
        echo -e "${GREEN}Starting services with Docker Compose...${NC}"
        echo -e "${YELLOW}Includes: MongoDB, Pricing API, Backend, Frontend${NC}"
        docker-compose up --build
        ;;
    local)
        echo -e "${GREEN}Starting services locally...${NC}"
        echo -e "${YELLOW}Note: MongoDB must be running locally (mongodb://localhost:27017)${NC}"
        echo -e "${YELLOW}      Start it with: docker run -d -p 27017:27017 mongo:7.0${NC}"
        echo ""

        # Start Pricing API
        echo -e "${BLUE}[1/3] Starting Pricing API (Port 8080)...${NC}"
        (cd pricing-api && uv run app/main.py) &
        PRICING_PID=$!

        # Start Propvision Portal Backend
        echo -e "${BLUE}[2/3] Starting Propvision Portal Backend (Port 8000)...${NC}"
        (cd prop-vision-portal/backend && uv run app/main.py) &
        BACKEND_PID=$!

        # Start Propvision Portal Frontend
        echo -e "${BLUE}[3/3] Starting Propvision Portal Frontend (Port 3000)...${NC}"
        (cd prop-vision-portal/frontend && npm run dev) &
        FRONTEND_PID=$!

        echo ""
        echo -e "${GREEN}All services are starting!${NC}"
        echo "  MongoDB:     mongodb://localhost:27017"
        echo "  Pricing API: http://localhost:8080"
        echo "  Backend API: http://localhost:8000"
        echo "  Frontend:    http://localhost:3000"
        echo ""
        echo "Press Ctrl+C to stop all services."

        # Handle Ctrl+C
        trap "kill $PRICING_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
        wait
        ;;
    stop)
        echo -e "${GREEN}Stopping Docker services...${NC}"
        docker-compose down
        ;;
    *)
        usage
        ;;
esac
