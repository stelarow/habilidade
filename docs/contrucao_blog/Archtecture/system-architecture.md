# System Architecture (C4 Model - Container Level)

The system is composed of three main containers running within the Vercel and Supabase ecosystem:

1.  **Next.js Application (Container):** A single Next.js application within the monorepo serving all web traffic.
    * **Blog (`/blog`):** A new section within the Next.js app, responsible for rendering blog pages. It will use the App Router.
    * **Admin Panel (`/admin`):** The existing admin area, extended with new routes for blog management.
    * **Shared Components:** The blog will consume UI components, hooks, and types from a shared library within the monorepo.

2.  **Supabase (Container):** The backend-as-a-service platform.
    * **PostgreSQL Database:** Stores all blog-related data (posts, categories, tags) in new tables.
    * **Authentication:** Manages user authentication and authorization using existing user roles.
    * **Storage:** Stores images and other media uploaded for blog posts.

3.  **User's Browser (Container):** The client-side environment that renders the Next.js application and interacts with Supabase services directly for authenticated actions.

![C4 Diagram Placeholder](https://via.placeholder.com/800x400.png?text=System+Architecture+Diagram)