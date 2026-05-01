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
