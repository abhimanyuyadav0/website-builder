import React from 'react';
import {
  Button,
  Typography,
  Card,
  Input,
  Row,
  Col,
  Container,
  Avatar,
  Badge,
  BadgeGroup,
  Spinner,
  Navbar,
  Accordion,
  Tabs,
  List,
  ListItem,
  Pagination,
  Modal,
  Tooltip,
} from 'glintly-ui';
import type { SectionConfig } from '../types/site';

// Component registry mapping component names to actual components
export const componentRegistry: Record<string, React.ComponentType<any>> = {
  Button,
  Typography,
  Card,
  Input,
  Row,
  Col,
  Container,
  Avatar,
  Badge,
  BadgeGroup,
  Spinner,
  Navbar,
  Accordion,
  Tabs,
  List,
  ListItem,
  Pagination,
  Modal,
  Tooltip,
};

// Component metadata for the palette
export interface ComponentMetadata {
  name: string;
  displayName: string;
  category: 'basic' | 'layout' | 'form' | 'display' | 'navigation';
  icon?: string;
  defaultProps?: Record<string, any>;
  description?: string;
}

export const componentMetadata: Record<string, ComponentMetadata> = {
  Button: {
    name: 'Button',
    displayName: 'Button',
    category: 'basic',
    description: 'Interactive button component',
    defaultProps: {
      children: 'Click me',
      variant: 'primary',
      size: 'md',
    },
  },
  Typography: {
    name: 'Typography',
    displayName: 'Text / Heading',
    category: 'basic',
    description: 'Text and heading component',
    defaultProps: {
      children: 'Sample text',
      variant: 'body1',
    },
  },
  Card: {
    name: 'Card',
    displayName: 'Card',
    category: 'display',
    description: 'Card container component',
    defaultProps: {
      title: 'Card Title',
      children: 'Card content goes here',
      shadow: true,
    },
  },
  Input: {
    name: 'Input',
    displayName: 'Input Field',
    category: 'form',
    description: 'Form input component',
    defaultProps: {
      placeholder: 'Enter text...',
      type: 'text',
    },
  },
  Row: {
    name: 'Row',
    displayName: 'Row',
    category: 'layout',
    description: 'Horizontal layout container',
    defaultProps: {},
  },
  Col: {
    name: 'Col',
    displayName: 'Column',
    category: 'layout',
    description: 'Vertical layout container',
    defaultProps: {},
  },
  Container: {
    name: 'Container',
    displayName: 'Container',
    category: 'layout',
    description: 'Page container component',
    defaultProps: {},
  },
  Avatar: {
    name: 'Avatar',
    displayName: 'Avatar',
    category: 'display',
    description: 'User avatar component',
    defaultProps: {},
  },
  Badge: {
    name: 'Badge',
    displayName: 'Badge',
    category: 'display',
    description: 'Badge component',
    defaultProps: {
      children: 'Badge',
    },
  },
  Spinner: {
    name: 'Spinner',
    displayName: 'Spinner',
    category: 'display',
    description: 'Loading spinner',
    defaultProps: {},
  },
  Navbar: {
    name: 'Navbar',
    displayName: 'Navbar',
    category: 'navigation',
    description: 'Navigation bar component',
    defaultProps: {},
  },
  Accordion: {
    name: 'Accordion',
    displayName: 'Accordion',
    category: 'display',
    description: 'Accordion component',
    defaultProps: {},
  },
  Tabs: {
    name: 'Tabs',
    displayName: 'Tabs',
    category: 'display',
    description: 'Tabs component',
    defaultProps: {},
  },
  List: {
    name: 'List',
    displayName: 'List',
    category: 'display',
    description: 'List component',
    defaultProps: {},
  },
  ListItem: {
    name: 'ListItem',
    displayName: 'List Item',
    category: 'display',
    description: 'List item component',
    defaultProps: {},
  },
  Pagination: {
    name: 'Pagination',
    displayName: 'Pagination',
    category: 'navigation',
    description: 'Pagination component',
    defaultProps: {},
  },
  Modal: {
    name: 'Modal',
    displayName: 'Modal',
    category: 'display',
    description: 'Modal dialog component',
    defaultProps: {},
  },
  Tooltip: {
    name: 'Tooltip',
    displayName: 'Tooltip',
    category: 'display',
    description: 'Tooltip component',
    defaultProps: {},
  },
};

// Render a component from config
export const renderComponent = (section: SectionConfig): React.ReactElement | null => {
  const Component = componentRegistry[section.component];
  if (!Component) {
    return (
      <div style={{ padding: '16px', border: '2px dashed #ef4444', color: '#ef4444' }}>
        Component "{section.component}" not found
      </div>
    );
  }

  const props = {
    ...componentMetadata[section.component]?.defaultProps,
    ...(section.props || {}),
    ...(section.style ? { style: section.style } : {}),
  };

  return <Component {...props} />;
};

