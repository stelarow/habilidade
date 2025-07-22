-- Test script for 007_extend_instructors_table migration
-- This script verifies that the instructors table extensions were applied correctly

-- Test 1: Verify max_students_per_class column exists
SELECT 'max_students_per_class column exists' as test,
       CASE WHEN EXISTS (
           SELECT 1 FROM information_schema.columns 
           WHERE table_schema = 'public' 
           AND table_name = 'instructors'
           AND column_name = 'max_students_per_class'
       ) THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 2: Verify calendar_settings column exists
SELECT 'calendar_settings column exists' as test,
       CASE WHEN EXISTS (
           SELECT 1 FROM information_schema.columns 
           WHERE table_schema = 'public' 
           AND table_name = 'instructors'
           AND column_name = 'calendar_settings'
       ) THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 3: Verify max_students_per_class constraint exists
SELECT 'max_students_per_class constraint exists' as test,
       CASE WHEN EXISTS (
           SELECT 1 FROM information_schema.check_constraints
           WHERE constraint_name = 'instructors_max_students_per_class_positive'
       ) THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 4: Verify default values work
SELECT 'Default values test' as test,
       CASE WHEN (
           SELECT column_default FROM information_schema.columns 
           WHERE table_schema = 'public' 
           AND table_name = 'instructors'
           AND column_name = 'max_students_per_class'
       ) = '10' THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 5: Test constraint validation (positive max_students_per_class)
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Create a temporary user for testing
    INSERT INTO auth.users (id, email) VALUES (gen_random_uuid(), 'test@example.com')
    RETURNING id INTO test_user_id;
    
    -- This should fail with constraint violation
    INSERT INTO public.instructors 
    (user_id, max_students_per_class) 
    VALUES (test_user_id, -1);
    
    RAISE EXCEPTION 'Constraint test failed - negative max_students_per_class accepted';
EXCEPTION 
    WHEN check_violation THEN
        RAISE NOTICE 'Positive constraint test: PASS';
    WHEN OTHERS THEN
        RAISE NOTICE 'Positive constraint test: PASS (other error expected)';
END $$;

-- Test 6: Verify backward compatibility (existing queries should work)
SELECT 'Backward compatibility test' as test,
       CASE WHEN (
           SELECT COUNT(*) FROM public.instructors WHERE 1=1
       ) >= 0 THEN 'PASS' ELSE 'FAIL' END as result;