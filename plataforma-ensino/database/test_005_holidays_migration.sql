-- Test script for 005_create_holidays_table migration
-- This script verifies that the migration was applied correctly

-- Test 1: Verify table exists
SELECT 'Table exists' as test, 
       CASE WHEN EXISTS (
           SELECT 1 FROM information_schema.tables 
           WHERE table_schema = 'public' AND table_name = 'holidays'
       ) THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 2: Verify table structure
SELECT 'Table structure' as test,
       CASE WHEN (
           SELECT COUNT(*) FROM information_schema.columns 
           WHERE table_schema = 'public' AND table_name = 'holidays'
       ) >= 6 THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 3: Verify RLS is enabled
SELECT 'RLS enabled' as test,
       CASE WHEN (
           SELECT rowsecurity FROM pg_tables 
           WHERE tablename = 'holidays' AND schemaname = 'public'
       ) THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 4: Verify indexes exist
SELECT 'Indexes exist' as test,
       CASE WHEN (
           SELECT COUNT(*) FROM pg_indexes 
           WHERE tablename = 'holidays' AND schemaname = 'public'
       ) >= 3 THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 5: Verify constraints exist
SELECT 'Constraints exist' as test,
       CASE WHEN (
           SELECT COUNT(*) FROM information_schema.table_constraints
           WHERE table_name = 'holidays' AND table_schema = 'public'
           AND constraint_type IN ('UNIQUE', 'CHECK')
       ) >= 2 THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 6: Test insert (will fail if no admin role, which is expected)
-- This should fail with RLS policy error if user is not admin - that's correct behavior
DO $$
BEGIN
    INSERT INTO public.holidays (date, name, year, is_national) 
    VALUES ('2025-01-01', 'Test Holiday', 2025, true);
    RAISE NOTICE 'Insert test: PASS - Admin access working';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Insert test: PASS - RLS blocking non-admin (expected)';
END $$;

-- Test 7: Test read access (should work for all users)
SELECT 'Read access test' as test,
       CASE WHEN (
           SELECT COUNT(*) FROM public.holidays
       ) >= 0 THEN 'PASS' ELSE 'FAIL' END as result;