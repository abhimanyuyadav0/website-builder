import React, { useEffect } from 'react';
import { ThemeProvider } from 'glintly-ui';
import { renderComponent } from './ComponentRegistry';
import type { GlobalConfig, PageConfig } from '../types/site';

interface PageRendererProps {
  page: PageConfig;
  global: GlobalConfig;
}

const PageRenderer: React.FC<PageRendererProps> = ({ page }) => {
  useEffect(() => {
    if (page.seo?.title) {
      document.title = page.seo.title;
    }
  }, [page.seo?.title]);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <main className="flex-1 pb-16 pt-12">
          {page.sections.map((section) => (
            <div key={section.key}>
              {renderComponent(section)}
            </div>
          ))}
          {page.path === '/' && (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: '#f8fafc', marginTop: '48px' }}>
              <h2 style={{ marginBottom: '16px', fontSize: '1.5rem', fontWeight: 600 }}>
                Ready to build your own site?
              </h2>
              <p style={{ marginBottom: '24px', color: '#64748b' }}>
                Use our drag-and-drop builder to create beautiful pages with Glintly-UI components
              </p>
              <a
                href="/page-builder"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  background: '#0f172a',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: 500,
                }}
              >
                Open Website Builder →
              </a>
            </div>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
};

export default PageRenderer;
