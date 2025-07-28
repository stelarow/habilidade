-- Fix Database Issues Script
-- This script applies the migration and seeds Maria Eduarda data

-- Apply migration 001
\i database/migrations/001_fix_instructor_schema.sql

-- Apply instructor seed data
\i database/seed_instructors.sql

-- Verification queries
SELECT 'Database schema fix verification:' as status;

-- Check if columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'instructors' 
  AND table_schema = 'public'
  AND column_name IN ('specializations', 'expertise', 'max_students_per_class')
ORDER BY column_name;

-- Check if teacher_availability table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'teacher_availability'
) as teacher_availability_exists;

-- Check Maria Eduarda data
SELECT 
  'Maria Eduarda user data:' as status,
  u.id,
  u.full_name,
  u.email,
  u.role
FROM users u 
WHERE u.full_name ILIKE '%maria eduarda%' OR u.email = 'madu.wein@hotmail.com';

-- Check Maria Eduarda instructor profile
SELECT 
  'Maria Eduarda instructor profile:' as status,
  i.id,
  i.user_id,
  i.bio,
  i.expertise,
  i.specializations,
  i.rating
FROM instructors i
JOIN users u ON i.user_id = u.id
WHERE u.full_name ILIKE '%maria eduarda%' OR u.email = 'madu.wein@hotmail.com';

-- Check availability slots
SELECT 
  'Maria Eduarda availability slots:' as status,
  COUNT(*) as total_slots,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_slots
FROM teacher_availability ta
JOIN instructors i ON ta.teacher_id = i.id
JOIN users u ON i.user_id = u.id
WHERE u.full_name ILIKE '%maria eduarda%' OR u.email = 'madu.wein@hotmail.com';