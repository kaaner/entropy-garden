#!/bin/bash
# Test Coverage Report Script

set -e

echo "╔════════════════════════════════════════════════╗"
echo "║   Entropy Garden - Test Coverage Report       ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Run tests with coverage
echo -e "${YELLOW}Running tests with coverage...${NC}"
echo ""

# Engine package
echo -e "${GREEN}📦 Testing @entropy-garden/engine${NC}"
pnpm --filter @entropy-garden/engine test:coverage || true
echo ""

# AI package
echo -e "${GREEN}🤖 Testing @entropy-garden/ai${NC}"
pnpm --filter @entropy-garden/ai test:coverage || true
echo ""

# Web app
echo -e "${GREEN}🌐 Testing @entropy-garden/web${NC}"
pnpm --filter @entropy-garden/web test:coverage || true
echo ""

# Summary
echo "╔════════════════════════════════════════════════╗"
echo "║   Coverage Reports Generated                   ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo "View HTML reports:"
echo "  - Engine: packages/engine/coverage/index.html"
echo "  - AI:     packages/ai/coverage/index.html"
echo "  - Web:    apps/web/coverage/index.html"
echo ""
echo -e "${GREEN}✅ Coverage report complete!${NC}"
