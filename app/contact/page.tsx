import { Metadata } from 'next'
import { Mail, MapPin, Phone, Github, Twitter, Linkedin } from 'lucide-react'
import siteMetadata from '@/data/siteMetadata'
import SectionContainer from '@/components/SectionContainer'
import ContactForm from '@/components/ContactForm'
import { genPageMetadata } from '../seo'

export const metadata: Metadata = genPageMetadata({ title: 'Contact' })

export default function ContactPage() {
  return (
    <>
      <SectionContainer>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="space-y-2 pb-8 pt-6 md:space-y-5">
            <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
              Contact
            </h1>
            <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
              Get in touch with me for collaborations, questions, or just to say hello!
            </p>
          </div>
          <div className="py-12 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Contact Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Let's Connect
                  </h2>
                  <p className="mb-6 text-gray-600 dark:text-gray-400">
                    I'm always open to discussing new projects, creative ideas, or opportunities to
                    be part of your visions.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Email</p>
                      <a
                        href={`mailto:${siteMetadata.email}`}
                        className="text-primary-600 hover:underline dark:text-primary-400"
                      >
                        {siteMetadata.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Location</p>
                      <p className="text-gray-600 dark:text-gray-400">Remote / Worldwide</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Availability</p>
                      <p className="text-gray-600 dark:text-gray-400">Open to new opportunities</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Follow Me
                  </h3>
                  <div className="flex space-x-4">
                    {siteMetadata.github && (
                      <a
                        href={siteMetadata.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
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
                        className="text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
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
                        className="text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
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
                  <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Send a Message
                  </h2>
                  <p className="mb-6 text-gray-600 dark:text-gray-400">
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
