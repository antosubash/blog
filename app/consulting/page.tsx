import { genPageMetadata } from 'app/seo'
import Link from '@/components/Link'

export const metadata = genPageMetadata({ title: 'Consulting Services' })

const ConsultingPage = () => {
  // Generate unique IDs for sections
  const servicesId = 'services-section'
  const technologiesId = 'technologies-section'
  const processId = 'process-section'
  const services = [
    {
      title: 'Application Development',
      description:
        'From conceptualization to execution, I help you build robust ABP applications from scratch, ensuring scalability, efficiency, and adherence to industry best practices.',
      icon: '🚀',
      features: [
        'Full-stack development',
        'Microservices architecture',
        'Cloud-native solutions',
        'Performance optimization',
      ],
    },
    {
      title: 'Customization & Optimization',
      description:
        'Transform your existing ABP application with expert guidance to enhance performance, functionality, and alignment with your evolving business requirements.',
      icon: '⚡',
      features: [
        'Performance tuning',
        'Feature enhancements',
        'Code refactoring',
        'Integration services',
      ],
    },
    {
      title: 'Problem Solving & Troubleshooting',
      description:
        'Expert technical support to identify and resolve complex issues efficiently, minimizing downtime and maximizing productivity across your ABP projects.',
      icon: '🔧',
      features: [
        'Debugging & diagnostics',
        'Root cause analysis',
        'Performance bottlenecks',
        'Security audits',
      ],
    },
    {
      title: 'Training & Knowledge Transfer',
      description:
        'Empower your team with comprehensive training sessions and knowledge transfer initiatives tailored to your organizational needs and technical requirements.',
      icon: '📚',
      features: [
        'Team workshops',
        'Best practices training',
        'Architecture guidance',
        'Code reviews',
      ],
    },
  ]

  const technologies = [
    { name: 'ABP Framework', icon: '🔷' },
    { name: '.NET Core', icon: '💜' },
    { name: 'React/Next.js', icon: '⚛️' },
    { name: 'Docker & Kubernetes', icon: '🐳' },
    { name: 'Azure Cloud', icon: '☁️' },
    { name: 'Microservices', icon: '🏗️' },
    { name: 'Identity & Security', icon: '🔐' },
    { name: 'API Development', icon: '🔌' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-16 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
              Expert Consulting Services
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl leading-8 text-gray-600 dark:text-gray-300">
              Transform your ABP projects with professional guidance and technical expertise. From
              development to optimization, I help you achieve your goals efficiently and
              effectively.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
              <Link
                href="mailto:antosubash@outlook.com"
                className="inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:bg-primary-700 hover:shadow-xl"
              >
                Get Started Today
              </Link>
              <Link
                href={`#${servicesId}`}
                className="inline-flex items-center rounded-lg border-2 border-primary-600 px-6 py-3 text-lg font-semibold text-primary-600 transition-all hover:bg-primary-600 hover:text-white dark:text-primary-400"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id={servicesId} className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              Services Offered
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Comprehensive consulting services tailored to your specific needs and project
              requirements
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.title}
                className="group rounded-xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-6 text-4xl">{service.icon}</div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {service.title}
                </h3>
                <p className="mb-6 text-gray-600 dark:text-gray-300">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                    >
                      <span className="mr-2 text-primary-600">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technologies Section */}
      <div id={technologiesId} className="bg-gray-50 py-16 dark:bg-gray-900 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              Technologies & Expertise
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Deep expertise in modern development technologies and frameworks
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg dark:bg-gray-800"
              >
                <div className="mb-3 text-3xl">{tech.icon}</div>
                <span className="text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div id={processId} className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              How We Work Together
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              A structured approach to ensure successful project delivery
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Discovery',
                description: 'Understanding your requirements and project scope',
              },
              {
                step: '02',
                title: 'Planning',
                description: 'Creating a detailed roadmap and timeline',
              },
              {
                step: '03',
                title: 'Execution',
                description: 'Implementing solutions with regular updates',
              },
              {
                step: '04',
                title: 'Delivery',
                description: 'Handing over with documentation and support',
              },
            ].map((process) => (
              <div key={process.step} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white">
                  {process.step}
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                  {process.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-primary-100">
            Let's discuss your project requirements and how I can help you achieve your goals.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
            <Link
              href="mailto:antosubash@outlook.com"
              className="inline-flex items-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-primary-600 shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl"
            >
              Contact Me
            </Link>
            <Link
              href="https://abp.io/expert/antosubash"
              target="_blank"
              className="inline-flex items-center rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-primary-600"
            >
              View Expert Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsultingPage
