# Authentication & Authorization

* **Authentication:** The existing Supabase Auth system will be used. No changes are needed.
* **Authorization:** Access to the blog management interface (`/admin/blog/**`) and the ability to write to the database will be restricted using **Supabase Row Level Security (RLS)**.
    * **Read Access:** `posts` with `status = 'published'` are publicly readable.
    * **Write Access (Create, Update, Delete):** Only users with the role of `instructor` or `admin` can perform write operations on the `posts`, `categories`, and `tags` tables. This will be enforced by RLS policies checking the user's role.