#!/bin/bash

# Entropy Garden - Docker Helper Script
# Usage: ./docker.sh [command]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Commands
dev_up() {
    print_info "Starting development environment..."
    docker-compose up --build
}

dev_down() {
    print_info "Stopping development environment..."
    docker-compose down
}

prod_up() {
    print_info "Starting production environment..."
    if [ ! -f .env ]; then
        print_error ".env file not found! Copy from .env.example"
        exit 1
    fi
    docker-compose -f docker-compose.prod.yml up -d --build
    print_success "Production environment started!"
    echo ""
    echo "Web App: http://localhost:3000"
    echo "n8n: http://localhost:5678"
}

prod_down() {
    print_info "Stopping production environment..."
    docker-compose -f docker-compose.prod.yml down
}

logs() {
    SERVICE=${1:-web}
    print_info "Showing logs for $SERVICE..."
    docker-compose logs -f "$SERVICE"
}

clean() {
    print_info "Cleaning up Docker resources..."
    docker-compose down -v
    docker system prune -f
    print_success "Cleanup complete!"
}

test() {
    print_info "Running tests in Docker..."
    docker-compose run --rm web pnpm test
}

lint() {
    print_info "Running lint in Docker..."
    docker-compose run --rm web pnpm lint
}

build() {
    print_info "Building Docker image..."
    docker build -t entropy-garden:latest .
    print_success "Build complete!"
}

# Main
case "${1}" in
    dev:up)
        dev_up
        ;;
    dev:down)
        dev_down
        ;;
    prod:up)
        prod_up
        ;;
    prod:down)
        prod_down
        ;;
    logs)
        logs "${2}"
        ;;
    clean)
        clean
        ;;
    test)
        test
        ;;
    lint)
        lint
        ;;
    build)
        build
        ;;
    *)
        echo "Usage: $0 {dev:up|dev:down|prod:up|prod:down|logs|clean|test|lint|build}"
        echo ""
        echo "Commands:"
        echo "  dev:up      - Start development environment"
        echo "  dev:down    - Stop development environment"
        echo "  prod:up     - Start production environment"
        echo "  prod:down   - Stop production environment"
        echo "  logs [svc]  - Show logs (default: web)"
        echo "  clean       - Clean up Docker resources"
        echo "  test        - Run tests in Docker"
        echo "  lint        - Run lint in Docker"
        echo "  build       - Build production image"
        exit 1
        ;;
esac
