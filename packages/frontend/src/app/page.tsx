import CallToAction from '@/components/CTA'
import Hero from '@/components/Hero'
import ValueProposition from '@/components/Landing/ValueProposition'
import TrustedCompanies from '@/components/TrustedCompanies'

export default function Home() {
  return (
    <main className="grow">
      <Hero />
      <ValueProposition />
      <TrustedCompanies />
      <CallToAction />
    </main>
  )
}
