# Projects page redesign

## Goal & scope

Make `/projects` show what Anto actually builds and maintains today, with enough context (what it is, how active it is, where to read about it) for a visitor to pick one up.

In scope:
- Four **featured** projects as cards: SimpleModule (.NET + Python), ABP React (+ TanStack), ABP Microservice, ABP single-layer template.
- A curated **Samples** list of about 10 smaller repos that each have at least one blog post.
- **Live GitHub stats** (stars, primary language, last push), fetched at build time.
- **Related posts** under each project, found automatically from the posts that link to its repo.

Out of scope: images and screenshots (no extra bandwidth), project detail pages, client-side JavaScript, and changes to other pages.

## Approach

Projects are curated data in `src/config/projectsData.ts`. Stats and related posts are derived at build time, so the page stays fully static.

Rejected alternatives:
- **List every public repo from the GitHub API:** this shows stale experiments, which you declined.
- **Hard-code the stats:** they'd go stale, and you chose live stats.
- **Fetch stats client-side:** that costs JavaScript and an API call on every visit.

## Design

### Data (`src/config/projectsData.ts`)

```ts
type ProjectLink = { label: string; href: string }   // e.g. "Live demo", "Docs", "Python port"
type Project = {
  slug: string             // anchor id, e.g. "simplemodule"
  title: string
  tagline: string          // one line under the title
  description: string      // 1–3 sentences, drawn from the repo README and the posts
  repos: string[]          // "antosubash/SimpleModule"; the first is the primary repo
  aliases?: string[]       // old repo names still linked from posts ("AbpReact", "AbpMicroservice")
  links?: ProjectLink[]    // homepages, demos, docs
  tags: string[]           // tech: ".NET", "React", "ABP", "Inertia.js"…
}
export const featuredProjects: Project[]
export const sampleProjects: Project[]   // same shape; rendered compactly
```

- Every repo URL uses the current repo name. The two existing links point at old names (`AbpReact`, `AbpMicroservice`) and only work through GitHub redirects.
- **Featured projects:**
  - **SimpleModule:** `SimpleModule` and `simple_module_python`, plus app.simplemodule.dev and docs.py.simplemodule.dev.
  - **ABP React:** `abp-react` and `abp-react-tanstack`, plus both live demos.
  - **ABP Microservice:** `abp-microservice`.
  - **ABP single-layer template:** `abp-single-layer-template`, plus abp.antosubash.com.
- **Samples:** about 10 public, non-archived repos that have posts: Todos, Tasky, nextjs-oidc-sample, microk8s-hetzner-deployment, docker_stack, agent-framework-ollama, sematic-kernal-with-ollama, OllamaExtensionsAI, ModernApiDocs and LargeFileUploadSample.

### GitHub stats (`src/lib/github.ts`)

- `getRepoStats(fullName)` calls `GET https://api.github.com/repos/{owner}/{repo}` with a 5 s timeout, using `GITHUB_TOKEN` when it's set. It returns `{ stars, language, pushedAt }` or `null`.
- Results are memoised per build; one build makes about 16 requests.
- **Any failure** (network, rate limit, 404) returns `null` and logs one warning. The card then renders without stats, and the **build never fails** because of GitHub.
- CI passes `GITHUB_TOKEN` through to the build step. On Vercel the token is optional: about 16 unauthenticated calls per build fit within GitHub's 60-per-hour anonymous limit, and adding the env var makes it robust.
- For multi-repo projects, the card shows each repo's stars next to its own link.

### Related posts (`src/lib/projects.ts`)

- `relatedPosts(project, posts)` finds published posts whose body links to `github.com/antosubash/<repo>`. Matching is case-insensitive, covers the repo names and aliases, and allows a trailing `/`, `.git` or `#`.
- Results are sorted newest first and capped at 3 on featured cards and 1 on samples.

### Page (`src/pages/projects/index.astro`)

- **Header:** title "Projects", a short intro, and a meta description that names the projects.
- **Featured:** a 2-column grid on desktop, 1 column on mobile, using the site's existing `bg-card`, `border-border` and `rounded-lg` card styles. Each card has:
  - the title and tagline;
  - the description;
  - tag chips;
  - a stats row (`★ 196 · TypeScript · updated Oct 2026`);
  - link buttons (Repo, Live demo, Docs…);
  - a "Read more" list of up to 3 related posts.
- **Samples:** a compact divided list. Each row shows the repo name (linked), a one-line description, the language, the stars, and its blog post.
- External links open in a new tab (`rel="noopener noreferrer"`). Internal post links are normal links.
- **No client JavaScript.** It works in light and dark mode, and on mobile at 390 px with no horizontal scroll.

## Decisions made (override any at approval)

- Descriptions are written by me from each repo's README and the existing posts, in the blog's plain style. Review the wording in the PR.
- Samples are picked as "has at least one post". Private repos are excluded (`dotfiles` is linked from posts but is private).
- Featured cards are ordered by current activity, not stars: SimpleModule, ABP React, ABP Microservice, ABP single-layer template.
- "Updated" shows the month and year of the last push.
- The page keeps the URL `/projects` and stays in the nav.

## Testing

- **Unit (vitest):**
  - related-post matching: aliases, case, `.git`, no false match on a repo-name prefix (`abp-react` vs `abp-react-tanstack`), drafts excluded;
  - stats: success parsing, and `null` on HTTP error, timeout and a malformed body (fetch mocked);
  - the stats line formatter.
- **Build:** `check-dist` (internal links), lint and typecheck.
- **Browser (playwright-cli):** desktop 1280, mobile 390, light and dark. Checks that cards render, there's no overflow, every external link has a `href`, and the build without network still renders cards without stats.

## Risks

- **GitHub rate limiting** on Vercel's shared IPs without a token. Mitigation: the null fallback, plus a recommendation to add `GITHUB_TOKEN` (a fine-grained, read-only, public-repo token) to Vercel.
- **Wrong or out-of-date descriptions:** the PR review catches these.
