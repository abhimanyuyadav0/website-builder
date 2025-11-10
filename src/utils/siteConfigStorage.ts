import siteConfig from '../config/site'
import type { SiteConfig } from '../types/site'

export const SITE_CONFIG_STORAGE_KEY = 'site-builder-config'

export const loadStoredConfig = (): SiteConfig => {
  if (typeof window === 'undefined') {
    return siteConfig
  }

  try {
    const raw = window.localStorage.getItem(SITE_CONFIG_STORAGE_KEY)
    if (!raw) {
      return siteConfig
    }

    const parsed = JSON.parse(raw)
    return parsed as SiteConfig
  } catch (error) {
    console.error('Failed to load site config from storage. Falling back to default config.', error)
    return siteConfig
  }
}

export const saveConfigToStorage = (config: SiteConfig) => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(config))
    window.dispatchEvent(new Event('site-config-updated'))
  } catch (error) {
    console.error('Failed to save site config to storage.', error)
  }
}

