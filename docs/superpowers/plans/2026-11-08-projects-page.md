# Projects page: plan

Design: `docs/superpowers/specs/2026-11-08-projects-page-design.md` (approved 2026-11-08).

| # | Task | Files | Test first | Done when |
|---|------|-------|-----------|-----------|
| 1 | GitHub stats helper with timeout, token, memo, null fallback; stats line formatter | `src/lib/github.ts`, `src/lib/__tests__/github.test.ts` | success parse; null on 404 / throw / timeout / bad body; `formatStats` | tests pass |
| 2 | Related-post matcher (repos + aliases, case, `.git`, no prefix match, drafts out, newest first, cap, pinned slugs first) | `src/lib/projects.ts`, `src/lib/__tests__/projects.test.ts` | the cases listed | tests pass |
| 3 | Curated data: 4 featured + 10 samples, copy from READMEs and posts, current repo names; demo sites that are down go in a comment, not `links` | `src/config/projectsData.ts` | every repo exists and is public (one-off `gh` check) | data compiles |
| 4 | Page: header, featured grid, samples list | `src/pages/projects/index.astro` | — | build + check-dist pass |
| 5 | CI and link check pass GITHUB_TOKEN to build | `.github/workflows/ci.yml`, `.github/workflows/links.yml` | — | workflow valid |
| 6 | Verify: lint, typecheck, tests, build, browser desktop/mobile/light/dark, offline build | — | — | screenshots reviewed |

Tasks 1 and 2 are independent; 3 depends on nothing; 4 needs 1–3. All small, done inline.
