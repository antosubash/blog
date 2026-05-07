import { spawn } from "node:child_process"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { type Storyboard, StoryboardSchema } from "../types"
import type { LoadedPost } from "./loadPost"

const CACHE_DIR = path.resolve(process.cwd(), "video/cache")

const SCHEMA_PROMPT = `You convert a technical blog post into a storyboard for a 6–10 minute YouTube video.

Output a JSON Storyboard object — no markdown fences, no preamble, JSON only:

{
  "slug": string,
  "title": string,
  "scenes": Scene[]    // 3 or more
}

Scene is exactly one of (discriminated by "type"):
- { "type": "intro",   "id": string, "narration": string, "title": string, "tags": string[] }
- { "type": "section", "id": string, "narration": string, "heading": string, "bullets": string[] }
- { "type": "code",    "id": string, "narration": string, "heading": string, "language": string, "code": string }
- { "type": "outro",   "id": string, "narration": string, "cta": string, "postUrl": string }

Constraints:
- The first scene must be type "intro" with the post title and tags (≤6 tags).
- The last scene must be type "outro" with a CTA and the postUrl provided below.
- Between them, alternate "section" and "code" scenes that follow the post's structure.
- Use "code" scenes only for code blocks ≤25 lines and ≤80 cols. For longer code, summarize in a "section" with bullets.
- "narration" is conversational spoken English. No markdown, no "Welcome back to my channel". Read like a friendly senior engineer explaining the topic. Aim for 15–35 seconds per scene at a natural reading pace.
- "bullets" are short (≤80 chars), 1–5 per section, no trailing punctuation.
- "id" is stable kebab-case.
- Skip noisy headings ("Conclusion", "References") unless they have substance.
- Aim for 8–18 scenes total.

Output the JSON object only.`

function runClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn("claude", ["-p", "--output-format", "text"], {
      stdio: ["pipe", "pipe", "pipe"],
    })
    let stdout = ""
    let stderr = ""
    proc.stdout.on("data", (chunk) => {
      stdout += chunk.toString()
    })
    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString()
    })
    proc.on("error", (err) => {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        reject(
          new Error(
            "`claude` CLI not found on PATH. Install Claude Code from https://docs.claude.com/claude-code and run `claude /login` first."
          )
        )
        return
      }
      reject(err)
    })
    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`claude CLI exited ${code}: ${stderr.slice(0, 500)}`))
        return
      }
      resolve(stdout)
    })
    proc.stdin.write(prompt)
    proc.stdin.end()
  })
}

function extractJsonObject(text: string): string {
  const trimmed = text.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) return fenced[1].trim()
  const start = trimmed.indexOf("{")
  const end = trimmed.lastIndexOf("}")
  if (start === -1 || end === -1 || end < start) return trimmed
  return trimmed.slice(start, end + 1)
}

export async function generateStoryboard(
  post: LoadedPost
): Promise<Storyboard> {
  const prompt = `${SCHEMA_PROMPT}

---
Post to convert:

Slug: ${post.slug}
Title: ${post.title}
Tags: ${post.tags.join(", ")}
Post URL: ${post.postUrl}
Excerpt: ${post.excerpt}

Body (MDX):

${post.body}`

  const output = await runClaude(prompt)
  const jsonText = extractJsonObject(output)

  let parsed: unknown
  try {
    parsed = JSON.parse(jsonText)
  } catch {
    throw new Error(
      `Claude CLI returned non-JSON output. First 500 chars:\n${jsonText.slice(0, 500)}`
    )
  }

  return StoryboardSchema.parse(parsed)
}

export async function loadOrGenerateStoryboard(
  post: LoadedPost,
  options: { force?: boolean } = {}
): Promise<Storyboard> {
  const cachePath = path.join(CACHE_DIR, post.slug, "storyboard.json")

  if (!options.force) {
    try {
      const cached = await readFile(cachePath, "utf8")
      console.log(`Using cached storyboard at ${cachePath}`)
      return StoryboardSchema.parse(JSON.parse(cached))
    } catch {}
  }

  console.log(`Generating storyboard for ${post.slug} via Claude Code CLI...`)
  const storyboard = await generateStoryboard(post)

  await mkdir(path.dirname(cachePath), { recursive: true })
  await writeFile(cachePath, JSON.stringify(storyboard, null, 2))
  console.log(`Wrote storyboard to ${cachePath}`)
  return storyboard
}
