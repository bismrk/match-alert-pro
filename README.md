# MatchTracker Pro

MatchTracker Pro is a modern web application designed for football (soccer) fans and sports enthusiasts. It allows users to track upcoming matches, manage alerts/subscriptions for their favorite teams, and monitor their betting statuses across various competitions.

## Target Audience
This app is perfect for:
- **Football Fans** who want to stay updated on when their favorite teams are playing.
- **Bettors** who need a centralized dashboard to track matches they've placed wagers on.

## Technologies Used
**Frontend:**
- React (with Vite)
- TypeScript
- TanStack Query (React Query) for data fetching

**Backend:**
- Python 3
- FastAPI (High-performance web framework)
- SQLAlchemy (ORM) & SQLite (Database)
- JWT Authentication (Passlib)
- `uv` (Fast Python package manager)

## Prerequisites
To run this project locally, you will need:
- **Node.js** (v18 or newer) and `npm`
- **Python** (3.10 or newer)
- **uv** (Python package installer and resolver) - install via `pip install uv` if you don't have it.

## Quick Start

### The Easiest Way (Windows)
If you are on Windows, simply double-click the `run.bat` file in the root directory. It will automatically start both the FastAPI backend and the Vite frontend in separate terminal windows.

### Manual Start

**1. Start the Backend:**
```bash
cd backend
# uv will automatically manage dependencies and run the server
uv run uvicorn src.main:app --reload
```
The backend API will be available at `http://127.0.0.1:8000`. You can view the Swagger documentation at `http://127.0.0.1:8000/docs`.

**2. Start the Frontend:**
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173` (or port 8080 depending on configuration).

### Запуск через Docker

У проекті налаштовано `Dockerfile`, який об'єднує Python-бекенд та Node.js-фронтенд в одному контейнері.

1. **Зберіть Docker-образ:**
   ```bash
   docker build -t match-tracker-pro .
   ```
2. **Запустіть контейнер:**
   ```bash
   docker run -p 8000:8000 -p 3000:3000 match-tracker-pro
   ```
Після запуску:
- Фронтенд (UI) буде доступний за адресою: `http://localhost:3000`
- API бекенду: `http://localhost:8000/api/...`
