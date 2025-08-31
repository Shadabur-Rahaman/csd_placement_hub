CREATE TABLE students (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  usn TEXT UNIQUE NOT NULL,
  batch TEXT NOT NULL,
  tenth_percentage DOUBLE PRECISION NOT NULL,
  puc_percentage DOUBLE PRECISION NOT NULL,
  sem1_percentage DOUBLE PRECISION,
  sem2_percentage DOUBLE PRECISION,
  sem3_percentage DOUBLE PRECISION,
  sem4_percentage DOUBLE PRECISION,
  sem5_percentage DOUBLE PRECISION,
  sem6_percentage DOUBLE PRECISION,
  aggregate_percentage DOUBLE PRECISION,
  active_backlogs INTEGER NOT NULL DEFAULT 0,
  placement_eligible BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_usn ON students(usn);
CREATE INDEX idx_students_batch ON students(batch);
CREATE INDEX idx_students_placement_eligible ON students(placement_eligible);
CREATE INDEX idx_students_aggregate ON students(aggregate_percentage);
