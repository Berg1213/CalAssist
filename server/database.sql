CREATE DATABASE calassist;

CREATE TABLE todo(
  todo_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  due_date DATE,
  due_time TIME,
  completed_at TIMESTAMPTZ,
  raw_input TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE goal(
  goal_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  period TEXT CHECK (period IN ('day','week')),
  target_amount INTEGER NOT NULL CHECK(target_amount > 0),
  unit TEXT,
  started_on DATE NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE goal_log(
  id SERIAL PRIMARY KEY,
  goal_id INTEGER NOT NULL REFERENCES "goal" (goal_id) ON DELETE CASCADE,
  logged_on DATE,
  amount INTEGER NOT NULL CHECK (amount > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
)

CREATE INDEX index_goal_log_goal_id_logged_on ON goal_log (goal_id,logged_on);

CREATE TABLE appointment(
  appointment_id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  appt_date DATE NOT NULL,
  appt_time TIME NOT NULL,
  arrive_at TIME,
  address VARCHAR(255),
  travel_time INTEGER NOT NULL CHECK(travel_time >= 0),
  buffer_minutes INTEGER NOT NULL CHECK(buffer_minutes >= 0)
);

CREATE TABLE project(
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL CHECK('active', 'paused', 'done', 'dropped'),
  ended_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
)

CREATE TABLE project_steps(
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES "project" (goal_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  notes TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
)

CREATE VIEW appointment_with_leave AS
SELECT a.*,
  a.appt_time - (a.travel_time + a.buffer_minutes) * interval '1 minute'
    AS leave_at,
    a.travel_time / 60 as travel_hours,
    a.travel_minutes % 60 AS travel_mins
FROM appointment a;