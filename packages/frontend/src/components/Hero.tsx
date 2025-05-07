import { Button } from './BasicButton'
import HowItWorks from './Hero/HowItWorks'

const Hero = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-bold mb-6 animate-fade-in">
            Unlock <span className="gradient-text">100s</span> of Job Applications a Day.
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            Supercharge your job search with Perfectify! Our AI-powered suite helps you tailor
            resumes, autofill applications, and track your progress, dramatically speeding up your
            ability to apply. It&apos;s all free, and no sign-up is required.
          </p>

          {/* CTA Button - Moved above the feature tiles */}
          <div className="animate-fade-in mb-12" style={{ animationDelay: '0.3s' }}>
            <Button className="cta-button text-lg px-8 py-6">
              {"Start Applying Faster – It's Free!"}
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              No account needed. Unleash your job search now.
            </p>
          </div>

          {/* How Perfectify Works - Steps */}
          <HowItWorks />
        </div>
      </div>
    </section>
  )
}

export default Hero
