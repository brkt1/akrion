import { useEffect } from 'react'

const upsertMeta = (selector, attributes, content) => {
  let element = document.head.querySelector(selector)
  const created = !element

  if (!element) {
    element = document.createElement('meta')
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value))
    document.head.appendChild(element)
  }

  const previousContent = element.getAttribute('content')
  element.setAttribute('content', content)

  return () => {
    if (created) element.remove()
    else if (previousContent == null) element.removeAttribute('content')
    else element.setAttribute('content', previousContent)
  }
}

const upsertCanonical = (href) => {
  let element = document.head.querySelector('link[rel="canonical"]')
  const created = !element

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }

  const previousHref = element.getAttribute('href')
  element.setAttribute('href', href)

  return () => {
    if (created) element.remove()
    else if (previousHref == null) element.removeAttribute('href')
    else element.setAttribute('href', previousHref)
  }
}

const serializeStructuredData = (value) => {
  if (value == null) return ''

  try {
    const serialized = JSON.stringify(value)
    return typeof serialized === 'string' ? serialized.replace(/</g, '\\u003c') : ''
  } catch {
    return ''
  }
}

const upsertStructuredData = (content) => {
  let element = document.head.querySelector(
    'script[type="application/ld+json"][data-page-meta]',
  )
  const created = !element

  if (!element) {
    element = document.createElement('script')
    element.setAttribute('type', 'application/ld+json')
    element.setAttribute('data-page-meta', '')
    document.head.appendChild(element)
  }

  const previousContent = element.textContent
  element.textContent = content

  return () => {
    if (created) element.remove()
    else element.textContent = previousContent
  }
}

const toAbsoluteUrl = (value) => {
  if (!value) return ''
  try {
    return new URL(value, window.location.origin).href
  } catch {
    return value
  }
}

const PageMeta = ({
  title,
  description = '',
  image = '',
  imageAlt = '',
  path = window.location.pathname,
  type = 'website',
  noIndex = false,
  structuredData = null,
}) => {
  useEffect(() => {
    const previousTitle = document.title
    const pageUrl = toAbsoluteUrl(path)
    const imageUrl = toAbsoluteUrl(image)
    const cleanDescription = description.trim()
    const serializedStructuredData = serializeStructuredData(structuredData)
    const cleanups = [
      upsertCanonical(pageUrl),
      upsertMeta('meta[property="og:title"]', { property: 'og:title' }, title),
      upsertMeta('meta[property="og:type"]', { property: 'og:type' }, type),
      upsertMeta('meta[property="og:url"]', { property: 'og:url' }, pageUrl),
      upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, imageUrl ? 'summary_large_image' : 'summary'),
      upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, title),
    ]

    document.title = title

    if (cleanDescription) {
      cleanups.push(
        upsertMeta('meta[name="description"]', { name: 'description' }, cleanDescription),
        upsertMeta('meta[property="og:description"]', { property: 'og:description' }, cleanDescription),
        upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, cleanDescription),
      )
    }

    if (imageUrl) {
      cleanups.push(
        upsertMeta('meta[property="og:image"]', { property: 'og:image' }, imageUrl),
        upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, imageUrl),
      )

      if (imageAlt.trim()) {
        cleanups.push(
          upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt' }, imageAlt.trim()),
          upsertMeta('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt' }, imageAlt.trim()),
        )
      }
    }

    if (noIndex) {
      cleanups.push(upsertMeta('meta[name="robots"]', { name: 'robots' }, 'noindex, nofollow'))
    }

    if (serializedStructuredData) {
      cleanups.push(upsertStructuredData(serializedStructuredData))
    }

    return () => {
      document.title = previousTitle
      cleanups.reverse().forEach((cleanup) => cleanup())
    }
  }, [description, image, imageAlt, noIndex, path, structuredData, title, type])

  return null
}

export default PageMeta
