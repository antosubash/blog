import { createFileRoute } from "@tanstack/react-router"
import projectsData from "@/config/projectsData"
import { genPageMetadata } from "@/lib/seo"

export const Route = createFileRoute("/projects/")({
  component: ProjectsPage,
  head: () => genPageMetadata({ title: "Projects" }),
})

function ProjectsPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-6">
      <div className="pb-8 pt-12 sm:pt-16">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Projects
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Open-source projects, templates, and solutions.
        </p>
      </div>

      <div className="divide-y divide-border">
        {projectsData.map((project) => (
          <div key={project.title} className="py-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              {project.href ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-150 hover:text-accent"
                >
                  {project.title}
                </a>
              ) : (
                project.title
              )}
            </h2>
            <p className="mt-2 text-muted-foreground">{project.description}</p>
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-sm font-medium text-accent transition-colors duration-150 hover:text-accent-hover"
              >
                View project &rarr;
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
