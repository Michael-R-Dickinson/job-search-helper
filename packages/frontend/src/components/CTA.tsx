import React from 'react'

const CallToAction = () => {
  return (
    <section className="py-16 bg-perfectify-primary/10">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 md:mb-6">Ready to Transform Your Job Search?</h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of job seekers who are applying to 10x more positions and landing
          interviews faster with Perfectify.
        </p>
        <div>
          <button className="cta-button text-lg px-8 py-6 shadow-xl hover:shadow-perfectify-primary/20">
            Start Applying Faster – It&apos;s Free!
          </button>
          <p className="text-sm text-muted-foreground mt-4">
            No account needed. Works with Google Docs, Word, and major job platforms.
          </p>
        </div>
      </div>
    </section>
  )
}

export default CallToAction
