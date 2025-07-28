-- Seed data for instructors table
-- This script ensures that the instructor Maria Eduarda is properly set up in the database

-- Insert/Update Maria Eduarda user if not exists
INSERT INTO users (id, email, full_name, role, created_at, updated_at)
VALUES (
  '355f9ed5-c838-4c66-8671-2cfbf87121fa',
  'madu.wein@hotmail.com',
  'Maria Eduarda',
  'instructor',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Insert/Update instructor profile for Maria Eduarda
INSERT INTO instructors (id, user_id, bio, expertise, specializations, rating, total_reviews, created_at, updated_at)
VALUES (
  '3834f9e6-2fd9-447f-9d74-757cdd6b6e44',
  '355f9ed5-c838-4c66-8671-2cfbf87121fa',
  'Professora especializada em ensino personalizado e acompanhamento pedagógico.',
  ARRAY['Educação', 'Pedagogia', 'Acompanhamento Escolar'],
  ARRAY['Educação', 'Pedagogia', 'Acompanhamento Escolar'],
  5.0,
  0,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  bio = EXCLUDED.bio,
  expertise = EXCLUDED.expertise,
  specializations = EXCLUDED.specializations,
  rating = EXCLUDED.rating,
  total_reviews = EXCLUDED.total_reviews,
  updated_at = NOW();

-- Insert teacher availability for Maria Eduarda (Monday to Saturday)
-- This ensures she has availability slots for enrollment

-- Monday (day_of_week = 1)
INSERT INTO teacher_availability (teacher_id, day_of_week, start_time, end_time, max_students, is_active, created_at, updated_at)
VALUES 
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 1, '08:00:00', '10:00:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 1, '10:00:00', '12:00:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 1, '13:30:00', '15:30:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 1, '15:30:00', '17:30:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 1, '18:00:00', '20:00:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 1, '20:00:00', '22:00:00', 3, true, NOW(), NOW())
ON CONFLICT (teacher_id, day_of_week, start_time, end_time) DO UPDATE SET
  max_students = EXCLUDED.max_students,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Tuesday (day_of_week = 2)
INSERT INTO teacher_availability (teacher_id, day_of_week, start_time, end_time, max_students, is_active, created_at, updated_at)
VALUES 
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 2, '08:00:00', '10:00:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 2, '10:00:00', '12:00:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 2, '13:30:00', '15:30:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 2, '15:30:00', '17:30:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 2, '18:00:00', '20:00:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 2, '20:00:00', '22:00:00', 3, true, NOW(), NOW())
ON CONFLICT (teacher_id, day_of_week, start_time, end_time) DO UPDATE SET
  max_students = EXCLUDED.max_students,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Wednesday (day_of_week = 3)
INSERT INTO teacher_availability (teacher_id, day_of_week, start_time, end_time, max_students, is_active, created_at, updated_at)
VALUES 
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 3, '08:00:00', '10:00:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 3, '10:00:00', '12:00:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 3, '13:30:00', '15:30:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 3, '15:30:00', '17:30:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 3, '18:00:00', '20:00:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 3, '20:00:00', '22:00:00', 3, true, NOW(), NOW())
ON CONFLICT (teacher_id, day_of_week, start_time, end_time) DO UPDATE SET
  max_students = EXCLUDED.max_students,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Thursday (day_of_week = 4)
INSERT INTO teacher_availability (teacher_id, day_of_week, start_time, end_time, max_students, is_active, created_at, updated_at)
VALUES 
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 4, '08:00:00', '10:00:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 4, '10:00:00', '12:00:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 4, '13:30:00', '15:30:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 4, '15:30:00', '17:30:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 4, '18:00:00', '20:00:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 4, '20:00:00', '22:00:00', 3, true, NOW(), NOW())
ON CONFLICT (teacher_id, day_of_week, start_time, end_time) DO UPDATE SET
  max_students = EXCLUDED.max_students,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Friday (day_of_week = 5)
INSERT INTO teacher_availability (teacher_id, day_of_week, start_time, end_time, max_students, is_active, created_at, updated_at)
VALUES 
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 5, '08:00:00', '10:00:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 5, '10:00:00', '12:00:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 5, '13:30:00', '15:30:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 5, '15:30:00', '17:30:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 5, '18:00:00', '20:00:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 5, '20:00:00', '22:00:00', 3, true, NOW(), NOW())
ON CONFLICT (teacher_id, day_of_week, start_time, end_time) DO UPDATE SET
  max_students = EXCLUDED.max_students,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Saturday (day_of_week = 6)
INSERT INTO teacher_availability (teacher_id, day_of_week, start_time, end_time, max_students, is_active, created_at, updated_at)
VALUES 
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 6, '08:00:00', '10:00:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 6, '10:00:00', '12:00:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 6, '13:30:00', '15:30:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 6, '15:30:00', '17:30:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 6, '18:00:00', '20:00:00', 3, true, NOW(), NOW()),
  ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 6, '20:00:00', '22:00:00', 3, true, NOW(), NOW())
ON CONFLICT (teacher_id, day_of_week, start_time, end_time) DO UPDATE SET
  max_students = EXCLUDED.max_students,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Verification query to confirm data integrity
SELECT 
  u.id as user_id,
  u.full_name,
  u.email,
  u.role,
  i.id as instructor_id,
  i.bio,
  i.expertise,
  COUNT(ta.id) as availability_slots
FROM users u
JOIN instructors i ON u.id = i.user_id
LEFT JOIN teacher_availability ta ON i.id = ta.teacher_id AND ta.is_active = true
WHERE u.full_name = 'Maria Eduarda'
GROUP BY u.id, u.full_name, u.email, u.role, i.id, i.bio, i.expertise;