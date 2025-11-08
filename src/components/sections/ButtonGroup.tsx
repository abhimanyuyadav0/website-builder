import Button from '../Button'

interface ButtonConfig {
  label: string
  href: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

interface ButtonGroupProps {
  title?: string
  subtitle?: string
  alignment?: 'left' | 'center' | 'right'
  buttons: ButtonConfig[]
}

const alignmentClasses: Record<NonNullable<ButtonGroupProps['alignment']>, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
}

const ButtonGroup = ({ title, subtitle, alignment = 'center', buttons }: ButtonGroupProps) => {
  const alignmentClass = alignmentClasses[alignment]

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className={`flex flex-col gap-6 ${alignmentClass}`}>
        <div className="space-y-3">
          {title ? <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h2> : null}
          {subtitle ? <p className="text-base text-slate-600">{subtitle}</p> : null}
        </div>
        <div className="flex flex-wrap gap-3">
          {buttons.map((button) => (
            <Button key={button.label} label={button.label} href={button.href} variant={button.variant} size={button.size} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ButtonGroup

