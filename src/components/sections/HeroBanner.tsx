import Button from '../ui/Button'

interface HeroBannerProps {
  heading: string
  subheading?: string
  cta?: {
    label: string
    href: string
  }
  media?: {
    type: string
    src: string
    alt?: string
  }
  style?: {
    background?: string
    padding?: {
      top?: number
      bottom?: number
    }
  }
}

const HeroBanner = ({ heading, subheading, cta, media, style }: HeroBannerProps) => {
  const paddingTop = style?.padding?.top ?? 64
  const paddingBottom = style?.padding?.bottom ?? 64

  return (
    <section
      className="mx-auto max-w-6xl px-6"
      style={{
        background: style?.background,
        paddingTop,
        paddingBottom,
      }}
    >
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">{heading}</h1>
          {subheading ? <p className="text-lg text-slate-600">{subheading}</p> : null}
          {cta ? (
            <Button label={cta.label} href={cta.href} variant="primary" size="lg" />
          ) : null}
        </div>
        {media?.type === 'image' ? (
          <img
            src={media.src}
            alt={media.alt ?? ''}
            className="w-full rounded-xl border border-slate-200 object-cover shadow-sm"
          />
        ) : null}
      </div>
    </section>
  )
}

export default HeroBanner

