interface StatItem {
  label: string
  value: string
  description?: string
}

interface StatsGridProps {
  eyebrow?: string
  title?: string
  description?: string
  items: StatItem[]
}

const StatsGrid = ({ eyebrow, title, description, items }: StatsGridProps) => {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-3xl text-center space-y-4">
        {eyebrow ? <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">{eyebrow}</span> : null}
        {title ? <h2 className="text-3xl font-semibold text-slate-900">{title}</h2> : null}
        {description ? <p className="text-base text-slate-600">{description}</p> : null}
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-3xl font-semibold text-slate-900">{item.value}</div>
            <div className="mt-2 text-sm font-medium text-slate-500">{item.label}</div>
            {item.description ? <p className="mt-3 text-sm text-slate-600">{item.description}</p> : null}
          </div>
        ))}
      </div>
    </section>
  )
}

export default StatsGrid

