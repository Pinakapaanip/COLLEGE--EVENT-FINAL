const { pool } = require("../config/db");
const { buildMockData, departments, years, categories, participantTypes } = require("../data/mockData");
const { buildAnalytics } = require("../utils/analytics");

let memory = buildMockData();
let dbHealthy = false;
let lastError = null;

async function query(text, params = []) {
  if (!pool) throw new Error("Database connection failed: DATABASE_URL is not configured");
  return pool.query(text, params);
}

async function initDb() {
  try {
    await query(`
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
      CREATE TABLE IF NOT EXISTS results (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        participant_id INTEGER REFERENCES participants(id) ON DELETE CASCADE,
        rank INTEGER NOT NULL,
        prize TEXT NOT NULL,
        UNIQUE(event_id, rank)
      );
    `);

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

async function seedDb(data) {
  for (const event of data.events) {
    await query(
      "INSERT INTO events (title, category, department, date, venue, organizer, description) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [event.title, event.category, event.department, event.date, event.venue, event.organizer, event.description]
    );
  }
  const eventRows = await query("SELECT id, title FROM events ORDER BY id");
  const eventIdByTitle = new Map(eventRows.rows.map((event) => [event.title, event.id]));

  for (const participant of data.participants) {
    const originalEvent = data.events.find((event) => event.id === participant.event_id);
    await query(
      "INSERT INTO participants (event_id, student_name, roll_no, department, year, participant_type) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING",
      [eventIdByTitle.get(originalEvent.title), participant.student_name, participant.roll_no, participant.department, participant.year, participant.participant_type]
    );
  }

  const participantRows = await query("SELECT id, roll_no FROM participants ORDER BY id");
  const participantIdByRoll = new Map(participantRows.rows.map((participant) => [participant.roll_no, participant.id]));
  for (const result of data.results) {
    const originalEvent = data.events.find((event) => event.id === result.event_id);
    const originalParticipant = data.participants.find((participant) => participant.id === result.participant_id);
    await query(
      "INSERT INTO results (event_id, participant_id, rank, prize) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING",
      [eventIdByTitle.get(originalEvent.title), participantIdByRoll.get(originalParticipant.roll_no), result.rank, result.prize]
    );
  }
}

function normalizeEvent(row) {
  return { ...row, date: row.date instanceof Date ? row.date.toISOString().slice(0, 10) : String(row.date).slice(0, 10) };
}

async function withFallback(action, fallbackValue) {
  try {
    const value = await action();
    dbHealthy = true;
    lastError = null;
    return { data: value, source: "database", error: null };
  } catch (error) {
    if (error.code === "23505") {
      throw new Error(error.detail?.includes("roll_no") ? "Duplicate roll number" : "Duplicate result rank for this event");
    }
    dbHealthy = false;
    lastError = error.message;
    return { data: fallbackValue(), source: "mock", error: `Database connection failed: ${error.message}` };
  }
}

async function listEvents() {
  return withFallback(async () => {
    const result = await query("SELECT * FROM events ORDER BY date ASC, id ASC");
    return result.rows.map(normalizeEvent);
  }, () => memory.events);
}

async function listParticipants() {
  return withFallback(async () => {
    const result = await query("SELECT * FROM participants ORDER BY id DESC");
    return result.rows;
  }, () => memory.participants);
}

async function listResults() {
  return withFallback(async () => {
    const result = await query("SELECT * FROM results ORDER BY event_id ASC, rank ASC");
    return result.rows;
  }, () => memory.results);
}

async function addEvent(payload) {
  const required = ["title", "category", "department", "date", "venue", "organizer"];
  required.forEach((field) => {
    if (!payload[field]) throw new Error(`${field} is required`);
  });
  return withFallback(async () => {
    const result = await query(
      "INSERT INTO events (title, category, department, date, venue, organizer, description) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [payload.title, payload.category, payload.department, payload.date, payload.venue, payload.organizer, payload.description || ""]
    );
    return normalizeEvent(result.rows[0]);
  }, () => {
    const item = { id: Math.max(...memory.events.map((event) => event.id)) + 1, ...payload, description: payload.description || "" };
    memory.events.unshift(item);
    return item;
  });
}

async function addParticipant(payload) {
  const required = ["event_id", "student_name", "roll_no", "department", "year", "participant_type"];
  required.forEach((field) => {
    if (!payload[field]) throw new Error(`${field} is required`);
  });
  if (memory.participants.some((item) => Number(item.event_id) === Number(payload.event_id) && item.roll_no === payload.roll_no)) {
    throw new Error("Duplicate roll number for this event");
  }
  return withFallback(async () => {
    const result = await query(
      "INSERT INTO participants (event_id, student_name, roll_no, department, year, participant_type) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [payload.event_id, payload.student_name, payload.roll_no, payload.department, payload.year, payload.participant_type]
    );
    return result.rows[0];
  }, () => {
    const item = { id: Math.max(...memory.participants.map((participant) => participant.id)) + 1, ...payload, event_id: Number(payload.event_id) };
    memory.participants.unshift(item);
    return item;
  });
}

async function addResult(payload) {
  const required = ["event_id", "participant_id", "rank", "prize"];
  required.forEach((field) => {
    if (!payload[field]) throw new Error(`${field} is required`);
  });
  return withFallback(async () => {
    const result = await query(
      "INSERT INTO results (event_id, participant_id, rank, prize) VALUES ($1,$2,$3,$4) RETURNING *",
      [payload.event_id, payload.participant_id, payload.rank, payload.prize]
    );
    return result.rows[0];
  }, () => {
    const item = { id: Math.max(...memory.results.map((result) => result.id)) + 1, ...payload, event_id: Number(payload.event_id), participant_id: Number(payload.participant_id), rank: Number(payload.rank) };
    memory.results.unshift(item);
    return item;
  });
}

async function analytics() {
  const eventsResponse = await listEvents();
  const participantsResponse = await listParticipants();
  const resultsResponse = await listResults();
  return {
    data: buildAnalytics({ events: eventsResponse.data, participants: participantsResponse.data, results: resultsResponse.data }),
    source: [eventsResponse, participantsResponse, resultsResponse].some((item) => item.source === "mock") ? "mock" : "database",
    error: eventsResponse.error || participantsResponse.error || resultsResponse.error
  };
}

function options() {
  return { departments, years, categories, participantTypes };
}

function health() {
  return { ok: true, dbHealthy, mode: dbHealthy ? "database" : "fallback", error: lastError };
}

module.exports = { initDb, listEvents, listParticipants, listResults, addEvent, addParticipant, addResult, analytics, options, health };
