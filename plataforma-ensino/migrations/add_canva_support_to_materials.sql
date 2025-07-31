-- Add support for Canva embeds in lesson materials
-- This migration standardizes the materials structure to support different types of resources

-- Update existing lessons to have a proper materials structure if empty
UPDATE public.lessons 
SET materials = '[]'::jsonb 
WHERE materials IS NULL OR materials::text = '[]' OR materials::text = '{}' OR jsonb_array_length(materials) = 0;

-- Add Canva embed to the marketing digital introduction lesson
UPDATE public.lessons 
SET materials = jsonb_build_array(
  jsonb_build_object(
    'id', gen_random_uuid(),
    'type', 'canva',
    'title', 'Apresentação Básica Minimalista Preto e Branco',
    'description', 'Material introdutório visual da aula',
    'url', 'https://www.canva.com/design/DAGuqW8uqiw/_HxYFw6YjdkL93523L-55w/view?embed',
    'author', 'Maria Eduarda Weingartner',
    'authorUrl', 'https://www.canva.com/design/DAGuqW8uqiw/_HxYFw6YjdkL93523L-55w/view?utm_content=DAGuqW8uqiw&utm_campaign=designshare&utm_medium=embeds&utm_source=link',
    'embedType', 'iframe',
    'order', 1
  )
) || COALESCE(materials, '[]'::jsonb)
WHERE slug = 'introducao-marketing-digital'
AND course_id IN (
  SELECT id FROM public.courses WHERE slug = 'marketing-digital'
);

-- Create an index on materials for better query performance
CREATE INDEX IF NOT EXISTS idx_lessons_materials ON public.lessons USING gin(materials);

-- Add a comment explaining the materials structure
COMMENT ON COLUMN public.lessons.materials IS 'JSONB array of lesson materials. Each material should have: {id, type, title, description?, url, author?, authorUrl?, embedType?, order?}. Types include: pdf, video, canva, link, download, etc.';