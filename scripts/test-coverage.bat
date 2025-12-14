@echo off
REM Test Coverage Report Script for Windows

echo ╔════════════════════════════════════════════════╗
echo ║   Entropy Garden - Test Coverage Report       ║
echo ╚════════════════════════════════════════════════╝
echo.

REM Run tests with coverage
echo Running tests with coverage...
echo.

REM Engine package
echo 📦 Testing @entropy-garden/engine
call pnpm --filter @entropy-garden/engine test:coverage
echo.

REM AI package
echo 🤖 Testing @entropy-garden/ai
call pnpm --filter @entropy-garden/ai test:coverage
echo.

REM Web app
echo 🌐 Testing @entropy-garden/web
call pnpm --filter @entropy-garden/web test:coverage
echo.

REM Summary
echo ╔════════════════════════════════════════════════╗
echo ║   Coverage Reports Generated                   ║
echo ╚════════════════════════════════════════════════╝
echo.
echo View HTML reports:
echo   - Engine: packages\engine\coverage\index.html
echo   - AI:     packages\ai\coverage\index.html
echo   - Web:    apps\web\coverage\index.html
echo.
echo ✅ Coverage report complete!
