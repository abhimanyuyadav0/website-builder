interface FeatureItem {
  icon?: string
  title: string
  body: string
}

interface FeatureGridProps {
  title?: string
  items: FeatureItem[]
}

const FeatureGrid = ({ title, items }: FeatureGridProps) => {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="space-y-10">
        {title ? <h2 className="text-center text-3xl font-semibold text-slate-900">{title}</h2> : null}
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              {item.icon ? (
                <div className="mb-4 h-10 w-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-medium">
                  {item.icon}
                </div>
              ) : null}
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureGrid

