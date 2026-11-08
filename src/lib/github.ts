/**
 * Repo stats from the GitHub API, read at build time for /projects. Any failure
 * (network, rate limit, 404, bad JSON) gives null and the page renders without
 * stats: GitHub must never break the build. GITHUB_TOKEN, when set, lifts the
 * anonymous rate limit (60 requests an hour per IP).
 */
export type RepoStats = {
  stars: number
  language: string | null
  pushedAt: string
}

const cache = new Map<string, Promise<RepoStats | null>>()
let warned = false

export function getRepoStats(
  fullName: string,
  {
    fetchImpl = fetch,
    token = process.env.GITHUB_TOKEN,
    timeoutMs = 5000,
  }: { fetchImpl?: typeof fetch; token?: string; timeoutMs?: number } = {}
): Promise<RepoStats | null> {
  const key = fullName.toLowerCase()
  let pending = cache.get(key)
  if (!pending) {
    pending = load(fullName, fetchImpl, token, timeoutMs)
    cache.set(key, pending)
  }
  return pending
}

async function load(
  fullName: string,
  fetchImpl: typeof fetch,
  token: string | undefined,
  timeoutMs: number
): Promise<RepoStats | null> {
  try {
    const res = await fetchImpl(`https://api.github.com/repos/${fullName}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "blog.antosubash.com build",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const body = (await res.json()) as Record<string, unknown>
    if (
      typeof body.stargazers_count !== "number" ||
      typeof body.pushed_at !== "string" ||
      Number.isNaN(Date.parse(body.pushed_at))
    ) {
      throw new Error("unexpected response")
    }
    return {
      stars: body.stargazers_count,
      language: typeof body.language === "string" ? body.language : null,
      pushedAt: body.pushed_at,
    }
  } catch (err) {
    if (!warned) {
      warned = true
      console.warn(
        `[projects] GitHub stats unavailable (${fullName}: ${err instanceof Error ? err.message : err}); rendering without them`
      )
    }
    return null
  }
}

/** "★ 196 · TypeScript · updated Oct 2026" */
export function formatStats(stats: RepoStats): string {
  const updated = new Date(stats.pushedAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
  return [
    `★ ${stats.stars.toLocaleString("en-US")}`,
    stats.language,
    `updated ${updated}`,
  ]
    .filter(Boolean)
    .join(" · ")
}

/** For tests: forget memoised results. */
export function clearRepoStatsCache() {
  cache.clear()
  warned = false
}
