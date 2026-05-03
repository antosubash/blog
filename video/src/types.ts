import { z } from "zod"

export const FPS = 30
export const VIDEO_WIDTH = 1920
export const VIDEO_HEIGHT = 1080

const baseScene = {
  id: z.string().describe("Stable identifier, kebab-case"),
  narration: z
    .string()
    .describe(
      "Natural spoken narration for this scene. Conversational, no markdown, no code blocks. Aim for 15–35 seconds when read aloud."
    ),
}

export const IntroSceneSchema = z.object({
  type: z.literal("intro"),
  ...baseScene,
  title: z.string().describe("The post title, as displayed on screen"),
  tags: z.array(z.string()).max(6),
})

export const SectionSceneSchema = z.object({
  type: z.literal("section"),
  ...baseScene,
  heading: z.string().describe("Section heading shown large on screen"),
  bullets: z
    .array(z.string())
    .min(1)
    .max(5)
    .describe("Short on-screen bullet points (≤80 chars each)"),
})

export const CodeSceneSchema = z.object({
  type: z.literal("code"),
  ...baseScene,
  heading: z.string(),
  language: z
    .string()
    .describe("Prism language identifier, e.g. 'bash', 'ts', 'csharp'"),
  code: z.string().describe("The code snippet exactly as it should appear"),
})

export const OutroSceneSchema = z.object({
  type: z.literal("outro"),
  ...baseScene,
  cta: z.string().describe("Call to action, e.g. 'Read the full post'"),
  postUrl: z.string().describe("Absolute URL of the blog post"),
})

export const SceneSchema = z.discriminatedUnion("type", [
  IntroSceneSchema,
  SectionSceneSchema,
  CodeSceneSchema,
  OutroSceneSchema,
])

export const StoryboardSchema = z.object({
  slug: z.string(),
  title: z.string(),
  scenes: z
    .array(SceneSchema)
    .min(3)
    .describe(
      "Ordered scenes. Must start with intro, end with outro, and contain at least one section between them."
    ),
})

export type Scene = z.infer<typeof SceneSchema>
export type Storyboard = z.infer<typeof StoryboardSchema>

export type SceneTiming = {
  startFrame: number
  durationFrames: number
  voiceFile: string | null
}

export type RenderedStoryboard = Storyboard & {
  totalDurationFrames: number
  timings: SceneTiming[]
}
