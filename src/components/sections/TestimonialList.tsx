interface Testimonial {
  quote: string
  author: string
  role?: string
}

interface TestimonialListProps {
  title?: string
  description?: string
  testimonials: Testimonial[]
}

const TestimonialList = ({ title, description, testimonials }: TestimonialListProps) => {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-3xl text-center space-y-4">
        {title ? <h2 className="text-3xl font-semibold text-slate-900">{title}</h2> : null}
        {description ? <p className="text-base text-slate-600">{description}</p> : null}
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <figure
            key={`${testimonial.author}-${index}`}
            className="rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm"
          >
            <blockquote className="text-sm text-slate-600">&ldquo;{testimonial.quote}&rdquo;</blockquote>
            <figcaption className="mt-6 text-sm font-semibold text-slate-900">
              {testimonial.author}
              {testimonial.role ? <span className="mt-1 block font-normal text-slate-500">{testimonial.role}</span> : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default TestimonialList

