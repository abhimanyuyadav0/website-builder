# Website Builder with Glintly-UI

A drag-and-drop website builder that allows users to visually design web pages using Glintly-UI components.

## Features

### ✅ Drag & Drop Builder
- Component palette with Glintly-UI components organized by category
- Drag components from palette to canvas
- Reorder components by dragging within the canvas
- Visual feedback during drag operations

### ✅ Live Rendering Canvas
- Real-time preview of the page as you build
- Responsive preview views:
  - Desktop (1280x800)
  - Tablet (768x1024)
  - Mobile (375x812)
- Auto-scaling preview to fit viewport

### ✅ Component Editing
- Property editor panel for selected components
- Edit component props via JSON editor
- Edit component styles via JSON editor
- Delete components with confirmation

### ✅ Multi-Page Support
- Create and manage multiple pages
- Page navigation sidebar
- Each page maintains its own component structure

### ✅ State Management
- Zustand store for global state
- Undo/Redo functionality
- History tracking
- Local storage persistence

### ✅ Export & Deployment
- Export site configuration as JSON
- Export React code (ready for deployment)
- Export HTML/CSS (static site)

## Component Categories

### Basic
- Button
- Typography (Text/Headings)

### Layout
- Row
- Column (Col)
- Container

### Forms
- Input Field

### Display
- Card
- Avatar
- Badge
- Spinner
- Accordion
- Tabs
- List
- Modal
- Tooltip

### Navigation
- Navbar
- Pagination

## Usage

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the builder:**
   Open `http://localhost:5173/page-builder` in your browser

3. **Create a page:**
   - Click "+ Add" in the Pages sidebar
   - Give your page a name and path

4. **Add components:**
   - Drag components from the Component Palette to the Canvas
   - Components will be added to your page

5. **Edit components:**
   - Click on a component in the canvas to select it
   - Edit properties in the Property Editor panel
   - Changes are reflected in real-time

6. **Reorder components:**
   - Use the drag handle (appears on hover) to reorder components
   - Or drag components directly within the canvas

7. **Preview your site:**
   - Click "Preview" button in the toolbar
   - Switch between Desktop, Tablet, and Mobile views
   - Click "Back to Builder" to continue editing

8. **Export your site:**
   - **Export JSON:** Download the site configuration
   - **Export React:** Download React code ready for deployment
   - **Save:** Persist changes to local storage

## Keyboard Shortcuts

- `Ctrl+Z` / `Cmd+Z`: Undo
- `Ctrl+Shift+Z` / `Cmd+Shift+Z`: Redo

## Architecture

### State Management
- **Zustand Store** (`src/store/builderStore.ts`): Global state for builder
- **Local Storage**: Automatic persistence of site configuration

### Components
- **ComponentPalette**: Sidebar with draggable components
- **BuilderCanvas**: Main canvas area with drag-and-drop
- **PropertyEditor**: Panel for editing component properties
- **PageRenderer**: Renders the final page using Glintly-UI components

### Component Registry
- Maps component names to Glintly-UI components
- Provides metadata for each component
- Handles component rendering

## Tech Stack

- **React 19** with TypeScript
- **@dnd-kit** for drag-and-drop
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Glintly-UI** component library
- **Vite** for build tooling

## File Structure

```
website-builder/
├── src/
│   ├── components/
│   │   ├── ComponentPalette.tsx    # Component sidebar
│   │   ├── BuilderCanvas.tsx        # Main canvas
│   │   ├── PropertyEditor.tsx       # Property editor
│   │   ├── ComponentRegistry.tsx    # Component mapping
│   │   └── PageRenderer.tsx          # Page renderer
│   ├── pages/
│   │   └── pageBuilder/
│   │       └── DragDropBuilder.tsx   # Main builder page
│   ├── store/
│   │   └── builderStore.ts           # Zustand store
│   ├── utils/
│   │   ├── exportCode.ts             # Export utilities
│   │   └── siteConfigStorage.ts      # Local storage
│   └── types/
│       └── site.ts                   # TypeScript types
```

## Future Enhancements

- [ ] Inline text editing
- [ ] Visual style editor (color picker, spacing controls)
- [ ] Component templates/presets
- [ ] Copy/paste between pages
- [ ] Component nesting support
- [ ] One-click deployment to Netlify/Vercel
- [ ] Component library expansion
- [ ] Theme customization UI
- [ ] Responsive breakpoint editor
- [ ] Component search/filter

