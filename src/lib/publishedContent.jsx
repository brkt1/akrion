import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const PublishedContent = createContext({ sections: {}, settings: {} })

export const PublishedContentProvider = ({ children }) => {
  const [content, setContent] = useState({ sections: {}, settings: {} })
  useEffect(() => {
    if (!supabase) return undefined
    let mounted = true
    const load = async () => {
      const [pages, settings] = await Promise.all([
        supabase.from('published_page_sections').select('page_key,section_key,content'),
        supabase.from('published_site_settings').select('setting_key,value'),
      ])
      if (!mounted) return
      setContent((current) => ({
        sections: pages.error ? current.sections : Object.fromEntries((pages.data || []).map((row) => [`${row.page_key}.${row.section_key}`, row.content])),
        settings: settings.error ? current.settings : Object.fromEntries((settings.data || []).map((row) => [row.setting_key, row.value?.value ?? ''])),
      }))
    }
    load().catch(() => {})
    const refresh = () => { if (document.visibilityState === 'visible') load().catch(() => {}) }
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      mounted = false
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])
  return <PublishedContent.Provider value={content}>{children}</PublishedContent.Provider>
}

export const usePublishedSection = (page, section) => useContext(PublishedContent).sections[`${page}.${section}`] || {}
export const useSiteSettings = () => useContext(PublishedContent).settings

export const useContactSettings = (defaults) => {
  const settings = useSiteSettings()
  const phone = settings['WhatsApp number'] || defaults.phone
  const telegramHandle = settings['Telegram handle'] || defaults.telegramHandle
  return {
    ...defaults,
    phone,
    whatsapp: String(phone).replace(/\D/g, '') || defaults.whatsapp,
    email: settings['Email address'] || defaults.email,
    location: settings['Location text'] || defaults.location,
    ceo: settings['CEO name'] || defaults.ceo,
    telegramHandle,
    telegramUrl: telegramHandle ? `https://t.me/${String(telegramHandle).replace(/^@/, '').replace(/[^a-zA-Z0-9_]/g, '')}` : defaults.telegramUrl,
  }
}

// Published content is plain text. Destinations may only use ordinary web,
// contact, or site routes, never executable URL schemes.
export const safeContentUrl = (value, fallback = '') => {
  const url = String(value || '').trim()
  if (/^\/(?!\/)/.test(url) || /^https?:\/\//i.test(url) || /^(mailto:|tel:)/i.test(url)) return url
  return fallback
}
