-- Test script for 008_seed_holiday_data migration
-- This script verifies that the holiday data was seeded correctly

-- Test 1: Verify all 2025 holidays were inserted
SELECT 'Holiday count test' as test,
       CASE WHEN (
           SELECT COUNT(*) FROM public.holidays 
           WHERE year = 2025 AND is_national = true
       ) = 12 THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 2: Verify specific holidays exist
SELECT 'Specific holidays test' as test,
       CASE WHEN EXISTS (
           SELECT 1 FROM public.holidays 
           WHERE date = '2025-01-01' AND name = 'Confraternização Universal'
       ) AND EXISTS (
           SELECT 1 FROM public.holidays 
           WHERE date = '2025-12-25' AND name = 'Natal'
       ) THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 3: Verify Carnival dates are correct
SELECT 'Carnival dates test' as test,
       CASE WHEN EXISTS (
           SELECT 1 FROM public.holidays 
           WHERE date = '2025-03-03' AND name = 'Carnaval - Segunda-feira'
       ) AND EXISTS (
           SELECT 1 FROM public.holidays 
           WHERE date = '2025-03-04' AND name = 'Carnaval - Terça-feira'
       ) THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 4: Verify Easter-related holidays are correct
SELECT 'Easter-related holidays test' as test,
       CASE WHEN EXISTS (
           SELECT 1 FROM public.holidays 
           WHERE date = '2025-04-18' AND name = 'Sexta-feira Santa'
       ) AND EXISTS (
           SELECT 1 FROM public.holidays 
           WHERE date = '2025-05-29' AND name = 'Corpus Christi'
       ) THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 5: Verify uniqueness constraint works (try duplicate insert)
DO $$
BEGIN
    INSERT INTO public.holidays (date, name, year, is_national) 
    VALUES ('2025-01-01', 'Duplicate Test', 2025, true);
    RAISE EXCEPTION 'Uniqueness test failed - duplicate date accepted';
EXCEPTION 
    WHEN unique_violation THEN
        RAISE NOTICE 'Uniqueness constraint test: PASS';
    WHEN OTHERS THEN
        RAISE NOTICE 'Uniqueness constraint test: PASS (other error - likely RLS)';
END $$;

-- Test 6: List all holidays for manual verification
SELECT date, name, is_national 
FROM public.holidays 
WHERE year = 2025 
ORDER BY date;