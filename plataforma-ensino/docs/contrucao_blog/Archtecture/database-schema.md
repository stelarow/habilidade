# Database Schema

The following tables will be created in the existing Supabase PostgreSQL database. Row Level Security (RLS) policies will be applied to control access.

## `posts` table
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

## `categories` table
* `id` (uuid, primary key)
* `name` (text, not null, unique)
* `slug` (text, not null, unique)

## `tags` table
* `id` (uuid, primary key)
* `name` (text, not null, unique)
* `slug` (text, not null, unique)

## Junction Tables (Many-to-Many)
* **`post_categories`**: `post_id` (fk), `category_id` (fk)
* **`post_tags`**: `post_id` (fk), `tag_id` (fk)