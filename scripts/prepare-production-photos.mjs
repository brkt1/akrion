import { createRequire } from 'node:module'
import { mkdir } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { productionGallery } from '../src/data/productionPhotos.js'

// Mechanical format conversion/resizing only. HEIC originals can first be
// losslessly decoded to PNG; source files are never modified or committed.
const sourceDirectory = process.argv[2]
const decodedDirectory = process.argv[3]
if (!sourceDirectory || !decodedDirectory) throw new Error('Pass the JPEG source directory and decoded HEIC PNG directory.')
const require = process.env.AKRION_IMAGE_MODULES
  ? createRequire(join(resolve(process.env.AKRION_IMAGE_MODULES), 'package.json'))
  : createRequire(import.meta.url)
const sharp = require('sharp')
const sourceNames = {
  'on-location': 'photo_8_2026-11-03_17-17-00.jpg',
  'interview-set': 'photo_6_2026-11-03_17-17-00.jpg',
  'interview-monitors': 'photo_5_2026-11-03_17-17-00.jpg',
  'production-kit': 'photo_7_2026-11-03_17-17-00.jpg',
  'warm-lighting': 'photo_9_2026-11-03_17-17-00.jpg',
  'scene-setup': 'IMG_0385.png',
  'scene-monitor': 'IMG_0235.png',
  'event-coverage': 'photo_4_2026-11-03_17-17-00.jpg',
  'ceremony-camera': 'photo_3_2026-11-03_17-17-00.jpg',
  'interview-closeup': 'photo_2_2026-11-03_17-17-00.jpg',
  'portrait-set': 'photo_1_2026-11-03_17-17-00.jpg',
}
await mkdir(resolve('public/images/production'), { recursive: true })
let totalBytes = 0
for (const photo of productionGallery) {
  const filename = sourceNames[photo.id]
  const source = join(filename.endsWith('.png') ? decodedDirectory : sourceDirectory, filename)
  for (const width of [720, 1200]) {
    const destination = resolve(`public/images/production/akrion-bts-${photo.id}-${width}.webp`)
    const info = await sharp(source).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 81, effort: 5 }).toFile(destination)
    totalBytes += info.size
    console.log(`${photo.id}: ${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB`)
    if (width === 1200 && (info.width !== photo.width || info.height !== photo.height)) throw new Error(`Registry dimensions do not match ${photo.id}.`)
  }
}
console.log(`Prepared ${productionGallery.length} real photos in two responsive sizes: ${(totalBytes / 1024 / 1024).toFixed(2)} MB total.`)
