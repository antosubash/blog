/**
 * The /projects page. Stars, language and last push come from the GitHub API at
 * build time (src/lib/github.ts); related posts are the posts that link to a
 * project's repos (src/lib/projects.ts), so only curated text lives here.
 *
 * Demo sites left out while they're down (2026-11-08), add them back to `links`
 * when they answer again:
 *   SimpleModule      https://app.simplemodule.dev          (Cloudflare 521)
 *   ABP React         https://abpreact.antosubash.com       (dokploy host not answering)
 *   ABP React TanStack https://abp-tanstack.antosubash.com
 *   ABP single layer  https://abp.antosubash.com
 */
export type Project = {
  /** Anchor id on the page. */
  slug: string
  title: string
  tagline: string
  description: string
  /** GitHub repos, "owner/name"; the first is the primary one. */
  repos: string[]
  /** Old repo names posts still link to, matched for related posts. */
  aliases?: string[]
  /** Post slugs to list first; posts linking to the repos fill the rest. */
  posts?: string[]
  links?: { label: string; href: string }[]
  tags: string[]
}

export const featuredProjects: Project[] = [
  {
    slug: "simplemodule",
    title: "SimpleModule",
    tagline: "A modular monolith framework for .NET 10, with a Python port",
    description:
      "Roslyn source generators discover modules, endpoints and DTOs at compile time, so there's no reflection or manual registration. Each module owns its schema, contracts and React pages, and C# DTOs generate the TypeScript types the Inertia.js frontend uses. simple_module_python brings the same module model to FastAPI and SQLModel.",
    repos: ["antosubash/SimpleModule", "antosubash/simple_module_python"],
    posts: ["introducing-simplemodule"],
    links: [
      { label: "Python docs", href: "https://docs.py.simplemodule.dev/" },
    ],
    tags: [".NET 10", "Python", "React", "Inertia.js", "Modular monolith"],
  },
  {
    slug: "abp-react",
    title: "ABP React",
    tagline: "A React UI for the ABP Framework",
    description:
      "A drop-in replacement for ABP's default Angular UI: identity, tenants, permissions, settings and a CMS with a visual page builder. abp-react-tanstack is the newer take on TanStack Router and Start, with OIDC login and API clients generated from OpenAPI.",
    repos: ["antosubash/abp-react", "antosubash/abp-react-tanstack"],
    aliases: ["AbpReact"],
    tags: ["React", "ABP", "TanStack", "OIDC"],
  },
  {
    slug: "abp-microservice",
    title: "ABP Microservice",
    tagline: "A .NET microservice template built on ABP",
    description:
      "A dotnet new template (Anto.Abp.Microservice.Template) for starting a microservice solution with ABP, based on the long-running .NET microservice series on this blog.",
    repos: ["antosubash/abp-microservice"],
    aliases: ["AbpMicroservice"],
    tags: [".NET", "ABP", "Microservices", "Docker"],
  },
  {
    slug: "abp-single-layer-template",
    title: "ABP single-layer template",
    tagline: "A minimal, non-layered ABP starter",
    description:
      "One project instead of separate Domain, Application and Infrastructure layers, plus the fixes I add to every app: readable Swagger names, HTTPS redirect, automatic migrations, SameSite cookies, data-protection keys in the database and a production Dockerfile. It's the backend the ABP React apps run against.",
    repos: ["antosubash/abp-single-layer-template"],
    aliases: ["abp-single-layer", "AbpTemplate"],
    tags: [".NET", "ABP", "Docker"],
  },
]

/** Samples render as a compact list: name, tagline, stats and one post. */
export type Sample = Pick<
  Project,
  "slug" | "title" | "tagline" | "repos" | "posts"
>

export const sampleProjects: Sample[] = [
  {
    slug: "agent-framework-ollama",
    title: "agent-framework-ollama",
    tagline: "Microsoft Agent Framework agents running on a local Ollama model",
    repos: ["antosubash/agent-framework-ollama"],
  },
  {
    slug: "ollama-extensions-ai",
    title: "OllamaExtensionsAI",
    tagline: "Ollama with Microsoft.Extensions.AI and function calling",
    repos: ["antosubash/OllamaExtensionsAI"],
  },
  {
    slug: "semantic-kernel-ollama",
    title: "sematic-kernal-with-ollama",
    tagline: "Semantic Kernel connected to a local Ollama model",
    repos: ["antosubash/sematic-kernal-with-ollama"],
  },
  {
    slug: "modern-api-docs",
    title: "ModernApiDocs",
    tagline: ".NET OpenAPI documents rendered with Scalar",
    repos: ["antosubash/ModernApiDocs"],
  },
  {
    slug: "nextjs-oidc-sample",
    title: "nextjs-oidc-sample",
    tagline: "OpenID Connect login in Next.js with openid-client",
    repos: ["antosubash/nextjs-oidc-sample"],
  },
  {
    slug: "large-file-upload",
    title: "LargeFileUploadSample",
    tagline: "Resumable large file uploads with tus, .NET and React",
    repos: ["antosubash/LargeFileUploadSample"],
  },
  {
    slug: "todos",
    title: "Todos",
    tagline: "The sample ABP app used across the getting-started posts",
    repos: ["antosubash/Todos"],
    posts: ["abp-getting-started-p1"],
  },
  {
    slug: "tasky",
    title: "Tasky",
    tagline: "The microservice app built in the ABP microservice series",
    repos: ["antosubash/Tasky"],
  },
  {
    slug: "microk8s-hetzner",
    title: "microk8s-hetzner-deployment",
    tagline: "Setting up a MicroK8s dev server on Hetzner",
    repos: ["antosubash/microk8s-hetzner-deployment"],
  },
  {
    slug: "docker-stack",
    title: "docker_stack",
    tagline: "Docker Compose stacks for a local development machine",
    repos: ["antosubash/docker_stack"],
    posts: ["docker-swarm-localhost"],
  },
]
