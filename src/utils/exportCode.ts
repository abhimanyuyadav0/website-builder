import type { SiteConfig, PageConfig, SectionConfig } from '../types/site';
import { componentMetadata } from '../components/ComponentRegistry';

export const exportReactCode = (config: SiteConfig): string => {
  const pages = config.site.pages;
  
  const imports = `import React from 'react';
import { ThemeProvider } from 'glintly-ui';
import {
  ${Object.keys(componentMetadata).join(',\n  ')}
} from 'glintly-ui';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
`;

  const renderComponent = (section: SectionConfig, indent: string = ''): string => {
    const Component = section.component;
    const props = section.props || {};
    const style = section.style || {};
    
    const propsString = Object.entries({ ...props, ...(Object.keys(style).length > 0 ? { style } : {}) })
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value}"`;
        }
        if (typeof value === 'boolean') {
          return value ? key : '';
        }
        if (typeof value === 'object') {
          return `${key}={${JSON.stringify(value)}}`;
        }
        return `${key}={${JSON.stringify(value)}}`;
      })
      .filter(Boolean)
      .join(' ');

    return `${indent}<${Component}${propsString ? ' ' + propsString : ''} />`;
  };

  const renderPage = (page: PageConfig): string => {
    const sections = page.sections.map((section) => renderComponent(section, '      ')).join('\n');
    
    return `  const ${page.name.replace(/\s+/g, '')}Page = () => {
    return (
      <div className="min-h-screen">
${sections}
      </div>
    );
  };`;
  };

  const pagesCode = pages.map(renderPage).join('\n\n');

  const appCode = `const App = () => {
  return (
    <ThemeProvider theme="${config.site.global.theme}">
      <Router>
        <Routes>
${pages.map((page) => `          <Route path="${page.path}" element={<${page.name.replace(/\s+/g, '')}Page />} />`).join('\n')}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;`;

  return `${imports}

${pagesCode}

${appCode}`;
};

export const exportHTML = (config: SiteConfig, pageId: string): string => {
  const page = config.site.pages.find((p) => p.id === pageId);
  if (!page) return '';

  const sections = page.sections.map((section) => {
    const Component = section.component;
    const props = section.props || {};
    const style = section.style || {};

    // Convert to HTML (simplified - would need more sophisticated conversion)
    const styleString = Object.entries(style)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
      .join('; ');

    return `<div class="${Component.toLowerCase()}"${styleString ? ` style="${styleString}"` : ''}>
  <!-- ${Component} component -->
  ${JSON.stringify(props)}
</div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.seo?.title || page.name}</title>
  <meta name="description" content="${page.seo?.description || ''}">
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2/dist/tailwind.min.css" rel="stylesheet">
</head>
<body>
  <div class="min-h-screen bg-slate-50">
${sections.split('\n').map((line) => `    ${line}`).join('\n')}
  </div>
</body>
</html>`;
};

