import CallToAction from '@/components/CTA'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import NavBar from '@/components/NavBar'
import ValueProposition from '@/components/Landing/ValueProposition'

export default function Home() {
  return (
    <div>
      <NavBar />
      <main className="grow">
        <Hero />
        <ValueProposition />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}
