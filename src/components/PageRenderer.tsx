import { useEffect } from 'react'
import layoutRegistry from './layout'
import sectionRegistry from './sections'
import type { GlobalConfig, PageConfig, SectionConfig } from '../types/site'

interface PageRendererProps {
  page: PageConfig
  global: GlobalConfig
}

const renderSection = (section: SectionConfig) => {
  const SectionComponent = sectionRegistry[section.component]

  if (!SectionComponent) {
    return (
      <section key={section.key} className="mx-auto max-w-3xl px-6 py-12 text-rose-600">
        Missing section component: <code>{section.component}</code>
      </section>
    )
  }

  const componentProps = {
    ...(section.props ?? {}),
    ...(section.style ? { style: section.style } : {}),
  }

  return <SectionComponent key={section.key} {...componentProps} />
}

const PageRenderer = ({ page, global }: PageRendererProps) => {
  const HeaderComponent = global.layout.header ? layoutRegistry[global.layout.header.component] : null
  const FooterComponent = global.layout.footer ? layoutRegistry[global.layout.footer.component] : null

  useEffect(() => {
    if (page.seo?.title) {
      document.title = page.seo.title
    }
  }, [page.seo?.title])

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {HeaderComponent ? (
        <HeaderComponent {...(global.layout.header?.props ?? {})} brand={global.brand} />
      ) : null}
      <main className="flex-1 pb-16 pt-12">{page.sections.map(renderSection)}</main>
      {FooterComponent ? (
        <FooterComponent {...(global.layout.footer?.props ?? {})} brand={global.brand} />
      ) : null}
    </div>
  )
}

export default PageRenderer

