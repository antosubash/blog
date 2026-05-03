import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import Anthropic from "@anthropic-ai/sdk"
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod"
import { type Storyboard, StoryboardSchema } from "../types"
import type { LoadedPost } from "./loadPost"

const CACHE_DIR = path.resolve(process.cwd(), "video/cache")

const SYSTEM_PROMPT = `You convert technical blog posts into storyboards for short YouTube videos (typically 6–10 minutes).

Output a Storyboard with these constraints:
- The first scene must be type "intro" with the post title and tags.
- The last scene must be type "outro" with a CTA pointing readers to the post.
- Between them, alternate "section" and "code" scenes that follow the post's structure.
- Use "code" scenes only for code blocks that are short enough to fit comfortably on screen (≤25 lines, ≤80 cols). For longer code, summarize in a "section" with bullets.
- Narration is conversational spoken English. No markdown, no "Welcome back to my channel". Read like a friendly senior engineer explaining the topic. 15–35 seconds per scene when read aloud at a natural pace.
- Bullets are short (≤80 chars), no trailing punctuation.
- Skip noisy headings ("Conclusion", "References") unless they have substance.
- Aim for 8–18 scenes total.`

export async function generateStoryboard(
  post: LoadedPost
): Promise<Storyboard> {
  const client = new Anthropic()

  const userPrompt = `Slug: ${post.slug}
Title: ${post.title}
Tags: ${post.tags.join(", ")}
Post URL: ${post.postUrl}
Excerpt: ${post.excerpt}

---
Body (MDX):

${post.body}`

  const response = await client.messages.parse({
    model: "claude-opus-4-7",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "high",
      format: zodOutputFormat(StoryboardSchema),
    },
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  })

  if (!response.parsed_output) {
    throw new Error(
      `Claude returned no parsed storyboard. stop_reason=${response.stop_reason}`
    )
  }

  return response.parsed_output
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
    } catch {
      // fall through
    }
  }

  console.log(`Generating storyboard for ${post.slug} via Claude Opus 4.7...`)
  const storyboard = await generateStoryboard(post)

  await mkdir(path.dirname(cachePath), { recursive: true })
  await writeFile(cachePath, JSON.stringify(storyboard, null, 2))
  console.log(`Wrote storyboard to ${cachePath}`)
  return storyboard
}
