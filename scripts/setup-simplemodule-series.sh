#!/usr/bin/env bash
# Sets up the antosubash/simplemodule-series companion repo for the
# SimpleModule blog series. Creates the public GitHub repo, seeds main
# with a README + baseline placeholder, then creates 18 stub branches
# (one per post) and pushes everything.
#
# Requirements: git, gh (authenticated)
# Usage: bash scripts/setup-simplemodule-series.sh
set -euo pipefail

REPO="simplemodule-series"
OWNER="antosubash"
DESC="Companion code for the SimpleModule blog series. Each post lives on its own branch and is independently reproducible."
WORKDIR="${HOME}/code/${REPO}"

# Branch slug | GitHub issue number | human title
BRANCHES=(
  "01-getting-started|138|Getting Started: install, scaffold, run"
  "02-architecture-overview|139|Architecture overview: modular monolith, layout, conventions"
  "03-module-from-scratch|140|Building a module from scratch with the source generator"
  "04-dto-typescript-bridge|141|How [Dto] and the TypeScript bridge work"
  "05-eventbus-communication|142|Inter-module communication with IEventBus"
  "06-inertia-react|143|Inertia.js + React integration patterns"
  "07-multitenancy-openiddict|144|Multi-tenancy and authorization with OpenIddict"
  "08-permissions|145|Permissions module deep dive"
  "09-efcore-migrations|146|EF Core migrations per module (moving off EnsureCreated)"
  "10-background-jobs|147|Background jobs module"
  "11-email|148|Email module"
  "12-file-storage|149|File storage module"
  "13-feature-flags-settings|150|Feature flags and settings"
  "14-localization|151|Localization"
  "15-audit-logs-rate-limiting|152|Audit logs and rate limiting"
  "16-testing|153|Testing modules with the shared web app factory"
  "17-sm-cli|154|The sm CLI: scaffolding and sm doctor"
  "18-aspire-deployment|155|Deploying with .NET Aspire and observability"
)

mkdir -p "${WORKDIR}"
cd "${WORKDIR}"
git init -b main

# ---------- main: top-level README ----------
cat > README.md <<'EOF'
# SimpleModule Series

Companion code for the [SimpleModule](https://github.com/antosubash/SimpleModule) blog series on
[blog.antosubash.com](https://blog.antosubash.com).

Every post in this series is **independently reproducible**. Each post has its own branch in this
repo. To follow a post, clone *only* that branch — you don't need anything from `main` or any
other branch.

```bash
git clone --branch 03-module-from-scratch --single-branch \
  https://github.com/antosubash/simplemodule-series.git
```

## Branches

| # | Branch | Post | Issue |
| - | ------ | ---- | ----- |
| 01 | [`01-getting-started`](../../tree/01-getting-started) | Getting Started: install, scaffold, run | [#138](https://github.com/antosubash/blog/issues/138) |
| 02 | [`02-architecture-overview`](../../tree/02-architecture-overview) | Architecture overview | [#139](https://github.com/antosubash/blog/issues/139) |
| 03 | [`03-module-from-scratch`](../../tree/03-module-from-scratch) | Building a module from scratch | [#140](https://github.com/antosubash/blog/issues/140) |
| 04 | [`04-dto-typescript-bridge`](../../tree/04-dto-typescript-bridge) | `[Dto]` and the TypeScript bridge | [#141](https://github.com/antosubash/blog/issues/141) |
| 05 | [`05-eventbus-communication`](../../tree/05-eventbus-communication) | Inter-module communication with `IEventBus` | [#142](https://github.com/antosubash/blog/issues/142) |
| 06 | [`06-inertia-react`](../../tree/06-inertia-react) | Inertia.js + React integration | [#143](https://github.com/antosubash/blog/issues/143) |
| 07 | [`07-multitenancy-openiddict`](../../tree/07-multitenancy-openiddict) | Multi-tenancy and OpenIddict | [#144](https://github.com/antosubash/blog/issues/144) |
| 08 | [`08-permissions`](../../tree/08-permissions) | Permissions module deep dive | [#145](https://github.com/antosubash/blog/issues/145) |
| 09 | [`09-efcore-migrations`](../../tree/09-efcore-migrations) | EF Core migrations per module | [#146](https://github.com/antosubash/blog/issues/146) |
| 10 | [`10-background-jobs`](../../tree/10-background-jobs) | Background jobs module | [#147](https://github.com/antosubash/blog/issues/147) |
| 11 | [`11-email`](../../tree/11-email) | Email module | [#148](https://github.com/antosubash/blog/issues/148) |
| 12 | [`12-file-storage`](../../tree/12-file-storage) | File storage module | [#149](https://github.com/antosubash/blog/issues/149) |
| 13 | [`13-feature-flags-settings`](../../tree/13-feature-flags-settings) | Feature flags and settings | [#150](https://github.com/antosubash/blog/issues/150) |
| 14 | [`14-localization`](../../tree/14-localization) | Localization | [#151](https://github.com/antosubash/blog/issues/151) |
| 15 | [`15-audit-logs-rate-limiting`](../../tree/15-audit-logs-rate-limiting) | Audit logs and rate limiting | [#152](https://github.com/antosubash/blog/issues/152) |
| 16 | [`16-testing`](../../tree/16-testing) | Testing modules | [#153](https://github.com/antosubash/blog/issues/153) |
| 17 | [`17-sm-cli`](../../tree/17-sm-cli) | The `sm` CLI | [#154](https://github.com/antosubash/blog/issues/154) |
| 18 | [`18-aspire-deployment`](../../tree/18-aspire-deployment) | Deploying with .NET Aspire | [#155](https://github.com/antosubash/blog/issues/155) |

## Baseline scaffold on `main`

`main` holds the minimum `sm new` output that every branch starts from. To regenerate:

```bash
sm new SimpleModule.Series
```

Each post branch may diverge freely from this baseline — readers cloning a single branch should
never need to reference `main`.

## Reproducing any post

Pick a branch, clone it on its own, follow the branch's README:

```bash
git clone --branch <branch-name> --single-branch \
  https://github.com/antosubash/simplemodule-series.git
cd simplemodule-series
# follow README.md on that branch
```
EOF

# ---------- main: baseline scaffold placeholder ----------
cat > BASELINE.md <<'EOF'
# Baseline scaffold

Run `sm new SimpleModule.Series` from this directory to generate the baseline scaffold,
then commit the result to `main`. Each post branch starts from this baseline and adds the
specific feature for that post.
EOF

cat > .gitignore <<'EOF'
bin/
obj/
node_modules/
.vs/
.idea/
*.user
.DS_Store
EOF

git add .
git commit -m "Initial main: README and baseline placeholder"

# ---------- per-post branches ----------
for entry in "${BRANCHES[@]}"; do
  IFS='|' read -r slug issue title <<< "$entry"
  git checkout -b "$slug" main

  cat > README.md <<EOF
# ${title}

Branch for the SimpleModule series post tracked in [issue #${issue}](https://github.com/antosubash/blog/issues/${issue}).

## Independently reproducible

This branch stands on its own. You do **not** need to read other posts in the series or check
out any other branch to follow along.

\`\`\`bash
git clone --branch ${slug} --single-branch \\
  https://github.com/antosubash/simplemodule-series.git
cd simplemodule-series
\`\`\`

## Status

Stub. The post and code for this branch haven't been written yet — see issue #${issue}.

## Series

- Series tracking issue: [#156](https://github.com/antosubash/blog/issues/156)
- Intro post: https://blog.antosubash.com/posts/introducing-simplemodule
- SimpleModule framework: https://github.com/antosubash/SimpleModule
EOF

  git add README.md
  git commit -m "Stub branch for ${title} (#${issue})"
  git checkout main
done

# ---------- create remote and push everything ----------
gh repo create "${OWNER}/${REPO}" --public --description "${DESC}" --source=. --remote=origin --push
git push origin --all

echo
echo "Done. Repo: https://github.com/${OWNER}/${REPO}"
echo "Branches: $(git branch | wc -l) total"
