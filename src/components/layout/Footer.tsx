interface FooterProps {
  brand?: string
  links?: string[]
}

const Footer = ({ brand = 'Site Builder', links = [] }: FooterProps) => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-6 py-8 text-sm text-slate-600">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 md:flex-row md:justify-between">
        <span>&copy; {new Date().getFullYear()} {brand}. All rights reserved.</span>
        <nav className="flex gap-4">
          {links.map((link) => (
            <a key={link} href={`/${link.toLowerCase()}`} className="hover:text-slate-900">
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default Footer

