import { FileText, SquareArrowRight, ListChecks } from 'lucide-react'
import { Button } from './BasicButton'

const Hero = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-bold mb-6 animate-fade-in">
            Unlock <span className="gradient-text">NEXTJS</span> of Job Applications a Day.
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
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            {/* AI Resume Tailoring */}
            <div className="bg-linear-to-br from-perfectify-light via-white to-perfectify-light/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-perfectify-light/30 group">
              <div className="w-16 h-16 rounded-full bg-perfectify-primary text-white flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="font-bold text-xl text-perfectify-primary">
                  1. AI Resume Tailoring
                </span>
              </div>
              <p className="text-muted-foreground">
                Upload your resume & paste a job URL for instant customization
              </p>
            </div>

            {/* Rapid Autofill */}
            <div className="bg-linear-to-br from-perfectify-light via-white to-perfectify-light/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-perfectify-light/30 group">
              <div className="w-16 h-16 rounded-full bg-perfectify-primary text-white flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform">
                <SquareArrowRight className="w-8 h-8" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="font-bold text-xl text-perfectify-primary">2. Rapid Autofill</span>
              </div>
              <p className="text-muted-foreground">
                Fill applications automatically across major job platforms
              </p>
            </div>

            {/* Smart Tracking */}
            <div className="bg-linear-to-br from-perfectify-light via-white to-perfectify-light/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-perfectify-light/30 group">
              <div className="w-16 h-16 rounded-full bg-perfectify-primary text-white flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform">
                <ListChecks className="w-8 h-8" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="font-bold text-xl text-perfectify-primary">3. Smart Tracking</span>
              </div>
              <p className="text-muted-foreground">
                Monitor all applications and interviews in one dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
