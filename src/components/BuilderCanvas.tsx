import React, { useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBuilderStore } from '../store/builderStore';
import { renderComponent } from './ComponentRegistry';
import type { SectionConfig } from '../types/site';

interface BuilderCanvasProps {
  pageId: string;
  onSectionSelect?: (sectionKey: string | null) => void;
}

const SortableSection: React.FC<{
  section: SectionConfig;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ section, isSelected, onSelect }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group mb-2 ${
        isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-slate-300'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className="absolute -left-8 top-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10 13a1 1 0 100-2 1 1 0 000 2zm-4 0a1 1 0 100-2 1 1 0 000 2zM6 7a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
        </button>
      </div>
      <div className="min-h-[40px] bg-white border border-slate-200 rounded">
        {renderComponent(section)}
      </div>
    </div>
  );
};

const BuilderCanvas: React.FC<BuilderCanvasProps> = ({ pageId, onSectionSelect }) => {
  const { config, selectedSectionKey, setSelectedSection } = useBuilderStore();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [draggedComponent, setDraggedComponent] = React.useState<{
    componentName: string;
    defaultProps: Record<string, any>;
  } | null>(null);

  const page = useMemo(
    () => config.site.pages.find((p) => p.id === pageId),
    [config.site.pages, pageId]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    if (active.data.current?.type === 'component') {
      setDraggedComponent({
        componentName: active.data.current.componentName,
        defaultProps: active.data.current.defaultProps || {},
      });
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !page) return;

    // If dragging from palette, show drop indicator
    if (active.data.current?.type === 'component' && over.id === 'canvas-drop-zone') {
      // Visual feedback handled by CSS
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDraggedComponent(null);

    if (!over || !page) return;

    // Handle dropping component from palette
    if (active.data.current?.type === 'component') {
      if (over.id === 'canvas-drop-zone' || over.id.toString().startsWith('section-')) {
        const componentName = active.data.current.componentName;
        const defaultProps = active.data.current.defaultProps || {};

        const newSection: SectionConfig = {
          key: `${componentName}-${Date.now()}`,
          component: componentName,
          props: defaultProps,
        };

        // Add to page
        const updatedPages = config.site.pages.map((p) => {
          if (p.id === pageId) {
            let insertIndex = page.sections.length;
            
            // If dropping on a section, insert after it
            if (typeof over.id === 'string' && over.id !== 'canvas-drop-zone') {
              const targetIndex = page.sections.findIndex((s) => s.key === over.id);
              if (targetIndex >= 0) {
                insertIndex = targetIndex + 1;
              }
            }

            const newSections = [...page.sections];
            newSections.splice(insertIndex, 0, newSection);

            return { ...p, sections: newSections };
          }
          return p;
        });

        useBuilderStore.getState().setConfig({
          ...config,
          site: { ...config.site, pages: updatedPages },
        });
        useBuilderStore.getState().addToHistory({
          ...config,
          site: { ...config.site, pages: updatedPages },
        });
      }
      return;
    }

    // Handle reordering sections
    if (active.id !== over.id) {
      const oldIndex = page.sections.findIndex((s) => s.key === active.id);
      const newIndex = page.sections.findIndex((s) => s.key === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newSections = [...page.sections];
        const [moved] = newSections.splice(oldIndex, 1);
        newSections.splice(newIndex, 0, moved);

        const updatedPages = config.site.pages.map((p) =>
          p.id === pageId ? { ...p, sections: newSections } : p
        );

        useBuilderStore.getState().setConfig({
          ...config,
          site: { ...config.site, pages: updatedPages },
        });
        useBuilderStore.getState().addToHistory({
          ...config,
          site: { ...config.site, pages: updatedPages },
        });
      }
    }
  };

  if (!page) {
    return (
      <div className="flex h-full items-center justify-center text-slate-500">
        Page not found
      </div>
    );
  }

  const sectionIds = page.sections.map((s) => s.key);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        id="canvas-drop-zone"
        className="h-full overflow-y-auto bg-slate-50 p-6"
        onClick={() => onSectionSelect?.(null)}
      >
        {page.sections.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-slate-300">
            <div className="text-center">
              <p className="text-slate-500">Drop components here to start building</p>
            </div>
          </div>
        ) : (
          <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
            {page.sections.map((section) => (
              <SortableSection
                key={section.key}
                section={section}
                isSelected={selectedSectionKey === section.key}
                onSelect={() => {
                  setSelectedSection(section.key);
                  onSectionSelect?.(section.key);
                }}
              />
            ))}
          </SortableContext>
        )}
      </div>
      <DragOverlay>
        {activeId && draggedComponent ? (
          <div className="rounded-lg border-2 border-blue-500 bg-white p-4 shadow-lg">
            {draggedComponent.componentName}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default BuilderCanvas;

