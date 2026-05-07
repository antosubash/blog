import { mkdir } from "node:fs/promises"
import path from "node:path"
import { bundle } from "@remotion/bundler"
import { renderMedia, selectComposition } from "@remotion/renderer"
import type { RenderedStoryboard } from "../types"

const OUT_DIR = path.resolve(process.cwd(), "video/out")
const ENTRY = path.resolve(process.cwd(), "video/src/index.ts")

export async function renderStoryboardVideo(
  storyboard: RenderedStoryboard
): Promise<string> {
  await mkdir(OUT_DIR, { recursive: true })
  const outputLocation = path.join(
    OUT_DIR,
    `${storyboard.slug.replace(/\//g, "-")}.mp4`
  )

  console.log("Bundling Remotion project...")
  const bundleLocation = await bundle({ entryPoint: ENTRY })

  console.log("Selecting composition...")
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "BlogVideo",
    inputProps: storyboard,
  })

  console.log(`Rendering to ${outputLocation}`)
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation,
    inputProps: storyboard,
    onProgress: ({ progress }) => {
      const pct = (progress * 100).toFixed(1)
      process.stdout.write(`\r  ${pct}%   `)
    },
  })
  process.stdout.write("\n")

  return outputLocation
}
