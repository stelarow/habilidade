# Frontend Architecture & Data Flow

## Folder Structure (within the monorepo)
```
/apps
/stelarow-web
/app
/blog
/page.tsx                # Blog home, lists all posts
/[slug]
/page.tsx              # Individual post page
/category
/[slug]
/page.tsx            # Category archive page
/admin
/blog
/page.tsx              # List posts for editing
/new
/page.tsx            # Create new post form
/edit
/[id]
/page.tsx          # Edit post form
/packages
/ui                        # Shared React components (e.g., Button, Card)
/core                      # Shared hooks, types, Supabase client
```

## Data Fetching Strategy
* **Public Pages (Blog Home, Post View):** Will be rendered using a combination of **Static Site Generation (SSG)** with revalidation and **Server-Side Rendering (SSR)** via Next.js Server Components. This ensures maximum performance and SEO. Data is fetched on the server directly from Supabase.
* **Admin Pages (Create/Edit):** Will be rendered as Client Components, as they are interactive and require user authentication. Data mutations (create, update) will be handled by the authenticated user's browser using the Supabase client library.