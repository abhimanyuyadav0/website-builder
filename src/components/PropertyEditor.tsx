import React, { useState, useEffect } from 'react';
import { useBuilderStore } from '../store/builderStore';
import { componentMetadata } from './ComponentRegistry';
import type { SectionConfig } from '../types/site';

interface PropertyEditorProps {
  pageId: string;
  sectionKey: string | null;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({ pageId, sectionKey }) => {
  const { config, setConfig, addToHistory } = useBuilderStore();
  const [propsJson, setPropsJson] = useState('');
  const [styleJson, setStyleJson] = useState('');
  const [error, setError] = useState<string | null>(null);

  const page = config.site.pages.find((p) => p.id === pageId);
  const section = page?.sections.find((s) => s.key === sectionKey || null);

  useEffect(() => {
    if (section) {
      setPropsJson(JSON.stringify(section.props || {}, null, 2));
      setStyleJson(JSON.stringify(section.style || {}, null, 2));
      setError(null);
    }
  }, [section]);

  const updateSection = (updater: (section: SectionConfig) => SectionConfig) => {
    if (!page || !section) return;

    const updatedPages = config.site.pages.map((p) => {
      if (p.id === pageId) {
        return {
          ...p,
          sections: p.sections.map((s) => (s.key === section.key ? updater(s) : s)),
        };
      }
      return p;
    });

    const newConfig = {
      ...config,
      site: { ...config.site, pages: updatedPages },
    };

    setConfig(newConfig);
    addToHistory(newConfig);
  };

  const handlePropsChange = (value: string) => {
    setPropsJson(value);
    setError(null);

    try {
      const parsed = value.trim() ? JSON.parse(value) : {};
      updateSection((s) => ({ ...s, props: parsed }));
    } catch (e) {
      setError('Invalid JSON');
    }
  };

  const handleStyleChange = (value: string) => {
    setStyleJson(value);
    setError(null);

    try {
      const parsed = value.trim() ? JSON.parse(value) : {};
      updateSection((s) => ({ ...s, style: parsed }));
    } catch (e) {
      setError('Invalid JSON');
    }
  };

  if (!section) {
    return (
      <div className="flex h-full items-center justify-center text-slate-500">
        Select a component to edit its properties
      </div>
    );
  }

  const metadata = componentMetadata[section.component];

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <h2 className="text-base font-semibold text-slate-900">Properties</h2>
        <p className="mt-1 text-xs text-slate-500">
          {metadata?.displayName || section.component}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Component
            </label>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {section.component}
            </div>
          </div>

          {metadata?.description && (
            <div>
              <p className="text-xs text-slate-500">{metadata.description}</p>
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Props (JSON)
            </label>
            <textarea
              value={propsJson}
              onChange={(e) => handlePropsChange(e.target.value)}
              onBlur={(e) => handlePropsChange(e.target.value)}
              className={`min-h-40 w-full rounded-lg border px-3 py-2 font-mono text-xs outline-none ${
                error ? 'border-red-300' : 'border-slate-200 focus:border-slate-400'
              }`}
              placeholder="{}"
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Style (JSON)
            </label>
            <textarea
              value={styleJson}
              onChange={(e) => handleStyleChange(e.target.value)}
              onBlur={(e) => handleStyleChange(e.target.value)}
              className={`min-h-32 w-full rounded-lg border px-3 py-2 font-mono text-xs outline-none ${
                error ? 'border-red-300' : 'border-slate-200 focus:border-slate-400'
              }`}
              placeholder="{}"
            />
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={() => {
                if (!page || !section) return;
                const updatedPages = config.site.pages.map((p) => {
                  if (p.id === pageId) {
                    return {
                      ...p,
                      sections: p.sections.filter((s) => s.key !== section.key),
                    };
                  }
                  return p;
                });
                const newConfig = {
                  ...config,
                  site: { ...config.site, pages: updatedPages },
                };
                setConfig(newConfig);
                addToHistory(newConfig);
              }}
              className="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              Delete Component
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyEditor;

