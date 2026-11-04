// Small copies of the existing verified covers, hosted on the second owned
// service so recovery never needs a multi-megabyte original upload.
export const portfolioCoverBackupFiles = Object.freeze({
  'documentary-film-production': 'documentary-film-720.webp',
  'wedding-special-event-media': 'wedding-event-600.webp',
  'enen-tube-short-series': 'enen-tube-series-600.webp',
  'yenege-events-website': 'yenege-events-logo-480.webp',
  'liyu-melketa-expo': 'liyu-melketa-720.webp',
  'birhuminds-consultancy-training': 'birhuminds-consultancy-720.webp',
  'benedikta-foundation-brand-identity': 'benedikta-foundation-720.webp',
})

export const getPortfolioCoverBackup = (slug) => Object.hasOwn(portfolioCoverBackupFiles, slug)
  ? `https://gavhkkrnsuisqsjnnaow.supabase.co/storage/v1/object/public/images/portfolio/akrion-cover-${slug}-v1.webp`
  : undefined
