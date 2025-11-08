import { useId, useState } from 'react'

interface ContactField {
  name: string
  label: string
  type: string
  required?: boolean
}

interface ContactFormProps {
  title?: string
  submitLabel?: string
  fields: ContactField[]
}

const ContactForm = ({ title, submitLabel = 'Submit', fields }: ContactFormProps) => {
  const formId = useId()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      event.currentTarget.reset()
    }, 800)
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        {title ? <h2 className="text-2xl font-semibold text-slate-900">{title}</h2> : null}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <label key={field.name} className="flex flex-col gap-2 text-sm text-slate-700">
              <span className="font-medium">
                {field.label}
                {field.required ? <span className="text-rose-500">*</span> : null}
              </span>
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  className="min-h-32 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                  required={field.required}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                  required={field.required}
                />
              )}
            </label>
          ))}
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isSubmitting}
            aria-describedby={`${formId}-hint`}
          >
            {isSubmitting ? 'Sending...' : submitLabel}
          </button>
          <p id={`${formId}-hint`} className="text-xs text-slate-500">
            Demo form — no data is sent.
          </p>
        </form>
      </div>
    </section>
  )
}

export default ContactForm

