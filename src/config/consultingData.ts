/**
 * The /consulting page copy. The proof under each area (post count and newest
 * posts) is computed at build from `tags` (src/lib/consulting.ts); `projects`
 * are featuredProjects slugs, linked as /projects#slug; `links` are extra
 * links shown after them in the card's "See:" line.
 */
export type PracticeArea = {
  /** Anchor id on the page. */
  slug: string
  title: string
  summary: string
  helpWith: string[]
  /** Post tags that count as proof for this area. */
  tags: string[]
  projects?: string[]
  /** Extra external links shown with the projects. */
  links?: { label: string; href: string }[]
}

export type Engagement = { title: string; summary: string; youGet: string[] }

export const abpExpertUrl = "https://abp.io/expert/antosubash"

export const practiceAreas: PracticeArea[] = [
  {
    slug: "modular-monoliths",
    title: "Modular monoliths in Python and .NET",
    summary:
      "One deployable app built from self-contained modules, each with its own tables, endpoints and pages. You get clear boundaries without paying the microservice tax.",
    helpWith: [
      "Structuring a new FastAPI or ASP.NET Core app as modules",
      "Breaking a tangled codebase into modules, one step at a time",
      "Multi-tenancy, background jobs and a reliable outbox",
      "Adopting SimpleModule for Python or .NET",
    ],
    tags: ["modular-monolith", "simplemodule"],
    projects: ["simplemodule"],
  },
  {
    slug: "abp",
    title: "ABP Framework and .NET",
    summary:
      "New ABP applications and modules, upgrades of existing ones, and the architecture around them, from a single layer up to microservices.",
    helpWith: [
      "Starting an ABP app or module the right way",
      "Upgrading ABP and .NET versions",
      "Microservices, gateways and OpenIddict identity",
      "React or Next.js frontends in place of the Angular UI",
    ],
    tags: ["abp", "microservice", "identity-server"],
    projects: ["abp-react", "abp-microservice", "abp-single-layer-template"],
    links: [{ label: "ABP Expert profile", href: abpExpertUrl }],
  },
  {
    slug: "geospatial",
    title: "Geospatial and scientific data platforms",
    summary:
      "Web platforms that collect, validate and serve geodata for research teams, from field surveys to map layers and image archives.",
    helpWith: [
      "PostGIS data models and spatial APIs",
      "Vector tile servers and fast map UIs",
      "Image and raster processing pipelines",
      "Survey and validation apps for citizen science",
    ],
    tags: [],
  },
  {
    slug: "applied-ai",
    title: "Applied AI and computer vision",
    summary:
      "Models that do a specific job inside your product: classifying images, reading scenes with vision-language models, or calling a local LLM from .NET.",
    helpWith: [
      "Image classification and vision-language model pipelines",
      "Serving models behind a FastAPI service",
      "Local LLMs with Ollama, Semantic Kernel and Microsoft.Extensions.AI",
      "Agents with Microsoft Agent Framework",
    ],
    tags: ["ollama", "llm"],
  },
  {
    slug: "ai-engineering",
    title: "AI-assisted engineering for teams",
    summary:
      "Setting up coding agents such as Claude Code and Codex so their pull requests are reviewed, tested in a browser and verified before anyone reads them.",
    helpWith: [
      "Skills and workflows from issue to merge-ready PR",
      "Automated review, QA and verification loops",
      "Running agents safely on shared machines",
      "Training your team to work with agents",
    ],
    tags: ["claude-code", "ai-workflows"],
  },
  {
    slug: "cloud",
    title: "Cloud and deployment",
    summary:
      "Getting all of the above into production and keeping it there, with containers, Kubernetes and CI/CD that the team can run.",
    helpWith: [
      "Docker images and compose stacks",
      "Kubernetes on AKS, MicroK8s or Helm",
      "CI/CD pipelines with GitHub Actions",
      "Observability for .NET and Python services",
    ],
    tags: ["docker", "kubernetes", "aks", "microk8s"],
  },
]

export const engagements: Engagement[] = [
  {
    title: "Architecture review",
    summary:
      "A fixed-scope look at your codebase and how it runs, before you commit to a direction.",
    youGet: [
      "A written report with prioritised fixes",
      "A walkthrough call with your team",
    ],
  },
  {
    title: "Hands-on build",
    summary:
      "I build or extend a feature, module or whole app, working in your repository with your team.",
    youGet: [
      "Working code in reviewed pull requests",
      "Tests and docs your team can maintain",
    ],
  },
  {
    title: "Team training",
    summary:
      "Workshops on ABP, modular architecture or AI tooling, built around your own code rather than toy examples.",
    youGet: ["Sessions shaped to your stack", "Material your team keeps"],
  },
  {
    title: "Ongoing support",
    summary:
      "A monthly arrangement for code reviews, upgrades and the questions that come up along the way.",
    youGet: [
      "A monthly block of hours, agreed up front",
      "Reviews and answers by email",
    ],
  },
]
