import type { SiteConfig } from '../types/site'

const siteConfig: SiteConfig = {
  site: {
    global: {
      brand: 'Acme Co',
      theme: 'light',
      layout: {
        header: {
          component: 'Header',
          props: {
            cta: {
              label: 'Book a demo',
              href: '/contact',
              variant: 'primary',
            },
          },
        },
        footer: {
          component: 'Footer',
          props: { links: ['Privacy', 'Terms'] },
        },
      },
    },
    pages: [
      {
        id: 'home',
        path: '/',
        name: 'Home',
        layout: 'default',
        metadata: {
          createdAt: '2024-01-01T09:00:00.000Z',
          updatedAt: '2024-10-01T10:00:00.000Z',
        },
        seo: {
          title: 'Acme Home',
          description: 'Welcome to Acme',
        },
        sections: [
          {
            key: 'hero',
            component: 'HeroBanner',
            props: {
              heading: 'Build faster',
              subheading: 'Ship in weeks, not months',
              cta: {
                label: 'Get Started',
                href: '/contact',
              },
              media: {
                type: 'image',
                src: '/assets/hero.jpg',
                alt: 'Team building product',
              },
            },
            style: {
              background: '#F4F6FB',
              padding: { top: 96, bottom: 96 },
            },
          },
          {
            key: 'features',
            component: 'FeatureGrid',
            props: {
              title: 'Why teams choose Acme',
              items: [
                { icon: 'Rocket', title: 'Faster go-live', body: 'Launch pages in days.' },
                { icon: 'Shield', title: 'Secure', body: 'Enterprise-grade security.' },
                { icon: 'Sparkles', title: 'Flexible', body: 'Compose bespoke sites with reusable sections.' },
              ],
            },
          },
          {
            key: 'stats',
            component: 'StatsGrid',
            props: {
              eyebrow: 'Outcomes',
              title: 'Impact that compounds',
              description: 'Teams using Acme ship faster experiences without sacrificing brand consistency.',
              items: [
                { label: 'Time-to-launch', value: '2 weeks', description: 'Average timeline from brief to launch' },
                { label: 'Conversion lift', value: '38%', description: 'Median uplift after migrating critical flows' },
                { label: 'Design debt', value: '-72%', description: 'Reduction in duplicated design work' },
                { label: 'NPS', value: '68', description: 'Customer satisfaction score' },
              ],
            },
          },
          {
            key: 'cta-buttons',
            component: 'ButtonGroup',
            props: {
              title: 'Launch your next experience',
              subtitle: 'Choose a path that fits your team and timeline.',
              alignment: 'center',
              buttons: [
                { label: 'Explore pricing', href: '/pricing', variant: 'primary', size: 'lg' },
                { label: 'Talk to sales', href: '/contact', variant: 'secondary', size: 'lg' },
              ],
            },
          },
          {
            key: 'testimonials',
            component: 'TestimonialList',
            props: {
              title: 'Loved by product-led teams',
              description: 'Acme brings marketing, product, and design into one connected workflow.',
              testimonials: [
                {
                  quote: 'Acme lets us ideate and ship campaigns the same week, without waiting on engineering.',
                  author: 'Riya Patel',
                  role: 'Director of Growth, Eventio',
                },
                {
                  quote: 'Our designers spend time on big ideas instead of rebuilding the same components.',
                  author: 'Marcus Wong',
                  role: 'Head of Design, Lumen',
                },
                {
                  quote: 'The configuration JSON is our single source of truth for every launch.',
                  author: 'Elena Davis',
                  role: 'Product Marketing Lead, Northwind',
                },
              ],
            },
          },
        ],
        children: [
          {
            id: 'home-overview',
            path: 'overview',
            name: 'Overview',
            sections: [
              {
                key: 'overview-content',
                component: 'RichText',
                props: {
                  content: '<p>Overview content...</p>',
                },
              },
            ],
          },
        ],
      },
      {
        id: 'contact',
        path: '/contact',
        name: 'Contact',
        layout: 'form',
        metadata: {
          createdAt: '2024-01-10T11:00:00.000Z',
          updatedAt: '2024-08-18T08:30:00.000Z',
        },
        seo: {
          title: 'Talk with sales',
          description: 'Reach our team using the form',
        },
        sections: [
          {
            key: 'contact-form',
            component: 'ContactForm',
            props: {
              title: "Let's work together",
              submitLabel: 'Send',
              fields: [
                { name: 'fullName', label: 'Full name', type: 'text', required: true },
                { name: 'email', label: 'Email', type: 'email', required: true },
                { name: 'message', label: 'Message', type: 'textarea' },
              ],
            },
          },
        ],
      },
      {
        id: 'pricing',
        path: '/pricing',
        name: 'Pricing',
        layout: 'default',
        metadata: {
          createdAt: '2024-03-22T13:00:00.000Z',
          updatedAt: '2024-09-05T15:15:00.000Z',
        },
        seo: {
          title: 'Pricing plans',
          description: 'Plans that scale with your ambition.',
        },
        sections: [
          {
            key: 'pricing-overview',
            component: 'RichText',
            props: {
              content:
                '<h1>Pricing for every stage</h1><p>Choose a plan that matches your velocity. All tiers include collaborative editing and publishing workflows.</p>',
            },
          },
          {
            key: 'pricing-actions',
            component: 'ButtonGroup',
            props: {
              alignment: 'left',
              buttons: [
                { label: 'Start free trial', href: '/contact', variant: 'primary' },
                { label: 'View enterprise', href: '/contact', variant: 'ghost' },
              ],
            },
          },
        ],
      },
    ],
  },
}

export default siteConfig

