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
            component: 'Container',
            props: {},
            style: {
              background: '#F4F6FB',
              padding: '96px 24px',
              textAlign: 'center',
            },
          },
          {
            key: 'hero-title',
            component: 'Typography',
            props: {
              variant: 'h1',
              children: 'Build faster',
            },
            style: {
              marginBottom: '16px',
            },
          },
          {
            key: 'hero-subtitle',
            component: 'Typography',
            props: {
              variant: 'h3',
              children: 'Ship in weeks, not months',
            },
            style: {
              marginBottom: '32px',
              color: '#64748b',
            },
          },
          {
            key: 'hero-button',
            component: 'Button',
            props: {
              children: 'Get Started',
              variant: 'primary',
              size: 'lg',
            },
            style: {
              marginBottom: '96px',
            },
          },
          {
            key: 'features-title',
            component: 'Typography',
            props: {
              variant: 'h2',
              children: 'Why teams choose Acme',
            },
            style: {
              textAlign: 'center',
              marginBottom: '48px',
              padding: '48px 24px 0',
            },
          },
          {
            key: 'features-grid',
            component: 'Row',
            props: {},
            style: {
              padding: '0 24px 48px',
            },
          },
          {
            key: 'feature-1',
            component: 'Card',
            props: {
              title: 'Faster go-live',
              children: 'Launch pages in days.',
            },
            style: {
              margin: '12px',
            },
          },
          {
            key: 'feature-2',
            component: 'Card',
            props: {
              title: 'Secure',
              children: 'Enterprise-grade security.',
            },
            style: {
              margin: '12px',
            },
          },
          {
            key: 'feature-3',
            component: 'Card',
            props: {
              title: 'Flexible',
              children: 'Compose bespoke sites with reusable sections.',
            },
            style: {
              margin: '12px',
            },
          },
          {
            key: 'cta-section',
            component: 'Container',
            props: {},
            style: {
              padding: '48px 24px',
              textAlign: 'center',
            },
          },
          {
            key: 'cta-title',
            component: 'Typography',
            props: {
              variant: 'h2',
              children: 'Launch your next experience',
            },
            style: {
              marginBottom: '16px',
            },
          },
          {
            key: 'cta-subtitle',
            component: 'Typography',
            props: {
              variant: 'body1',
              children: 'Choose a path that fits your team and timeline.',
            },
            style: {
              marginBottom: '32px',
              color: '#64748b',
            },
          },
          {
            key: 'cta-button-1',
            component: 'Button',
            props: {
              children: 'Explore pricing',
              variant: 'primary',
              size: 'lg',
            },
            style: {
              marginRight: '16px',
            },
          },
          {
            key: 'cta-button-2',
            component: 'Button',
            props: {
              children: 'Talk to sales',
              variant: 'secondary',
              size: 'lg',
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
                component: 'Typography',
                props: {
                  variant: 'body1',
                  children: 'Overview content...',
                },
                style: {
                  padding: '24px',
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
            key: 'contact-title',
            component: 'Typography',
            props: {
              variant: 'h1',
              children: "Let's work together",
            },
            style: {
              textAlign: 'center',
              padding: '48px 24px 24px',
            },
          },
          {
            key: 'contact-form',
            component: 'Container',
            props: {},
            style: {
              maxWidth: '600px',
              margin: '0 auto',
              padding: '24px',
            },
          },
          {
            key: 'contact-name',
            component: 'Input',
            props: {
              placeholder: 'Full name',
              type: 'text',
            },
            style: {
              marginBottom: '16px',
            },
          },
          {
            key: 'contact-email',
            component: 'Input',
            props: {
              placeholder: 'Email',
              type: 'email',
            },
            style: {
              marginBottom: '16px',
            },
          },
          {
            key: 'contact-message',
            component: 'Input',
            props: {
              placeholder: 'Message',
              type: 'textarea',
            },
            style: {
              marginBottom: '24px',
            },
          },
          {
            key: 'contact-submit',
            component: 'Button',
            props: {
              children: 'Send',
              variant: 'primary',
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
            key: 'pricing-title',
            component: 'Typography',
            props: {
              variant: 'h1',
              children: 'Pricing for every stage',
            },
            style: {
              textAlign: 'center',
              padding: '48px 24px 16px',
            },
          },
          {
            key: 'pricing-description',
            component: 'Typography',
            props: {
              variant: 'body1',
              children: 'Choose a plan that matches your velocity. All tiers include collaborative editing and publishing workflows.',
            },
            style: {
              textAlign: 'center',
              padding: '0 24px 48px',
              color: '#64748b',
            },
          },
          {
            key: 'pricing-actions',
            component: 'Container',
            props: {},
            style: {
              textAlign: 'center',
              padding: '0 24px 48px',
            },
          },
          {
            key: 'pricing-button-1',
            component: 'Button',
            props: {
              children: 'Start free trial',
              variant: 'primary',
            },
            style: {
              marginRight: '16px',
            },
          },
          {
            key: 'pricing-button-2',
            component: 'Button',
            props: {
              children: 'View enterprise',
              variant: 'secondary',
            },
          },
        ],
      },
    ],
  },
}

export default siteConfig

