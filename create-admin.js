#!/usr/bin/env node

/**
 * Creates (or promotes) a Supabase Auth administrator from environment values.
 * No credentials or service keys belong in this repository.
 *
 * Required environment variables:
 *   SUPABASE_URL
 *   SUPABASE_SECRET_KEY (or the legacy SUPABASE_SERVICE_ROLE_KEY)
 *   ADMIN_EMAIL
 *   ADMIN_PASSWORD
 *
 * Run only from a trusted local/server environment. Never expose the service
 * role key through a VITE_* variable or client-side bundle.
 */

import { createClient } from '@supabase/supabase-js'

const requiredEnvironment = [
  'SUPABASE_URL',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
]

const missingEnvironment = requiredEnvironment.filter((name) => !process.env[name]?.trim())
const adminApiKey = process.env.SUPABASE_SECRET_KEY?.trim()
  || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

if (!adminApiKey) missingEnvironment.push('SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY)')

if (missingEnvironment.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvironment.join(', ')}`)
  console.error('See ADMIN-SETUP.md and .env.example for safe setup instructions.')
  process.exit(1)
}

const supabaseUrl = process.env.SUPABASE_URL.trim()
const adminEmail = process.env.ADMIN_EMAIL.trim().toLowerCase()
const adminPassword = process.env.ADMIN_PASSWORD

try {
  const parsedUrl = new URL(supabaseUrl)
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('Unsupported protocol')
} catch {
  console.error('SUPABASE_URL must be a valid HTTP(S) URL.')
  process.exit(1)
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
  console.error('ADMIN_EMAIL must be a valid email address.')
  process.exit(1)
}

if (adminPassword.length < 16) {
  console.error('ADMIN_PASSWORD must contain at least 16 characters.')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, adminApiKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
})

const findUserByEmail = async (email) => {
  for (let page = 1; page <= 100; page += 1) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 100 })
    if (error) throw error

    const match = data.users.find((user) => user.email?.toLowerCase() === email)
    if (match) return match
    if (data.users.length < 100) return null
  }

  throw new Error('Admin lookup exceeded the safe pagination limit.')
}

try {
  const existingUser = await findUserByEmail(adminEmail)

  if (existingUser) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
      password: adminPassword,
      app_metadata: {
        ...(existingUser.app_metadata || {}),
        role: 'admin',
      },
    })

    if (error) throw error
    console.log(`Admin password and authorization updated for ${adminEmail}.`)
  } else {
    const { error } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      app_metadata: { role: 'admin' },
    })

    if (error) throw error
    console.log(`Admin user created for ${adminEmail}.`)
  }

  console.log('Sign out and back in before opening /admin so the JWT contains the new role.')
} catch (error) {
  console.error(`Unable to configure the administrator: ${error.message}`)
  process.exit(1)
}
