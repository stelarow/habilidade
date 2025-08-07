# SEO_FIX_INDEXING_ISSUES_V2

## CONTEXT
Site: escolahabilidade.com
Date: 2025-08-01
GSC_Status: 68_pages_not_indexed, 19_indexed
Priority: CRITICAL

## ISSUES_SUMMARY

| issue_type | pages | severity | action_required |
|------------|-------|----------|-----------------|
| noindex_tag | 24 | HIGH | remove_meta_tags |
| soft_404 | 20 | HIGH | add_content_or_404 |
| crawled_not_indexed | 22 | MEDIUM | improve_quality |
| canonical_alternate | 2 | LOW | verify_only |

## ISSUE_1_NOINDEX

### Detection
```html
<!-- FIND_AND_REMOVE -->
<meta name="robots" content="noindex">
<meta name="googlebot" content="noindex">
```

### Fix_Steps
1. Check_SEO_plugins: Yoast/RankMath settings per page
2. Review_theme_templates: functions.php, header.php
3. Verify_staging_configs: .htaccess, nginx.conf
4. Force_indexing_WordPress:
```php
add_filter('wp_robots', function($robots) {
    $robots['index'] = true;
    $robots['follow'] = true;
    return $robots;
});
```

### Validation
- GSC > URL_Inspector > Request_Indexing
- Wait 48-72h for recrawl

## ISSUE_2_SOFT_404

### Detection
Pages returning HTTP_200 but content appears empty/missing

### Common_Patterns
- Content < 100 words
- Generic messages: "Not found", "Coming soon"
- Empty category/tag pages
- Redirects to homepage

### Fix_Matrix

| scenario | solution | code_snippet |
|----------|----------|--------------|
| thin_content | add_500+_words | expand_with_relevant_info |
| truly_missing | return_404 | `status_header(404)` |
| empty_category | add_default_content | see_code_below |

### WordPress_Fix
```php
// Return proper 404
if (!$content_exists) {
    status_header(404);
    nocache_headers();
    include(get_404_template());
    exit();
}

// Add category content
add_filter('category_description', function($desc, $cat) {
    return $desc ?: "Explore content about {$cat->name}";
}, 10, 2);
```

## ISSUE_3_CRAWLED_NOT_INDEXED

### Quality_Signals_Missing
- E-E-A-T: No author bio, credentials, dates
- Content: < 500 words, no structure
- Performance: LCP > 2.5s, CLS > 0.1
- Links: < 3 internal links

### Quick_Wins
1. Add_author_schema:
```html
<div itemscope itemtype="https://schema.org/Person">
  <span itemprop="name">Author Name</span>
  <span itemprop="jobTitle">Role</span>
</div>
```

2. Content_minimums:
   - Words: 500+
   - H2_headings: Every 300 words
   - Images: 1 per 500 words with alt text
   - Internal_links: 3-5 relevant

3. Core_Web_Vitals:
   - Implement lazy loading
   - Compress images to WebP
   - Minify CSS/JS

## ISSUE_4_CANONICAL

### Status
CORRECT - No action needed

### Verify_Only
```html
<link rel="canonical" href="https://example.com/original">
```

## ACTION_PLAN

### WEEK_1_CRITICAL
```yaml
day_1-2:
  - remove_all_noindex_tags
  - audit_seo_plugins
  - test_staging

day_3-4:
  - fix_soft_404_pages
  - add_content_or_proper_404
  - implement_301_redirects

day_5-7:
  - submit_to_gsc
  - resubmit_sitemap
  - monitor_coverage
```

### WEEK_2_QUALITY
```yaml
tasks:
  - expand_thin_content
  - add_schema_markup
  - optimize_images
  - improve_page_speed
```

### WEEK_3-4_MONITOR
```yaml
metrics:
  - indexation_rate: target > 80%
  - impressions: +50% in 30d
  - avg_position: improve 20%
```

## SCRIPTS

### Audit_Noindex
```bash
# Find noindex in files
grep -r 'noindex' --include="*.php" --include="*.html"
```

### Check_Status_Codes
```bash
while read url; do
  curl -s -o /dev/null -w "%{http_code}" "$url"
done < urls.txt
```

### GSC_API_Check
```python
# Validate fixes via API
from google.oauth2 import service_account
from googleapiclient.discovery import build

def check_indexing(url):
    request = service.urlInspection().index().inspect(
        body={'inspectionUrl': url, 'siteUrl': site_url}
    )
    return request.execute()
```

## SUCCESS_METRICS

### 30_days
- indexed_pages: > 80%
- soft_404_errors: < 10
- impressions: +50%
- avg_ctr: > 2%

### 90_days
- organic_traffic: +100%
- top10_keywords: 20+
- avg_session: > 2min
- bounce_rate: < 60%

## TOOLS

### Required
- Google_Search_Console: Daily monitoring
- Screaming_Frog: Weekly crawl
- PageSpeed_Insights: Core Web Vitals

### Optional
- Ahrefs/SEMrush: Competitor analysis
- Schema_Validator: Structured data

## NOTES
- Changes take 2-8 weeks to reflect
- Test all fixes in staging first
- Document all changes made
- Monitor GSC daily first week

## END_DOCUMENT