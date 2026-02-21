#!/bin/bash

# Housing Property Valuation System - Start All Script

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Housing Property Valuation System${NC}"
echo "-------------------------------------"

# Function to display help
usage() {
    echo "Usage: $0 [MODE]"
    echo ""
    echo "Modes:"
    echo "  docker    Run all services using Docker Compose (recommended)"
    echo "  local     Run all services locally (requires uv and node)"
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
        docker-compose up --build
        ;;
    local)
        echo -e "${GREEN}Starting services locally...${NC}"
        
        # Start Pricing API
        echo -e "${BLUE}[1/3] Starting Pricing API (Port 8080)...${NC}"
        cd pricing-api && source .venv/bin/activate && uv run app/main.py &
        PRICING_PID=$!

        # Start Property Portal Backend
        echo -e "${BLUE}[2/3] Starting Property Portal Backend (Port 8000)...${NC}"
        cd property-portal/backend && source .venv/bin/activate && uv run app/main.py &
        BACKEND_PID=$!

        # Start Property Portal Frontend
        echo -e "${BLUE}[3/3] Starting Property Portal Frontend (Port 3000)...${NC}"
        cd property-portal/frontend && npm run dev &
        FRONTEND_PID=$!

        echo -e "${GREEN}All services are starting!${NC}"
        echo "Pricing API: http://localhost:8080"
        echo "Backend API: http://localhost:8000"
        echo "Frontend:    http://localhost:3000"
        echo ""
        echo "Press Ctrl+C to stop all services."

        # Handle Ctrl+C
        trap "kill $PRICING_PID $BACKEND_PID $FRONTEND_PID; exit" INT
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
