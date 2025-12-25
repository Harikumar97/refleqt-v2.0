#!/bin/bash

# Quick Setup Verification Script
# Run this after pulling to verify everything is working

echo "=================================="
echo "Refleqt Setup Verification"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project root directory"
    exit 1
fi

# Check if scripts exist in package.json
echo "1. Checking npm scripts..."
if grep -q "dev:safe" package.json && grep -q "\"fix\"" package.json && grep -q "\"validate\"" package.json; then
    echo "   ✅ All npm scripts found"
else
    echo "   ❌ npm scripts missing - did you pull the latest changes?"
    exit 1
fi

# Check if validation scripts exist
echo ""
echo "2. Checking validation scripts..."
if [ -f "scripts/validate-dev-environment.js" ] && [ -f "scripts/auto-fix-common-issues.js" ]; then
    echo "   ✅ Validation scripts found"
else
    echo "   ❌ Validation scripts missing"
    exit 1
fi

# Check if DEV_WORKFLOW.md exists
echo ""
echo "3. Checking documentation..."
if [ -f "DEV_WORKFLOW.md" ]; then
    echo "   ✅ Development workflow documentation found"
else
    echo "   ❌ DEV_WORKFLOW.md missing"
    exit 1
fi

# Check Prisma configuration
echo ""
echo "4. Checking Prisma configuration..."
if grep -q 'engineType.*=.*"binary"' prisma/schema.prisma; then
    echo "   ✅ Prisma 7 configuration correct"
else
    echo "   ❌ Prisma schema needs engineType = \"binary\""
    exit 1
fi

# Test npm scripts are callable
echo ""
echo "5. Testing npm scripts..."
if npm run 2>&1 | grep -q "dev:safe"; then
    echo "   ✅ npm can see custom scripts"
else
    echo "   ⚠️  npm might need cache clear: npm cache clean --force"
fi

echo ""
echo "=================================="
echo "✨ Verification Complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo "  1. Run: npm run dev:safe"
echo "  2. Visit: http://localhost:3000/portal/intelligence-feed"
echo ""
