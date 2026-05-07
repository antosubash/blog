import "dotenv/config"
import { PRIVACY_VALUES, type Privacy, STEP_VALUES, type Step } from "../config"
import { loadOrGenerateStoryboard } from "../pipeline/generateStoryboard"
import { loadPost } from "../pipeline/loadPost"
import { renderStoryboardVideo } from "../pipeline/render"
import { synthesizeStoryboard } from "../pipeline/synthesizeVoice"
import { uploadToYouTube } from "../pipeline/uploadYouTube"
import { writeBackVideoId } from "../pipeline/writeBackVideoId"
import { FPS, totalDurationFrames } from "../types"

const dieWithUsage = (message: string): never => {
  console.error(message)
  console.error(
    "\nUsage: pnpm video:<step> <slug> [--force-storyboard] [--force-voice] [--privacy=public|unlisted|private]"
  )
  process.exit(1)
}

const parseArgs = () => {
  const args = process.argv.slice(2)
  const slug = args.find((a) => !a.startsWith("--"))
  if (!slug) {
    dieWithUsage(
      "Provide a post slug, e.g. azure/automatic-image-cleanup-in-acr"
    )
  }

  const stepRaw = process.env.VIDEO_STEP ?? "all"
  if (!(STEP_VALUES as readonly string[]).includes(stepRaw)) {
    dieWithUsage(
      `Invalid VIDEO_STEP=${stepRaw}. Expected one of: ${STEP_VALUES.join(", ")}`
    )
  }
  const step = stepRaw as Step

  const privacyArg = args.find((a) => a.startsWith("--privacy="))
  const privacyRaw = privacyArg?.split("=")[1] ?? "unlisted"
  if (!(PRIVACY_VALUES as readonly string[]).includes(privacyRaw)) {
    dieWithUsage(
      `Invalid --privacy=${privacyRaw}. Expected one of: ${PRIVACY_VALUES.join(", ")}`
    )
  }
  const privacy = privacyRaw as Privacy

  return {
    step,
    slug: slug as string,
    forceStoryboard: args.includes("--force-storyboard"),
    forceVoice: args.includes("--force-voice"),
    privacy,
  }
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
  const rendered = await synthesizeStoryboard(storyboard, { force: forceVoice })
  const totalFrames = totalDurationFrames(rendered.timings)
  console.log(
    `Total duration: ${(totalFrames / FPS).toFixed(1)}s across ${rendered.timings.length} scenes`
  )
  if (step === "voice") return

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
