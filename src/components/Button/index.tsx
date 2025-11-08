import { forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonCommonProps {
  label: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

type AnchorButtonProps = ButtonCommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  }

type NativeButtonProps = ButtonCommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined
  }

export type ButtonProps = AnchorButtonProps | NativeButtonProps

const baseClasses =
  'inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-900',
  secondary: 'bg-white text-slate-900 border border-slate-200 hover:border-slate-300 focus-visible:outline-slate-900',
  ghost: 'bg-transparent text-slate-900 hover:bg-slate-100 focus-visible:outline-slate-900',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(props, ref) {
  const { label, variant = 'primary', size = 'md', className = '', ...rest } = props
  const classes = [baseClasses, variantClasses[variant], sizeClasses[size], className].join(' ').trim()

  if ('href' in props && props.href) {
    const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} href={props.href} className={classes} {...anchorProps}>
        {label}
      </a>
    )
  }

  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} {...buttonProps}>
      {label}
    </button>
  )
})

export default Button

