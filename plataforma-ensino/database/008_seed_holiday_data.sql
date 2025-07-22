-- Migration 008: Seed 2025 Brazilian national holiday data
-- Story: 1.1.database-schema-setup
-- Task: Create seeding script for 2025 Brazilian national holidays

-- ====================================================================
-- FORWARD MIGRATION
-- ====================================================================

-- Insert 2025 Brazilian national holidays
INSERT INTO public.holidays (date, name, year, is_national) VALUES
    ('2025-01-01', 'Confraternização Universal', 2025, true),
    ('2025-03-03', 'Carnaval - Segunda-feira', 2025, true),
    ('2025-03-04', 'Carnaval - Terça-feira', 2025, true),
    ('2025-04-18', 'Sexta-feira Santa', 2025, true),
    ('2025-04-21', 'Tiradentes', 2025, true),
    ('2025-05-01', 'Dia do Trabalhador', 2025, true),
    ('2025-05-29', 'Corpus Christi', 2025, true),
    ('2025-09-07', 'Independência do Brasil', 2025, true),
    ('2025-10-12', 'Nossa Senhora Aparecida', 2025, true),
    ('2025-11-02', 'Finados', 2025, true),
    ('2025-11-15', 'Proclamação da República', 2025, true),
    ('2025-12-25', 'Natal', 2025, true)
ON CONFLICT (date) DO UPDATE SET
    name = EXCLUDED.name,
    is_national = EXCLUDED.is_national,
    updated_at = NOW();

-- ====================================================================
-- ROLLBACK MIGRATION (for testing rollback capability)
-- ====================================================================

/*
-- To rollback this migration:
DELETE FROM public.holidays 
WHERE year = 2025 AND is_national = true 
  AND date IN (
    '2025-01-01', '2025-03-03', '2025-03-04', '2025-04-18',
    '2025-04-21', '2025-05-01', '2025-05-29', '2025-09-07',
    '2025-10-12', '2025-11-02', '2025-11-15', '2025-12-25'
  );
*/