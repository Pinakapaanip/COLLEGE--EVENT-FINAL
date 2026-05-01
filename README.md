# College Event Management & Analytics Portal

## Project Summary

The **College Event Management & Analytics Portal** is a full-stack web application for managing college events, participants, results, and analytics.

It is built with:

- **Frontend:** React, Vite, Tailwind CSS, Recharts, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL, designed to work with Supabase
- **Deployment Ready For:** Render backend and Vercel frontend
- **Fallback System:** Works even when the database or API is unavailable by using demo/mock data

This project is useful for:

- College event management
- Department-wise event tracking
- Participant registration
- Result entry
- Analytics dashboard
- Demonstrating full-stack development
- Academic project submission

---

## Key Features

### Event Management

- Add new events
- View all events
- Store event title, category, department, date, venue, organizer, and description
- Display events in a clean dashboard layout

### Participant Management

- Add participants for selected events
- Store student name, roll number, department, year, and participant type
- Prevent duplicate roll numbers for the same event
- View recent participants

### Result Management

- Add winners for each event
- Store participant rank and prize
- Prevent duplicate ranks for the same event at database level
- Show winners in analytics leaderboard

### Analytics Dashboard

- Total events
- Total participants
- Total departments
- Upcoming events
- Events by department chart
- Monthly event trend chart
- Category distribution pie chart
- Internal vs external participant chart
- Participants by department chart
- Winners leaderboard

### Offline And Fallback Support

The project has two fallback layers:

1. **Backend fallback:** If PostgreSQL is unavailable, the backend uses in-memory mock data.
2. **Frontend fallback:** If the backend API is unavailable, the frontend uses local demo data.

This means the application can still run and demonstrate features even without a live database.

---

## Project Folder Structure

```text
NEW_DVA_FINAL/
  package.json
  README.md
  .gitignore

  backend/
    package.json
    render.yaml
    supabase.sql
    src/
      server.js
      app.js
      config/
        db.js
      data/
        mockData.js
      services/
        dataService.js
      utils/
        analytics.js

  frontend/
    package.json
    vercel.json
    vite.config.js
    tailwind.config.js
    postcss.config.js
    index.html
    public/
      images/
        event-stage.svg
        event-lab.svg
        event-tech.svg
    src/
      main.jsx
      App.jsx
      api.js
      fallbackData.js
      styles.css
```

---

## Simple Architecture

```text
User Browser
   |
   v
React Frontend
   |
   | HTTP requests using fetch()
   v
Express Backend API
   |
   | SQL queries using pg
   v
PostgreSQL / Supabase Database
```

If the database fails:

```text
Express Backend API
   |
   v
In-memory mock data
```

If the backend API fails:

```text
React Frontend
   |
   v
Frontend fallback demo data
```

---

## Technology Explanation

### React

React is used to build the frontend user interface. The main React code is inside `frontend/src/App.jsx`.

### Vite

Vite is used as the frontend development server and build tool. It makes React development fast and simple.

### Tailwind CSS

Tailwind CSS is used for styling the frontend with utility classes.

### Recharts

Recharts is used to display charts such as bar charts, line charts, and pie charts.

### Lucide React

Lucide React provides icons used in the sidebar, dashboard cards, and buttons.

### Express.js

Express.js is used to create the backend API routes.

### PostgreSQL

PostgreSQL stores events, participants, and results.

### Supabase

Supabase can be used as the hosted PostgreSQL database provider.

### Render

Render can host the backend API.

### Vercel

Vercel can host the frontend React application.

---

## Prerequisites

Install these before running the project:

- Node.js 18 or higher
- npm
- PostgreSQL database or Supabase project, optional but recommended
- Git, optional

Check installed versions:

```bash
node --version
npm --version
```

---

## Environment Variables

### Backend Environment

Create a file named `.env` inside the `backend` folder:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/postgres
PORT=10000
NODE_ENV=development
```

Explanation:

| Variable | Meaning |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Backend server port |
| `NODE_ENV` | Application environment |

If `DATABASE_URL` is missing or invalid, the backend still runs using mock data.

### Frontend Environment

Create a file named `.env` inside the `frontend` folder:

```env
VITE_API_URL=http://127.0.0.1:10000
```

Explanation:

| Variable | Meaning |
| --- | --- |
| `VITE_API_URL` | Backend API base URL used by frontend |

For production, this should be your Render backend URL:

```env
VITE_API_URL=https://your-render-service.onrender.com
```

---

## Install The Project

From the root folder:

```bash
npm run install:all
```

This command installs dependencies for both:

- `backend`
- `frontend`

Root `package.json` command:

```json
"install:all": "npm install --prefix backend && npm install --prefix frontend"
```

---

## Run The Project Locally

### Start Backend

```bash
npm run dev:backend
```

Backend runs at:

```text
http://127.0.0.1:10000
```

### Start Frontend

Open another terminal:

```bash
npm run dev:frontend
```

Frontend runs at:

```text
http://127.0.0.1:5173
```

---

## Build Frontend For Production

```bash
npm run build
```

This runs the frontend build command and creates a production-ready `dist` folder inside `frontend`.

---

## Root Package Explanation

File:

```text
package.json
```

Main purpose:

- Provides common scripts from the project root
- Makes it easy to install, build, and run both apps

Scripts:

| Script | What It Does |
| --- | --- |
| `npm run install:all` | Installs backend and frontend dependencies |
| `npm run build` | Builds frontend for production |
| `npm start` | Starts backend |
| `npm run dev:backend` | Starts backend using nodemon |
| `npm run dev:frontend` | Starts frontend using Vite |

---

## Backend Overview

Backend folder:

```text
backend/
```

The backend is responsible for:

- Creating API routes
- Connecting to PostgreSQL
- Creating database tables automatically
- Seeding demo data if database is empty
- Validating required input fields
- Returning analytics data
- Falling back to mock data if database fails

---

## Backend File Explanation

### `backend/src/server.js`

This is the backend entry point.

Important code:

```js
const { app, initDb } = require("./app");
```

This imports:

- `app`: Express application
- `initDb`: database initialization function

```js
const port = process.env.PORT || 10000;
```

This selects the port:

- Use `.env` value if available
- Otherwise use `10000`

```js
initDb().finally(() => {
  app.listen(port, () => {
    console.log(`College Event Portal API running on port ${port}`);
  });
});
```

This starts the database initialization first, then starts the server.

Even if database initialization fails, the server still starts because the app can use fallback mock data.

---

### `backend/src/app.js`

This file creates the Express app and API routes.

Important imports:

```js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dataService = require("./services/dataService");
```

Explanation:

- `dotenv` loads environment variables from `.env`
- `express` creates the API server
- `cors` allows frontend requests
- `dataService` handles database and fallback logic

Express app setup:

```js
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
```

Explanation:

- Creates the Express app
- Enables CORS for frontend access
- Allows JSON request bodies

Helper function:

```js
function send(res, payload, status = 200) {
  res.status(status).json(payload);
}
```

This sends consistent JSON responses.

Async route wrapper:

```js
function asyncRoute(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      send(res, { success: false, data: null, error: error.message || "Unexpected server error", source: "server" }, 400);
    }
  };
}
```

This prevents repeated `try/catch` code in every route.

Routes:

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/` | API welcome route |
| `GET` | `/health` | Backend and database health |
| `GET` | `/api/options` | Dropdown options |
| `GET` | `/api/events` | List events |
| `POST` | `/api/events` | Add event |
| `GET` | `/api/participants` | List participants |
| `POST` | `/api/participants` | Add participant |
| `GET` | `/api/results` | List results |
| `POST` | `/api/results` | Add result |
| `GET` | `/api/analytics` | Get dashboard analytics |

404 handler:

```js
app.use((req, res) => send(res, { success: false, data: null, error: "Route not found", source: "server" }, 404));
```

This handles unknown routes.

---

### `backend/src/config/db.js`

This file configures PostgreSQL connection.

Important code:

```js
const { Pool } = require("pg");
```

`Pool` manages PostgreSQL connections.

```js
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
```

This checks whether `DATABASE_URL` exists.

```js
const pool = hasDatabaseUrl
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    })
  : null;
```

Explanation:

- If `DATABASE_URL` exists, create a PostgreSQL connection pool
- If not, set `pool` to `null`
- `ssl` is useful for hosted databases such as Supabase
- `max: 5` limits database connections
- `connectionTimeoutMillis: 5000` avoids waiting forever

Export:

```js
module.exports = { pool, hasDatabaseUrl };
```

Other backend files use this pool to run SQL queries.

---

### `backend/src/services/dataService.js`

This is the main backend service file. It contains database operations and fallback logic.

It imports:

```js
const { pool } = require("../config/db");
const { buildMockData, departments, years, categories, participantTypes } = require("../data/mockData");
const { buildAnalytics } = require("../utils/analytics");
```

Explanation:

- `pool` connects to PostgreSQL
- `buildMockData` creates demo data
- dropdown arrays are used by `/api/options`
- `buildAnalytics` creates dashboard chart data

Memory fallback:

```js
let memory = buildMockData();
let dbHealthy = false;
let lastError = null;
```

Explanation:

- `memory` stores mock data
- `dbHealthy` tracks database status
- `lastError` stores latest database error

Database query helper:

```js
async function query(text, params = []) {
  if (!pool) throw new Error("Database connection failed: DATABASE_URL is not configured");
  return pool.query(text, params);
}
```

This function runs SQL safely using parameterized values.

Database initialization:

```js
async function initDb() {
  try {
    await query(`CREATE TABLE IF NOT EXISTS ...`);
    const count = await query("SELECT COUNT(*)::int AS count FROM events");
    if (count.rows[0].count === 0) {
      await seedDb(memory);
    }
    dbHealthy = true;
    lastError = null;
  } catch (error) {
    dbHealthy = false;
    lastError = error.message;
  }
}
```

This function:

- Creates required tables
- Checks if event table is empty
- Adds demo data if database has no events
- Marks database health
- Does not crash the app if database fails

Fallback helper:

```js
async function withFallback(action, fallbackValue) {
  try {
    const value = await action();
    dbHealthy = true;
    lastError = null;
    return { data: value, source: "database", error: null };
  } catch (error) {
    dbHealthy = false;
    lastError = error.message;
    return { data: fallbackValue(), source: "mock", error: `Database connection failed: ${error.message}` };
  }
}
```

This is one of the most important functions in the project.

It means:

- Try database first
- If database works, return real data
- If database fails, return mock data
- Tell frontend whether data came from `database` or `mock`

Main service functions:

| Function | Purpose |
| --- | --- |
| `listEvents()` | Gets all events |
| `listParticipants()` | Gets all participants |
| `listResults()` | Gets all results |
| `addEvent(payload)` | Adds a new event |
| `addParticipant(payload)` | Adds a participant |
| `addResult(payload)` | Adds a result |
| `analytics()` | Builds dashboard analytics |
| `options()` | Returns dropdown options |
| `health()` | Returns API/database health |

Validation example:

```js
const required = ["title", "category", "department", "date", "venue", "organizer"];
required.forEach((field) => {
  if (!payload[field]) throw new Error(`${field} is required`);
});
```

This makes sure important form values are not empty.

Duplicate participant logic:

```js
if (memory.participants.some((item) => Number(item.event_id) === Number(payload.event_id) && item.roll_no === payload.roll_no)) {
  throw new Error("Duplicate roll number for this event");
}
```

This stops the same roll number from being added twice for one event in fallback mode.

---

### `backend/src/data/mockData.js`

This file creates realistic demo data.

Main arrays:

```js
const departments = ["CSE", "AI", "ECE", "MECH"];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const categories = ["Technical", "Cultural", "Sports", "Workshop", "Innovation"];
const participantTypes = ["Internal", "External"];
```

These values are used for forms and demo data.

`buildMockData()` creates:

- Events
- Participants
- Results

Event generation:

```js
eventBlueprint.forEach(([department, count], deptIndex) => {
  for (let i = 0; i < count; i += 1) {
    ...
  }
});
```

This creates different numbers of events for each department.

Participant generation:

```js
const students = Array.from({ length: 236 }, (_, i) => {
  ...
});
```

This creates fake student records.

Result generation:

```js
[1, 2, 3].forEach((rank, offset) => {
  ...
});
```

This creates top 3 results for each event.

---

### `backend/src/utils/analytics.js`

This file converts raw event, participant, and result data into chart-ready analytics.

Helper:

```js
function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || "Unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}
```

This counts how many records belong to each value.

Example:

```text
CSE: 12
AI: 8
ECE: 10
MECH: 6
```

Chart formatter:

```js
function objectToSeries(obj, name = "count") {
  return Object.entries(obj).map(([label, value]) => ({ label, [name]: Number(value) }));
}
```

This converts an object into a format Recharts can use.

Main function:

```js
function buildAnalytics(data) {
  const { events, participants, results } = data;
  ...
}
```

It returns:

- KPI values
- Events by department
- Monthly trend
- Category distribution
- Participant type distribution
- Participants by department
- Winners leaderboard

KPI calculation:

```js
kpis: {
  totalEvents: events.length,
  totalParticipants: participants.length,
  departmentsCount: new Set(events.map((event) => event.department)).size,
  upcomingEvents: events.filter((event) => new Date(`${event.date}T00:00:00.000Z`) >= now).length
}
```

Explanation:

- Count total events
- Count total participants
- Count unique departments
- Count events whose date is upcoming

---

### `backend/supabase.sql`

This file contains SQL table creation commands.

It creates three tables:

1. `events`
2. `participants`
3. `results`

Use this file in Supabase SQL Editor if you want to create tables manually.

---

## Database Schema

### Events Table

```sql
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  department TEXT NOT NULL,
  date DATE NOT NULL,
  venue TEXT NOT NULL,
  organizer TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT ''
);
```

Meaning:

| Column | Meaning |
| --- | --- |
| `id` | Unique event ID |
| `title` | Event name |
| `category` | Technical, Cultural, Sports, etc. |
| `department` | CSE, AI, ECE, MECH |
| `date` | Event date |
| `venue` | Event location |
| `organizer` | Club or department organizing event |
| `description` | Event details |

### Participants Table

```sql
CREATE TABLE IF NOT EXISTS participants (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  roll_no TEXT NOT NULL,
  department TEXT NOT NULL,
  year TEXT NOT NULL,
  participant_type TEXT NOT NULL,
  UNIQUE(event_id, roll_no)
);
```

Meaning:

| Column | Meaning |
| --- | --- |
| `id` | Unique participant ID |
| `event_id` | Event connected to participant |
| `student_name` | Student name |
| `roll_no` | Student roll number |
| `department` | Student department |
| `year` | Student year |
| `participant_type` | Internal or external |

Important:

```sql
UNIQUE(event_id, roll_no)
```

This prevents the same roll number from registering twice in the same event.

### Results Table

```sql
CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  participant_id INTEGER REFERENCES participants(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  prize TEXT NOT NULL,
  UNIQUE(event_id, rank)
);
```

Meaning:

| Column | Meaning |
| --- | --- |
| `id` | Unique result ID |
| `event_id` | Event connected to result |
| `participant_id` | Winner participant |
| `rank` | Winner rank |
| `prize` | Prize details |

Important:

```sql
UNIQUE(event_id, rank)
```

This prevents two students from having the same rank in the same event.

---

## API Documentation

Backend base URL locally:

```text
http://127.0.0.1:10000
```

### `GET /`

Returns API information and route list.

Example response:

```json
{
  "success": true,
  "message": "College Event Portal API",
  "routes": ["/health", "/api/events", "/api/participants", "/api/results", "/api/analytics"]
}
```

### `GET /health`

Checks backend status and database mode.

Example response:

```json
{
  "success": true,
  "ok": true,
  "dbHealthy": true,
  "mode": "database",
  "error": null
}
```

If database is unavailable:

```json
{
  "success": true,
  "ok": true,
  "dbHealthy": false,
  "mode": "fallback",
  "error": "Database connection failed"
}
```

### `GET /api/options`

Returns dropdown values used by forms.

Example response:

```json
{
  "success": true,
  "data": {
    "departments": ["CSE", "AI", "ECE", "MECH"],
    "years": ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    "categories": ["Technical", "Cultural", "Sports", "Workshop", "Innovation"],
    "participantTypes": ["Internal", "External"]
  },
  "source": "static",
  "error": null
}
```

### `GET /api/events`

Returns all events.

### `POST /api/events`

Adds a new event.

Request body:

```json
{
  "title": "Hackathon 2026",
  "category": "Technical",
  "department": "CSE",
  "date": "2026-04-30",
  "venue": "Main Auditorium",
  "organizer": "Tech Club",
  "description": "A coding competition for students."
}
```

Required fields:

- `title`
- `category`
- `department`
- `date`
- `venue`
- `organizer`

### `GET /api/participants`

Returns all participants.

### `POST /api/participants`

Adds a participant.

Request body:

```json
{
  "event_id": 1,
  "student_name": "Aarav Sharma",
  "roll_no": "CSE2026001",
  "department": "CSE",
  "year": "2nd Year",
  "participant_type": "Internal"
}
```

Required fields:

- `event_id`
- `student_name`
- `roll_no`
- `department`
- `year`
- `participant_type`

### `GET /api/results`

Returns all results.

### `POST /api/results`

Adds a result.

Request body:

```json
{
  "event_id": 1,
  "participant_id": 10,
  "rank": 1,
  "prize": "Gold Medal + Certificate"
}
```

Required fields:

- `event_id`
- `participant_id`
- `rank`
- `prize`

### `GET /api/analytics`

Returns dashboard analytics.

Response contains:

- KPI cards
- Bar chart data
- Line chart data
- Pie chart data
- Winners leaderboard

---

## Frontend Overview

Frontend folder:

```text
frontend/
```

The frontend is responsible for:

- Showing login screen
- Displaying dashboard analytics
- Showing charts
- Adding events
- Adding participants
- Adding results
- Calling backend APIs
- Showing fallback data if API fails

---

## Frontend File Explanation

### `frontend/src/main.jsx`

This file starts the React app.

Typical responsibility:

- Import React
- Import ReactDOM
- Import `App`
- Mount the app into the HTML element with ID `root`

The browser loads `index.html`, then Vite loads `main.jsx`, and React renders the application.

---

### `frontend/src/App.jsx`

This is the biggest frontend file. It contains the main UI and page logic.

Main imports:

```js
import React, { useEffect, useMemo, useState } from "react";
```

Explanation:

- `useState` stores component state
- `useEffect` runs code after page loads
- `useMemo` calculates filtered values efficiently

Chart imports:

```js
import {
  BarChart, Bar, CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
```

These are used to draw dashboard charts.

Icon imports:

```js
import { Activity, CalendarPlus, LayoutDashboard, LogIn, Medal, Trophy, UserPlus, Users } from "lucide-react";
```

These icons are used in navigation and cards.

API imports:

```js
import { apiRequest, API_URL } from "./api";
```

`apiRequest` calls backend routes.

Fallback imports:

```js
import { fallbackAnalytics, fallbackEvents, fallbackOptions, fallbackParticipants } from "./fallbackData";
```

These keep the UI working when API is unavailable.

---

## Important Frontend Components

### `Notice`

Purpose:

- Shows success, error, or information messages

Example:

```jsx
<Notice message="Event saved successfully" />
```

### `Field`

Purpose:

- Wraps input fields with a label
- Keeps form UI consistent

### `TextInput`

Purpose:

- Reusable styled input

### `Select`

Purpose:

- Reusable styled dropdown

### `ChartCard`

Purpose:

- Gives charts a consistent card layout

### `Login`

Purpose:

- Shows a simple login screen
- Accepts any coordinator name or email
- Saves user name in browser local storage

Important code:

```js
localStorage.setItem("portalUser", value);
```

This remembers the user after refresh.

### `Dashboard`

Purpose:

- Shows banner images
- Shows KPI cards
- Shows charts
- Shows winners leaderboard

Charts used:

- `BarChart`
- `LineChart`
- `PieChart`

### `Events`

Purpose:

- Shows event creation form
- Shows event list
- Calls `POST /api/events`

Important code:

```js
const response = await apiRequest("/events", { method: "POST", body: JSON.stringify(form) });
```

This sends the new event form data to the backend.

### `Participants`

Purpose:

- Shows participant creation form
- Shows recent participants
- Calls `POST /api/participants`

### `Results`

Purpose:

- Shows result creation form
- Filters participants according to selected event
- Calls `POST /api/results`

Important code:

```js
const eventParticipants = useMemo(
  () => participantRows.filter((p) => Number(p.event_id) === Number(form.event_id)),
  [participantRows, form.event_id]
);
```

This shows participants related to the selected event.

### Main `App`

Purpose:

- Stores all main frontend state
- Loads data from backend
- Controls active page
- Handles refresh
- Shows login page or dashboard layout

Important state:

```js
const [user, setUser] = useState(getStoredUser);
const [page, setPage] = useState("dashboard");
const [events, setEvents] = useState(fallbackEvents);
const [participants, setParticipants] = useState(fallbackParticipants);
const [analytics, setAnalytics] = useState(fallbackAnalytics());
const [options, setOptions] = useState(fallbackOptions);
const [error, setError] = useState("");
const [isLoading, setIsLoading] = useState(true);
```

Meaning:

| State | Purpose |
| --- | --- |
| `user` | Logged-in coordinator name |
| `page` | Current selected page |
| `events` | Event list |
| `participants` | Participant list |
| `analytics` | Dashboard data |
| `options` | Dropdown options |
| `error` | Error message |
| `isLoading` | Loading status |

Data loading:

```js
const [eventRes, participantRes, analyticsRes, optionRes] = await Promise.all([
  apiRequest("/events"),
  apiRequest("/participants"),
  apiRequest("/analytics"),
  apiRequest("/options")
]);
```

This loads multiple API routes at the same time.

---

### `frontend/src/api.js`

This file handles all frontend API communication.

Default backend:

```js
const DEFAULT_API_ORIGIN = "https://college-event-final.onrender.com";
```

If `VITE_API_URL` is missing, this URL is used.

Normalize API URL:

```js
function normalizeApiBaseUrl(value) {
  const raw = stripTrailingSlash(value || DEFAULT_API_ORIGIN);
  const apiIndex = raw.indexOf("/api");
  if (apiIndex >= 0) return raw.slice(0, apiIndex + 4);
  return raw.endsWith("/api") ? raw : `${raw}/api`;
}
```

This makes sure API URL ends correctly with `/api`.

Example:

```text
http://127.0.0.1:10000
```

becomes:

```text
http://127.0.0.1:10000/api
```

Fallback map:

```js
const fallbackByEndpoint = {
  "/events": fallbackEvents,
  "/participants": fallbackParticipants,
  "/results": fallbackResults,
  "/analytics": fallbackAnalytics,
  "/options": fallbackOptions
};
```

This tells the frontend what demo data to use if an API route fails.

Main function:

```js
export async function apiRequest(path, options = {}) {
  ...
}
```

This function:

- Normalizes endpoint path
- Sends request using `fetch`
- Parses JSON safely
- Retries GET requests
- Returns fallback data if API cannot connect

GET retry logic:

```js
const attempts = method === "GET" ? 3 : 1;
```

Meaning:

- GET requests retry 3 times
- POST requests only try once

Why?

- Retrying GET is safe
- Retrying POST could accidentally create duplicate records

---

### `frontend/src/fallbackData.js`

This file contains frontend demo data.

It exports:

- `fallbackEvents`
- `fallbackParticipants`
- `fallbackResults`
- `fallbackAnalytics`
- `fallbackOptions`

Purpose:

- Keep dashboard working without backend
- Help during demos
- Prevent blank screens

---

### `frontend/src/styles.css`

This file contains global CSS and Tailwind imports.

Tailwind imports:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Global box sizing:

```css
* {
  box-sizing: border-box;
}
```

This makes layout easier to control.

Body background:

```css
body {
  margin: 0;
  min-height: 100vh;
  background: ...;
  color: #e5eefb;
}
```

This sets the dark dashboard background.

Reusable glass style:

```css
.glass {
  background: rgba(15, 23, 42, 0.70);
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 24px 80px rgba(2, 6, 23, 0.32);
  backdrop-filter: blur(18px);
}
```

This creates the glass-card UI effect.

Reusable field style:

```css
.field {
  width: 100%;
  border-radius: 0.5rem;
  ...
}
```

This styles form inputs and dropdowns.

Banner animation:

```css
.banner-track {
  animation: slide 18s infinite ease-in-out;
}
```

This animates dashboard banner images.

---

### `frontend/vite.config.js`

Purpose:

- Configures Vite
- Enables React plugin

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()]
});
```

---

### `frontend/tailwind.config.js`

Purpose:

- Tells Tailwind which files to scan
- Adds custom font, colors, and shadow

Important part:

```js
content: ["./index.html", "./src/**/*.{js,jsx}"]
```

Tailwind scans these files and includes only used styles.

---

### `frontend/postcss.config.js`

Purpose:

- Enables Tailwind CSS and Autoprefixer

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

---

## How Data Flows

### When Dashboard Loads

1. User opens frontend.
2. `App.jsx` runs `refresh()`.
3. `refresh()` calls:
   - `/api/events`
   - `/api/participants`
   - `/api/analytics`
   - `/api/options`
4. Backend tries PostgreSQL.
5. If PostgreSQL works, backend returns database data.
6. If PostgreSQL fails, backend returns mock data.
7. If backend fails completely, frontend uses `fallbackData.js`.
8. Dashboard updates charts and tables.

### When Adding Event

1. User fills Add Event form.
2. Frontend sends `POST /api/events`.
3. Backend validates required fields.
4. Backend inserts into PostgreSQL.
5. If database fails, backend stores event in memory.
6. Frontend refreshes data.

### When Adding Participant

1. User selects an event.
2. User enters participant details.
3. Frontend sends `POST /api/participants`.
4. Backend validates fields.
5. Backend checks duplicate roll number.
6. Backend saves participant.
7. Frontend refreshes data.

### When Adding Result

1. User selects event.
2. Frontend filters participants for that event.
3. User selects participant, rank, and prize.
4. Frontend sends `POST /api/results`.
5. Backend saves result.
6. Dashboard analytics update after refresh.

---

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Copy the contents of:

```text
backend/supabase.sql
```

4. Run the SQL.
5. Go to database connection settings.
6. Copy the PostgreSQL connection string.
7. Put it in:

```text
backend/.env
```

Example:

```env
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres
```

---

## Render Backend Deployment

The backend includes:

```text
backend/render.yaml
```

It configures:

- Node web service
- Free plan
- Backend root directory
- Build command
- Start command
- Health check path
- `DATABASE_URL` environment variable

Important configuration:

```yaml
rootDir: backend
buildCommand: npm install
startCommand: npm start
healthCheckPath: /health
```

After deployment, your backend URL will look like:

```text
https://your-service-name.onrender.com
```

Test it:

```text
https://your-service-name.onrender.com/health
```

---

## Vercel Frontend Deployment

The frontend includes:

```text
frontend/vercel.json
```

It configures:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

The rewrite is important because React handles frontend routing.

On Vercel, set environment variable:

```env
VITE_API_URL=https://your-render-service.onrender.com
```

---

## Common Commands

| Command | Purpose |
| --- | --- |
| `npm run install:all` | Install backend and frontend dependencies |
| `npm run dev:backend` | Run backend locally |
| `npm run dev:frontend` | Run frontend locally |
| `npm run build` | Build frontend |
| `npm start` | Start backend |
| `npm start --prefix backend` | Start backend from root |
| `npm run build --prefix frontend` | Build frontend directly |

---

## Testing API Manually

### Check Backend

```bash
curl http://127.0.0.1:10000/health
```

### Get Events

```bash
curl http://127.0.0.1:10000/api/events
```

### Get Analytics

```bash
curl http://127.0.0.1:10000/api/analytics
```

### Add Event

```bash
curl -X POST http://127.0.0.1:10000/api/events \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Hackathon 2026\",\"category\":\"Technical\",\"department\":\"CSE\",\"date\":\"2026-04-30\",\"venue\":\"Main Auditorium\",\"organizer\":\"Tech Club\",\"description\":\"Coding competition\"}"
```

---

## Troubleshooting

### Frontend Shows Demo Data

Possible reasons:

- Backend is not running
- `VITE_API_URL` is wrong
- Backend deployed URL is down
- Network request failed

Fix:

```env
VITE_API_URL=http://127.0.0.1:10000
```

Then restart frontend.

### Backend Uses Fallback Mode

Check:

```text
http://127.0.0.1:10000/health
```

If response says:

```json
"mode": "fallback"
```

Possible reasons:

- `DATABASE_URL` missing
- Database password wrong
- Supabase database paused
- Network blocked
- SSL connection issue

### Duplicate Roll Number Error

This happens when the same roll number is added twice for the same event.

Database rule:

```sql
UNIQUE(event_id, roll_no)
```

Use a different roll number or select another event.

### Duplicate Rank Error

This happens when the same rank is added twice for the same event.

Database rule:

```sql
UNIQUE(event_id, rank)
```

Example:

- Event 1 already has Rank 1
- Adding another Rank 1 for Event 1 will fail

### Port Already In Use

If backend port `10000` is busy, change:

```env
PORT=10001
```

Then update frontend:

```env
VITE_API_URL=http://127.0.0.1:10001
```

---

## Important Design Decisions

### Why Use Fallback Data?

Fallback data makes the project demo-friendly.

Even if database setup fails during presentation, the app still shows:

- Events
- Participants
- Charts
- Results

### Why Use Separate Frontend And Backend?

This makes the project closer to real-world applications.

Frontend:

- Handles UI
- Handles user interactions

Backend:

- Handles database
- Handles validation
- Handles API responses

### Why Use PostgreSQL?

PostgreSQL is reliable and supports relational data well.

This project has relationships:

- One event has many participants
- One event has many results
- One result belongs to one participant

### Why Use Recharts?

Recharts makes React charts easy to build and update.

The backend sends chart-ready data, and frontend displays it.

---

## Future Improvements

Possible improvements:

- Real authentication
- Admin and student roles
- Event editing
- Event deletion
- Participant search
- Department filters
- CSV export
- Certificate generation
- Email notifications
- Attendance marking
- Result approval workflow
- Pagination for large participant lists
- Better form validation
- Unit and integration tests

---

## Quick Demo Flow

Use this order to demonstrate the project:

1. Open frontend.
2. Enter any coordinator name.
3. Show dashboard KPI cards.
4. Explain analytics charts.
5. Go to Events and add a new event.
6. Go to Participants and register a student.
7. Go to Results and add a winner.
8. Return to Dashboard.
9. Click Refresh Data.
10. Show updated analytics.

---

## Short Project Explanation For Viva

This project is a full-stack College Event Management and Analytics Portal. The frontend is built with React, Vite, Tailwind CSS, Recharts, and Lucide icons. The backend is built with Node.js and Express.js. PostgreSQL stores events, participants, and results, and Supabase can be used as the database provider. The backend exposes REST APIs for events, participants, results, options, health, and analytics. The dashboard displays important metrics and charts such as events by department, monthly trends, category distribution, participant type distribution, and winners leaderboard. The project also includes fallback mock data, so it can continue working even if the database or API is unavailable.

---

## One-Line Summary

The **College Event Management & Analytics Portal** is a React and Express full-stack application that helps colleges manage events, register participants, record results, and view analytics through charts and dashboards.
