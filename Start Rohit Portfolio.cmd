@echo off
cd /d "%~dp0"
if not exist node_modules (
  call npm install
  if errorlevel 1 (pause & exit /b 1)
)
echo Open http://localhost:3010 in your browser after Ready appears.
call npm run dev
pause
