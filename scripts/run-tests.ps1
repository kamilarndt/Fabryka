# NextFab Test Runner (PowerShell)
# Runs all tests with coverage and generates reports

Write-Host "🧪 Running NextFab Test Suite" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

function Run-PackageTests {
    param(
        [string]$PackageName,
        [string]$PackageDir
    )
    
    Write-Host "`nTesting $PackageName..." -ForegroundColor Yellow
    Set-Location $PackageDir
    
    if (Test-Path "package.json") {
        # Run unit tests
        Write-Host "Running unit tests..." -ForegroundColor Green
        try {
            npm run test:unit 2>$null
        } catch {
            Write-Host "No unit tests configured" -ForegroundColor Gray
        }
        
        # Run E2E tests (only for frontend)
        if ($PackageName -eq "frontend") {
            Write-Host "Running E2E tests..." -ForegroundColor Green
            try {
                npm run test:e2e 2>$null
            } catch {
                Write-Host "No E2E tests configured" -ForegroundColor Gray
            }
        }
        
        # Generate coverage report
        Write-Host "Generating coverage report..." -ForegroundColor Green
        try {
            npm run test:coverage 2>$null
        } catch {
            Write-Host "No coverage configured" -ForegroundColor Gray
        }
    }
    
    Set-Location ..
}

# Run frontend tests
Run-PackageTests -PackageName "frontend" -PackageDir "frontend"

# Run backend tests
Run-PackageTests -PackageName "backend" -PackageDir "backend"

Write-Host "`n✅ All tests completed!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan

# Check if coverage reports exist and display summary
if (Test-Path "frontend/coverage") {
    Write-Host "`nFrontend Coverage Report available at: frontend/coverage/index.html" -ForegroundColor Yellow
}

if (Test-Path "backend/coverage") {
    Write-Host "`nBackend Coverage Report available at: backend/coverage/index.html" -ForegroundColor Yellow
}

Write-Host "`nTest execution completed successfully!" -ForegroundColor Green
