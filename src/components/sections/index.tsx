import type { ComponentType } from 'react'
import HeroBanner from './HeroBanner'
import FeatureGrid from './FeatureGrid'
import RichText from './RichText'
import ContactForm from './ContactForm'
import ButtonGroup from './ButtonGroup'
import StatsGrid from './StatsGrid'
import TestimonialList from './TestimonialList'

type SectionComponent = ComponentType<Record<string, unknown>>

const sectionRegistry: Record<string, SectionComponent> = {
  HeroBanner: HeroBanner as SectionComponent,
  FeatureGrid: FeatureGrid as SectionComponent,
  RichText: RichText as SectionComponent,
  ContactForm: ContactForm as SectionComponent,
  ButtonGroup: ButtonGroup as SectionComponent,
  StatsGrid: StatsGrid as SectionComponent,
  TestimonialList: TestimonialList as SectionComponent,
}

export default sectionRegistry

