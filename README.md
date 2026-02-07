# AutoApply AI

AutoApply AI is a full-stack MVP that automatically applies to jobs based on user preferences. The platform focuses **only** on automated job applications (no ATS scoring or resume optimization).

## Features

- Email/password authentication with JWT sessions
- Resume upload (PDF/DOCX)
- Preferences form for job targeting
- Scraper module for LinkedIn, Indeed, Glassdoor (adapter-based)
- Rule-based job matching engine
- Auto-apply queue with random delays and retries
- Application status dashboard with platform breakdown

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js (Express)
- **Database:** PostgreSQL
- **Queue:** Redis + BullMQ
- **Automation:** Playwright

## Project Structure

```
backend/        Express API, scrapers, automation worker
frontend/       React UI
```

## Setup Instructions

### 1) Environment Variables

Create a `.env` file in `backend/`:

```
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/autoapply
DATABASE_SSL=false
JWT_SECRET=your-secret
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
CORS_ORIGIN=http://localhost:5173
```

### 2) Database Setup

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

Run the schema located in `backend/db/schema.sql`.

### 3) Install Dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 4) Run the Apps

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

## API Endpoints

- `POST /auth/signup`
- `POST /auth/login`
- `POST /resume/upload`
- `POST /preferences/save`
- `GET /jobs/matched`
- `POST /apply/start`
- `GET /applications/status`

## Notes

- Scraper adapters are stubbed with sample data; extend `backend/src/services/scraper/*` with real scraping logic.
- Automation adapters use Playwright as placeholders for form submissions. Customize per platform in `backend/src/services/automation/sources/`.
- Daily apply limits are enforced before queueing new applications.
