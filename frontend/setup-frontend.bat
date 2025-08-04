@echo off
echo ========================================
echo Frontend Setup Script
echo ========================================

echo.
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js first:
    echo 1. Go to https://nodejs.org/
    echo 2. Download the LTS version
    echo 3. Run the installer
    echo 4. Make sure to check "Add to PATH" during installation
    echo 5. Restart your terminal after installation
    echo.
    pause
    exit /b 1
)

echo Node.js is installed ✓
node --version

echo.
echo Checking npm...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm is not working!
    pause
    exit /b 1
)

echo npm is working ✓

echo.
echo Installing frontend dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo Dependencies installed ✓

echo.
echo ========================================
echo Frontend Setup Complete!
echo ========================================
echo.
echo To start the frontend development server:
echo npm run dev
echo.
echo The frontend will be available at:
echo http://localhost:5173
echo.
echo Make sure your backend is also running on:
echo http://localhost:5000
echo.
pause 