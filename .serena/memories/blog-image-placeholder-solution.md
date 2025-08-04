# Blog Image Placeholder Solution

## Problem Summary
Two blog articles were showing placeholders because:
1. `cinco-maneiras-maximizar-vistas-magnificas-casas-personalizadas` - image_url was null in DB
2. `espacos-pequenos-futuros-grandes-design-sprint-2025` - image_url was null in DB

## Solution Applied
1. Updated database with image URLs from blogMockData.js:
   - Article 1: `/assets/blog/five-ways-magnificent-views/2024_687205183_five_ways_to_1.jpg`
   - Article 2: `/assets/blog/design-sprint-2025.svg`

2. Created directories: `plataforma-ensino/public/assets/blog/`

## Remaining Issues
- The actual image files don't exist
- BlogCard component uses `post.image` but DB has `image_url`
- Need to either:
  a) Create placeholder images
  b) Update BlogCard to handle missing images gracefully
  c) Ensure data mapping converts image_url to image property

## Next Steps
- Create SVG placeholder images for both articles
- Or update the data fetching to map image_url to image property