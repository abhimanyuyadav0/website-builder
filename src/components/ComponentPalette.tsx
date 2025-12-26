import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { componentMetadata } from './ComponentRegistry';

interface ComponentPaletteProps {
  onComponentSelect?: (componentName: string) => void;
}

const ComponentItem: React.FC<{ name: string; metadata: typeof componentMetadata[string] }> = ({
  name,
  metadata,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${name}`,
    data: {
      type: 'component',
      componentName: name,
      defaultProps: metadata.defaultProps || {},
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing rounded-lg border border-slate-200 bg-white p-3 hover:border-slate-300 hover:shadow-sm transition-shadow"
    >
      <div className="text-sm font-semibold text-slate-900">{metadata.displayName}</div>
      {metadata.description && (
        <div className="mt-1 text-xs text-slate-500">{metadata.description}</div>
      )}
    </div>
  );
};

const ComponentPalette: React.FC<ComponentPaletteProps> = () => {
  const categories = ['basic', 'layout', 'form', 'display', 'navigation'] as const;
  const categoryLabels: Record<typeof categories[number], string> = {
    basic: 'Basic',
    layout: 'Layout',
    form: 'Forms',
    display: 'Display',
    navigation: 'Navigation',
  };

  const componentsByCategory = categories.reduce((acc, category) => {
    acc[category] = Object.entries(componentMetadata).filter(
      ([, metadata]) => metadata.category === category
    );
    return acc;
  }, {} as Record<typeof categories[number], Array<[string, typeof componentMetadata[string]]>>);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <h2 className="text-base font-semibold text-slate-900">Components</h2>
        <p className="mt-1 text-xs text-slate-500">
          Drag components to the canvas to add them
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {categories.map((category) => {
          const components = componentsByCategory[category];
          if (components.length === 0) return null;

          return (
            <div key={category} className="mb-6">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {categoryLabels[category]}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {components.map(([name, metadata]) => (
                  <ComponentItem key={name} name={name} metadata={metadata} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComponentPalette;

