# Performance Analysis - Lesson Page

## Executive Summary

The lesson page at `https://plataformahabilidade.netlify.app/course/marketing-digital/lesson/introducao-marketing-digital` has significant performance issues caused by **duplicate Canva iframe embeds**.

### Key Findings

1. **Duplicate Iframes**: The page loads 2 Canva iframes with identical content
2. **High First Contentful Paint**: 3.84 seconds (should be under 2.5s)
3. **Total Resources**: 189 requests (excessive)
4. **Database Queries**: Efficient with average execution time < 1ms

## Performance Metrics

```
DOM Content Loaded: 2.054 seconds ✓
Page Load Complete: 2.062 seconds ✓  
First Paint: 2.000 seconds ✓
First Contentful Paint: 3.840 seconds ❌
Total Resources: 189 ❌
Total Size: ~32KB (compressed) ✓
```

## Root Cause Analysis

### 1. Duplicate Canva Embeds

The page renders the same Canva presentation twice:
- One in the lesson header section
- Another in the lesson content section

This causes:
- Double the network requests
- Double the iframe rendering overhead
- Increased memory usage
- Poor user experience

**Code Location**: 
- `plataforma-ensino/src/components/lesson/LessonPageIntegration.tsx:256-260`
- The component passes hardcoded Canva embed data instead of using lesson-specific data

### 2. Database Performance

Supabase queries are well-optimized:
- Average query time: 0.94ms for lesson queries
- Proper indexing on slug fields
- Efficient joins for related data

### 3. Bundle Optimization

The Next.js configuration has good code splitting:
- PDF libraries are lazy loaded
- UI components are properly chunked
- React dependencies are separated

## Recommendations

### Immediate Fix (High Priority)

1. **Remove Duplicate Canva Embed**
   ```typescript
   // In LessonPageIntegration.tsx
   // Remove hardcoded canvaEmbedUrl and use lesson.materials instead
   canvaEmbedUrl={lesson.materials?.find(m => m.type === 'canva')?.url}
   ```

2. **Conditional Rendering**
   ```typescript
   // Only render Canva embed if it exists in materials
   {canvaEmbedUrl && <CanvaEmbed url={canvaEmbedUrl} />}
   ```

### Performance Optimizations

1. **Lazy Load Canva Embed**
   ```typescript
   const CanvaEmbed = dynamic(() => import('./CanvaEmbed'), {
     loading: () => <div>Loading presentation...</div>,
     ssr: false
   });
   ```

2. **Add Loading States**
   - Show skeleton UI while iframe loads
   - Use intersection observer to load only when visible

3. **Optimize Iframe Settings**
   - Add `loading="lazy"` to iframe
   - Implement proper sandbox attributes
   - Use referrer policy to reduce tracking requests

### Testing

Run the performance tests:
```bash
npm run test:e2e tests/performance/lesson-page.spec.ts
```

## Expected Improvements

After implementing these fixes:
- First Contentful Paint: < 2.5 seconds (35% improvement)
- Total requests: < 100 (47% reduction)
- Better mobile performance
- Reduced memory usage

## Monitoring

Set up monitoring for:
- Core Web Vitals (LCP, FID, CLS)
- Resource loading times
- Error rates
- User engagement metrics

## Next Steps

1. Fix duplicate Canva embeds immediately
2. Deploy and measure improvements
3. Consider progressive loading for lesson content
4. Implement resource hints (preconnect, prefetch)
5. Add performance budget to CI/CD pipeline