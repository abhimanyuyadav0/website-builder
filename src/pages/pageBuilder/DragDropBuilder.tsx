import React, { useState, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import { useBuilderStore } from '../../store/builderStore';
import ComponentPalette from '../../components/ComponentPalette';
import BuilderCanvas from '../../components/BuilderCanvas';
import PropertyEditor from '../../components/PropertyEditor';
import PageRenderer from '../../components/PageRenderer';
import { saveConfigToStorage, loadStoredConfig } from '../../utils/siteConfigStorage';
import type { SiteConfig } from '../../types/site';

interface DragDropBuilderProps {
  initialConfig?: SiteConfig;
}

const PREVIEW_DEVICES = [
  { id: 'mobile', label: 'Mobile', width: 375, height: 812 },
  { id: 'tablet', label: 'Tablet', width: 768, height: 1024 },
  { id: 'desktop', label: 'Desktop', width: 1280, height: 800 },
] as const;

type PreviewDeviceId = (typeof PREVIEW_DEVICES)[number]['id'];

const DragDropBuilder: React.FC<DragDropBuilderProps> = ({ initialConfig }) => {
  const {
    config,
    selectedPageId,
    selectedSectionKey,
    setConfig,
    setSelectedPage,
    setSelectedSection,
    addToHistory,
    undo,
    redo,
    history,
    historyIndex,
  } = useBuilderStore();

  const [viewMode, setViewMode] = useState<'builder' | 'preview'>('builder');
  const [previewDeviceId, setPreviewDeviceId] = useState<PreviewDeviceId>('desktop');
  const [previewScale, setPreviewScale] = useState(1);
  const previewContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
      addToHistory(initialConfig);
      if (initialConfig.site.pages.length > 0) {
        setSelectedPage(initialConfig.site.pages[0].id);
      }
    } else {
      const stored = loadStoredConfig();
      if (stored.site.pages.length > 0) {
        setConfig(stored);
        addToHistory(stored);
        setSelectedPage(stored.site.pages[0].id);
      }
    }
  }, [initialConfig, setConfig, addToHistory, setSelectedPage]);

  useEffect(() => {
    const updateScale = () => {
      const container = previewContainerRef.current;
      if (!container) {
        setPreviewScale(1);
        return;
      }
      const availableWidth = container.clientWidth;
      if (availableWidth === 0) {
        setPreviewScale(1);
        return;
      }
      const device = PREVIEW_DEVICES.find((d) => d.id === previewDeviceId);
      if (device) {
        const scale = Math.min(1, availableWidth / device.width);
        setPreviewScale(scale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [previewDeviceId]);

  const selectedPage = selectedPageId
    ? config.site.pages.find((p) => p.id === selectedPageId)
    : null;

  const previewDevice = PREVIEW_DEVICES.find((d) => d.id === previewDeviceId) || PREVIEW_DEVICES[2];

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleSave = () => {
    saveConfigToStorage(config);
    alert('Configuration saved!');
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `site-config-${new Date().toISOString().split('T')[0]}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleAddPage = () => {
    const newPage = {
      id: `page-${Date.now()}`,
      name: `Page ${config.site.pages.length + 1}`,
      path: `/page-${config.site.pages.length + 1}`,
      layout: 'default',
      seo: { title: '', description: '' },
      sections: [],
      metadata: { createdAt: new Date().toISOString() },
    };

    const newConfig = {
      ...config,
      site: {
        ...config.site,
        pages: [...config.site.pages, newPage],
      },
    };

    setConfig(newConfig);
    addToHistory(newConfig);
    setSelectedPage(newPage.id);
  };

  if (viewMode === 'preview' && selectedPage) {
    return (
      <div className="flex h-screen flex-col bg-slate-100">
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Preview Mode</h1>
              <p className="text-xs text-slate-500">Live preview of your page</p>
            </div>
            <div className="flex items-center gap-2">
              {PREVIEW_DEVICES.map((device) => {
                const isActive = device.id === previewDeviceId;
                return (
                  <button
                    key={device.id}
                    onClick={() => setPreviewDeviceId(device.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'border border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {device.label}
                  </button>
                );
              })}
              <button
                onClick={() => setViewMode('builder')}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-300"
              >
                Back to Builder
              </button>
            </div>
          </div>
        </div>
        <div ref={previewContainerRef} className="flex-1 overflow-auto p-6">
          <div className="mx-auto flex w-full max-w-full justify-center">
            <div
              className="relative"
              style={{
                width: previewDevice.width * previewScale,
                height: previewDevice.height * previewScale,
              }}
            >
              <div
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
                style={{
                  width: previewDevice.width,
                  height: previewDevice.height,
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top left',
                }}
              >
                <PageRenderer page={selectedPage} global={config.site.global} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndContext>
      <div className="flex h-screen flex-col bg-slate-100">
        {/* Toolbar */}
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Website Builder</h1>
              <p className="text-xs text-slate-500">
                Drag and drop Glintly-UI components to build your site
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Undo
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Redo
              </button>
              <div className="h-6 w-px bg-slate-200" />
              <button
                onClick={handleSave}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-300"
              >
                Save
              </button>
              <button
                onClick={handleExportJSON}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-300"
              >
                Export JSON
              </button>
              {selectedPage && (
                <button
                  onClick={async () => {
                    const { exportReactCode } = await import('../../utils/exportCode');
                    const reactCode = exportReactCode(config);
                    const blob = new Blob([reactCode], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const anchor = document.createElement('a');
                    anchor.href = url;
                    anchor.download = `site-${selectedPage.name.replace(/\s+/g, '-')}-${Date.now()}.tsx`;
                    anchor.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-300"
                >
                  Export React
                </button>
              )}
              <button
                onClick={() => setViewMode('preview')}
                disabled={!selectedPage}
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Pages Sidebar */}
        <div className="flex h-[calc(100vh-73px)]">
          <div className="w-64 border-r border-slate-200 bg-white">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Pages</h2>
                <button
                  onClick={handleAddPage}
                  className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:border-slate-300"
                >
                  + Add
                </button>
              </div>
            </div>
            <div className="overflow-y-auto p-2">
              {config.site.pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(page.id)}
                  className={`mb-2 w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                    selectedPageId === page.id
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold">{page.name}</div>
                  <div className="text-xs opacity-75">{page.path}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Component Palette */}
          <div className="w-64 border-r border-slate-200">
            <ComponentPalette />
          </div>

          {/* Canvas */}
          <div className="flex-1">
            {selectedPageId ? (
              <BuilderCanvas
                pageId={selectedPageId}
                onSectionSelect={setSelectedSection}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500">
                Select or create a page to start building
              </div>
            )}
          </div>

          {/* Property Editor */}
          <div className="w-80 border-l border-slate-200">
            {selectedPageId && selectedSectionKey ? (
              <PropertyEditor pageId={selectedPageId} sectionKey={selectedSectionKey} />
            ) : (
              <div className="flex h-full items-center justify-center bg-white text-slate-500">
                Select a component to edit properties
              </div>
            )}
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default DragDropBuilder;

