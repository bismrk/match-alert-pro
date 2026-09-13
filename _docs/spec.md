# Specification: MatchTracker Pro (Betting-Focused Scoreboard)

## 1. Project Overview
A specialized sports-league scoreboard application designed specifically for sports bettors. Unlike traditional sports apps that show all matches, this application allows users to subscribe only to their favorite top-tier teams. The core value proposition is a highly customizable, automated reminder system via Telegram and in-app notifications.

## 2. Project Structure & Workflow Rules
- **Directory Structure:** The repository will be split into two isolated folders:
  - `front-end/` (Node.js, React/Vue)
  - `back-end/` (Python, `uv`)
- **Workflow Rule (AGENTS.md):** The AI Agent MUST perform a `git commit` immediately after completing any single functional requirement.
- **Agent Context:** `AGENTS.md` is placed in the root directory and contains all necessary rules and commands for the AI to follow.

## 3. API Contract & OpenAPI (Swagger)
The frontend and backend will communicate via a strictly defined API contract. The frontend will initially use **mocked requests** based on this contract, which will then be used to generate the OpenAPI (Swagger) specification to guide the backend agent.
- `GET /api/teams` — List of available teams to follow.
- `POST /api/subscriptions` — Save user's selected teams and reminder interval preferences.
- `GET /api/matches/urgency` — List of upcoming matches sorted by urgency for the dashboard.
- `POST /api/matches/{id}/bet-placed` — Change the status of a specific match to "Bet Placed" (snoozing betting reminders).

## 4. Tech Stack & Architecture
- **Backend:** Python (managed via `uv`). We will use **FastAPI** (as it perfectly supports SQLAlchemy and automatic OpenAPI generation).
- **Frontend:** Node.js (React/Vue).
- **Two-Stage Database Strategy:**
  - *Phase 1:* **In-Memory Store** (Python dictionaries) to quickly mock the API contract and test client-server integration.
  - *Phase 2:* **SQLAlchemy ORM + SQLite** (A database-agnostic setup to easily transition to PostgreSQL in production).
- **Background Tasks & Data Sources:** 
  - **Scheduler:** Use `APScheduler` or FastAPI's native `BackgroundTasks` to check match times and trigger Telegram alerts.
  - **Data Source:** Use a **Mock Football API Service** during MVP development instead of connecting to a real, paid API.

## 5. Core Features
1. **Team Subscription & Automated Scheduling:** Users select teams. Backend fetches schedules via Mock Football API.
2. **Smart Notification System:** Custom reminder intervals (5 days, 2 days, 2 hours). Sent via Telegram.
3. **"Bet Placed" Status (Snooze Logic):** Marking a match stops betting reminders.
4. **Urgency-Based Dashboard:** Sleek, dark-mode UI with live countdown timers, color-coded by urgency.

## 6. User Stories
- *As a Bettor, I want to select 'Real Madrid' and 'Arsenal' so that I only see matches relevant to my betting strategy.*
- *As a Bettor, I want to set a reminder for 2 days before a match, so I have time to analyze the odds.*
- *As a Bettor, I want to click "Bet Placed" on a match, so the app stops reminding me to place a bet for that specific game.*
- *As a Bettor, I want to see a countdown timer for today's matches on my dashboard, so I know exactly how much time is left.*

## 7. Out of Scope for MVP
- Live score updating (during the match) or live text commentary.
- Direct integration with real betting platforms/bookmakers.
- Complex user authentication (MVP will assume a simple/mock login system).
