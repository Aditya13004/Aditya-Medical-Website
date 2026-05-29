@echo off
echo ===================================================
echo Pushing new updates to Aditya Medical GitHub
echo ===================================================
echo.

echo 1. Adding changed files...
git add .
echo.

echo 2. Saving changes (committing)...
git commit -m "Fix AI Help page layout and responsiveness"
echo.

echo 3. Pushing updates to GitHub (main branch)...
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo [Notice] 'main' branch push failed. Trying 'master' branch instead...
    git push origin master
)

echo.
echo ===================================================
echo Done! Your updates have been pushed successfully.
echo ===================================================
pause
