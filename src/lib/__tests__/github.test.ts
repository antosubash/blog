import { beforeEach, describe, expect, it, vi } from "vitest"
import { clearRepoStatsCache, formatStats, getRepoStats } from "../github"

const ok = (body: unknown) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status: 200 }))

describe("getRepoStats", () => {
  beforeEach(() => {
    clearRepoStatsCache()
    vi.spyOn(console, "warn").mockImplementation(() => {})
  })

  it("reads stars, language and last push, sending the token when set", async () => {
    const fetchImpl = ok({
      stargazers_count: 196,
      language: "TypeScript",
      pushed_at: "2026-10-23T08:00:00Z",
    })
    const stats = await getRepoStats("antosubash/abp-react", {
      fetchImpl,
      token: "t0ken",
    })
    expect(stats).toEqual({
      stars: 196,
      language: "TypeScript",
      pushedAt: "2026-10-23T08:00:00Z",
    })
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ]
    expect(url).toBe("https://api.github.com/repos/antosubash/abp-react")
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer t0ken"
    )
  })

  it("memoises per repo", async () => {
    const fetchImpl = ok({
      stargazers_count: 1,
      language: null,
      pushed_at: "2026-01-01T00:00:00Z",
    })
    await getRepoStats("a/b", { fetchImpl })
    await getRepoStats("A/B", { fetchImpl })
    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })

  it.each([
    ["an HTTP error", vi.fn(async () => new Response("{}", { status: 403 }))],
    [
      "a network error",
      vi.fn(async () => {
        throw new TypeError("fetch failed")
      }),
    ],
    ["a malformed body", ok({ message: "Not Found" })],
  ])("returns null on %s", async (_, fetchImpl) => {
    expect(
      await getRepoStats("x/y", { fetchImpl: fetchImpl as typeof fetch })
    ).toBeNull()
  })

  it("returns null when the request times out", async () => {
    const fetchImpl = vi.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_, reject) =>
          init?.signal?.addEventListener("abort", () =>
            reject(new Error("aborted"))
          )
        )
    )
    expect(
      await getRepoStats("slow/repo", {
        fetchImpl: fetchImpl as typeof fetch,
        timeoutMs: 20,
      })
    ).toBeNull()
  })
})

describe("formatStats", () => {
  it("joins stars, language and the month of the last push", () => {
    expect(
      formatStats({
        stars: 1234,
        language: "C#",
        pushedAt: "2026-10-06T10:00:00Z",
      })
    ).toBe("★ 1,234 · C# · updated Oct 2026")
  })
  it("leaves out a missing language", () => {
    expect(
      formatStats({
        stars: 3,
        language: null,
        pushedAt: "2025-01-15T00:00:00Z",
      })
    ).toBe("★ 3 · updated Jan 2025")
  })
})
