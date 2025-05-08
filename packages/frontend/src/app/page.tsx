import CallToAction from '@/components/CTA'
import Hero from '@/components/Hero'
import ValueProposition from '@/components/Landing/ValueProposition'

export default function Home() {
  return (
    <main className="grow">
      <Hero />
      <ValueProposition />
      <CallToAction />
    </main>
  )
}
