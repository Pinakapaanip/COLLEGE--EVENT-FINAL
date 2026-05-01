# College Event Management & Analytics Portal

Production-ready full-stack demo project using React/Vite/Tailwind/Recharts, Node/Express, and PostgreSQL via Supabase.

## Environment

Backend (`backend/.env`):

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/postgres
PORT=10000
NODE_ENV=production
```

Frontend (`frontend/.env`):

```env
VITE_API_URL=https://your-render-service.onrender.com
```

## Local Run

```bash
npm run install:all
npm run dev:backend
npm run dev:frontend
```

The backend automatically uses realistic mock data if the database is missing, empty, or unavailable.

