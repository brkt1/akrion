import benediktaLarge from '../assets/portfolio/benedikta-foundation-1200.webp'
import benediktaSmall from '../assets/portfolio/benedikta-foundation-720.webp'
import yenegeLarge from '../assets/portfolio/yenege-events-logo-720.webp'
import yenegeSmall from '../assets/portfolio/yenege-events-logo-480.webp'
import { productionPhotos } from './productionPhotos'

// Existing verified project assets for design services; actual BTS photos for
// production. Do not present a camera photograph as a website screenshot.
export const agencyServiceVisuals = {
  brand: { small: benediktaSmall, large: benediktaLarge, width: 1200, height: 900, smallWidth: 720, largeWidth: 1200, position: 'center top', alt: 'Benedikta Foundation identity applications created by Akrion, including stationery, a mug and a tote bag' },
  web: { small: yenegeSmall, large: yenegeLarge, width: 720, height: 992, smallWidth: 480, largeWidth: 720, position: 'center', fit: 'contain', alt: 'Yenege Events identity from Akrion’s website-development portfolio' },
  video: productionPhotos.interviewMonitors,
  social: productionPhotos.interviewSet,
  consulting: productionPhotos.sceneSetup,
}
