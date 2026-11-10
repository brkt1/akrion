import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'
import { productionGallery } from '../src/data/productionPhotos.js'

// Re-encode existing artwork only. The original photos and logo are untouched.
const require = process.env.AKRION_IMAGE_MODULES
  ? createRequire(join(resolve(process.env.AKRION_IMAGE_MODULES), 'package.json'))
  : createRequire(import.meta.url)
const sharp = require('sharp')

await Promise.all(productionGallery.map((photo) =>
  sharp(`public${photo.src}`).resize({ width: 480, withoutEnlargement: true })
    .webp({ quality: 76, effort: 6 }).toFile(`public${photo.srcTiny}`),
))

const mark = 'src/assets/brand/akrion-mark-gold.png'
await sharp(mark).resize({ height: 240, withoutEnlargement: true })
  .webp({ lossless: true, effort: 6 }).toFile('src/assets/brand/akrion-mark-gold-240.webp')
await sharp(mark).resize({ width: 64, height: 64, fit: 'contain', background: '#0000' })
  .webp({ lossless: true, effort: 6 }).toFile('public/akrion-icon-64.webp')
