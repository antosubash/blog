# Consulting page: implementation plan

Design: `docs/superpowers/specs/2026-11-08-consulting-page-design.md`.

1. **`postsForTags` helper** (independent)
   - Files: `src/lib/consulting.ts`, `src/lib/__tests__/consulting.test.ts`.
   - Write these tests first:
     - matches any of several tags;
     - matching is case-insensitive;
     - drafts are excluded;
     - posts come newest first;
     - the limit is respected;
     - `count` covers all matches;
     - an empty tag list returns 0.
   - Done when `pnpm test` is green.
2. **Data** (independent)
   - Files: `src/config/consultingData.ts`, `src/lib/__tests__/consultingData.test.ts`.
   - Write this test first: every `projects` slug exists in `featuredProjects`, and slugs are unique.
   - Done when the tests are green.
3. **Page** (depends on 1 and 2)
   - File: `src/pages/consulting/index.astro`, rewritten per the design: hero with the proof strip, six area cards, engagements, how it starts, and a closing CTA.
   - The email comes from `siteMetadata`.
   - Done when `pnpm lint`, `pnpm typecheck`, `pnpm build` and check-dist all pass.
4. **Ship:** run `/ship` (optimize → review → QA at 1280 and 390 px, light and dark → /vf → PR).
