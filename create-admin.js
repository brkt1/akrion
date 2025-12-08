#!/usr/bin/env node

/**
 * Script to create admin user via Supabase Admin API
 * 
 * Usage:
 * 1. Get your service_role key from Supabase Dashboard → Settings → API
 * 2. Set it as environment variable: export SUPABASE_SERVICE_ROLE_KEY=your_key
 * 3. Run: node create-admin.js
 */

import { createClient } from '@supabase/supabase-js'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = 'https://umgztbsclpznwgdocgbh.supabase.co'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!serviceRoleKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is not set')
  console.log('\n📝 To get your service role key:')
  console.log('1. Go to Supabase Dashboard → Settings → API')
  console.log('2. Copy the "service_role" key (keep it secret!)')
  console.log('3. Run: export SUPABASE_SERVICE_ROLE_KEY=your_key')
  console.log('4. Then run this script again\n')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const adminEmail = 'Hailakemelaku1223@gmail.com'
const adminPassword = 'Open@1223'

console.log('🔐 Creating admin user...\n')
console.log(`Email: ${adminEmail}`)
console.log(`Password: ${adminPassword}\n`)

try {
  // Check if user already exists
  const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
  
  if (listError) {
    console.error('Error checking existing users:', listError.message)
  } else {
    const existingUser = existingUsers.users.find(u => u.email === adminEmail)
    if (existingUser) {
      console.log('⚠️  User already exists!')
      console.log(`   User ID: ${existingUser.id}`)
      console.log('   You can reset the password if needed.\n')
      process.exit(0)
    }
  }

  // Create the admin user
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true, // Skip email verification
    user_metadata: {
      role: 'admin',
      name: 'Admin User'
    }
  })

  if (error) {
    console.error('❌ Error creating user:', error.message)
    process.exit(1)
  }

  console.log('✅ Admin user created successfully!')
  console.log(`   User ID: ${data.user.id}`)
  console.log(`   Email: ${data.user.email}`)
  console.log('\n📝 The user can now log in through the Login button in the footer.')
  console.log('   Admin mode will be automatically enabled after login.\n')

} catch (error) {
  console.error('❌ Unexpected error:', error.message)
  process.exit(1)
}

