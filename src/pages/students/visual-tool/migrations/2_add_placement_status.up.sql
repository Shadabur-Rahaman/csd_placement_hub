ALTER TABLE students ADD COLUMN placement_status TEXT DEFAULT 'Not Placed';

-- Update specific students to "Placed" status
UPDATE students SET placement_status = 'Placed' WHERE name IN ('Shankar', 'Vaishnavi G K', 'Kartik Gopal Madivala');
