# Supabase Backend Setup

This project uses Supabase as the backend database. Follow these steps to set up the database:

## 1. Database Setup

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-migrations.sql` into the SQL Editor
4. Run the SQL script to create all necessary tables and policies

## 2. Tables Created

The migration script creates the following tables:

- **blog_posts** - Stores blog posts with title, content, author, date, image, and category
- **portfolio_projects** - Stores portfolio projects with title, description, image, category, link, and tags
- **services** - Stores services with title, description, and icon type
- **contact_messages** - Stores contact form submissions

## 3. Row Level Security (RLS)

All tables have RLS enabled with public read/write policies. For production, you should:
- Restrict write operations to authenticated users only
- Add proper authentication
- Implement role-based access control

## 4. API Configuration

The Supabase client is configured in `src/lib/supabase.js` with:
- Project URL: `https://umgztbsclpznwgdocgbh.supabase.co`
- Anon Key: Already configured

## 5. API Services

The following API services are available:

- `src/lib/api/blog.js` - Blog posts CRUD operations
- `src/lib/api/portfolio.js` - Portfolio projects CRUD operations
- `src/lib/api/services.js` - Services CRUD operations
- `src/lib/api/contacts.js` - Contact messages operations

## 6. Default Data

The migration script includes default data for:
- 5 default services
- 5 default portfolio projects
- 2 default blog posts

## 7. Testing

After running the migration:
1. Start the development server: `npm run dev`
2. Navigate to Blog, Portfolio, or Services pages
3. Enter Admin Mode to test CRUD operations
4. Verify data is being saved to and loaded from Supabase

## 8. Environment Variables (Optional)

For better security, you can move the Supabase keys to environment variables:

1. Create a `.env` file in the root directory
2. Add:
   ```
   VITE_SUPABASE_URL=https://umgztbsclpznwgdocgbh.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```
3. Update `src/lib/supabase.js` to use `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`

## Troubleshooting

- **Error: "relation does not exist"** - Make sure you've run the SQL migration script
- **Error: "permission denied"** - Check that RLS policies are correctly set up
- **Data not loading** - Check browser console for API errors and verify Supabase connection

