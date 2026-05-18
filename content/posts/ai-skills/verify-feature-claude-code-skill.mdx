---
title: 'A Claude Code Skill for Verifying a Feature End-to-End Before Opening a PR'
excerpt: 'How to encode a gated "prove it works, then PR it" pipeline as a Claude Code skill — start the app, drive the feature in a real browser, run local CI, and only then push the branch and open the pull request.'
date: '2026-05-11'
tags:
  - claude-code
  - agent-skills
  - ai-workflows
  - ci
  - playwright
  - developer-productivity
---

<TOCInline toc={props.toc} asDisclosure />

## The gap between "it compiles" and "it works"

Most teams already have a local CI checklist: formatter, build, unit tests, maybe an integration suite. What that checklist usually does *not* answer is the question every reviewer silently asks: **did you actually open the app and use the feature?**

When an AI agent writes the code, the gap widens. The diff looks reasonable, the build is green, and pushing without trying it is one keystroke away. A few weeks of that and your PRs start carrying a quiet tax — small regressions, missing wiring, console errors no one sees until staging.

A Claude Code [skill](https://docs.claude.com/en/docs/claude-code/skills) is a good place to encode the discipline you'd apply yourself. This post walks through a `verify-feature` skill that runs a gated pipeline — boot the app, drive the feature in a browser, run local CI, then (and only then) open the PR. Each stage must pass before the next runs; if any fails, the skill stops and reports.

The reference implementation lives at [SimpleModule/.claude/skills/verify-feature/SKILL.md](https://github.com/antosubash/SimpleModule/blob/main/.claude/skills/verify-feature/SKILL.md). The version below is generalized for any web stack, and there's a [setup section at the end](#setup-for-ai-agents) with the full SKILL.md files ready to drop in — including for an agent you've handed this URL to.

> **Update (May 2026):** The same workflow now ships as a user-level [`/vf` slash command](#from-skill-to-slash-command) that auto-detects the stack (JS/TS, Python, .NET), so you don't have to author or customize a SKILL.md per repo. The skill below is still the right read for *understanding* the pipeline — the slash command at the end is the right thing to *install* if you want it everywhere by default.

## The shape of the skill

A skill is just a Markdown file under `.claude/skills/<name>/SKILL.md` with a small frontmatter block. The frontmatter is what Claude reads to decide when to invoke it.

```markdown
---
name: verify-feature
description: End-to-end verification of a feature implementation before opening a PR.
  Starts the dev server, drives the feature in a real browser, runs every local CI
  step, and only then opens a pull request. Use when the user asks to "verify the
  feature", "test and ship", "run e2e + CI + PR", or any variation that means
  "prove it works, then PR it".
allowed-tools: Bash, Read, Edit, Write
---
```

Two things matter here:

- **The description is a trigger.** Claude matches the user's intent against this text, so list the phrases you actually say out loud. "Test and ship", "verify and PR", "run the full check" — whatever your team's shorthand is.
- **`allowed-tools` is a safety rail.** This skill writes files, runs shell commands, and pushes to a remote. It does not need network fetches or notebook editing. Keep the list tight. If you want to be stricter still, scope `Bash` to specific binaries (e.g. `Bash(playwright-cli:*)`, `Bash(gh:*)`) — Claude Code's permission syntax supports per-command allowlists.

The body of the file is the playbook. Claude reads it top-to-bottom each time the skill runs.

## The pipeline, stage by stage

### Stage 0 — Prepare the branch

Before any code runs, get the branch into a state where the rest of the pipeline can succeed. Three things must be true:

1. **You're not on `main`,** and the tools the skill needs are installed and authenticated.
2. **Every file you mean to ship is committed.** Otherwise the PR at the end is missing files, and stage 4's "production build" tells you nothing about the version you actually meant to ship.
3. **The branch isn't lagging `main`.** A branch that hasn't seen recent upstream commits builds locally, then breaks the moment it lands.

```bash
# 1. Pre-flight
[ "$(git rev-parse --abbrev-ref HEAD)" != "main" ] || { echo "On main; abort"; exit 1; }
for cmd in gh playwright-cli; do
  command -v $cmd >/dev/null 2>&1 || { echo "$cmd not found"; exit 1; }
done
gh auth status >/dev/null 2>&1 || { echo "gh not authenticated — run 'gh auth login'"; exit 1; }

# 2. Commit pending changes
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "<message inferred from the diff>"
fi

# 3. Sync with main by rebasing on top of it
git fetch origin main
git rebase origin/main || {
  git rebase --abort
  echo "Rebase onto main hit conflicts; resolve manually and re-run"
  exit 1
}
```

A few things to keep honest:

- **Inspect before committing.** Run `git status` and `git diff` first (the index is still empty at this point, so `git diff --cached` would show nothing). If the working tree contains files that obviously shouldn't ship (`.env`, scratch notes, large binaries), stop and ask the user — don't commit them just to keep the pipeline moving.
- **One commit, descriptive message.** Squash the pending changes into a single commit whose message follows the repo's existing style (read `git log` first).
- **Rebase, then abort on conflict.** Replaying the branch's commits on top of main keeps history linear and surfaces drift immediately. If the rebase hits conflicts, `git rebase --abort` puts things back; the skill stops and asks the user to resolve. Letting an agent auto-resolve merge conflicts is a classic way to lose work. Teams that prefer merge commits can swap `git rebase origin/main` for `git merge origin/main` — the conflict-stop rule applies either way.
- **Never amend.** If commits already exist on the branch, create a new one on top — amending rewrites history that may already be pushed.

If the working tree is clean and the branch is already up-to-date with `main`, the only real work this stage does is the preflight check — the rest is a no-op.

### Stage 1 — Start the application

Before the feature can be exercised, the dev server has to be up. Two things tend to go wrong:

1. The port is already held by a stale process from a previous run.
2. The server takes longer than the skill expects to become ready, and the next stage races it.

Both are easy to handle in shell — adjust the port for your stack:

```bash
# Free the port if something is bound to it.
PORT=3000  # or 5001, 8000, whatever your app uses
PORT_PIDS=$(lsof -ti tcp:$PORT 2>/dev/null || true)
if [ -n "$PORT_PIDS" ]; then
  echo "Port $PORT occupied by PID(s): $PORT_PIDS — killing"
  kill -9 $PORT_PIDS
  sleep 1
fi

# Start the server in the background.
npm run dev   # or: dotnet run --project ./src/Web
              #     uv run uvicorn app:app
              #     bundle exec rails s
```

The skill instructs Claude to invoke the long-running command with `run_in_background: true` and to keep the shell ID, so it can stop the server cleanly later.

Then poll for readiness instead of sleeping a fixed amount of time. The loop below caps the wait at 90 seconds (45 iterations × 2s):

```bash
for i in $(seq 1 45); do
  # Drop -k if your dev server uses plain HTTP; keep it for self-signed HTTPS.
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/ \
      | grep -qE '^(200|302|401)$'; then
    echo "App is up"; break
  fi
  sleep 2
done
```

If readiness times out, the skill reads the background shell's output, surfaces the error, and exits. No point continuing to the browser test if the app never started.

> **A note on killing processes.** Blindly `kill -9`ing whatever holds a port is fine on a dev machine you control — it is not fine on a shared box or CI runner. The skill is told to confirm with the user before killing an unfamiliar process.

### Stage 2 — Exercise the feature in a real browser

This is the stage that catches what CI doesn't: missing wiring, broken navigation, a button that 500s on click, a form that silently fails validation. The point is not to write a comprehensive end-to-end test — that's what your e2e suite is for. The point is to **prove this specific feature works** before asking a human to review it.

The skill drives the browser through [`playwright-cli`](https://www.npmjs.com/package/@playwright/cli), a shell wrapper around Playwright. Every step is a bash command, which is what makes it work well from a skill.

Make sure the binary and its companion Claude Code skill are installed:

```bash
if ! command -v playwright-cli >/dev/null 2>&1; then
  npm install -g @playwright/cli
  playwright-cli install chromium     # browser binary
  playwright-cli install --skills     # drops a playwright-cli skill into .claude/skills
fi
```

`playwright-cli install --skills` is the bit worth knowing about: it writes a ready-made `playwright-cli` skill into `.claude/skills/`, so the agent can call `playwright-cli` commands by name without you authoring a second skill. If you'd rather not install globally, replace every `playwright-cli` call with `npx -y @playwright/cli`.

Then the verification itself is a short script:

```bash
playwright-cli open http://localhost:$PORT/<route>
playwright-cli snapshot                     # confirm the page rendered
# drive the feature: click an element by ref, fill a field, submit
playwright-cli click e5
playwright-cli fill e7 "test@example.com"
playwright-cli press Enter
playwright-cli snapshot                     # confirm post-interaction state
playwright-cli console                      # check for client errors
mkdir -p .verify
playwright-cli screenshot --filename=.verify/verify-feature.png
playwright-cli close-all
```

The element refs (`e5`, `e7`) come from the accessibility snapshot — `playwright-cli snapshot` prints the DOM tree with refs that subsequent commands target. The agent doesn't need to write selectors; it reads the snapshot and points at the element it wants. (Refs are not stable across renders, so don't hard-code them — see the [troubleshooting section](#troubleshooting).)

The screenshot at the end becomes the visual evidence for the PR. Stage 5 commits it to the branch and embeds the raw URL in the PR body, so the reviewer sees what the agent saw without re-running anything.

The skill tells Claude what counts as a pass:

> **Assertions to make from the snapshots and console:**
>
> 1. The expected route is in the URL.
> 2. Key UI affordances from the feature are present in the snapshot.
> 3. After exercising the feature, the resulting state is correct.
> 4. The console returns no `error`-level entries related to the feature.
> 5. If the feature has a side effect (DB row, queue entry, external write), that side effect actually happened.
>
> If any assertion fails, stop and report. Do not proceed to CI.

Assertion 5 is the one most agent-written features miss. The UI looks right, the redirect fires, the console is clean — but the form never persisted anything. A `curl http://localhost:$PORT/api/<resource> | jq` or a one-liner `psql -c` check is usually enough to catch it.

The interesting part is what's *not* in that list. The skill does not try to enumerate every possible failure mode — it just asserts the invariants that matter, and trusts Claude to apply them to the feature in front of it. Listing more rules pushes the skill toward brittle, feature-specific checks; listing fewer makes it sloppy.

### Stage 3 — Stop the server

A small but important stage. CI's `build` step will fight the running dev server for file locks, watcher handles, and the port itself — the symptoms are slow and confusing (a phantom rebuild loop, a test that times out, a build that succeeds on retry). Stop the server before CI runs and the whole class of problems goes away.

```bash
PORT_PIDS=$(lsof -ti tcp:$PORT 2>/dev/null || true)
[ -n "$PORT_PIDS" ] && kill -9 $PORT_PIDS
```

If your harness exposes a way to terminate the background shell by ID (Claude Code does), call that as well so the harness stops tracking it.

### Stage 4 — Run local CI

This is your existing CI checklist, run sequentially with a hard stop on the first failure. Skip the optional stuff (long-running smoke suites, perf benchmarks) — the goal is fast feedback before the PR, not a duplicate of the cloud pipeline.

```bash
npm run lint           # or: ruff check . / biome ci .
npm run typecheck      # or: tsc --noEmit / mypy . / dotnet build
npm test               # or: pytest -q / dotnet test --no-build
npm run build          # production build
npm run test:smoke     # a small subset of e2e
```

At the end, print a results table. This is the single most useful artifact the skill produces — a reviewer can glance at it in the PR description and know what was actually run.

```text
| Step              | Status |
|-------------------|--------|
| Lint & Format     | pass   |
| Type Check        | pass   |
| Unit Tests        | pass   |
| Production Build  | pass   |
| E2E Smoke         | pass   |
```

If any step fails, the skill surfaces the relevant error output, suggests a fix, and exits. The PR step does not run.

### Stage 5 — Open the PR

Only reached when every previous stage passed.

```bash
# 1. Confirm there are commits ahead of main.
git log --oneline main..HEAD

# 2. Commit the verification screenshot from stage 2 and push.
git add .verify/verify-feature.png
git commit -m "Verification screenshot for <feature>"
git push -u origin HEAD

# 3. Build the raw URL for the screenshot. raw.githubusercontent.com serves
#    blob content directly, which is what GitHub's markdown renderer expects.
REPO=$(gh repo view --json owner,name -q '.owner.login + "/" + .name')
BRANCH=$(git rev-parse --abbrev-ref HEAD)
SHOT="https://raw.githubusercontent.com/${REPO}/${BRANCH}/.verify/verify-feature.png"

# 4. Open the PR with a HEREDOC body. Note the unquoted EOF — $PORT and $SHOT
#    expand inside the body. Use <<'EOF' (quoted) if you want everything literal.
gh pr create --title "<concise, under 70 chars>" --body "$(cat <<EOF
## Summary
- <what changed>
- <why>

## Verification
- Manually exercised <feature> at http://localhost:$PORT/<route>
- All local CI steps passed (lint, typecheck, tests, build, smoke)

![verification](${SHOT})

## Test plan
- [ ] CI green on PR
- [ ] Reviewer spot-checks <area>
EOF
)"
```

The PR body is templated, but the **Verification** block is the part worth keeping fresh. It tells the reviewer what was actually tested locally — not "I ran the tests", but "I navigated to `/products/new`, submitted a valid form, and confirmed the new row appeared on the index page". That kind of specificity moves reviews faster.

## A complete example run

Concrete picture, end to end. The feature is *"add a `/products/new` page that creates a product and redirects to `/products`"*.

The user says **"verify and ship the new product feature"**. The skill's description matches, Claude picks it up, and walks the stages:

```text
Stage 0 — Prepare the branch
  $ git rev-parse --abbrev-ref HEAD       # → feature/products-new
  $ command -v gh playwright-cli           # → both present
  $ gh auth status                         # → authenticated
  $ git status --porcelain                 # → 3 modified, 1 new file
  $ git diff                               # (inspected; no secrets, no junk)
  $ git add -A
  $ git commit -m "Add /products/new page and POST handler"
  $ git fetch origin main
  $ git rebase origin/main                 # → main unchanged, replay is a no-op

Stage 1 — Start the app
  $ lsof -ti tcp:3000     # → empty, port is free
  $ npm run dev           # (run_in_background, shell id: dev-1)
  Polling http://localhost:3000/ … 200 after 6s. App is up.

Stage 2 — Drive the feature
  $ playwright-cli open http://localhost:3000/products/new
  $ playwright-cli snapshot
    → form with name=e4, price=e5, submit=e7
  $ playwright-cli fill e4 "Test widget"
  $ playwright-cli fill e5 "12.50"
  $ playwright-cli click e7
  $ playwright-cli snapshot
    → URL = http://localhost:3000/products
    → row "Test widget — $12.50" present
  $ playwright-cli console
    → no error-level entries
  $ curl -s http://localhost:3000/api/products | jq '.[-1].name'
    → "Test widget"                        # side effect confirmed
  $ playwright-cli screenshot --filename=.verify/verify-feature.png
  $ playwright-cli close-all
  Assertions: 5/5 pass.

Stage 3 — Stop the server
  Killing PID on tcp:3000 and shell dev-1.

Stage 4 — Local CI
  | Step              | Status |
  |-------------------|--------|
  | Lint & Format     | pass   |
  | Type Check        | pass   |
  | Unit Tests        | pass   |
  | Production Build  | pass   |
  | E2E Smoke         | pass   |

Stage 5 — Open the PR
  $ git log --oneline main..HEAD     # → 2 commits ahead
  $ git add .verify/verify-feature.png
  $ git commit -m "Verification screenshot for products/new"
  $ git push -u origin HEAD
  $ gh repo view --json owner,name   # → acme/app
  $ gh pr create … --body "<embeds raw screenshot URL>"
  Opened: https://github.com/acme/app/pull/482
```

If stage 2's final snapshot had shown the same `/products/new` URL instead of `/products`, the skill would have stopped there with *"redirect after submit did not happen"* — no CI run, no push, no PR. That's the whole point.

## The hard rules

Every non-trivial skill needs a short "do not do this" section at the end. It is the cheapest insurance you can buy against an agent making a creative-but-wrong decision under pressure.

```markdown
## Hard rules

- **Stop on first failure.** Do not paper over a broken stage to get to the PR.
- **The PR step is gated.** If stages 1–4 didn't all pass, surface the failure and exit.
- **Never** force-push, push to `main`, or use `--no-verify`.
- **Never** add AI attribution to commits, PR bodies, or PR titles (project convention).
```

These rules exist because Claude, like any capable assistant, will try to be helpful when it gets stuck. "The lint step failed, but the test suite passed, so I went ahead and opened the PR with a note" is a perfectly reasonable thing for an eager agent to do. It is also exactly what this skill is designed to prevent.

## Troubleshooting

A handful of failure modes show up often enough to be worth naming. The fixes are short; the symptoms are not always obvious.

**Port is still held after stage 3.** Stage 3's `kill -9` covers the dev server, but file watchers, sidecar processes (esbuild, vite preview, a worker), or a debugger attached to the port may linger. If stage 4's build hangs or stage 1 of the *next* run refuses to start, widen the kill to the process group: `lsof -ti tcp:$PORT | xargs -r kill -9` then `pkill -f "node .*dev"` (or the equivalent for your stack).

**Snapshot refs change between runs.** `e5` today may be `e7` tomorrow — refs are assigned in DOM order and shift when the page re-renders. Never hard-code refs in the skill. The flow is always *snapshot → read refs → act → snapshot again*. If the agent insists on caching refs across snapshots, remind it in the skill body.

**`gh pr create` fails with `not authenticated`.** Stage 0's pre-flight checks `gh auth status` and should have caught this. If you reach stage 5 with no auth, the pre-flight was skipped or `gh auth` silently expired mid-run — run `gh auth login` and re-invoke the skill.

**The dev server returns 200 before it's actually ready.** Some stacks serve a placeholder shell while the real bundle is still compiling. Stage 1 sees 200 and moves on, then stage 2's `playwright-cli snapshot` returns a blank page. Fix it by pointing the readiness check at a path that depends on the bundle (e.g. `/api/health` for a backend, or a specific route your app actually owns), not the root URL.

**Smoke tests in stage 4 conflict with stage 2's browser.** If `npm run test:smoke` boots its own browser and your stage 2 didn't fully close the previous session, you'll see a "browser is already in use" error. Add `playwright-cli close-all` at the end of stage 2, not just `playwright-cli close`.

**The skill picks up the wrong intent.** If you find Claude triggering the skill on phrases that mean something else, tighten the `description` frontmatter. "Verify" alone is too broad — pair it with the action (`"verify the feature"`, `"verify and ship"`) and an explicit *not* list in the body if needed.

**`git rebase origin/main` hits conflicts.** Stage 0's rebase replays the branch's commits on top of main. If main has changes that touch the same lines, the rebase pauses with conflicts; the skill runs `git rebase --abort` and stops. Resolve manually (`git rebase origin/main`, fix conflicts, `git rebase --continue`) and re-invoke the skill. An agent that auto-resolves conflicts is an agent that will eventually drop someone's code.

**Screenshot URL 404s in the PR body.** The PR body links `raw.githubusercontent.com/<owner>/<repo>/<branch>/.verify/verify-feature.png`. If the URL renders broken, either the screenshot wasn't committed (`git ls-tree -r HEAD .verify/`) or wasn't pushed (`git log origin/<branch>..HEAD` should be empty when you open the PR). The skill's stage 5 commits and pushes the screenshot *before* `gh pr create` for exactly this reason — don't reorder those steps.

## Adapting it to your stack

The skill in [SimpleModule](https://github.com/antosubash/SimpleModule/blob/main/.claude/skills/verify-feature/SKILL.md) is wired for .NET 10 + Inertia.js + React, and it uses a `playwright-cli` skill that ships in the same repo. To adapt it:

1. **Replace stage 1's start command** with whatever boots your app (`npm run dev`, `dotnet run`, `uv run …`).
2. **Replace stage 1's port and health check** with the port your app listens on and a path that returns quickly.
3. **Replace stage 2's route, assertions, and side-effect check** with the specific page, behavior, and API/DB call your feature touches. The `playwright-cli` commands stay the same; only the URL, the refs you click, and the strings you assert on change.
4. **Replace stage 4's CI script** with your project's actual local-CI checklist. If you already have a `Makefile`, `justfile`, or `package.json` script that runs the whole thing, the skill can simply invoke `make ci` and be done with it.
5. **Tweak the PR template** to match your repo's PR description format. If you don't want screenshots in git history, swap the `.verify/` commit for a public-gist upload (`gh gist create --public` returns a URL) or drop the visual evidence entirely.

The stage *boundaries* are the part worth keeping intact. A version that pushes through failures to be more flexible is the same as not having the skill at all.

## When to invoke it

This skill is not a substitute for unit tests or for CI in the cloud. It is a *pre-PR* check — the thing you run right before you'd otherwise type `git push` and `gh pr create` yourself.

Good moments to invoke it:

- You finished a feature. Whether or not you've already committed, stage 0 handles it.
- An agent finished a feature and you want a quick gate before reviewing the diff.
- You're cleaning up a long-running branch and want a final sanity pass.

Bad moments to invoke it:

- Mid-implementation, when the feature isn't actually done yet. Stage 0 will happily commit half-finished work — and then the PR ships half-finished work.
- For docs-only or comment-only changes. There's nothing to verify in a browser.
- On `main`. The skill refuses to push to `main` — but it's worth not getting there in the first place.

## Why a skill at all?

You could write all of this as a shell script and call it from `package.json`. For a single project, that's probably fine.

Putting it in `.claude/skills/` buys you three things a script doesn't:

1. **Discoverability for the agent.** When you tell Claude "verify the feature and ship it," it picks up the skill from the description and follows it. No "which script was that again?" lookup.
2. **Structured stop conditions.** A shell script either runs to completion or exits non-zero. A skill can stop, summarize what passed and failed, suggest a fix, and let you decide what to do next — all in the same conversation.
3. **Versioned, reviewable workflow.** The skill lives in the repo. Changes go through PR. New team members get the same pre-PR check the rest of the team uses, automatically.

The cost is small: one Markdown file, mostly prose. The upside is that your "did you actually try it?" discipline becomes a thing the team enforces by default rather than a thing each person remembers to do on a good day.

## From skill to slash command

After living with the project-local skill for a few weeks, the friction was the *setup tax*: every new repo needed its own SKILL.md, with the port, start command, and CI commands hard-coded. The pipeline itself never changed — only the placeholders did.

So the workflow got promoted to a [user-level slash command](https://docs.claude.com/en/docs/claude-code/slash-commands) that lives once in `~/.claude/commands/vf.md` and runs anywhere. Invoke it with `/vf` (optionally with a feature description), and it auto-detects the rest:

```text
/vf add a /products/new page that creates a product and redirects
```

The five-stage gated pipeline is the same. What changed is what you no longer have to write down:

- **Stack auto-detection.** Three first-class stacks — **JS/TS**, **Python**, **.NET** — detected from `package.json` + lockfile, `pyproject.toml` / `manage.py`, or `*.sln` / `*.csproj`. The framework (Next, Vite, Django, FastAPI, ASP.NET Core, …) determines the default port, start command, and CI commands. The command echoes what it detected so you can correct before stages run.
- **Background workers.** Many features rely on a queue: emails, notifications, file processing, webhooks. The command detects `BackgroundService` / Hangfire / Celery / BullMQ / etc., and decides whether *this* feature needs the worker based on the diff and the description. If it does, Stage 1b starts the worker (after checking Redis/RabbitMQ is reachable) and Stage 2 asserts on the side effect.
- **A new Stage 2b/2c.** When an e2e suite already exists (Playwright / `pytest-playwright` / `Microsoft.Playwright.NUnit`), the smoke check in 2a is followed by *authoring or extending a durable spec* in 2b and running just that spec in 2c — the full suite still runs in Stage 4. When no e2e suite exists, the smoke check IS the verification; the command never scaffolds one as a side effect.
- **Every Bash call has an explicit timeout.** A class-based table sets the budget: 10s for quick local checks (`git status`, `lsof`), 60s for network ops (`git fetch`, `git push`, `gh pr create`), 300s for builds/unit tests, 600s for the full e2e suite. A command that exceeds its budget stops the stage — `/vf` does not retry with a higher value, because the stall itself is the signal. The Bash tool's silent 2-minute default is the failure mode this is designed to prevent: a hung `git push` or a flaky test that never completes shouldn't burn 2 minutes of wall-clock per call with no useful diagnostic at the end.
- **Flags for the awkward cases.** `--port`, `--route`, `--start`, `--health`, `--base`, plus opt-outs (`--no-pr`, `--no-rebase`, `--skip-browser`, `--no-worker`, `--no-e2e`) for repos that don't fit the defaults.

For a single project, the same file works at `.claude/commands/vf.md` in the repo instead of `~/.claude/commands/`.

**Skill or slash command?** The skill in `.claude/skills/` is the right choice when you want the pipeline *committed to the repo* — every clone of the project gets the same pre-PR check, reviewed through PRs like any other code. The slash command is the right choice when you want it *everywhere by default* without per-repo setup. They're not mutually exclusive: a repo can ship a project-specific SKILL.md that wraps `/vf` with a few project-specific assertions on top.

## Setup for AI agents

If a teammate handed you this URL with "set this up in our repo," this section is for you. Follow it top to bottom and you'll end with two skills installed and a working `verify-feature` workflow.

> The repository must already be a git repo with a `main` branch, a configured remote, and a `gh`-authenticated session (`gh auth status` should return OK). The dev server must be runnable from the repo root.

### 1. Install playwright-cli and its skill

```bash
# Binary + browser
npm install -g @playwright/cli
playwright-cli install chromium

# Drops a ready-made playwright-cli skill into .claude/skills/playwright-cli/
playwright-cli install --skills
```

If `npm install -g` is not desirable, replace every `playwright-cli` call below with `npx -y @playwright/cli` and skip the global install — but still run `playwright-cli install --skills` once so the helper skill exists.

### 2. Create the verify-feature skill

Write the following file to `.claude/skills/verify-feature/SKILL.md`. The placeholders in `<ANGLE_BRACKETS>` are the only parts you should customize for the host project — leave the structure intact.

````markdown
---
name: verify-feature
description: End-to-end verification of a feature implementation before opening a PR.
  Starts the dev server, drives the feature in a real browser via playwright-cli,
  runs every local CI step, and only then opens a pull request. Use when the user
  asks to "verify the feature", "test and ship", "run e2e + CI + PR", or any
  variation that means "prove it works, then PR it".
allowed-tools: Bash, Read, Edit, Write
---

# verify-feature

Run after a feature is implemented. Gated pipeline — each stage must pass
before the next runs. If any stage fails, stop, surface the failure, and do
NOT open a PR.

## Inputs to gather first

From conversation context (do not ask unless missing):

- **Feature description** — what was implemented.
- **Page route** — the URL path to exercise.
- **Branch** — current branch (must not be `main`).

If route is unknown, grep the diff for the route registration of your framework.

## Stage 0 — Prepare the branch

Three things must be true before verification starts.

```bash
# 1. Pre-flight: not on main, tooling present, gh authenticated.
[ "$(git rev-parse --abbrev-ref HEAD)" != "main" ] || { echo "On main; abort"; exit 1; }
for cmd in gh playwright-cli; do
  command -v $cmd >/dev/null 2>&1 || { echo "$cmd not found"; exit 1; }
done
gh auth status >/dev/null 2>&1 || { echo "gh not authenticated"; exit 1; }

# 2. Commit pending changes.
if [ -n "$(git status --porcelain)" ]; then
  git diff               # inspect unstaged changes
  git add -A
  git diff --cached      # confirm what is about to be committed
  git commit -m "<concise message inferred from the diff, matching repo style>"
fi

# 3. Sync with main by rebasing on top of it.
git fetch origin main
git rebase origin/main || {
  git rebase --abort
  echo "Rebase onto main hit conflicts; resolve manually and re-run"
  exit 1
}
```

Rules:

- Read `git log` first to match the repo's commit message style.
- If `.env`, credentials, large binaries, or scratch files appear in the diff,
  **stop and ask the user** — do not stage them.
- Create a new commit; never `--amend` an existing one.
- If the rebase hits conflicts, run `git rebase --abort` and ask the user.
  Do not auto-resolve. Teams that prefer merge commits can swap
  `git rebase origin/main` for `git merge origin/main`.

## Stage 1 — Start the application

```bash
PORT=<PORT>
PORT_PIDS=$(lsof -ti tcp:$PORT 2>/dev/null || true)
if [ -n "$PORT_PIDS" ]; then
  echo "Port $PORT occupied by PID(s): $PORT_PIDS — killing"
  kill -9 $PORT_PIDS
  sleep 1
fi
<START_COMMAND>     # e.g. npm run dev / dotnet run --project ./src/Web
```

Invoke `<START_COMMAND>` via Bash with `run_in_background: true` and keep the
shell ID for stage 3. Then poll readiness (cap 90s):

```bash
for i in $(seq 1 45); do
  if curl -s -o /dev/null -w "%{http_code}" <HEALTH_URL> \
      | grep -qE '^(200|302|401)$'; then
    echo "App is up"; break
  fi
  sleep 2
done
```

If readiness times out, read the background shell's output, surface the error,
and abort the skill.

## Stage 2 — Verify the feature with playwright-cli

```bash
playwright-cli open <BASE_URL>/<ROUTE>
playwright-cli snapshot
# drive the feature using refs from the snapshot — never hard-code refs
playwright-cli click eN
playwright-cli fill eM "<value>"
playwright-cli press Enter
playwright-cli snapshot
playwright-cli console
mkdir -p .verify
playwright-cli screenshot --filename=.verify/verify-feature.png
playwright-cli close-all
```

**Assertions to make from snapshots, console, and side effects:**

1. The expected page route is in the URL.
2. Key UI affordances from the feature are present in the snapshot.
3. After exercising the feature, the resulting state is correct.
4. `playwright-cli console` returns no `error`-level entries related to the feature.
5. If the feature has a side effect (DB row, API write, queue entry), confirm
   it actually happened — usually one `curl <BASE_URL>/api/...` or `psql -c`.

If any assertion fails, stop and report. Do not proceed to CI.

## Stage 3 — Stop the app before CI

```bash
PORT_PIDS=$(lsof -ti tcp:<PORT> 2>/dev/null || true)
[ -n "$PORT_PIDS" ] && kill -9 $PORT_PIDS
```

Also call `KillShell` on the stage-1 background shell.

## Stage 4 — Run local CI

Stop on the first failure. Replace these with the project's actual checklist:

```bash
<LINT_COMMAND>          # e.g. npm run lint
<TYPECHECK_COMMAND>     # e.g. npm run typecheck
<TEST_COMMAND>          # e.g. npm test
<BUILD_COMMAND>         # e.g. npm run build
<SMOKE_COMMAND>         # e.g. npm run test:smoke
```

Print this table at the end of stage 4:

| Step              | Status    |
|-------------------|-----------|
| Lint & Format     | pass/fail |
| Type Check        | pass/fail |
| Unit Tests        | pass/fail |
| Production Build  | pass/fail |
| E2E Smoke         | pass/fail |

If any step fails, surface the error, suggest a fix, and abort — do not open a PR.

## Stage 5 — Create the PR

Only reached when stages 1–4 all passed.

```bash
# 1. Confirm there are commits ahead of main.
git log --oneline main..HEAD   # must be non-empty

# 2. Commit the screenshot from stage 2 and push.
git add .verify/verify-feature.png
git commit -m "Verification screenshot for <feature>"
git push -u origin HEAD

# 3. Build the raw URL for the screenshot. raw.githubusercontent.com serves
#    binary blobs directly, which is what GitHub's markdown renderer expects.
REPO=$(gh repo view --json owner,name -q '.owner.login + "/" + .name')
BRANCH=$(git rev-parse --abbrev-ref HEAD)
SHOT="https://raw.githubusercontent.com/${REPO}/${BRANCH}/.verify/verify-feature.png"

# 4. Open the PR. Unquoted EOF so ${SHOT} expands; <BASE_URL>/<ROUTE> are
#    placeholders that should already be substituted by the agent at this point.
gh pr create --title "<concise title, <70 chars>" --body "$(cat <<EOF
## Summary
- <what changed>
- <why>

## Verification
- Manually exercised <feature> at <BASE_URL>/<ROUTE> via playwright-cli
- Confirmed side effect via <BASE_URL>/api/<resource>
- All local CI steps passed (lint, typecheck, tests, build, smoke)

![verification](${SHOT})

## Test plan
- [ ] CI green on PR
- [ ] Reviewer spot-checks <area>
EOF
)"
```

Return the PR URL.

## Hard rules

- **Stop on first failure.** Do not paper over a broken stage to get to the PR.
- **The PR step is gated.** If stages 1–4 didn't all pass, surface the failure and exit.
- **Never** force-push, push to `main`, or use `--no-verify`.
- **Never** add AI attribution to commits, PR bodies, or PR titles.
- Before killing PIDs, confirm they belong to processes the skill started or
  that the user expects to be killable.
````

### 3. Customize the placeholders

Edit only these tokens in the file you just wrote:

| Placeholder              | Replace with                                           |
|--------------------------|--------------------------------------------------------|
| `<PORT>`                 | Port the dev server listens on (e.g. `3000`)           |
| `<START_COMMAND>`        | Command that boots the app (e.g. `npm run dev`)        |
| `<HEALTH_URL>`           | URL that returns 200 once the app is ready             |
| `<BASE_URL>`             | Base URL of the running app (e.g. `http://localhost:3000`) |
| `<LINT_COMMAND>` … `<SMOKE_COMMAND>` | The project's actual local-CI commands     |

If the project already has a single `make ci` or `npm run ci` target that runs
the whole checklist, collapse stage 4 to that one command.

### 4. Sanity-check the install

```bash
test -f .claude/skills/playwright-cli/SKILL.md && echo "playwright-cli skill: ok"
test -f .claude/skills/verify-feature/SKILL.md && echo "verify-feature skill: ok"
gh auth status >/dev/null 2>&1 && echo "gh: authenticated"
```

All three lines should print. If `gh` isn't authenticated, run `gh auth login`
before invoking the skill — stage 5 will fail otherwise.

### 5. Commit the skills

```bash
git add .claude/skills/playwright-cli .claude/skills/verify-feature
git commit -m "Add verify-feature and playwright-cli skills"
```

Now the skill is part of the repo: every clone gets the same pre-PR check.

## Resources

- [Skill source on GitHub](https://github.com/antosubash/SimpleModule/blob/main/.claude/skills/verify-feature/SKILL.md)
- [Claude Code skills documentation](https://docs.claude.com/en/docs/claude-code/skills)
- [Claude Code slash commands documentation](https://docs.claude.com/en/docs/claude-code/slash-commands)
- [`@playwright/cli` on npm](https://www.npmjs.com/package/@playwright/cli) — the `playwright-cli` binary used in stage 2
- [GitHub CLI (`gh`) — creating pull requests](https://cli.github.com/manual/gh_pr_create)
