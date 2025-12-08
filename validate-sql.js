#!/usr/bin/env node

/**
 * Simple SQL Migration Validator
 * Checks for common SQL syntax issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlFile = path.join(__dirname, 'supabase-migrations.sql');

console.log('🔍 Validating SQL Migration File...\n');

try {
  const sql = fs.readFileSync(sqlFile, 'utf8');
  
  const checks = [
    {
      name: 'File exists and is readable',
      test: () => sql.length > 0,
      error: 'SQL file is empty or cannot be read'
    },
    {
      name: 'Contains table creation statements',
      test: () => sql.includes('CREATE TABLE'),
      error: 'Missing CREATE TABLE statements'
    },
    {
      name: 'Uses IF NOT EXISTS for tables',
      test: () => sql.includes('CREATE TABLE IF NOT EXISTS'),
      error: 'Tables should use IF NOT EXISTS to be idempotent'
    },
    {
      name: 'Contains RLS policies',
      test: () => sql.includes('CREATE POLICY'),
      error: 'Missing RLS policy creation'
    },
    {
      name: 'Uses DROP POLICY IF EXISTS',
      test: () => sql.includes('DROP POLICY IF EXISTS'),
      error: 'Should use DROP POLICY IF EXISTS for idempotency'
    },
    {
      name: 'Contains storage policies',
      test: () => sql.includes('storage.objects'),
      error: 'Missing storage policies'
    },
    {
      name: 'Contains trigger function',
      test: () => sql.includes('update_updated_at_column'),
      error: 'Missing trigger function'
    },
    {
      name: 'Contains default data inserts',
      test: () => sql.includes('INSERT INTO'),
      error: 'Missing default data inserts'
    },
    {
      name: 'Uses ON CONFLICT for inserts',
      test: () => sql.includes('ON CONFLICT DO NOTHING'),
      error: 'Should use ON CONFLICT DO NOTHING for idempotent inserts'
    },
    {
      name: 'No storage extension reference',
      test: () => !sql.includes('CREATE EXTENSION') || !sql.includes('"storage"'),
      error: 'Should not try to create storage extension (it does not exist)'
    }
  ];

  let passed = 0;
  let failed = 0;

  checks.forEach(check => {
    try {
      if (check.test()) {
        console.log(`✅ ${check.name}`);
        passed++;
      } else {
        console.log(`❌ ${check.name}`);
        console.log(`   ${check.error}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${check.name}`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

  if (failed === 0) {
    console.log('✅ SQL migration file looks good!');
    console.log('\n📝 Next steps:');
    console.log('1. Copy the contents of supabase-migrations.sql');
    console.log('2. Go to Supabase Dashboard → SQL Editor');
    console.log('3. Paste and run the SQL');
    console.log('4. Create the storage bucket manually (see TESTING-GUIDE.md)');
    process.exit(0);
  } else {
    console.log('⚠️  Some checks failed. Please review the SQL file.');
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Error reading SQL file:', error.message);
  process.exit(1);
}

