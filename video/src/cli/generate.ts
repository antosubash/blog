import "dotenv/config"
import { loadOrGenerateStoryboard } from "../pipeline/generateStoryboard"
import { loadPost } from "../pipeline/loadPost"
import { renderStoryboardVideo } from "../pipeline/render"
import { synthesizeStoryboard } from "../pipeline/synthesizeVoice"
import { uploadToYouTube } from "../pipeline/uploadYouTube"
import { writeBackVideoId } from "../pipeline/writeBackVideoId"
import type { RenderedStoryboard } from "../types"

type Step = "storyboard" | "voice" | "render" | "upload" | "all"

const parseArgs = () => {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error(
      "Usage: pnpm video:<step> <slug> [--force-storyboard] [--force-voice] [--privacy=public|unlisted|private]"
    )
    process.exit(1)
  }
  const step = (process.env.VIDEO_STEP as Step | undefined) ?? "all"
  const slug = args.find((a) => !a.startsWith("--"))
  if (!slug) {
    console.error(
      "Provide a post slug, e.g. azure/automatic-image-cleanup-in-acr"
    )
    process.exit(1)
  }
  const forceStoryboard = args.includes("--force-storyboard")
  const forceVoice = args.includes("--force-voice")
  const privacyArg = args.find((a) => a.startsWith("--privacy="))
  const privacy = (privacyArg?.split("=")[1] ?? "unlisted") as
    | "public"
    | "unlisted"
    | "private"
  return { step, slug, forceStoryboard, forceVoice, privacy }
}

async function main() {
  const { step, slug, forceStoryboard, forceVoice, privacy } = parseArgs()

  const post = await loadPost(slug)
  console.log(`Loaded post: ${post.title}`)

  const storyboard = await loadOrGenerateStoryboard(post, {
    force: forceStoryboard,
  })
  console.log(`Storyboard has ${storyboard.scenes.length} scenes`)
  if (step === "storyboard") return

  console.log("Synthesizing voice...")
  const timings = await synthesizeStoryboard(storyboard, { force: forceVoice })
  const totalDurationFrames = timings.reduce(
    (sum, t) => sum + t.durationFrames,
    0
  )
  console.log(
    `Total duration: ${(totalDurationFrames / 30).toFixed(1)}s across ${timings.length} scenes`
  )
  if (step === "voice") return

  const rendered: RenderedStoryboard = {
    ...storyboard,
    timings,
    totalDurationFrames,
  }

  const outputPath = await renderStoryboardVideo(rendered)
  console.log(`Rendered: ${outputPath}`)
  if (step === "render") return

  console.log(`Uploading to YouTube (${privacy})...`)
  const videoId = await uploadToYouTube(outputPath, post, privacy)
  console.log(`YouTube video ID: ${videoId}`)
  await writeBackVideoId(post.filePath, videoId)
  console.log(`Wrote videoId to ${post.filePath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
