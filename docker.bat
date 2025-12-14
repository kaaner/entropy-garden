@echo off
REM Entropy Garden - Docker Helper Script for Windows
REM Usage: docker.bat [command]

setlocal enabledelayedexpansion

if "%1"=="" goto usage
if "%1"=="dev:up" goto dev_up
if "%1"=="dev:down" goto dev_down
if "%1"=="prod:up" goto prod_up
if "%1"=="prod:down" goto prod_down
if "%1"=="logs" goto logs
if "%1"=="clean" goto clean
if "%1"=="test" goto test
if "%1"=="lint" goto lint
if "%1"=="build" goto build
goto usage

:dev_up
echo Starting development environment...
docker-compose up --build
goto end

:dev_down
echo Stopping development environment...
docker-compose down
goto end

:prod_up
echo Starting production environment...
if not exist .env (
    echo ERROR: .env file not found! Copy from .env.example
    exit /b 1
)
docker-compose -f docker-compose.prod.yml up -d --build
echo Production environment started!
echo.
echo Web App: http://localhost:3000
echo n8n: http://localhost:5678
goto end

:prod_down
echo Stopping production environment...
docker-compose -f docker-compose.prod.yml down
goto end

:logs
set SERVICE=%2
if "%SERVICE%"=="" set SERVICE=web
echo Showing logs for %SERVICE%...
docker-compose logs -f %SERVICE%
goto end

:clean
echo Cleaning up Docker resources...
docker-compose down -v
docker system prune -f
echo Cleanup complete!
goto end

:test
echo Running tests in Docker...
docker-compose run --rm web pnpm test
goto end

:lint
echo Running lint in Docker...
docker-compose run --rm web pnpm lint
goto end

:build
echo Building Docker image...
docker build -t entropy-garden:latest .
echo Build complete!
goto end

:usage
echo Usage: %0 {dev:up^|dev:down^|prod:up^|prod:down^|logs^|clean^|test^|lint^|build}
echo.
echo Commands:
echo   dev:up      - Start development environment
echo   dev:down    - Stop development environment
echo   prod:up     - Start production environment
echo   prod:down   - Stop production environment
echo   logs [svc]  - Show logs (default: web)
echo   clean       - Clean up Docker resources
echo   test        - Run tests in Docker
echo   lint        - Run lint in Docker
echo   build       - Build production image
exit /b 1

:end
endlocal
