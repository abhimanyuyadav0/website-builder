import type { ComponentType } from 'react'
import Header from './Header'
import Footer from './Footer'

type LayoutComponent = ComponentType<Record<string, unknown>>

const layoutRegistry: Record<string, LayoutComponent> = {
  Header: Header as LayoutComponent,
  Footer: Footer as LayoutComponent,
}

export default layoutRegistry

