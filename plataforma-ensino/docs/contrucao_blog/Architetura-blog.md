# Software Architecture Document: Stelarow Integrated Blog

**Autor:** BMad-Architect (Architect)
**Status:** Version 1.0 - Ready for Development
**Based on:** `docs/prd.md`, `docs/front-end-spec.md`

---

### 1. Architectural Vision

This document outlines the technical architecture for the Stelarow Integrated Blog. The primary goal is to create a robust and performant blog platform that is deeply integrated into the existing Stelarow monorepo, sharing the same technology stack (Next.js 14, Supabase, Vercel) and design system.

The architecture is designed for:
* **Synergy & Reusability:** Leveraging the existing monorepo to share components, types, authentication, and utilities, reducing code duplication and accelerating development.
* **Performance:** Utilizing Next.js Server-Side Rendering (SSR) and Static Site Generation (SSG) for fast page loads and excellent SEO.
* **Scalability:** Building on the scalable, serverless infrastructure provided by Vercel and Supabase.
* **Maintainability:** Ensuring a clear separation of concerns and a logical folder structure to facilitate future development and maintenance.

### 2. System Architecture (C4 Model - Container Level)

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

### 3. Database Schema

The following tables will be created in the existing Supabase PostgreSQL database. Row Level Security (RLS) policies will be applied to control access.

#### `posts` table
* `id` (uuid, primary key, default: `uuid_generate_v4()`)
* `title` (text, not null)
* `slug` (text, not null, unique)
* `content` (text, markdown format)
* `excerpt` (text)
* `cover_image_url` (text)
* `author_id` (uuid, foreign key to `profiles.id`)
* `status` (enum: `'draft'`, `'published'`, default: `'draft'`)
* `published_at` (timestamp with time zone)
* `meta_title` (text)
* `meta_description` (text)
* `created_at` (timestamp, default: `now()`)
* `updated_at` (timestamp, default: `now()`)

#### `categories` table
* `id` (uuid, primary key)
* `name` (text, not null, unique)
* `slug` (text, not null, unique)

#### `tags` table
* `id` (uuid, primary key)
* `name` (text, not null, unique)
* `slug` (text, not null, unique)

#### Junction Tables (Many-to-Many)
* **`post_categories`**: `post_id` (fk), `category_id` (fk)
* **`post_tags`**: `post_id` (fk), `tag_id` (fk)

### 4. Frontend Architecture & Data Flow

#### Folder Structure (within the monorepo)
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


#### Data Fetching Strategy
* **Public Pages (Blog Home, Post View):** Will be rendered using a combination of **Static Site Generation (SSG)** with revalidation and **Server-Side Rendering (SSR)** via Next.js Server Components. This ensures maximum performance and SEO. Data is fetched on the server directly from Supabase.
* **Admin Pages (Create/Edit):** Will be rendered as Client Components, as they are interactive and require user authentication. Data mutations (create, update) will be handled by the authenticated user's browser using the Supabase client library.

### 5. Authentication & Authorization

* **Authentication:** The existing Supabase Auth system will be used. No changes are needed.
* **Authorization:** Access to the blog management interface (`/admin/blog/**`) and the ability to write to the database will be restricted using **Supabase Row Level Security (RLS)**.
    * **Read Access:** `posts` with `status = 'published'` are publicly readable.
    * **Write Access (Create, Update, Delete):** Only users with the role of `instructor` or `admin` can perform write operations on the `posts`, `categories`, and `tags` tables. This will be enforced by RLS policies checking the user's role.

### 6. Non-Functional Requirements
* **Performance:** Target a First Contentful Paint (FCP) of **< 2 seconds**, achieved through SSG/SSR and optimized images (using Vercel's Image Optimization).
* **Security:**
    * All database interactions will be protected by RLS policies.
    * Inputs in the admin panel will be validated to prevent XSS attacks.
    * The Supabase client library handles protection against SQL injection.
* **SEO:** The architecture directly supports on-page SEO requirements from the PRD by allowing for custom slugs, meta titles, and meta descriptions, which will be rendered on the server.

---