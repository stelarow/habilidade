# Fix for Duplicate Canva Iframe Issue [IMPLEMENTED]

## Problem
The lesson page is rendering two identical Canva iframes:
1. One embedded in the lesson content HTML (stored in database)
2. Another from the hardcoded `canvaEmbedUrl` prop in LessonPageIntegration

## Solution

### Option 1: Remove Hardcoded Canva Embed (Recommended)

In `src/components/lesson/LessonPageIntegration.tsx`, remove the hardcoded Canva props:

```typescript
// Remove these lines (256-260):
canvaEmbedUrl="https://www.canva.com/design/DAGuqW8uqiw/_HxYFw6YjdkL93523L-55w/view?embed"
canvaTitle="Apresentação Básica Minimalista Preto e Branco"
canvaDescription="Material introdutório visual da aula"
canvaAuthor="Maria Eduarda Weingartner"
canvaAuthorUrl="https://www.canva.com/design/DAGuqW8uqiw/_HxYFw6YjdkL93523L-55w/view?utm_content=DAGuqW8uqiw&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
```

This way, only the iframe in the lesson content will be rendered.

### Option 2: Extract Canva URL from Materials

Replace the hardcoded values with dynamic data from lesson materials:

```typescript
// Get Canva material from lesson materials
const canvaMaterial = lesson.materials?.find(m => m.type === 'canva' || m.url?.includes('canva.com'));

return (
  <LessonPageRedesigned
    // ... other props
    canvaEmbedUrl={canvaMaterial?.url}
    canvaTitle={canvaMaterial?.title}
    canvaDescription={canvaMaterial?.description}
    // Remove author props if not in materials
  />
);
```

### Option 3: Clean Database Content

If you want to keep the separate CanvaEmbed component and remove the iframe from content:

```sql
-- Update lesson content to remove Canva iframe
UPDATE lessons 
SET content = regexp_replace(
  content, 
  '<div style="position: relative.*?</iframe>\s*</div>', 
  '', 
  'g'
)
WHERE slug = 'introducao-marketing-digital';
```

## Testing

After implementing the fix:

1. Check that only one Canva iframe is rendered
2. Verify First Contentful Paint improves to < 2.5s
3. Confirm total requests decrease by ~50%
4. Test on mobile devices

## Implementation Steps

1. Choose Option 1 (simplest and safest)
2. Deploy to staging
3. Run performance tests
4. Monitor Core Web Vitals
5. Deploy to production

## Implementation Status [2024-12-02]

✅ **IMPLEMENTED** - Option 2 was successfully implemented with the following enhancements:

### What was done:
1. **Database Migration**: Applied migration to add Canva support to materials JSONB column
2. **Dynamic Data Extraction**: Updated `LessonPageIntegration.tsx` to extract Canva data from `lesson.materials`
3. **Type Safety**: Created `materials.ts` with proper TypeScript interfaces
4. **Admin Management**: Created `CanvaMaterialManager.tsx` component for easy Canva embed management
5. **Database Verification**: Confirmed Marketing Digital lesson now has Canva data stored in materials

### Results:
- ✅ No more hardcoded Canva URLs
- ✅ Dynamic Canva embeds from database
- ✅ Support for multiple Canva embeds per lesson
- ✅ Easy admin interface for management
- ✅ Performance optimization with only one iframe rendered

See `DYNAMIC_CANVA_IMPLEMENTATION.md` for full implementation details.