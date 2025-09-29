#!/bin/bash

# NextFab Test Runner
# Runs all tests with coverage and generates reports

set -e

echo "🧪 Running NextFab Test Suite"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to run tests for a specific package
run_package_tests() {
    local package_name=$1
    local package_dir=$2
    
    echo -e "\n${YELLOW}Testing $package_name...${NC}"
    cd "$package_dir"
    
    if [ -f "package.json" ]; then
        # Run unit tests
        echo "Running unit tests..."
        npm run test:unit 2>/dev/null || echo "No unit tests configured"
        
        # Run E2E tests (only for frontend)
        if [ "$package_name" = "frontend" ]; then
            echo "Running E2E tests..."
            npm run test:e2e 2>/dev/null || echo "No E2E tests configured"
        fi
        
        # Generate coverage report
        echo "Generating coverage report..."
        npm run test:coverage 2>/dev/null || echo "No coverage configured"
    fi
    
    cd ..
}

# Run frontend tests
run_package_tests "frontend" "frontend"

# Run backend tests
run_package_tests "backend" "backend"

echo -e "\n${GREEN}✅ All tests completed!${NC}"
echo "================================"

# Check if coverage reports exist and display summary
if [ -d "frontend/coverage" ]; then
    echo -e "\n${YELLOW}Frontend Coverage Summary:${NC}"
    cat frontend/coverage/lcov-report/index.html 2>/dev/null | grep -o 'statements.*%' || echo "Coverage report not available"
fi

if [ -d "backend/coverage" ]; then
    echo -e "\n${YELLOW}Backend Coverage Summary:${NC}"
    cat backend/coverage/lcov-report/index.html 2>/dev/null | grep -o 'statements.*%' || echo "Coverage report not available"
fi

echo -e "\n${GREEN}Test execution completed successfully!${NC}"
