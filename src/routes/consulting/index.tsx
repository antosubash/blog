import { createFileRoute } from "@tanstack/react-router"
import { genPageMetadata } from "@/lib/seo"

export const Route = createFileRoute("/consulting/")({
  component: ConsultingPage,
  head: () => genPageMetadata({ title: "Consulting Services" }),
})

function ConsultingPage() {
  const services = [
    {
      title: "Application Development",
      description:
        "From conceptualization to execution, I help you build robust ABP applications from scratch, ensuring scalability, efficiency, and adherence to industry best practices.",
      features: [
        "Full-stack development",
        "Microservices architecture",
        "Cloud-native solutions",
        "Performance optimization",
      ],
    },
    {
      title: "Customization & Optimization",
      description:
        "Transform your existing ABP application with expert guidance to enhance performance, functionality, and alignment with your evolving business requirements.",
      features: [
        "Performance tuning",
        "Feature enhancements",
        "Code refactoring",
        "Integration services",
      ],
    },
    {
      title: "Problem Solving & Troubleshooting",
      description:
        "Expert technical support to identify and resolve complex issues efficiently, minimizing downtime and maximizing productivity across your ABP projects.",
      features: [
        "Debugging & diagnostics",
        "Root cause analysis",
        "Performance bottlenecks",
        "Security audits",
      ],
    },
    {
      title: "Training & Knowledge Transfer",
      description:
        "Empower your team with comprehensive training sessions and knowledge transfer initiatives tailored to your organizational needs and technical requirements.",
      features: [
        "Team workshops",
        "Best practices training",
        "Architecture guidance",
        "Code reviews",
      ],
    },
  ]

  const technologies = [
    "ABP Framework",
    ".NET Core",
    "React/Next.js",
    "Docker & Kubernetes",
    "Azure Cloud",
    "Microservices",
    "Identity & Security",
    "API Development",
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="pb-8 pt-12 sm:pt-16">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Consulting Services
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Transform your ABP projects with professional guidance and technical expertise.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href="mailto:antosubash@outlook.com"
            className="inline-flex items-center text-sm font-medium text-accent transition-colors duration-150 hover:text-accent-hover"
          >
            Get in touch &rarr;
          </a>
          <a
            href="https://abp.io/expert/antosubash"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            ABP Expert Profile &rarr;
          </a>
        </div>
      </div>

      {/* Services */}
      <div className="divide-y divide-border">
        {services.map((service) => (
          <div key={service.title} className="py-8">
            <h2 className="font-display text-xl font-semibold text-foreground">
              {service.title}
            </h2>
            <p className="mt-2 text-muted-foreground">{service.description}</p>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-accent">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Technologies */}
      <div className="border-t border-border py-12">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Technologies & Expertise
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-accent-muted/50 px-3 py-1 text-sm text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Process */}
      <div className="border-t border-border py-12">
        <h2 className="font-display text-xl font-semibold text-foreground">
          How We Work Together
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {[
            { step: "01", title: "Discovery", description: "Understanding your requirements and project scope" },
            { step: "02", title: "Planning", description: "Creating a detailed roadmap and timeline" },
            { step: "03", title: "Execution", description: "Implementing solutions with regular updates" },
            { step: "04", title: "Delivery", description: "Handing over with documentation and support" },
          ].map((process) => (
            <div key={process.step}>
              <span className="text-sm font-medium text-accent">{process.step}</span>
              <h3 className="mt-1 font-semibold text-foreground">{process.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{process.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
