# Supabase Storage Setup Guide

This guide will help you set up Supabase Storage for file uploads in the admin panel.

## Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Name it: `images`
5. Set it to **Public** (so uploaded images can be accessed via URL)
6. Click **Create bucket**

## Step 2: Set Up Storage Policies

After creating the bucket, you need to set up policies for file access:

### Policy 1: Public Read Access

1. Go to **Storage** → **Policies** → Select `images` bucket
2. Click **New Policy**
3. Choose **For full customization**
4. Policy name: `Public read access`
5. Allowed operation: `SELECT`
6. Policy definition:
   ```sql
   (bucket_id = 'images')
   ```
7. Click **Review** and **Save policy**

### Policy 2: Public Upload Access (for demo)

For production, you should restrict uploads to authenticated users only. For now, we'll allow public uploads:

1. Click **New Policy**
2. Choose **For full customization**
3. Policy name: `Public upload access`
4. Allowed operation: `INSERT`
5. Policy definition:
   ```sql
   (bucket_id = 'images')
   ```
6. Click **Review** and **Save policy**

### Policy 3: Public Update Access

1. Click **New Policy**
2. Choose **For full customization**
3. Policy name: `Public update access`
4. Allowed operation: `UPDATE`
5. Policy definition:
   ```sql
   (bucket_id = 'images')
   ```
6. Click **Review** and **Save policy**

### Policy 4: Public Delete Access

1. Click **New Policy**
2. Choose **For full customization**
3. Policy name: `Public delete access`
4. Allowed operation: `DELETE`
5. Policy definition:
   ```sql
   (bucket_id = 'images')
   ```
6. Click **Review** and **Save policy**

## Step 3: Test File Upload

1. Start your development server: `npm run dev`
2. Navigate to Blog, Portfolio, or Services page
3. Enter Admin Mode
4. Click "New Post" or "New Project"
5. Try uploading an image file
6. Verify the image appears in the preview

## File Upload Features

- **Supported formats**: All image formats (JPEG, PNG, GIF, WebP, etc.)
- **Max file size**: 5MB (configurable in code)
- **Storage structure**: 
  - Blog images: `images/blog/`
  - Portfolio images: `images/portfolio/`
- **Image preview**: Shows preview after upload
- **Fallback**: Can still use image URLs if preferred

## Production Security

For production, you should:

1. **Restrict uploads to authenticated users only**
   - Change INSERT policy to require authentication
   - Add user authentication to your app

2. **Add file validation**
   - Already implemented: file type and size validation
   - Consider adding virus scanning

3. **Set up CDN**
   - Use Supabase CDN for faster image delivery
   - Configure cache headers

4. **Monitor storage usage**
   - Set up alerts for storage limits
   - Implement cleanup policies for old files

## Troubleshooting

- **Error: "Bucket not found"** - Make sure you created the `images` bucket
- **Error: "Permission denied"** - Check that policies are set up correctly
- **Images not displaying** - Verify bucket is set to Public
- **Upload fails** - Check file size (max 5MB) and file type (images only)

