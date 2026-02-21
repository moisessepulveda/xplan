#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# Configuration
STACK_NAME=${STACK_NAME:-xplan}
IMAGE_NAME=${IMAGE_NAME:-xplan}

# Read version from file
if [ ! -f "version" ]; then
    echo -e "${RED}Error: version file not found!${NC}"
    exit 1
fi

VERSION=$(cat version | tr -d '[:space:]')

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       XPlan Production Deploy          ║${NC}"
echo -e "${BLUE}║       Version: ${VERSION}                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"

# Check if .env.prod exists
if [ ! -f ".env.prod" ]; then
    echo -e "${RED}Error: .env.prod file not found!${NC}"
    echo -e "${YELLOW}Copy docker/.env.prod.example to .env.prod and configure it.${NC}"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env.prod | xargs)

# Export version for docker-compose
export IMAGE_TAG=${VERSION}

# Set volume paths inside project
export SQLITE_DATA_PATH="${PROJECT_ROOT}/database"
export STORAGE_PRIVATE_PATH="${PROJECT_ROOT}/storage/app/private"
export STORAGE_LOGS_PATH="${PROJECT_ROOT}/storage/logs"

# Create data directories
echo -e "${YELLOW}Creating data directories...${NC}"
mkdir -p "${SQLITE_DATA_PATH}"
mkdir -p "${STORAGE_PRIVATE_PATH}"
mkdir -p "${STORAGE_LOGS_PATH}"

# Ensure SQLite file exists
if [ ! -f "${SQLITE_DATA_PATH}/database.sqlite" ]; then
    touch "${SQLITE_DATA_PATH}/database.sqlite"
fi

# Set permissions (user 1000 is www inside container)
chmod -R 775 "${SQLITE_DATA_PATH}"
chmod -R 775 "${STORAGE_PRIVATE_PATH}"
chmod -R 775 "${STORAGE_LOGS_PATH}"

# Build image (--pull to get latest base images)
echo -e "${YELLOW}Building Docker image ${IMAGE_NAME}:${VERSION}...${NC}"
docker build --pull -t ${IMAGE_NAME}:${VERSION} -t ${IMAGE_NAME}:latest .

# Deploy stack
echo -e "${YELLOW}Deploying stack to Docker Swarm...${NC}"
docker stack deploy \
    --compose-file docker-compose.prod.yml \
    ${STACK_NAME}

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         Deploy Complete!               ║${NC}"
echo -e "${GREEN}║         Version: ${VERSION}                   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"

echo -e "${BLUE}Stack services:${NC}"
docker stack services ${STACK_NAME}

echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo -e "  View logs:     docker service logs ${STACK_NAME}_app -f"
echo -e "  View services: docker stack services ${STACK_NAME}"
echo -e "  Remove stack:  docker stack rm ${STACK_NAME}"
