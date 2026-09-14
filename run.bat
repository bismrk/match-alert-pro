@echo off
echo =========================================
echo   Starting MatchTracker Pro Services...
echo =========================================

echo.
echo Starting Backend (FastAPI)...
start "Backend" cmd /k "cd backend && uv run uvicorn src.main:app --reload"

echo.
echo Starting Frontend (Vite)...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both services are starting in separate windows!
echo - Frontend will be available at: http://localhost:8080/ (or http://localhost:5173/)
echo - Backend API will be available at: http://127.0.0.1:8000/
echo - Backend Swagger Docs at: http://127.0.0.1:8000/docs
echo.
pause
