import { create } from 'zustand';
import type { SiteConfig, SectionConfig } from '../types/site';

interface BuilderState {
  config: SiteConfig;
  selectedPageId: string | null;
  selectedSectionKey: string | null;
  history: SiteConfig[];
  historyIndex: number;
  clipboard: { section: SectionConfig; mode: 'copy' | 'cut' } | null;
  setConfig: (config: SiteConfig) => void;
  setSelectedPage: (pageId: string | null) => void;
  setSelectedSection: (sectionKey: string | null) => void;
  addToHistory: (config: SiteConfig) => void;
  undo: () => void;
  redo: () => void;
  setClipboard: (clipboard: { section: SectionConfig; mode: 'copy' | 'cut' } | null) => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  config: {
    site: {
      global: {
        brand: 'My Website',
        theme: 'light',
        layout: {},
      },
      pages: [],
    },
  },
  selectedPageId: null,
  selectedSectionKey: null,
  history: [],
  historyIndex: -1,
  clipboard: null,

  setConfig: (config) => set({ config }),
  
  setSelectedPage: (pageId) => set({ selectedPageId: pageId, selectedSectionKey: null }),
  
  setSelectedSection: (sectionKey) => set({ selectedSectionKey: sectionKey }),
  
  addToHistory: (config) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(config);
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      config,
    });
  },
  
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        historyIndex: newIndex,
        config: history[newIndex],
      });
    }
  },
  
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        historyIndex: newIndex,
        config: history[newIndex],
      });
    }
  },
  
  setClipboard: (clipboard) => set({ clipboard }),
}));

