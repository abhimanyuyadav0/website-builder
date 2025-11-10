import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PageRenderer from "../../components/PageRenderer";
import type { PageConfig, SectionConfig, SiteConfig } from "../../types/site";
import {
  loadStoredConfig,
  saveConfigToStorage,
} from "../../utils/siteConfigStorage";

type SortOption =
  | "name-asc"
  | "name-desc"
  | "created-newest"
  | "created-oldest";

interface PageBuilderProps {
  initialConfig?: SiteConfig;
}

interface SectionPreset {
  label: string;
  description: string;
  component: SectionConfig["component"];
  props?: SectionConfig["props"];
  style?: SectionConfig["style"];
}

const PREVIEW_DEVICES = [
  { id: "mobile", label: "Mobile", width: 375, height: 812 },
  { id: "tablet", label: "Tablet", width: 768, height: 1024 },
  { id: "laptop", label: "Laptop", width: 1280, height: 800 },
  { id: "desktop", label: "Desktop", width: 1470, height: 956 },
] as const;

type PreviewDeviceId = (typeof PREVIEW_DEVICES)[number]["id"];

const sectionPresets: SectionPreset[] = [
  {
    label: "Hero Banner",
    description:
      "Bold hero section with headline, subheading and optional media.",
    component: "HeroBanner",
    props: {
      heading: "Build and iterate without compromise",
      subheading: "Compose a performant marketing site in minutes, not weeks.",
      cta: {
        label: "Get Started",
        href: "/contact",
      },
      media: {
        type: "image",
        src: "/assets/hero.jpg",
        alt: "Hero image",
      },
    },
    style: {
      background: "#F4F6FB",
      padding: { top: 96, bottom: 96 },
    },
  },
  {
    label: "Feature Grid",
    description: "Grid of feature cards ideal for describing product benefits.",
    component: "FeatureGrid",
    props: {
      title: "Why teams rely on Acme",
      items: [
        {
          icon: "Rocket",
          title: "Launch quickly",
          body: "Ship landing pages in days.",
        },
        {
          icon: "Sparkles",
          title: "Stay flexible",
          body: "Swap sections without rewrites.",
        },
        {
          icon: "Shield",
          title: "Enterprise ready",
          body: "Security and governance built-in.",
        },
      ],
    },
  },
  {
    label: "Stats Grid",
    description: "Highlights a set of key metrics in a card layout.",
    component: "StatsGrid",
    props: {
      eyebrow: "Results",
      title: "Metrics that matter",
      description: "Demonstrate the compounded impact of your team.",
      items: [
        {
          label: "Time to publish",
          value: "45 min",
          description: "Average from brief to go-live",
        },
        {
          label: "Conversion lift",
          value: "31%",
          description: "Average uplift after rollout",
        },
        {
          label: "Team adoption",
          value: "92%",
          description: "Product & marketing collaboration",
        },
        {
          label: "NPS",
          value: "64",
          description: "Customer satisfaction score",
        },
      ],
    },
  },
  {
    label: "Testimonials",
    description: "Showcase quotes from customers and advocates.",
    component: "TestimonialList",
    props: {
      title: "Trusted by product-led teams",
      description: "Hear what our customers say about building with Acme.",
      testimonials: [
        {
          quote: "The builder is our single source of truth for every launch.",
          author: "Maya Chen",
          role: "VP Marketing, Fluxo",
        },
        {
          quote: "Our experiments ship 4x faster with reusable sections.",
          author: "Luis Ramirez",
          role: "Growth Lead, Altitude",
        },
        {
          quote: "We iterate in hours and keep brand fidelity intact.",
          author: "Hannah Singh",
          role: "Design Director, Northwind",
        },
      ],
    },
  },
  {
    label: "Call to Action Buttons",
    description: "Group of buttons with configurable alignment.",
    component: "ButtonGroup",
    props: {
      title: "Pick your next action",
      subtitle: "Guide visitors to the outcomes that matter.",
      alignment: "center",
      buttons: [
        {
          label: "Start trial",
          href: "/pricing",
          variant: "primary",
          size: "lg",
        },
        {
          label: "Talk to sales",
          href: "/contact",
          variant: "secondary",
          size: "lg",
        },
      ],
    },
  },
  {
    label: "Rich Text",
    description: "Flexible content block where you can paste HTML.",
    component: "RichText",
    props: {
      content:
        "<h2>Custom content</h2><p>Drop in prose or embed components using HTML.</p>",
    },
  },
];

const clone = <T,>(value: T): T => {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
};

const createEmptyPage = (count: number): PageConfig => {
  const id = crypto.randomUUID ? crypto.randomUUID() : `page-${Date.now()}`;
  return {
    id,
    name: `Untitled page ${count + 1}`,
    path: `/page-${count + 1}`,
    layout: "default",
    seo: {
      title: "",
      description: "",
    },
    sections: [],
    metadata: {
      createdAt: new Date().toISOString(),
    },
  };
};

// const PANEL_OPTIONS = [
//   { label: "Pages", value: "pages" },
//   { label: "Sections", value: "sections" },
//   { label: "Global", value: "global" },
// ] as const;

type PanelOption = "pages" | "sections" | "global";

const PageBuilder = ({ initialConfig }: PageBuilderProps) => {
  const resolvedInitialConfig = useMemo(
    () => initialConfig ?? loadStoredConfig(),
    [initialConfig]
  );
  const [config, setConfig] = useState<SiteConfig>(resolvedInitialConfig);
  const [history, setHistory] = useState<SiteConfig[]>(() => [
    clone(resolvedInitialConfig),
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [pageSearch, setPageSearch] = useState("");
  const [filterLayout, setFilterLayout] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  const [selectedPageId, setSelectedPageId] = useState<string | null>(
    () => config.site.pages[0]?.id ?? null
  );
  const [selectedSectionKey, setSelectedSectionKey] = useState<string | null>(
    null
  );
  const [clipboard, setClipboard] = useState<{
    section: SectionConfig;
    mode: "copy" | "cut";
  } | null>(null);
  const [draggingSectionKey, setDraggingSectionKey] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const [previewDeviceId, setPreviewDeviceId] =
    useState<PreviewDeviceId>("laptop");
  const [previewScale, setPreviewScale] = useState(1);
  const [viewMode, setViewMode] = useState<"preview" | "json">("preview");
  const [panelOpen, setPanelOpen] = useState<PanelOption | "">("pages");

  const handleOpenPanel = (panel: PanelOption | "") => {
    setPanelOpen((current) => (current === panel ? "" : panel));
  };

  const handleOpenPagePanel = (pageId: string) => {
     if (panelOpen !== "pages") {
       setPanelOpen("pages");
     }
    if (selectedPageId === pageId) {
      setSelectedPageId(null);
      setSelectedSectionKey(null);
      return;
    }
    setSelectedPageId(pageId);
    setSelectedSectionKey(null);
  };

  const handleViewModeChange = (mode: "preview" | "json") => {
    setViewMode(mode);
  };
  useEffect(() => {
    setConfig(resolvedInitialConfig);
    setHistory([clone(resolvedInitialConfig)]);
    setHistoryIndex(0);
    setSelectedPageId(resolvedInitialConfig.site.pages[0]?.id ?? null);
  }, [initialConfig, resolvedInitialConfig]);

  const layoutOptions = useMemo(() => {
    const values = new Set<string>();
    config.site.pages.forEach((page) => {
      if (page.layout) {
        values.add(page.layout);
      }
    });
    return Array.from(values);
  }, [config.site.pages]);

  const filteredPages = useMemo(() => {
    let pages = config.site.pages;

    if (pageSearch.trim()) {
      const term = pageSearch.toLowerCase();
      pages = pages.filter((page) => {
        const matchesSections = page.sections.some((section) =>
          section.component.toLowerCase().includes(term)
        );
        return (
          page.name.toLowerCase().includes(term) ||
          page.path.toLowerCase().includes(term) ||
          (page.layout ?? "").toLowerCase().includes(term) ||
          matchesSections
        );
      });
    }

    if (filterLayout !== "all") {
      pages = pages.filter(
        (page) => (page.layout ?? "default") === filterLayout
      );
    }

    const sorted = [...pages];
    sorted.sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "created-newest":
          return (
            new Date(b.metadata?.createdAt ?? 0).getTime() -
            new Date(a.metadata?.createdAt ?? 0).getTime()
          );
        case "created-oldest":
          return (
            new Date(a.metadata?.createdAt ?? 0).getTime() -
            new Date(b.metadata?.createdAt ?? 0).getTime()
          );
        default:
          return 0;
      }
    });

    return sorted;
  }, [config.site.pages, pageSearch, filterLayout, sortOption]);

  useEffect(() => {
    if (
      !selectedPageId ||
      !config.site.pages.some((page) => page.id === selectedPageId)
    ) {
      setSelectedPageId(config.site.pages[0]?.id ?? null);
    }
  }, [config.site.pages, selectedPageId]);

  const selectedPage = selectedPageId
    ? config.site.pages.find((page) => page.id === selectedPageId) ?? null
    : null;

  const previewDevice = useMemo(
    () =>
      PREVIEW_DEVICES.find((device) => device.id === previewDeviceId) ??
      PREVIEW_DEVICES[PREVIEW_DEVICES.length - 1],
    [previewDeviceId]
  );

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  const hasClipboard = Boolean(clipboard);

  const recordHistory = (
    nextConfig: SiteConfig,
    options?: { skipHistory?: boolean }
  ) => {
    const snapshot = clone(nextConfig);
    setConfig(snapshot);

    if (options?.skipHistory) {
      saveConfigToStorage(snapshot);
      return;
    }

    setHistory((prev) => {
      const limited = prev.slice(0, historyIndex + 1);
      return [...limited, snapshot];
    });
    setHistoryIndex((prev) => prev + 1);
    saveConfigToStorage(snapshot);
  };

  const handleUndo = () => {
    if (!canUndo) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    const snapshot = history[newIndex];
    setConfig(snapshot);
    saveConfigToStorage(snapshot);
  };

  const handleRedo = () => {
    if (!canRedo) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    const snapshot = history[newIndex];
    setConfig(snapshot);
    saveConfigToStorage(snapshot);
  };

  const updateGlobalConfig = (
    updater: (
      globalConfig: SiteConfig["site"]["global"]
    ) => SiteConfig["site"]["global"]
  ) => {
    const nextGlobal = updater(clone(config.site.global));
    const nextConfig: SiteConfig = {
      ...config,
      site: {
        ...config.site,
        global: nextGlobal,
      },
    };
    recordHistory(nextConfig);
  };

  const handleGlobalBrandChange = (value: string) => {
    updateGlobalConfig((globalConfig) => ({
      ...globalConfig,
      brand: value,
    }));
  };

  const handleGlobalThemeChange = (
    theme: SiteConfig["site"]["global"]["theme"]
  ) => {
    updateGlobalConfig((globalConfig) => ({
      ...globalConfig,
      theme,
    }));
  };

  const handleLayoutComponentChange = (
    slot: "header" | "footer",
    component: string
  ) => {
    const trimmed = component.trim();
    updateGlobalConfig((globalConfig) => {
      const nextLayout = { ...globalConfig.layout };
      if (!trimmed) {
        delete nextLayout[slot];
        return {
          ...globalConfig,
          layout: nextLayout,
        };
      }

      const previous = nextLayout[slot] ?? null;
      nextLayout[slot] = {
        ...(previous ?? {}),
        component: trimmed,
      };

      return {
        ...globalConfig,
        layout: nextLayout,
      };
    });
  };

  const handleLayoutPropsChange = (slot: "header" | "footer", json: string) => {
    try {
      const nextProps = json
        ? (JSON.parse(json) as Record<string, unknown>)
        : undefined;
      updateGlobalConfig((globalConfig) => {
        const target = globalConfig.layout[slot];
        if (!target) {
          if (nextProps) {
            console.warn(
              `Cannot assign props for ${slot} without selecting a component.`
            );
          }
          return globalConfig;
        }

        return {
          ...globalConfig,
          layout: {
            ...globalConfig.layout,
            [slot]: {
              ...target,
              props: nextProps,
            },
          },
        };
      });
    } catch (error) {
      console.warn(`Invalid JSON for ${slot} props`, error);
    }
  };

  const applyImportedConfig = (nextConfig: SiteConfig) => {
    const snapshot = clone(nextConfig);
    setConfig(snapshot);
    setHistory([snapshot]);
    setHistoryIndex(0);
    setSelectedPageId(snapshot.site.pages[0]?.id ?? null);
    setSelectedSectionKey(null);
    setClipboard(null);
    saveConfigToStorage(snapshot);
  };

  const handleExportConfig = () => {
    try {
      const blob = new Blob([JSON.stringify(config, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `site-config-${
        new Date().toISOString().split("T")[0]
      }.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export configuration", error);
    }
  };

  const handleImportFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as SiteConfig;
      applyImportedConfig(parsed);
      alert("Configuration imported successfully.");
    } catch (error) {
      console.error("Failed to import configuration", error);
      alert("Unable to import configuration. Please verify the JSON file.");
    } finally {
      event.target.value = "";
    }
  };

  const handleTriggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleCopyConfig = async (json: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      console.warn("Clipboard API not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(json);
    } catch (error) {
      console.error("Failed to copy configuration JSON.", error);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

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
      const scale = Math.min(1, availableWidth / previewDevice.width);
      setPreviewScale(scale);
    };

    updateScale();

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateScale);
      if (previewContainerRef.current) {
        observer.observe(previewContainerRef.current);
      }
    } else {
      window.addEventListener("resize", updateScale);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      } else {
        window.removeEventListener("resize", updateScale);
      }
    };
  }, [previewDevice]);

  const updatePageById = (
    pageId: string,
    updater: (page: PageConfig) => PageConfig
  ) => {
    const nextPages = config.site.pages.map((page) => {
      if (page.id !== pageId) return page;
      const updated = updater(clone(page));
      return {
        ...updated,
        metadata: {
          ...updated.metadata,
          updatedAt: new Date().toISOString(),
        },
      };
    });

    recordHistory({
      ...config,
      site: {
        ...config.site,
        pages: nextPages,
      },
    });
  };

  const handleAddPage = () => {
    const nextPage = createEmptyPage(config.site.pages.length);
    const nextConfig: SiteConfig = {
      ...config,
      site: {
        ...config.site,
        pages: [...config.site.pages, nextPage],
      },
    };
    recordHistory(nextConfig);
    setSelectedPageId(nextPage.id);
  };

  const handleDeletePage = (pageId: string) => {
    const remaining = config.site.pages.filter((page) => page.id !== pageId);
    const nextConfig: SiteConfig = {
      ...config,
      site: {
        ...config.site,
        pages: remaining,
      },
    };
    recordHistory(nextConfig);
    if (selectedPageId === pageId) {
      setSelectedPageId(remaining[0]?.id ?? null);
      setSelectedSectionKey(null);
    }
  };

  const handleDuplicatePage = (pageId: string) => {
    const source = config.site.pages.find((page) => page.id === pageId);
    if (!source) return;
    const clonePage = clone(source);
    const newId = crypto.randomUUID
      ? crypto.randomUUID()
      : `${pageId}-copy-${Date.now()}`;
    clonePage.id = newId;
    clonePage.name = `${clonePage.name} copy`;
    clonePage.path = `${clonePage.path}-copy`;
    clonePage.metadata = {
      createdAt: new Date().toISOString(),
    };

    const nextConfig: SiteConfig = {
      ...config,
      site: {
        ...config.site,
        pages: [...config.site.pages, clonePage],
      },
    };

    recordHistory(nextConfig);
    setSelectedPageId(newId);
  };

  const handleAddSection = (pageId: string, preset: SectionPreset) => {
    updatePageById(pageId, (page) => {
      const sections = [...page.sections];
      const uniqueKey = `${preset.component}-${Date.now()}-${sections.length}`;
      sections.push({
        key: uniqueKey,
        component: preset.component,
        props: preset.props ? clone(preset.props) : undefined,
        style: preset.style ? clone(preset.style) : undefined,
      });
      return {
        ...page,
        sections,
      };
    });
    setSelectedSectionKey(null);
  };

  const handleRemoveSection = (pageId: string, sectionKey: string) => {
    updatePageById(pageId, (page) => ({
      ...page,
      sections: page.sections.filter((section) => section.key !== sectionKey),
    }));
    if (selectedSectionKey === sectionKey) {
      setSelectedSectionKey(null);
    }
  };

  const handleCopySection = (section: SectionConfig) => {
    setClipboard({ section: clone(section), mode: "copy" });
  };

  const handleCutSection = (pageId: string, section: SectionConfig) => {
    setClipboard({ section: clone(section), mode: "cut" });
    handleRemoveSection(pageId, section.key);
  };

  const handlePasteSection = (pageId: string) => {
    if (!clipboard) return;
    updatePageById(pageId, (page) => {
      const sections = [...page.sections];
      const uniqueKey = `${clipboard.section.component}-${Date.now()}-${
        sections.length
      }`;
      sections.push({
        ...clone(clipboard.section),
        key: uniqueKey,
      });
      return {
        ...page,
        sections,
      };
    });
    if (clipboard.mode === "cut") {
      setClipboard(null);
    }
  };

  const handleSectionPropsChange = (
    pageId: string,
    sectionKey: string,
    json: string
  ) => {
    try {
      const nextProps = json
        ? (JSON.parse(json) as SectionConfig["props"])
        : undefined;
      updatePageById(pageId, (page) => ({
        ...page,
        sections: page.sections.map((section) =>
          section.key === sectionKey
            ? {
                ...section,
                props: nextProps,
              }
            : section
        ),
      }));
    } catch (error) {
      console.warn("Invalid JSON for section props", error);
    }
  };

  const handleSectionStyleChange = (
    pageId: string,
    sectionKey: string,
    json: string
  ) => {
    try {
      const nextStyle = json
        ? (JSON.parse(json) as SectionConfig["style"])
        : undefined;
      updatePageById(pageId, (page) => ({
        ...page,
        sections: page.sections.map((section) =>
          section.key === sectionKey
            ? {
                ...section,
                style: nextStyle,
              }
            : section
        ),
      }));
    } catch (error) {
      console.warn("Invalid JSON for section style", error);
    }
  };

  const handleReorderSection = (
    pageId: string,
    fromKey: string,
    toKey: string
  ) => {
    updatePageById(pageId, (page) => {
      const sections = [...page.sections];
      const fromIndex = sections.findIndex(
        (section) => section.key === fromKey
      );
      const toIndex = sections.findIndex((section) => section.key === toKey);
      if (fromIndex === -1 || toIndex === -1) return page;
      const [moved] = sections.splice(fromIndex, 1);
      sections.splice(toIndex, 0, moved);
      return {
        ...page,
        sections,
      };
    });
  };

  const handleDragStart = (sectionKey: string) => {
    setDraggingSectionKey(sectionKey);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (targetKey: string) => {
    if (
      !selectedPage ||
      !draggingSectionKey ||
      draggingSectionKey === targetKey
    ) {
      setDraggingSectionKey(null);
      return;
    }
    handleReorderSection(selectedPage.id, draggingSectionKey, targetKey);
    setDraggingSectionKey(null);
  };

  const handleClearClipboard = () => setClipboard(null);

  const handlePageFieldChange = <Field extends keyof PageConfig>(
    pageId: string,
    field: Field,
    value: PageConfig[Field]
  ) => {
    updatePageById(pageId, (page) => ({
      ...page,
      [field]: value,
    }));
  };

  const handleSeoFieldChange = (
    pageId: string,
    field: "title" | "description",
    value: string
  ) => {
    updatePageById(pageId, (page) => ({
      ...page,
      seo: {
        ...page.seo,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    saveConfigToStorage(config);
  };

  const handlePublish = () => {
    saveConfigToStorage(config);
    alert(
      "Configuration published. Navigate to the site routes to preview the updated experience."
    );
  };

  const renderSidebar = () => (
    <aside className="flex h-full flex-col gap-1 border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-2">
        <h2 className="text-base font-semibold text-slate-900">
          Pages &amp; sections
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Select a page to edit its metadata and structure directly here.
        </p>
      </div>
      <div className="border-b border-slate-200 flex flex-col gap-2 p-2">
        <input
          type="search"
          placeholder="Search pages, sections, properties"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          value={pageSearch}
          onChange={(event) => {
            setPageSearch(event.target.value);
          }}
        />
        <div className="flex gap-2">
          <select
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            value={filterLayout}
            onChange={(event) => {
              setFilterLayout(event.target.value);
            }}
          >
            <option value="all">All layouts</option>
            {layoutOptions.map((layout) => (
              <option key={layout} value={layout}>
                {layout}
              </option>
            ))}
          </select>
          <select
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            value={sortOption}
            onChange={(event) =>
              setSortOption(event.target.value as SortOption)
            }
          >
            <option value="name-asc">Name A → Z</option>
            <option value="name-desc">Name Z → A</option>
            <option value="created-newest">Newest first</option>
            <option value="created-oldest">Oldest first</option>
          </select>
        </div>
      </div>
      <div className="justify-between border-b border-slate-200 px-2 py-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Pages
          </span>
          <div className="flex items-center gap-2">
        <button
          onClick={handleAddPage}
          className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:border-slate-300"
        >
          + Add page
        </button>
            <button
              onClick={() => handleOpenPanel("pages")}
              className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:border-slate-300"
            >
              {panelOpen === "pages" ? "Close" : "Open"}
        </button>
      </div>
        </div>
        {panelOpen === "pages" && (
          <div className="py-2 overflow-y-auto h-[67vh] overflow-hidden">
            {filteredPages.length > 0 ? (
              filteredPages.map((page) => {
                const isActive = selectedPageId === page.id;
            return (
                  <div
                key={page.id}
                    className="rounded-lg border border-slate-200"
                  >
                    <button
                onClick={() => handleOpenPagePanel(page.id)}
                      className={`w-full rounded-t-lg px-3 py-2 text-left text-sm transition ${
                  isActive
                          ? "bg-slate-900 text-white"
                          : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{page.name}</span>
                        <span className="text-xs uppercase">
                          {page.layout ?? "default"}
                        </span>
                </div>
                      <div
                        className={`mt-1 text-xs ${
                          isActive ? "text-slate-200" : "text-slate-500"
                        }`}
                      >
                        {page.path}
                      </div>
                      <div
                        className={`mt-1 text-[10px] uppercase tracking-wide ${
                          isActive ? "text-slate-300" : "text-slate-400"
                        }`}
                      >
                        {page.sections.length} sections · Updated{" "}
                  {page.metadata?.updatedAt
                    ? new Date(page.metadata.updatedAt).toLocaleString()
                    : page.metadata?.createdAt
                    ? new Date(page.metadata.createdAt).toLocaleString()
                          : "never"}
                </div>
              </button>
                    {isActive ? (
                      <div className="space-y-4 border-t border-slate-200 px-3 py-3 overflow-auto h-full">
                        {renderPageDetailsCard(page)}
                        {renderSectionsPanel(page)}
            </div>
          ) : null}
        </div>
                );
              })
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-xs text-slate-500">
                No pages match your filters. Try adjusting search, filters, or
                sorting.
      </div>
            )}
        </div>
        )}
      </div>
      <div className="p-3 border-b border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Site-wide settings
          </h3>
          <button
            onClick={() => handleOpenPanel("global")}
            className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:border-slate-300"
          >
            {panelOpen === "global" ? "Close" : "Open"}
          </button>
        </div>
        {panelOpen === "global" && (
          <p className="mt-1 text-[11px] text-slate-500">
            Configure brand, theme, and layout components that every page
            inherits.
          </p>
        )}
        {panelOpen === "global" && (
          <div className="mt-3 space-y-3 bg-slate-50 p-3 border border-slate-200 rounded-lg overflow-auto h-[62vh]">
            {renderGlobalSettingsCard()}
          </div>
        )}
      </div>
    </aside>
  );

  const renderToolbar = () => (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">
          Site Builder workspace
        </h1>
        <p className="text-xs text-slate-500">
          Manage pages, sections, and global settings. Changes persist to local
          storage.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5">
          <button
            onClick={() => handleViewModeChange("preview")}
            disabled={viewMode === "preview"}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Preview
          </button>
          <button
            onClick={() => handleViewModeChange("json")}
            disabled={viewMode === "json"}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            View JSON
          </button>
      </div>
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Undo
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Redo
        </button>
        <div className="hidden h-6 w-px bg-slate-200 sm:block" />
        <button
          onClick={handleExportConfig}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-300"
        >
          Export JSON
        </button>
        <button
          onClick={handleTriggerImport}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-300"
        >
          Import JSON
        </button>
        <div className="hidden h-6 w-px bg-slate-200 sm:block" />
        <button
          onClick={handleSave}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-300"
        >
          Save
        </button>
        <button
          onClick={handlePublish}
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Publish
        </button>
      </div>
    </div>
  );

  const renderSectionEditor = (page: PageConfig, section: SectionConfig) => {
    const propsJson = section.props
      ? JSON.stringify(section.props, null, 2)
      : "";
    const styleJson = section.style
      ? JSON.stringify(section.style, null, 2)
      : "";

    return (
      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Component
          </label>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            {section.component}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Props (JSON)
          </label>
          <textarea
            defaultValue={propsJson}
            onBlur={(event) =>
              handleSectionPropsChange(page.id, section.key, event.target.value)
            }
            placeholder="{}"
            className="min-h-40 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs outline-none focus:border-slate-400"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Style (JSON)
          </label>
          <textarea
            defaultValue={styleJson}
            onBlur={(event) =>
              handleSectionStyleChange(page.id, section.key, event.target.value)
            }
            placeholder="{}"
            className="min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs outline-none focus:border-slate-400"
          />
        </div>
      </div>
    );
  };

  const renderSectionsPanel = (page: PageConfig) => (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between">
              <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Structure &amp; sections
          </h3>
          <p className="mt-1 text-[11px] text-slate-500">
            Drag to reorder. Copy, cut, and paste across pages.
          </p>
              </div>
              <div className="flex items-center gap-2">
                <button
            onClick={() => handlePasteSection(page.id)}
            disabled={!hasClipboard}
            className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
            Paste
                </button>
          {hasClipboard ? (
                <button
              onClick={handleClearClipboard}
              className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] text-slate-500 hover:border-slate-300"
                >
              Clear
                </button>
          ) : null}
              </div>
            </div>

      <div className="space-y-3">
        {page.sections.map((section) => {
          const isSelected = selectedSectionKey === section.key;
                return (
                  <div
                    key={section.key}
              className={`group rounded-xl border p-3 text-sm transition ${
                      isSelected
                  ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                  : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                    draggable
                    onDragStart={() => handleDragStart(section.key)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(section.key)}
                    onClick={() => setSelectedSectionKey(section.key)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                  <div className="text-sm font-semibold">
                    {section.component}
                  </div>
                  <div
                    className={`mt-1 text-[11px] ${
                      isSelected ? "text-slate-200" : "text-slate-500"
                    }`}
                  >
                          Key: {section.key}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(event) => {
                      event.stopPropagation();
                      handleCopySection(section);
                    }}
                    className={`rounded-lg border px-2 py-1 text-[11px] ${
                      isSelected
                        ? "border-slate-600 text-slate-200"
                        : "border-slate-200 text-slate-600"
                          } hover:border-slate-300`}
                        >
                          Copy
                        </button>
                        <button
                          onClick={(event) => {
                      event.stopPropagation();
                      handleCutSection(page.id, section);
                    }}
                    className={`rounded-lg border px-2 py-1 text-[11px] ${
                      isSelected
                        ? "border-slate-600 text-slate-200"
                        : "border-slate-200 text-slate-600"
                          } hover:border-slate-300`}
                        >
                          Cut
                        </button>
                        <button
                          onClick={(event) => {
                      event.stopPropagation();
                      handleRemoveSection(page.id, section.key);
                    }}
                    className={`rounded-lg border px-2 py-1 text-[11px] ${
                      isSelected
                        ? "border-rose-500 text-rose-100"
                        : "border-rose-200 text-rose-600"
                          } hover:border-rose-300`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
              {isSelected ? renderSectionEditor(page, section) : null}
                  </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-3">
        <div className="text-sm font-semibold text-slate-700">
          Add a section
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          Preset blocks assemble common layouts quickly.
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {sectionPresets.map((preset) => (
                    <button
                      key={preset.component}
              onClick={() => handleAddSection(page.id, preset)}
              className="rounded-lg border border-slate-200 bg-white p-3 text-left hover:border-slate-300"
            >
              <div className="text-sm font-semibold text-slate-900">
                {preset.label}
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                {preset.description}
              </div>
                    </button>
                  ))}
                </div>
      </div>
    </div>
  );

  const renderGlobalSettingsCard = () => {
    const header = config.site.global.layout.header;
    const footer = config.site.global.layout.footer;
    const headerPropsJson = header?.props
      ? JSON.stringify(header.props, null, 2)
      : "";
    const footerPropsJson = footer?.props
      ? JSON.stringify(footer.props, null, 2)
      : "";

    return (
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Brand
          </label>
          <input
            value={config.site.global.brand}
            onChange={(event) => handleGlobalBrandChange(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Theme
          </label>
          <select
            value={config.site.global.theme}
            onChange={(event) =>
              handleGlobalThemeChange(
                event.target.value as SiteConfig["site"]["global"]["theme"]
              )
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className="space-y-3 border-t border-slate-200 pt-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Header component
            </label>
            <input
              value={header?.component ?? ""}
              placeholder="e.g. Header"
              onChange={(event) =>
                handleLayoutComponentChange("header", event.target.value)
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Header props (JSON)
            </label>
            <textarea
              key={`header-props-${headerPropsJson}`}
              defaultValue={headerPropsJson}
              onBlur={(event) =>
                handleLayoutPropsChange("header", event.target.value)
              }
              placeholder={
                header ? "{}" : "Add a header component to configure props"
              }
              disabled={!header}
              className="min-h-28 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs outline-none focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>
        </div>
        <div className="space-y-3 border-t border-slate-200 pt-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Footer component
            </label>
            <input
              value={footer?.component ?? ""}
              placeholder="e.g. Footer"
              onChange={(event) =>
                handleLayoutComponentChange("footer", event.target.value)
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Footer props (JSON)
            </label>
            <textarea
              key={`footer-props-${footerPropsJson}`}
              defaultValue={footerPropsJson}
              onBlur={(event) =>
                handleLayoutPropsChange("footer", event.target.value)
              }
              placeholder={
                footer ? "{}" : "Add a footer component to configure props"
              }
              disabled={!footer}
              className="min-h-28 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs outline-none focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderPageDetailsCard = (page: PageConfig) => (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Page details
        </h3>
        <div className="flex items-center gap-2">
                  <button
            onClick={() => handleDuplicatePage(page.id)}
            className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 hover:border-slate-300"
                  >
            Duplicate
                  </button>
                    <button
            onClick={() => handleDeletePage(page.id)}
            className="rounded-lg border border-rose-200 px-2 py-1 text-[11px] font-medium text-rose-600 hover:border-rose-300"
                    >
            Delete
                    </button>
                </div>
              </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Name
          </label>
                <input
            value={page.name}
            onChange={(event) =>
              handlePageFieldChange(page.id, "name", event.target.value)
            }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Path
          </label>
                <input
            value={page.path}
            onChange={(event) =>
              handlePageFieldChange(page.id, "path", event.target.value)
            }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Layout
          </label>
                <input
            value={page.layout ?? ""}
            onChange={(event) =>
              handlePageFieldChange(page.id, "layout", event.target.value)
            }
                  placeholder="e.g. default"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  SEO Title
                </label>
                <input
            value={page.seo?.title ?? ""}
            onChange={(event) =>
              handleSeoFieldChange(page.id, "title", event.target.value)
            }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  SEO Description
                </label>
                <textarea
            value={page.seo?.description ?? ""}
            onChange={(event) =>
              handleSeoFieldChange(page.id, "description", event.target.value)
            }
            className="min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Sections summary
                </label>
                <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600">
            {page.sections.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-4">
                {page.sections.map((section) => (
                        <li key={section.key}>
                    {section.component}{" "}
                    <span className="text-slate-400">
                      ({section.props ? "Props" : "No props"})
                    </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
              <span>No sections yet. Add one from the presets below.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
  );

  const renderPreviewPanel = () => {
    if (!selectedPage) {
      return (
        <div className="flex h-[32rem] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
          Select a page to preview it live.
        </div>
      );
    }

    return (
      <div className="flex h-[32rem] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Preview</h3>
            <p className="text-[11px] text-slate-500">
              Live rendering of <code>{selectedPage.path}</code> at{" "}
              {previewDevice.width}×{previewDevice.height} (
              {Math.round(previewScale * 100)}%).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {PREVIEW_DEVICES.map((device) => {
              const isActive = device.id === previewDeviceId;
              return (
                <button
                  key={device.id}
                  onClick={() => setPreviewDeviceId(device.id)}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "border border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {device.label}
                </button>
              );
            })}
          </div>
        </div>
        <div
          ref={previewContainerRef}
          className="flex-1 overflow-auto px-5 py-5"
        >
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
                  transformOrigin: "top left",
                }}
              >
                <PageRenderer page={selectedPage} global={config.site.global} />
              </div>
              </div>
              </div>
              </div>
          </div>
    );
  };

  const renderSiteJsonPanel = () => {
    const jsonString = JSON.stringify(config, null, 2);

      return (
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Site configuration JSON
            </h3>
            <p className="text-[11px] text-slate-500">
              Full schema used by the runtime and persisted in local storage.
          </p>
        </div>
          <button
            onClick={() => handleCopyConfig(jsonString)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-300"
          >
            Copy
          </button>
          </div>
        <pre className="flex-1 overflow-auto px-5 py-4 text-xs leading-relaxed text-slate-700">
          {jsonString}
        </pre>
        </div>
    );
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImportFileChange}
      />
    <div className="grid h-screen grid-cols-12 gap-0 bg-slate-100">
        <div className="col-span-4 overflow-hidden h-full">
          {renderSidebar()}
        </div>
        <div className="col-span-8 flex h-full flex-col overflow-hidden">
        {renderToolbar()}
          <div className="flex-1 overflow-y-auto px-2 py-2">
            <div className="flex flex-col gap-6">
              {viewMode === "preview" && renderPreviewPanel()}
              {viewMode === "json" && renderSiteJsonPanel()}
        </div>
      </div>
    </div>
      </div>
    </>
  );
};

export default PageBuilder;
