-- ============================================
-- AKRION DIGITALS - MASTER SETUP SCRIPT
-- ============================================
-- This script performs a complete setup:
-- 1. Creates all necessary tables
-- 2. Enables Row Level Security (RLS)
-- 3. Sets up RLS Policies
-- 4. Creates the Storage Bucket
-- 5. Sets up Storage Policies
-- 6. Creates the Admin User
-- 7. Inserts Default Data
-- ============================================

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  date DATE NOT NULL,
  image TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create portfolio_projects table
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  category TEXT,
  link TEXT,
  tags TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. CREATE RLS POLICIES FOR TABLES
-- ============================================

-- Blog Posts Policies
DROP POLICY IF EXISTS "Allow public read access on blog_posts" ON blog_posts;
CREATE POLICY "Allow public read access on blog_posts" ON blog_posts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on blog_posts" ON blog_posts;
CREATE POLICY "Allow public insert on blog_posts" ON blog_posts
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on blog_posts" ON blog_posts;
CREATE POLICY "Allow public update on blog_posts" ON blog_posts
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on blog_posts" ON blog_posts;
CREATE POLICY "Allow public delete on blog_posts" ON blog_posts
  FOR DELETE USING (true);

-- Portfolio Projects Policies
DROP POLICY IF EXISTS "Allow public read access on portfolio_projects" ON portfolio_projects;
CREATE POLICY "Allow public read access on portfolio_projects" ON portfolio_projects
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on portfolio_projects" ON portfolio_projects;
CREATE POLICY "Allow public insert on portfolio_projects" ON portfolio_projects
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on portfolio_projects" ON portfolio_projects;
CREATE POLICY "Allow public update on portfolio_projects" ON portfolio_projects
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on portfolio_projects" ON portfolio_projects;
CREATE POLICY "Allow public delete on portfolio_projects" ON portfolio_projects
  FOR DELETE USING (true);

-- Services Policies
DROP POLICY IF EXISTS "Allow public read access on services" ON services;
CREATE POLICY "Allow public read access on services" ON services
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on services" ON services;
CREATE POLICY "Allow public insert on services" ON services
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on services" ON services;
CREATE POLICY "Allow public update on services" ON services
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on services" ON services;
CREATE POLICY "Allow public delete on services" ON services
  FOR DELETE USING (true);

-- Contact Messages Policies
DROP POLICY IF EXISTS "Allow public insert on contact_messages" ON contact_messages;
CREATE POLICY "Allow public insert on contact_messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access on contact_messages" ON contact_messages;
CREATE POLICY "Allow public read access on contact_messages" ON contact_messages
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public delete on contact_messages" ON contact_messages;
CREATE POLICY "Allow public delete on contact_messages" ON contact_messages
  FOR DELETE USING (true);

-- ============================================
-- 4. CREATE STORAGE BUCKET
-- ============================================

-- Note: This requires relevant permissions on the storage schema
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images', 
  'images', 
  true, 
  5242880, 
  '{"image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"}'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. CREATE STORAGE POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access on images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access on images" ON storage.objects;
DROP POLICY IF EXISTS "Public update access on images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access on images" ON storage.objects;

-- Public read access for images
CREATE POLICY "Public read access on images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'images');

-- Public upload access for images
CREATE POLICY "Public upload access on images" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'images');

-- Public update access for images
CREATE POLICY "Public update access on images" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'images')
  WITH CHECK (bucket_id = 'images');

-- Public delete access for images
CREATE POLICY "Public delete access on images" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'images');

-- ============================================
-- 6. CREATE ADMIN USER
-- ============================================
-- Credentials:
-- Email: Hailakemelaku1223@gmail.com
-- Password: Open@1223
-- ============================================

-- We use do block to handle potential missing extensions or schema access
DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
BEGIN
  -- Check if user already exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'Hailakemelaku1223@gmail.com') THEN
    
    -- Insert into auth.users
    INSERT INTO auth.users (
      id, 
      instance_id, 
      email, 
      encrypted_password, 
      email_confirmed_at, 
      raw_app_meta_data, 
      raw_user_meta_data, 
      created_at, 
      updated_at, 
      role, 
      confirmation_token, 
      email_change, 
      email_change_token_new, 
      recovery_token
    )
    VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'Hailakemelaku1223@gmail.com',
      crypt('Open@1223', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"admin"}',
      NOW(),
      NOW(),
      'authenticated',
      '',
      '',
      '',
      ''
    );

    -- Insert into auth.identities
    INSERT INTO auth.identities (
      id, 
      user_id, 
      identity_data, 
      provider, 
      last_sign_in_at, 
      created_at, 
      updated_at
    )
    VALUES (
      gen_random_uuid(),
      new_user_id,
      format('{"sub":"%s","email":"%s"}', new_user_id::text, 'Hailakemelaku1223@gmail.com')::jsonb,
      'email',
      NOW(),
      NOW(),
      NOW()
    );

    RAISE NOTICE 'Admin user created successfully.';
  ELSE
    RAISE NOTICE 'Admin user already exists.';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Could not create admin user via SQL. Please use the Supabase Dashboard.';
END $$;

-- ============================================
-- 7. INSERT DEFAULT DATA
-- ============================================

-- Insert default services
INSERT INTO services (title, description, icon) VALUES
  ('Branding', 'We create compelling brand identities that tell your story and connect with your audience.', 'Branding'),
  ('Development', 'Custom web and app development that brings your vision to life with cutting-edge technology.', 'Development'),
  ('Video', 'Cinematic video production and motion design that captivates and communicates your message.', 'Video'),
  ('Social Media', 'Strategic social media campaigns that engage, grow, and convert your audience.', 'Social Media'),
  ('Consulting', 'Creative consulting to guide your brand strategy and digital transformation journey.', 'Consulting')
ON CONFLICT DO NOTHING;

-- Insert default portfolio projects
INSERT INTO portfolio_projects (title, description, image, category, tags) VALUES
  ('Cassopia Tour', 'Adventure meets storytelling through digital design.', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', 'Branding', 'Travel, Adventure, Design'),
  ('Yenege Games', 'Playful creativity for Ethiopia''s gaming frontier.', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800', 'Gaming', 'Gaming, Creative, Digital'),
  ('Corno D''Africa', 'A visual identity for authentic African dining.', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 'Restaurant', 'Food, Branding, Identity'),
  ('Akrion Run Campaign', 'Building community spirit through visual storytelling.', 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800', 'Campaign', 'Event, Community, Marketing'),
  ('Teff & Bula Brand Identity', 'Organic identity for natural products inspired by Ethiopian roots.', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800', 'Branding', 'Organic, Natural, Identity')
ON CONFLICT DO NOTHING;

-- Insert default blog posts
INSERT INTO blog_posts (title, content, author, date, image, category) VALUES
  ('The Future of Digital Design', 'Digital design is evolving at an unprecedented pace. From AI-powered tools to immersive experiences, we explore what''s next in the creative industry.', 'Akrion Team', '2024-01-15', 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800', 'Design'),
  ('Building Brands That Matter', 'A brand is more than a logo. It''s a promise, a story, and an experience. Learn how we craft brands that resonate with audiences and drive results.', 'Akrion Team', '2024-01-10', 'https://images.unsplash.com/photo-1561070791-2526d2fc2a68?w=800', 'Branding')
ON CONFLICT DO NOTHING;

-- ============================================
-- 8. CREATE TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_portfolio_projects_updated_at ON portfolio_projects;
CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SETUP COMPLETE
-- ============================================
