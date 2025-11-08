import Button from '../Button'

interface HeaderProps {
  brand?: string
  cta?: {
    label: string
    href: string
    variant?: 'primary' | 'secondary' | 'ghost'
  }
}

const Header = ({ brand = 'Site Builder', cta }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <a href="/" className="text-lg font-semibold text-slate-900">
        {brand}
      </a>
      {cta ? <Button label={cta.label} href={cta.href} variant={cta.variant} size="sm" /> : null}
    </header>
  )
}

export default Header

