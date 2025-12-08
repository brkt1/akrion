# Testing the SQL Migration

## Quick Test Steps

### 1. Test in Supabase Dashboard

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Test the Migration**
   - Copy the entire contents of `supabase-migrations.sql`
   - Paste into the SQL Editor
   - Click "Run" or press `Ctrl+Enter` (or `Cmd+Enter` on Mac)

4. **Check for Errors**
   - If successful, you'll see "Success. No rows returned"
   - If there are errors, they'll be displayed in red

### 2. Verify Tables Were Created

Run this query to check all tables:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('blog_posts', 'portfolio_projects', 'services', 'contact_messages')
ORDER BY table_name;
```

Expected result: 4 rows (one for each table)

### 3. Verify RLS is Enabled

Run this query:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('blog_posts', 'portfolio_projects', 'services', 'contact_messages');
```

Expected result: All tables should have `rowsecurity = true`

### 4. Verify Policies Were Created

Run this query:

```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('blog_posts', 'portfolio_projects', 'services', 'contact_messages')
ORDER BY tablename, policyname;
```

Expected result: Multiple policies for each table

### 5. Verify Default Data

Check if default data was inserted:

```sql
-- Check services
SELECT COUNT(*) as service_count FROM services;
-- Expected: 5

-- Check portfolio projects
SELECT COUNT(*) as project_count FROM portfolio_projects;
-- Expected: 5

-- Check blog posts
SELECT COUNT(*) as post_count FROM blog_posts;
-- Expected: 2
```

### 6. Test Storage Policies (After Creating Bucket)

First, create the storage bucket manually:
1. Go to Storage → New bucket
2. Name: `images`
3. Set to Public
4. Create

Then test storage policies:

```sql
SELECT policyname 
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%images%';
```

Expected result: 4 policies (read, insert, update, delete)

### 7. Test Triggers

Test that triggers are working:

```sql
-- Update a blog post to test trigger
UPDATE blog_posts 
SET title = title 
WHERE id = (SELECT id FROM blog_posts LIMIT 1);

-- Check if updated_at changed
SELECT id, title, created_at, updated_at 
FROM blog_posts 
LIMIT 1;
```

The `updated_at` should be more recent than `created_at`.

## Common Issues and Solutions

### Issue: "relation already exists"
**Solution**: The tables already exist. The migration uses `IF NOT EXISTS` so this shouldn't happen, but if it does, you can drop tables first:

```sql
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS portfolio_projects CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
```

### Issue: "policy already exists"
**Solution**: The migration uses `DROP POLICY IF EXISTS` so this should be handled automatically. If you still get errors, the policies might have different names.

### Issue: Storage policies fail
**Solution**: Make sure you've created the `images` bucket first in the Storage section of the dashboard.

## Full Reset (if needed)

If you need to completely reset and start over:

```sql
-- Drop all tables
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS portfolio_projects CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;

-- Drop triggers
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
DROP TRIGGER IF EXISTS update_portfolio_projects_updated_at ON portfolio_projects;
DROP TRIGGER IF EXISTS update_services_updated_at ON services;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Then run the full migration again
```

