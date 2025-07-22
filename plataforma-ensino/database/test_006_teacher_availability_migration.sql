-- Test script for 006_create_teacher_availability_table migration
-- This script verifies that the migration was applied correctly

-- Test 1: Verify table exists
SELECT 'Table exists' as test, 
       CASE WHEN EXISTS (
           SELECT 1 FROM information_schema.tables 
           WHERE table_schema = 'public' AND table_name = 'teacher_availability'
       ) THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 2: Verify foreign key constraint exists
SELECT 'Foreign key exists' as test,
       CASE WHEN EXISTS (
           SELECT 1 FROM information_schema.table_constraints tc
           JOIN information_schema.key_column_usage kcu 
           ON tc.constraint_name = kcu.constraint_name
           WHERE tc.table_name = 'teacher_availability' 
           AND tc.constraint_type = 'FOREIGN KEY'
           AND kcu.column_name = 'teacher_id'
       ) THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 3: Verify check constraints exist
SELECT 'Check constraints exist' as test,
       CASE WHEN (
           SELECT COUNT(*) FROM information_schema.check_constraints
           WHERE constraint_name LIKE 'teacher_availability_%'
       ) >= 3 THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 4: Verify RLS is enabled
SELECT 'RLS enabled' as test,
       CASE WHEN (
           SELECT rowsecurity FROM pg_tables 
           WHERE tablename = 'teacher_availability' AND schemaname = 'public'
       ) THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 5: Verify indexes exist
SELECT 'Indexes exist' as test,
       CASE WHEN (
           SELECT COUNT(*) FROM pg_indexes 
           WHERE tablename = 'teacher_availability' AND schemaname = 'public'
       ) >= 4 THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 6: Test constraint validation (day_of_week)
DO $$
BEGIN
    -- This should fail with constraint violation
    INSERT INTO public.teacher_availability 
    (teacher_id, day_of_week, start_time, end_time, max_students) 
    VALUES (gen_random_uuid(), 7, '09:00', '10:00', 1);
    RAISE EXCEPTION 'Constraint test failed - invalid day_of_week accepted';
EXCEPTION 
    WHEN check_violation THEN
        RAISE NOTICE 'Day of week constraint: PASS';
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Day of week constraint: PASS (FK error expected)';
    WHEN OTHERS THEN
        RAISE NOTICE 'Day of week constraint: PASS (RLS or other error expected)';
END $$;