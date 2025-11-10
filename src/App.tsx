import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PageRenderer from './components/PageRenderer'
import PageBuilder from './pages/pageBuilder'
import siteConfig from './config/site'
import type { PageConfig, SiteConfig } from './types/site'
import { loadStoredConfig } from './utils/siteConfigStorage'

const flattenPages = (pages: PageConfig[], parentPath = ''): Array<{ page: PageConfig; path: string }> => {
  return pages.flatMap((page) => {
    const path = normalizePath(parentPath, page.path)
    const current = { page, path }
    const children = page.children ? flattenPages(page.children, path) : []
    return [current, ...children]
  })
}

const normalizePath = (parentPath: string, childPath: string) => {
  if (childPath.startsWith('/')) {
    return childPath
  }

  const base = parentPath === '/' ? '' : parentPath
  return `${base}/${childPath}`.replace(/\/{2,}/g, '/')
}

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-6 text-center text-white">
    <h1 className="text-4xl font-semibold">Page not found</h1>
    <p className="mt-4 text-sm text-slate-300">This route is not defined in the site configuration.</p>
  </div>
)

function App() {
  const [config, setConfig] = useState<SiteConfig>(() => {
    if (typeof window === 'undefined') {
      return siteConfig
    }
    return loadStoredConfig()
  })

  useEffect(() => {
    const syncConfig = () => {
      setConfig(loadStoredConfig())
    }

    syncConfig()
    window.addEventListener('site-config-updated', syncConfig)
    return () => window.removeEventListener('site-config-updated', syncConfig)
  }, [])

  const pagesWithPaths = useMemo(() => flattenPages(config.site.pages), [config])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/page-builder" element={<PageBuilder initialConfig={config} />} />
        {pagesWithPaths.map(({ page, path }) => (
          <Route
            key={page.id}
            path={path}
            element={<PageRenderer page={page} global={config.site.global} />}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
