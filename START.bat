@echo off
title TicketAI - Launcher
color 0A

echo.
echo  ============================================
echo   TicketAI - Customer Support Classifier
echo   MCA 3rd Sem Mini Project
echo  ============================================
echo.

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo  [ERROR] Python not found!
    echo  Download from: https://www.python.org/downloads/
    pause
    exit /b
)

echo  [1/3] Installing dependencies...
pip install flask --quiet --disable-pip-version-check
if not exist ".env" (
    echo GEMINI_API_KEY=your_new_api_key_here > .env
)
echo  Done.
echo.

:: Train model only if not already trained
if not exist "model\classifier.json" (
    echo  [2/3] Training AI model for first time...
    python train.py
    echo  Done.
) else (
    echo  [2/3] AI model already trained. Skipping.
)
echo.

echo  [3/3] Starting TicketAI...
echo.
echo  ============================================
echo   App running at: http://127.0.0.1:5000
echo   Press Ctrl+C to stop the server
echo  ============================================
echo.

:: Open browser after 2 sec delay in background
start "" python -c "import time,webbrowser; time.sleep(2); webbrowser.open('http://127.0.0.1:5000')"

:: Start Flask (blocking)
python app.py

pause
