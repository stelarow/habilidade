# Non-Functional Requirements

* **Performance:** Target a First Contentful Paint (FCP) of **< 2 seconds**, achieved through SSG/SSR and optimized images (using Vercel's Image Optimization).
* **Security:**
    * All database interactions will be protected by RLS policies.
    * Inputs in the admin panel will be validated to prevent XSS attacks.
    * The Supabase client library handles protection against SQL injection.
* **SEO:** The architecture directly supports on-page SEO requirements from the PRD by allowing for custom slugs, meta titles, and meta descriptions, which will be rendered on the server.