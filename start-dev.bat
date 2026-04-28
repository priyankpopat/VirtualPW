@echo off
REM 🚀 AI Election Assistant - Local Development Startup Script
REM Usage: start-dev.bat

echo.
echo 🎉 AI Election Assistant - Development Environment
echo ==================================================
echo.

REM Check if running from correct directory
if not exist "backend\package.json" (
    echo ⚠️  Please run this script from the election-assistant directory
    pause
    exit /b 1
)

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Node.js is not installed. Please install Node.js first
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend

if not exist "node_modules" (
    echo   Installing npm packages...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ✗ Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo ✓ Dependencies already installed
)

echo.

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  .env file not found
    echo    Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Update .env with your MongoDB connection string!
    echo    Edit: backend\.env
    echo.
    set /p "reply=Open .env now? (y/n): "
    if /i "%reply%"=="y" (
        start notepad .env
    )
)

echo.
echo ✓ Starting backend server...
echo 🌐 Server running on http://localhost:5000
echo.
echo Available endpoints:
echo   GET  http://localhost:5000/api/health
echo   POST http://localhost:5000/api/auth/register
echo   POST http://localhost:5000/api/auth/login
echo   POST http://localhost:5000/api/vote
echo   GET  http://localhost:5000/api/votes
echo.
echo ⚠️  Press Ctrl+C to stop the server
echo.

REM Start server with nodemon
call npm run dev

pause
