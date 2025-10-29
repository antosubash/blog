import { genPageMetadata } from 'app/seo'
import Link from '@/components/Link'
import NewsletterForm from '@/components/ui/NewsletterForm'

export const metadata = genPageMetadata({ title: 'Consulting Services' })

const ConsultingPage = () => {
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
      <div className="bg-primary-50 py-16 dark:bg-gray-900 md:py-24">
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
                href="#services"
                className="inline-flex items-center rounded-lg border-2 border-primary-600 px-6 py-3 text-lg font-semibold text-primary-600 transition-all hover:bg-primary-600 hover:text-white dark:text-primary-400"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="py-16 md:py-24">
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
            {services.map((service, index) => (
              <div
                key={index}
                className="group rounded-xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-6 text-4xl">{service.icon}</div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {service.title}
                </h3>
                <p className="mb-6 text-gray-600 dark:text-gray-300">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
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
      <div className="bg-gray-50 py-16 dark:bg-gray-900 md:py-24">
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
            {technologies.map((tech, index) => (
              <div
                key={index}
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
      <div className="py-16 md:py-24">
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
            ].map((process, index) => (
              <div key={index} className="text-center">
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

      {/* Newsletter Section */}
      <div className="bg-gray-50 py-16 dark:bg-gray-900 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              Stay Updated
            </h2>
            <p className="mb-8 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Subscribe to get the latest articles, tutorials, and updates on ABP Framework, .NET,
              and modern web development.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsultingPage
