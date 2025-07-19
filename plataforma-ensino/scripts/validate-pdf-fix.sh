#!/bin/bash

# PDF Blank Space Fix Validation Script
# Checks that all the required changes have been implemented correctly

set -e

echo "🔍 Validating PDF Blank Space Fix Implementation..."
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0
WARNINGS=0

# Helper functions
check_pass() {
    echo -e "${GREEN}✅ PASS:${NC} $1"
    ((PASS++))
}

check_fail() {
    echo -e "${RED}❌ FAIL:${NC} $1"
    ((FAIL++))
}

check_warning() {
    echo -e "${YELLOW}⚠️  WARN:${NC} $1"
    ((WARNINGS++))
}

check_info() {
    echo -e "${BLUE}ℹ️  INFO:${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src/components/lesson" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    exit 1
fi

echo -e "\n${BLUE}1. Checking for CSS Conflicts...${NC}"
echo "=================================="

# Check for removed global CSS conflicts
if grep -r "height: auto !important" src/components/lesson/PDFSection.tsx 2>/dev/null; then
    check_fail "Global CSS conflicts still present (height: auto !important)"
else
    check_pass "No global CSS conflicts found"
fi

if grep -r "\!important" src/components/lesson/PDFSection.tsx 2>/dev/null | grep -E "(height|canvas)" >/dev/null; then
    check_fail "CSS !important declarations found affecting height/canvas"
else
    check_pass "No problematic !important declarations found"
fi

# Check for style jsx global blocks
if grep -A 10 -B 2 "<style jsx global>" src/components/lesson/PDFSection.tsx 2>/dev/null; then
    check_fail "Global style blocks still present"
else
    check_pass "No global style blocks found"
fi

echo -e "\n${BLUE}2. Checking React-PDF Props Usage...${NC}"
echo "======================================"

# Check for scale prop usage (should be removed)
if grep -r "scale={" src/components/lesson/PDFSection.tsx 2>/dev/null; then
    check_fail "Scale prop still in use (conflicts with width prop)"
else
    check_pass "Scale prop properly removed"
fi

# Check for width prop usage (should be present)
if grep -r "width={" src/components/lesson/PDFSection.tsx 2>/dev/null; then
    check_pass "Width prop found (correct approach)"
else
    check_fail "Width prop not found (required for sizing)"
fi

# Check for proper Page component props
if grep -A 5 -B 5 "<Page" src/components/lesson/PDFSection.tsx | grep -E "(renderTextLayer|renderAnnotationLayer)" >/dev/null; then
    check_pass "Render layer props properly configured"
else
    check_warning "Render layer props might not be optimally configured"
fi

echo -e "\n${BLUE}3. Checking Container Configuration...${NC}"
echo "======================================"

# Check for min-height removal
if grep -r "min-h-\[600px\]" src/components/lesson/PDFSection.tsx 2>/dev/null; then
    check_fail "Fixed min-height still present (prevents dynamic sizing)"
else
    check_pass "Fixed min-height properly removed"
fi

# Check for proper container classes
if grep -r "overflow-auto\|overflow-hidden" src/components/lesson/PDFSection.tsx 2>/dev/null; then
    check_pass "Container overflow properly configured"
else
    check_warning "Container overflow configuration not found"
fi

echo -e "\n${BLUE}4. Checking Error Handling Implementation...${NC}"
echo "============================================="

# Check for error boundary
if [ -f "src/components/lesson/PDFErrorBoundary.tsx" ]; then
    check_pass "Error boundary component exists"
    
    # Check error boundary features
    if grep -r "componentDidCatch\|getDerivedStateFromError" src/components/lesson/PDFErrorBoundary.tsx >/dev/null; then
        check_pass "Error boundary properly implements error handling"
    else
        check_fail "Error boundary missing essential methods"
    fi
    
    if grep -r "retry\|fallback" src/components/lesson/PDFErrorBoundary.tsx >/dev/null; then
        check_pass "Error boundary includes retry/fallback mechanisms"
    else
        check_warning "Error boundary might be missing retry mechanisms"
    fi
else
    check_fail "Error boundary component not found"
fi

echo -e "\n${BLUE}5. Checking Performance Monitoring...${NC}"
echo "======================================="

# Check for performance hook
if [ -f "src/hooks/usePDFPerformance.ts" ]; then
    check_pass "Performance monitoring hook exists"
    
    if grep -r "blankSpaceRatio\|trackDimensions" src/hooks/usePDFPerformance.ts >/dev/null; then
        check_pass "Performance hook includes blank space tracking"
    else
        check_warning "Performance hook might not track blank space issues"
    fi
else
    check_warning "Performance monitoring hook not found"
fi

# Check for performance dashboard
if [ -f "src/components/lesson/PDFPerformanceDashboard.tsx" ]; then
    check_pass "Performance dashboard component exists"
else
    check_warning "Performance dashboard component not found"
fi

echo -e "\n${BLUE}6. Checking Test Coverage...${NC}"
echo "============================="

# Check for enhanced tests
if [ -f "src/components/lesson/__tests__/PDFSection.enhanced.test.tsx" ]; then
    check_pass "Enhanced test suite exists"
    
    if grep -r "blank.*space\|blankSpace" src/components/lesson/__tests__/PDFSection.enhanced.test.tsx >/dev/null; then
        check_pass "Tests include blank space validation"
    else
        check_warning "Tests might not cover blank space scenarios"
    fi
else
    check_warning "Enhanced test suite not found"
fi

# Check for test setup
if [ -f "src/test-utils/pdf-test-setup.ts" ]; then
    check_pass "PDF test setup configuration exists"
else
    check_warning "PDF test setup configuration not found"
fi

# Check for Jest PDF config
if [ -f "jest.pdf.config.js" ]; then
    check_pass "Jest PDF configuration exists"
else
    check_warning "Jest PDF configuration not found"
fi

echo -e "\n${BLUE}7. Checking TypeScript Configuration...${NC}"
echo "========================================"

# Check for proper TypeScript types
if grep -r "interface.*PDF\|type.*PDF" src/components/lesson/ src/hooks/ 2>/dev/null | grep -v ".test." >/dev/null; then
    check_pass "TypeScript interfaces/types found for PDF components"
else
    check_warning "PDF-specific TypeScript types might be missing"
fi

# Check for proper imports
if grep -r "import.*react-pdf" src/components/lesson/PDFSection.tsx 2>/dev/null; then
    check_pass "React-PDF properly imported"
else
    check_fail "React-PDF import not found"
fi

echo -e "\n${BLUE}8. Checking Package Dependencies...${NC}"
echo "==================================="

# Check if react-pdf is in package.json
if grep -r "react-pdf" package.json >/dev/null; then
    check_pass "React-PDF dependency found in package.json"
    
    # Get version
    VERSION=$(grep -A 1 -B 1 "react-pdf" package.json | grep -o '"[0-9]\+\.[0-9]\+\.[0-9]\+"' | head -1 | tr -d '"')
    if [ ! -z "$VERSION" ]; then
        check_info "React-PDF version: $VERSION"
        
        # Check if version is recent enough (10.x or higher)
        MAJOR_VERSION=$(echo $VERSION | cut -d. -f1)
        if [ "$MAJOR_VERSION" -ge 10 ]; then
            check_pass "React-PDF version is current"
        else
            check_warning "React-PDF version might be outdated (current: $VERSION, recommended: 10.x+)"
        fi
    fi
else
    check_fail "React-PDF dependency not found in package.json"
fi

echo -e "\n${BLUE}9. Validating Build Configuration...${NC}"
echo "====================================="

# Check for proper build scripts
if grep -r "build\|test" package.json | grep -E "(npm|yarn)" >/dev/null; then
    check_pass "Build scripts found in package.json"
else
    check_warning "Build scripts might be missing"
fi

# Check for TypeScript config
if [ -f "tsconfig.json" ]; then
    check_pass "TypeScript configuration exists"
    
    # Check for strict mode
    if grep -r "strict.*true" tsconfig.json >/dev/null; then
        check_pass "TypeScript strict mode enabled"
    else
        check_warning "TypeScript strict mode might not be enabled"
    fi
else
    check_warning "TypeScript configuration not found"
fi

echo -e "\n${BLUE}10. Running Quick Validation Tests...${NC}"
echo "======================================"

# Check if Node modules are installed
if [ -d "node_modules" ]; then
    check_pass "Node modules installed"
    
    # Try to run TypeScript compiler check
    if command -v npx >/dev/null; then
        echo "Running TypeScript check..."
        if npx tsc --noEmit --skipLibCheck 2>/dev/null; then
            check_pass "TypeScript compilation check passed"
        else
            check_warning "TypeScript compilation issues detected"
        fi
        
        # Try to run linting
        if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ] || [ -f "eslint.config.js" ]; then
            echo "Running ESLint check on PDF components..."
            if npx eslint src/components/lesson/PDF* src/hooks/usePDFPerformance.ts --quiet 2>/dev/null; then
                check_pass "ESLint check passed"
            else
                check_warning "ESLint issues detected in PDF components"
            fi
        fi
    fi
else
    check_warning "Node modules not installed - run 'npm install' first"
fi

echo -e "\n${BLUE}Summary Report${NC}"
echo "=============="
echo -e "✅ Passed: ${GREEN}$PASS${NC}"
echo -e "❌ Failed: ${RED}$FAIL${NC}"
echo -e "⚠️  Warnings: ${YELLOW}$WARNINGS${NC}"

echo -e "\n${BLUE}Recommendations:${NC}"
if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 All critical checks passed!${NC}"
    
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}📋 Consider addressing the warnings above for optimal implementation.${NC}"
    fi
    
    echo -e "\n${BLUE}Next Steps:${NC}"
    echo "1. Run the test suite: npm test -- --config jest.pdf.config.js"
    echo "2. Test the implementation manually in the browser"
    echo "3. Monitor performance using the dashboard component"
    echo "4. Deploy and monitor for blank space issues"
    
else
    echo -e "${RED}🚨 Critical issues found that need to be addressed before deployment.${NC}"
    echo -e "${YELLOW}📋 Please review the failed checks above and implement the required fixes.${NC}"
    
    echo -e "\n${BLUE}Priority Actions:${NC}"
    echo "1. Fix all failed checks (marked with ❌)"
    echo "2. Re-run this validation script"
    echo "3. Run comprehensive tests"
    echo "4. Validate in browser before deployment"
fi

echo -e "\n${BLUE}Documentation:${NC}"
echo "📖 Enhanced implementation guide: PDF_BLANK_SPACE_FIX_ENHANCED.md"
echo "🧪 Test suite: src/components/lesson/__tests__/PDFSection.enhanced.test.tsx"
echo "📊 Performance monitoring: src/components/lesson/PDFPerformanceDashboard.tsx"

# Exit with appropriate code
if [ $FAIL -gt 0 ]; then
    exit 1
else
    exit 0
fi