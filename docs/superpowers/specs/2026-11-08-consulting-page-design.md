# Consulting page redesign

## Goal & scope

Make `/consulting` say clearly what Anto can be hired for and why a visitor should believe it, then make getting in touch one step away.

In scope:
- A broader offer with six practice areas, grounded in the work profile: modular monoliths, ABP & .NET, geospatial data platforms, applied AI & computer vision, AI-assisted engineering, and cloud & deployment.
- Four engagement types, with no prices.
- Proof drawn from the site's own data: posts, series and open-source projects.
- An email and ABP Expert call to action.

Out of scope:
- prices or rates;
- testimonials or client logos;
- a booking link;
- a contact form;
- changes to other pages, apart from linking into `/projects#…` anchors that already exist.

## Approach

The page is built from curated copy in `src/config/consultingData.ts`, plus proof computed at build time from the posts collection and `projectsData.ts`. It stays static, with no client JavaScript.

Rejected alternatives:
- **Keep the current generic list of four services.** It's ABP-only, its claims are generic, and nothing links to evidence.
- **Hard-coded proof numbers** ("90+ posts"). They go stale. Counting from the collection is just as cheap and stays true.

## Design

### Data (`src/config/consultingData.ts`)

```ts
type PracticeArea = {
  slug: string          // anchor id
  title: string         // "ABP Framework"
  summary: string       // 1–2 sentences
  helpWith: string[]    // 3–4 concrete things ("Migrating a layered app to modules")
  tags: string[]        // post tags that count as proof, e.g. ["abp"]
  projects?: string[]   // featuredProjects slugs, linked as /projects#slug
}
type Engagement = { title: string; summary: string; youGet: string[] }
export const practiceAreas: PracticeArea[]
export const engagements: Engagement[]
```

**Practice areas** (drafted from a private profile of recent work; review the wording in the PR):

1. **Modular monoliths (Python & .NET)**: one deployable app built from self-contained modules, without the microservice tax. Covers SimpleModule for Python (FastAPI, SQLModel, Inertia, React) and for .NET, multi-tenancy, background jobs and outbox, and migrating a tangled app to modules. Tags: `module`, `python`. Projects: simplemodule.
2. **ABP Framework & .NET**: new ABP apps and modules, upgrades, microservices, OpenIddict identity, and React or Next.js frontends that replace the Angular UI. Tags: `abp`, `microservice`, `identity-server`. Projects: abp-react, abp-microservice, abp-single-layer-template. Also linked: the ABP Expert profile.
3. **Geospatial & scientific data platforms**: web platforms for collecting, validating and serving geodata. Covers PostGIS, vector tiles (Martin), image and raster pipelines, map UIs and citizen-science surveys. No matching posts yet, so this card shows its bullets only. Clients are not named.
4. **Applied AI & computer vision**: image classification and VLM pipelines (vLLM, ViT ensembles), plus local LLMs in .NET with Ollama, Semantic Kernel, Microsoft.Extensions.AI and Agent Framework. Tags: `ollama`, `llm`.
5. **AI-assisted engineering for teams**: setting up coding agents such as Claude Code and Codex with skills, review, QA and verify loops, so that agents open PRs you can trust. Proof comes from the three ai-skills posts (the skill repo is private, so it is not linked). Tags: `claude-code`, `ai-workflows`.
6. **Cloud & deployment**: Docker, Kubernetes (AKS, MicroK8s, Helm) and CI/CD for the work above. Tags: `docker`, `kubernetes`, `aks`, `microk8s`.

**Engagements:**
- **Architecture review:** a fixed-scope look at an existing codebase, ending in a written report with prioritised fixes.
- **Hands-on build:** I build or extend the feature, module or app together with your team.
- **Team training:** workshops on ABP, modular architecture or AI tooling, using your own code.
- **Ongoing support:** a monthly retainer for reviews, upgrades and questions.

### Proof (computed at build)

- **Per practice area:**
  - "N posts" counts published posts with any of the area's tags.
  - The area lists its 3 newest matching posts as links.
  - It shows a "See the project" link for each project slug.
  - A new pure helper, `postsForTags(posts, tags, limit)` in `src/lib/consulting.ts`, returns `{count, posts}`. It reuses `isPublished` and `byDateDesc`.
- **Proof strip under the hero:** total published posts, the number of series (`getAllSeries`), and the number of open-source projects (featured plus samples). For example: "91 posts · 6 series · 14 open-source projects", with each part linking to /posts, /series and /projects.
- **No GitHub API calls.** That keeps the page independent of rate limits.

### Page (`src/pages/consulting/index.astro`)

1. **Hero.** Contents:
   - Title: "Consulting".
   - Headline: "I build modular platforms in .NET and Python, for data-heavy and AI-heavy work".
   - A one-line pitch.
   - CTA buttons: "Email me" (mailto), with the address also shown as selectable text, and "ABP Expert profile".
   - The proof strip.
2. **What I work on.** Six practice-area cards, using the `bg-surface border-border rounded-lg` style from /projects. On desktop, a 2-column grid; on mobile, 1 column. Each card has:
   - the title and summary;
   - the "I can help with" bullets;
   - the "N posts" count and up to 3 post links;
   - project links.
3. **Ways to work together.** The four engagement types as a divided list. Each one has a summary and "You get" bullets.
4. **How it starts.** Three short steps: email what you're working on, then a 30-minute call to scope it, then a written proposal. These replace the current 4-step process.
5. **Closing CTA band.** "Have a project in mind?", the email address, and the ABP Expert link.

Other details:
- **Email:** uses `siteMetadata.email` (`antosubash@live.com`). The page currently hard-codes `antosubash@outlook.com`, which differs from the rest of the site.
- **Meta description:** names the six areas.
- **Links:** external ones open in a new tab through `linkAttrs`.
- **Constraints:** works in light and dark mode and at 390 px, and adds no images.
- **Nav:** stays as it is.

## Decisions made (override any at approval)

- The email comes from `siteMetadata` (live.com), replacing the outlook.com address on the current page. Tell me if outlook.com is the one you want for consulting.
- Six practice areas, taken from the work profile. Geospatial is included even though it has no posts yet.
- **Clients are not named**, per the "no client proof" answer.
- No "Technologies" chip cloud: the practice areas already name the technologies.
- A card with 0 matching posts hides the post count rather than showing "0 posts".
- Proof counts are computed at build time; there are no hard-coded numbers.
- The page title changes from "Consulting Services" to "Consulting", and the URL stays the same.

## Testing

- **Unit (vitest) for `postsForTags`:**
  - matches any of several tags;
  - matching is case-insensitive;
  - drafts are excluded;
  - posts are sorted newest first;
  - the limit is respected;
  - `count` covers all matches, not just the limit;
  - an empty tag list returns 0.
- **Data test:** every `projects` slug in `consultingData` exists in `featuredProjects`. That keeps the `/projects#slug` links valid.
- **Build:** check-dist (internal links), lint and typecheck.
- **Browser (/qa):** desktop at 1280 px and mobile at 390 px, in light and dark mode. It checks that there's no overflow, the anchors and project links resolve, the mailto shows the right address, and the post links work.

## Risks

- **Copy accuracy:** the practice-area claims are mine, so you review them in the PR.
- **Tag drift:** a new tag such as `agents` won't count until it's added to an area's `tags` list. That's acceptable, and the list sits right next to the copy.
