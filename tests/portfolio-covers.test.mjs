import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { portfolioCoverBackupFiles, getPortfolioCoverBackup } from '../src/data/portfolioCoverBackups.js'

test('cover recovery uses small existing photos on the owned secondary host', async () => {
  let total = 0
  assert.equal(Object.keys(portfolioCoverBackupFiles).length, 7)
  for (const [slug, filename] of Object.entries(portfolioCoverBackupFiles)) {
    const file = await readFile(new URL(`../src/assets/portfolio/${filename}`, import.meta.url))
    assert.ok(file.length < 60 * 1024)
    total += file.length
    assert.match(getPortfolioCoverBackup(slug), /^https:\/\/gavhkkrnsuisqsjnnaow\.supabase\.co\/storage\/v1\/object\/public\/images\/portfolio\/akrion-cover-[a-z-]+-v1\.webp$/)
  }
  assert.ok(total < 300 * 1024)
  assert.equal(getPortfolioCoverBackup('unknown-custom-project'), undefined)
})
