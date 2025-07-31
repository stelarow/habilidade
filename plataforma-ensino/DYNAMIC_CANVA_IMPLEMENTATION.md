# Dynamic Canva Embed Implementation

## Overview
This implementation transforms the hardcoded Canva embed into a dynamic system that stores Canva presentations in the database and allows for easy management.

## Implementation Details

### 1. Database Structure
Materials are stored in the `lessons.materials` JSONB column with this structure:
```json
{
  "id": "uuid",
  "type": "canva",
  "title": "Apresentação Título",
  "description": "Descrição opcional",
  "url": "https://www.canva.com/design/.../view?embed",
  "author": "Nome do Autor",
  "authorUrl": "https://www.canva.com/...",
  "embedType": "iframe",
  "order": 1
}
```

### 2. Migration Applied
- Created migration: `add_canva_support_to_materials.sql`
- Added Canva embed data to the Marketing Digital introduction lesson
- Created GIN index for better query performance on materials

### 3. Components Updated

#### LessonPageIntegration.tsx
- Removed hardcoded Canva URLs
- Added logic to extract Canva materials from `lesson.materials`
- Dynamic props passed to LessonPageRedesigned

#### CanvaMaterialManager.tsx (New)
- Admin component to manage Canva embeds
- Features:
  - Add/Edit/Delete Canva presentations
  - Automatic URL formatting for embed
  - Preview links
  - Validation

### 4. Type Safety
Created `src/types/materials.ts` with interfaces for materials and Canva-specific materials.

## Usage

### For Developers
```typescript
// Extract Canva material from lesson
const canvaMaterial = lesson.materials?.find(
  m => m.type === 'canva'
)

// Use in component
<CanvaEmbed 
  url={canvaMaterial?.url}
  title={canvaMaterial?.title}
  // ... other props
/>
```

### For Administrators
1. Navigate to lesson edit page
2. Use the CanvaMaterialManager component to:
   - Add new Canva presentations by pasting share link
   - Edit existing presentations
   - Remove presentations

### Adding Canva via SQL
```sql
UPDATE public.lessons 
SET materials = materials || jsonb_build_array(
  jsonb_build_object(
    'id', gen_random_uuid(),
    'type', 'canva',
    'title', 'Sua Apresentação',
    'url', 'https://www.canva.com/design/ID/view?embed',
    'author', 'Autor Nome'
  )
)
WHERE id = 'lesson-id';
```

## Benefits
1. **Dynamic**: No more hardcoded URLs
2. **Scalable**: Multiple Canva embeds per lesson
3. **Manageable**: Easy admin interface
4. **Type-safe**: TypeScript interfaces
5. **Performance**: Indexed JSONB queries
6. **Flexible**: Supports other material types

## Next Steps
1. Integrate CanvaMaterialManager into LessonForm
2. Add drag-and-drop ordering for multiple Canva embeds
3. Create preview mode in admin
4. Add Canva embed analytics tracking