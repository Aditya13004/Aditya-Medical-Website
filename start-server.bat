@echo off
echo =============================================
echo   Aditya Medical Web Server
echo =============================================
echo.

cd /d "%~dp0"

echo Starting server on http://localhost:3000
echo.
echo Press Ctrl+C to stop the server.
echo.

node server.js

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo ERROR: Server failed to start!
  echo Make sure Node.js is installed.
  pause
)
