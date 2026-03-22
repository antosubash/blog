import { createFileRoute } from "@tanstack/react-router"
import { Mail, MapPin, Phone, Github, Twitter, Linkedin } from "lucide-react"
import siteMetadata from "@/config/siteMetadata"
import SectionContainer from "@/components/SectionContainer"
import ContactForm from "@/components/ContactForm"
import { genPageMetadata } from "@/lib/seo"

export const Route = createFileRoute("/contact/")({
  component: ContactPage,
  head: () => genPageMetadata({ title: "Contact" }),
})

function ContactPage() {
  return (
    <>
      <SectionContainer>
        <div className="divide-y divide-border">
          <div className="space-y-2 pb-8 pt-12 sm:pt-16 md:space-y-5">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Contact
            </h1>
            <p className="text-lg leading-7 text-muted-foreground">
              Get in touch with me for collaborations, questions, or just to say hello!
            </p>
          </div>
          <div className="py-12 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Contact Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-2xl font-semibold text-foreground">
                    Let's Connect
                  </h2>
                  <p className="mb-6 text-muted-foreground">
                    I'm always open to discussing new projects, creative ideas, or opportunities to
                    be part of your visions.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <a
                        href={`mailto:${siteMetadata.email}`}
                        className="text-accent hover:underline"
                      >
                        {siteMetadata.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium text-foreground">Location</p>
                      <p className="text-muted-foreground">Remote / Worldwide</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium text-foreground">Availability</p>
                      <p className="text-muted-foreground">Open to new opportunities</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="mb-3 text-lg font-semibold text-foreground">
                    Follow Me
                  </h3>
                  <div className="flex space-x-4">
                    {siteMetadata.github && (
                      <a
                        href={siteMetadata.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-sm text-muted-foreground transition-colors hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                        aria-label="GitHub"
                      >
                        <Github className="h-6 w-6" />
                      </a>
                    )}
                    {siteMetadata.twitter && (
                      <a
                        href={siteMetadata.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-sm text-muted-foreground transition-colors hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                        aria-label="Twitter"
                      >
                        <Twitter className="h-6 w-6" />
                      </a>
                    )}
                    {siteMetadata.linkedin && (
                      <a
                        href={siteMetadata.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-sm text-muted-foreground transition-colors hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-6 w-6" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-2xl font-semibold text-foreground">
                    Send a Message
                  </h2>
                  <p className="mb-6 text-muted-foreground">
                    Fill out the form below and I'll get back to you as soon as possible.
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </>
  )
}
