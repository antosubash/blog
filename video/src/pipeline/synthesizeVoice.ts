import { spawn } from "node:child_process"
import { mkdir, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { FPS, type SceneTiming, type Storyboard } from "../types"

const CACHE_DIR = path.resolve(process.cwd(), "video/cache")

// Padding around the narration so scene transitions don't clip the audio.
const PRE_PAD_FRAMES = 12
const POST_PAD_FRAMES = 18
const FALLBACK_DURATION_FRAMES = 5 * FPS

type ElevenLabsOptions = {
  voiceId?: string
  modelId?: string
}

export async function synthesizeScene(
  text: string,
  outPath: string,
  options: ElevenLabsOptions = {}
): Promise<void> {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY not set")

  const voiceId =
    options.voiceId ?? process.env.ELEVENLABS_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM" // Rachel
  const modelId =
    options.modelId ?? process.env.ELEVENLABS_MODEL_ID ?? "eleven_turbo_v2_5"

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `ElevenLabs returned ${response.status}: ${body.slice(0, 500)}`
    )
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  await mkdir(path.dirname(outPath), { recursive: true })
  await writeFile(outPath, buffer)
}

export async function getMp3DurationSeconds(filePath: string): Promise<number> {
  // Use ffprobe — already available because Remotion ships ffmpeg.
  return new Promise((resolve, reject) => {
    const proc = spawn("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      filePath,
    ])
    let stdout = ""
    let stderr = ""
    proc.stdout.on("data", (chunk) => {
      stdout += chunk.toString()
    })
    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString()
    })
    proc.on("error", reject)
    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`ffprobe failed (${code}): ${stderr}`))
        return
      }
      const seconds = Number.parseFloat(stdout.trim())
      if (!Number.isFinite(seconds)) {
        reject(new Error(`ffprobe returned non-numeric duration: ${stdout}`))
        return
      }
      resolve(seconds)
    })
  })
}

export async function synthesizeStoryboard(
  storyboard: Storyboard,
  options: { force?: boolean } = {}
): Promise<SceneTiming[]> {
  const voiceDir = path.join(CACHE_DIR, storyboard.slug, "voice")
  await mkdir(voiceDir, { recursive: true })

  const timings: SceneTiming[] = []
  let cursor = 0

  for (const [index, scene] of storyboard.scenes.entries()) {
    const fileName = `${String(index).padStart(2, "0")}-${scene.id}.mp3`
    const outPath = path.join(voiceDir, fileName)

    let needsRender = options.force === true
    if (!needsRender) {
      try {
        await stat(outPath)
      } catch {
        needsRender = true
      }
    }

    if (needsRender) {
      console.log(
        `  [${index + 1}/${storyboard.scenes.length}] TTS ${scene.id}`
      )
      await synthesizeScene(scene.narration, outPath)
    }

    let durationSeconds: number
    try {
      durationSeconds = await getMp3DurationSeconds(outPath)
    } catch (error) {
      console.warn(
        `  ffprobe failed for ${outPath}; falling back to ${FALLBACK_DURATION_FRAMES / FPS}s. Reason: ${(error as Error).message}`
      )
      durationSeconds = FALLBACK_DURATION_FRAMES / FPS
    }

    const audioFrames = Math.ceil(durationSeconds * FPS)
    const durationFrames = audioFrames + PRE_PAD_FRAMES + POST_PAD_FRAMES

    timings.push({
      startFrame: cursor,
      durationFrames,
      voiceFile: outPath,
    })
    cursor += durationFrames
  }

  return timings
}
