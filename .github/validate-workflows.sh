#!/bin/bash

# GitHub Workflow Validation Script
# This script validates the GitHub Actions workflows for syntax and configuration

set -e

echo "🔍 GitHub Workflow Validation Script"
echo "==================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_WORKFLOWS=0
VALID_WORKFLOWS=0
ERRORS=0
WARNINGS=0

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "SUCCESS")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "ERROR")
            echo -e "${RED}❌ $message${NC}"
            ((ERRORS++))
            ;;
        "WARNING")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ((WARNINGS++))
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
    esac
}

# Function to validate YAML syntax
validate_yaml() {
    local file=$1
    local filename=$(basename "$file")
    
    echo "Validating $filename..."
    
    # Check if yq is available for YAML validation
    if command -v yq >/dev/null 2>&1; then
        if yq eval '.' "$file" >/dev/null 2>&1; then
            print_status "SUCCESS" "$filename has valid YAML syntax"
            ((VALID_WORKFLOWS++))
        else
            print_status "ERROR" "$filename has invalid YAML syntax"
            return 1
        fi
    else
        # Fallback to basic syntax check with python if yq not available
        if command -v python3 >/dev/null 2>&1; then
            if python3 -c "import yaml; yaml.safe_load(open('$file'))" 2>/dev/null; then
                print_status "SUCCESS" "$filename has valid YAML syntax"
                ((VALID_WORKFLOWS++))
            else
                print_status "ERROR" "$filename has invalid YAML syntax"
                return 1
            fi
        else
            print_status "WARNING" "Cannot validate $filename - no YAML validator available"
            return 1
        fi
    fi
}

# Function to validate workflow structure
validate_workflow_structure() {
    local file=$1
    local filename=$(basename "$file")
    
    echo "Checking workflow structure for $filename..."
    
    # Check required fields
    if ! grep -q "^name:" "$file"; then
        print_status "ERROR" "$filename missing 'name' field"
        return 1
    fi
    
    if ! grep -q "^on:" "$file"; then
        print_status "ERROR" "$filename missing 'on' field"
        return 1
    fi
    
    if ! grep -q "^jobs:" "$file"; then
        print_status "ERROR" "$filename missing 'jobs' field"
        return 1
    fi
    
    # Check for common best practices
    if ! grep -q "runs-on:" "$file"; then
        print_status "WARNING" "$filename may be missing 'runs-on' specification"
    fi
    
    if ! grep -q "uses: actions/checkout@" "$file"; then
        print_status "WARNING" "$filename may be missing checkout action"
    fi
    
    print_status "SUCCESS" "$filename has valid workflow structure"
}

# Function to check for security best practices
check_security_practices() {
    local file=$1
    local filename=$(basename "$file")
    
    echo "Checking security practices for $filename..."
    
    # Check for pinned action versions
    if grep -q "uses: .*/.*@main\|uses: .*/.*@master" "$file"; then
        print_status "WARNING" "$filename uses unpinned action versions (main/master branch)"
    fi
    
    # Check for secrets handling
    if grep -q "\\${{ secrets\\." "$file" && ! grep -q "env:" "$file"; then
        print_status "WARNING" "$filename may expose secrets directly in run commands"
    fi
    
    # Check for appropriate permissions
    if ! grep -q "permissions:" "$file"; then
        print_status "WARNING" "$filename does not specify permissions (will inherit default)"
    fi
    
    print_status "SUCCESS" "$filename security check completed"
}

# Function to validate specific workflow requirements
validate_workflow_requirements() {
    local file=$1
    local filename=$(basename "$file")
    
    echo "Checking specific requirements for $filename..."
    
    case $filename in
        "ci-main-website.yml")
            if ! grep -q "paths:" "$file"; then
                print_status "WARNING" "$filename should use path filters for efficiency"
            fi
            if ! grep -q "NODE_VERSION" "$file"; then
                print_status "WARNING" "$filename should specify Node.js version"
            fi
            ;;
        "ci-learning-platform.yml")
            if ! grep -q "plataforma-ensino" "$file"; then
                print_status "ERROR" "$filename should reference learning platform directory"
                return 1
            fi
            if ! grep -q "SUPABASE" "$file"; then
                print_status "WARNING" "$filename should include Supabase configuration"
            fi
            ;;
        "cd-production.yml")
            if ! grep -q "environment:" "$file"; then
                print_status "WARNING" "$filename should use GitHub environments for production"
            fi
            ;;
        "security-audit.yml")
            if ! grep -q "schedule:" "$file"; then
                print_status "WARNING" "$filename should run on a schedule for regular audits"
            fi
            ;;
    esac
    
    print_status "SUCCESS" "$filename requirements check completed"
}

# Main validation function
validate_workflow() {
    local file=$1
    ((TOTAL_WORKFLOWS++))
    
    echo ""
    echo "🔍 Validating $(basename "$file")"
    echo "----------------------------------------"
    
    validate_yaml "$file" || return 1
    validate_workflow_structure "$file" || return 1
    check_security_practices "$file"
    validate_workflow_requirements "$file"
    
    echo "----------------------------------------"
    print_status "SUCCESS" "$(basename "$file") validation completed"
}

# Check if .github/workflows directory exists
if [ ! -d ".github/workflows" ]; then
    print_status "ERROR" ".github/workflows directory not found"
    exit 1
fi

# Main execution
echo "🚀 Starting workflow validation..."
echo ""

# Find and validate all workflow files
for workflow_file in .github/workflows/*.yml .github/workflows/*.yaml; do
    if [ -f "$workflow_file" ]; then
        validate_workflow "$workflow_file"
    fi
done

# Summary
echo ""
echo "📊 Validation Summary"
echo "===================="
echo "Total workflows: $TOTAL_WORKFLOWS"
echo "Valid workflows: $VALID_WORKFLOWS"
echo "Errors: $ERRORS"
echo "Warnings: $WARNINGS"
echo ""

if [ $ERRORS -eq 0 ]; then
    print_status "SUCCESS" "All workflows passed validation!"
    echo ""
    echo "🎉 Your GitHub Actions workflows are ready!"
    echo ""
    echo "Next steps:"
    echo "1. Commit and push these workflows to your repository"
    echo "2. Configure required secrets in GitHub repository settings"
    echo "3. Set up branch protection rules (see .github/branch-protection.md)"
    echo "4. Monitor first workflow runs and adjust as needed"
    echo ""
    exit 0
else
    print_status "ERROR" "Some workflows failed validation"
    echo ""
    echo "❌ Please fix the errors above before proceeding"
    echo ""
    exit 1
fi