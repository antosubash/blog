'use client'

import { useId } from 'react'
import { genPageMetadata } from 'app/seo'
import projectsData from '@/data/projectsData'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  const featuredId = useId()
  const featuredProjects = projectsData.filter(
    (project) =>
      project.title.toLowerCase().includes('abp') ||
      project.title.toLowerCase().includes('microservice')
  )

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 py-16 dark:from-gray-900 dark:to-gray-800 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
              My Projects
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl leading-8 text-gray-600 dark:text-gray-300">
              A collection of open-source projects, templates, and solutions that showcase my
              expertise in modern web development, microservices, and the ABP Framework.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
              <a
                href="https://github.com/antosubash"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:bg-primary-700 hover:shadow-xl"
              >
                View on GitHub
              </a>
              <a
                href={`#${featuredId}`}
                className="inline-flex items-center rounded-lg border-2 border-primary-600 px-6 py-3 text-lg font-semibold text-primary-600 transition-all hover:bg-primary-600 hover:text-white dark:text-primary-400"
              >
                Explore Projects
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects Section */}
      <div id={featuredId} className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              Featured Projects
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Highlighted projects that demonstrate my expertise and contributions to the developer
              community
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {featuredProjects.map((project) => (
              <div
                key={project.title}
                className="group rounded-xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-6 flex items-center">
                  <div className="mr-4 text-3xl">
                    {project.title.toLowerCase().includes('abp') ? '🔷' : '🏗️'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {project.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                        {project.title.toLowerCase().includes('abp')
                          ? 'ABP Framework'
                          : 'Microservices'}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                        Open Source
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mb-6 text-gray-600 dark:text-gray-300">{project.description}</p>
                <div className="flex items-center justify-between">
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    View Project
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      role="img"
                      aria-label="External link"
                    >
                      <title>External link</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                  <div className="flex space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">⭐</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">🔀</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Interested in Collaboration?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-primary-100">
            Let's work together on your next project or contribute to open-source initiatives.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
            <a
              href="mailto:antosubash@outlook.com"
              className="inline-flex items-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-primary-600 shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl"
            >
              Get in Touch
            </a>
            <a
              href="https://github.com/antosubash"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-primary-600"
            >
              View GitHub Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
