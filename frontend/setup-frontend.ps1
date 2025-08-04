Write-Host "========================================" -ForegroundColor Green
Write-Host "Frontend Setup Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host ""
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version
    Write-Host "Node.js is installed ✓" -ForegroundColor Green
    Write-Host "Version: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js first:" -ForegroundColor Yellow
    Write-Host "1. Go to https://nodejs.org/" -ForegroundColor White
    Write-Host "2. Download the LTS version" -ForegroundColor White
    Write-Host "3. Run the installer" -ForegroundColor White
    Write-Host "4. Make sure to check 'Add to PATH' during installation" -ForegroundColor White
    Write-Host "5. Restart your terminal after installation" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Checking npm..." -ForegroundColor Yellow

try {
    $npmVersion = npm --version
    Write-Host "npm is working ✓" -ForegroundColor Green
    Write-Host "Version: $npmVersion" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: npm is not working!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow

try {
    npm install
    Write-Host "Dependencies installed ✓" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Frontend Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the frontend development server:" -ForegroundColor Yellow
Write-Host "npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "The frontend will be available at:" -ForegroundColor Yellow
Write-Host "http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Make sure your backend is also running on:" -ForegroundColor Yellow
Write-Host "http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to continue" 