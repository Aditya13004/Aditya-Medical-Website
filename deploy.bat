@echo off
echo ====================================================
echo Deploying Aditya Medical Web to GitHub...
echo ====================================================

:: Initialize git if not already initialized
if not exist ".git" (
    git init
    echo [OK] Initialized empty Git repository.
)

:: Add all changes
git add .
echo [OK] Added files.

:: Commit changes
git commit -m "Final pre-deployment UI/UX audit, responsiveness, and critical functionality restorations"
echo [OK] Committed files.

:: Add remote (ignore error if it already exists)
git remote add origin https://github.com/Aditya13004/Aditya-Medical-Website.git 2>nul
git remote set-url origin https://github.com/Aditya13004/Aditya-Medical-Website.git

:: Push to main branch forcefully to ensure deployment
echo Pushing to GitHub...
git push -u origin HEAD:main --force

echo ====================================================
echo Deployment Complete!
echo You can now check your GitHub repository.
echo ====================================================
pause
