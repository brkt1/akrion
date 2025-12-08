# Admin User Setup Guide

## Admin Credentials

- **Email**: `Hailakemelaku1223@gmail.com`
- **Password**: `Open@1223`

## Method 1: Via Supabase Dashboard (Easiest)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Users**
4. Click **"Add user"** → **"Create new user"**
5. Fill in:
   - **Email**: `Hailakemelaku1223@gmail.com`
   - **Password**: `Open@1223`
   - **Auto Confirm User**: ✅ Yes (to skip email verification)
6. Click **"Create user"**

✅ Done! The admin user is now created and can log in.

## Method 2: Via Node.js Script

1. Get your **Service Role Key**:
   - Go to Supabase Dashboard → **Settings** → **API**
   - Copy the **"service_role"** key (⚠️ Keep it secret!)

2. Run the script:
   ```bash
   export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   node create-admin.js
   ```

3. The script will:
   - Check if user already exists
   - Create the admin user if it doesn't exist
   - Set email as confirmed (no verification needed)

## Method 3: Via Supabase Management API

```bash
curl -X POST 'https://api.supabase.com/v1/projects/{project_ref}/auth/users' \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "Hailakemelaku1223@gmail.com",
    "password": "Open@1223",
    "email_confirm": true,
    "user_metadata": {
      "role": "admin"
    }
  }'
```

Replace `{project_ref}` with your project reference ID.

## After Creating the User

1. **Test Login**:
   - Start your dev server: `npm run dev`
   - Click the **"Login"** button in the footer
   - Enter the credentials
   - You should be logged in and see your email in the footer

2. **Admin Mode**:
   - Once logged in, admin mode is automatically enabled
   - You'll see admin controls on Blog, Portfolio, and Services pages
   - You can create, edit, and delete content

3. **Logout**:
   - Click **"Logout"** in the footer to sign out
   - Admin mode will be disabled

## Troubleshooting

### "Invalid login credentials"
- Double-check the email and password
- Make sure the user was created successfully
- Verify email confirmation is enabled (Auto Confirm User)

### "Email not confirmed"
- In Supabase Dashboard → Authentication → Users
- Find the user and click "..." → "Send confirmation email"
- Or enable "Auto Confirm User" when creating the user

### User already exists
- You can reset the password in Supabase Dashboard
- Or use the Management API to update the user

## Security Notes

- The service_role key has full access - never expose it in client-side code
- For production, consider:
  - Using environment variables for sensitive keys
  - Implementing role-based access control (RBAC)
  - Adding 2FA for admin accounts
  - Restricting admin access by IP or domain

