#!/bin/bash

# Sprint 1 Validation Script
# Checks that all Sprint 1 components are properly implemented

echo "============================================"
echo "Sprint 1 Validation Check"
echo "============================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} File exists: $1"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} File missing: $1"
        ((FAILED++))
        return 1
    fi
}

# Function to check file contains pattern
check_pattern() {
    local file=$1
    local pattern=$2
    local description=$3

    if grep -q "$pattern" "$file" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $description"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $description (pattern not found)"
        ((FAILED++))
        return 1
    fi
}

echo "1. Checking Core Files..."
echo "-------------------------------------------"
check_file "src/styles/design-system.css"
check_file "src/contexts/GlobalStateContext.tsx"
check_file "src/contexts/EventBusContext.tsx"
check_file "src/hooks/useToast.ts"
check_file "src/components/ui/Toast.tsx"
check_file "src/components/ui/StatusIndicator.tsx"
check_file "src/components/layout/CompanyHeader.tsx"
check_file "src/components/layout/ObsessionWidget.tsx"
check_file "src/components/layout/SubNavigation.tsx"
check_file "src/components/layout/Sidebar.tsx"
check_file "src/app/portal/test-sprint1/page.tsx"
echo ""

echo "2. Checking Design System..."
echo "-------------------------------------------"
check_pattern "src/styles/design-system.css" "--gradient-primary" "Primary gradient defined"
check_pattern "src/styles/design-system.css" "--gradient-funnel" "Funnel gradient defined"
check_pattern "src/styles/design-system.css" "--gradient-brewery" "Brewery gradient defined"
check_pattern "src/styles/design-system.css" "--shadow-sm" "Shadow system defined"
check_pattern "src/styles/design-system.css" "@keyframes pulse" "Pulse animation defined"
echo ""

echo "3. Checking Global State..."
echo "-------------------------------------------"
check_pattern "src/contexts/GlobalStateContext.tsx" "obsessionScore" "Obsession score state defined"
check_pattern "src/contexts/GlobalStateContext.tsx" "updateObsessionScore" "Update function defined"
check_pattern "src/contexts/GlobalStateContext.tsx" "notifications" "Notifications state defined"
check_pattern "src/contexts/GlobalStateContext.tsx" "addNotification" "Add notification function defined"
echo ""

echo "4. Checking Event Bus..."
echo "-------------------------------------------"
check_pattern "src/contexts/EventBusContext.tsx" "EVENTS" "Event constants defined"
check_pattern "src/contexts/EventBusContext.tsx" "emit" "Emit function defined"
check_pattern "src/contexts/EventBusContext.tsx" "on" "Subscribe function defined"
check_pattern "src/contexts/EventBusContext.tsx" "ANALYSIS_STARTED" "Analysis event defined"
echo ""

echo "5. Checking UI Components..."
echo "-------------------------------------------"
check_pattern "src/components/ui/Toast.tsx" "ToastContainer" "Toast container component defined"
check_pattern "src/components/ui/StatusIndicator.tsx" "StatusDot" "Status dot component defined"
check_pattern "src/components/ui/StatusIndicator.tsx" "Badge" "Badge component defined"
check_pattern "src/components/ui/StatusIndicator.tsx" "NavStatus" "Nav status component defined"
echo ""

echo "6. Checking Layout Components..."
echo "-------------------------------------------"
check_pattern "src/components/layout/CompanyHeader.tsx" "Refleqt" "Company name displayed"
check_pattern "src/components/layout/ObsessionWidget.tsx" "useGlobalState" "Uses global state"
check_pattern "src/components/layout/ObsessionWidget.tsx" "obsessionScore" "Displays obsession score"
check_pattern "src/components/layout/SubNavigation.tsx" "NavItemWithSub" "Sub-navigation component defined"
echo ""

echo "7. Checking Sidebar Integration..."
echo "-------------------------------------------"
check_pattern "src/components/layout/Sidebar.tsx" "CompanyHeader" "Company header imported"
check_pattern "src/components/layout/Sidebar.tsx" "ObsessionWidget" "Obsession widget imported"
check_pattern "src/components/layout/Sidebar.tsx" "NavItemWithSub" "Sub-navigation imported"
check_pattern "src/components/layout/Sidebar.tsx" "Intelligence Feed" "Intelligence Feed nav item exists"
echo ""

echo "8. Checking Portal Layout..."
echo "-------------------------------------------"
check_pattern "src/app/portal/layout.tsx" "GlobalStateProvider" "Global state provider wrapped"
check_pattern "src/app/portal/layout.tsx" "EventBusProvider" "Event bus provider wrapped"
check_pattern "src/app/portal/layout.tsx" "ToastContainer" "Toast container included"
echo ""

echo "9. Checking Test Page..."
echo "-------------------------------------------"
check_pattern "src/app/portal/test-sprint1/page.tsx" "testToastSuccess" "Toast tests defined"
check_pattern "src/app/portal/test-sprint1/page.tsx" "increaseObsession" "Obsession tests defined"
check_pattern "src/app/portal/test-sprint1/page.tsx" "testEventBus" "Event bus tests defined"
check_pattern "src/app/portal/test-sprint1/page.tsx" "testMultipleToasts" "Edge case tests defined"
echo ""

echo "10. Checking Imports..."
echo "-------------------------------------------"
check_pattern "src/app/globals.css" "design-system.css" "Design system imported in globals.css"
check_pattern "src/components/ui/index.ts" "ToastContainer" "Toast exported from ui/index"
check_pattern "src/components/ui/index.ts" "StatusDot" "StatusDot exported from ui/index"
echo ""

# Summary
echo "============================================"
echo "Validation Summary"
echo "============================================"
echo -e "Total Checks: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All Sprint 1 validations passed!${NC}"
    echo ""
    echo "Next Steps:"
    echo "1. Open browser: http://localhost:3000/portal/test-sprint1"
    echo "2. Verify visual elements in sidebar"
    echo "3. Test interactive features (toasts, obsession score, events)"
    echo "4. Run edge case tests"
    echo "5. Review SPRINT1_TEST_DOCUMENTATION.md for detailed test plan"
    exit 0
else
    echo -e "${RED}✗ Some validations failed. Please review the output above.${NC}"
    exit 1
fi
