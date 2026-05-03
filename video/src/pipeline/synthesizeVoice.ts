import { spawn } from "node:child_process"
import { mkdir, readFile, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { TTS_CONCURRENCY } from "../config"
import {
  FPS,
  type RenderedStoryboard,
  type SceneTiming,
  type Storyboard,
} from "../types"

const CACHE_DIR = path.resolve(process.cwd(), "video/cache")

// Padding around the narration so scene transitions don't clip the audio.
const PRE_PAD_FRAMES = 12
const POST_PAD_FRAMES = 18
const FALLBACK_DURATION_FRAMES = 5 * FPS

type ElevenLabsOptions = {
  voiceId?: string
  modelId?: string
}

async function synthesizeScene(
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

function probeMp3DurationSeconds(filePath: string): Promise<number> {
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

async function getDurationSeconds(mp3Path: string): Promise<number> {
  const sidecar = `${mp3Path}.duration`
  try {
    const [mp3Stat, sidecarStat] = await Promise.all([
      stat(mp3Path),
      stat(sidecar),
    ])
    if (sidecarStat.mtimeMs >= mp3Stat.mtimeMs) {
      const cached = Number.parseFloat(await readFile(sidecar, "utf8"))
      if (Number.isFinite(cached)) return cached
    }
  } catch {
    // sidecar missing or stale — re-probe
  }

  const seconds = await probeMp3DurationSeconds(mp3Path)
  await writeFile(sidecar, String(seconds))
  return seconds
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length)
  let cursor = 0
  const runners = Array.from(
    { length: Math.min(concurrency, items.length) },
    async () => {
      while (true) {
        const i = cursor++
        if (i >= items.length) return
        results[i] = await worker(items[i], i)
      }
    }
  )
  await Promise.all(runners)
  return results
}

export async function synthesizeStoryboard(
  storyboard: Storyboard,
  options: { force?: boolean } = {}
): Promise<RenderedStoryboard> {
  const voiceDir = path.join(CACHE_DIR, storyboard.slug, "voice")
  await mkdir(voiceDir, { recursive: true })

  type SceneAudio = { audioFrames: number; voiceFile: string }

  const audioBySceneIndex = await mapWithConcurrency(
    storyboard.scenes,
    TTS_CONCURRENCY,
    async (scene, index): Promise<SceneAudio> => {
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
        durationSeconds = await getDurationSeconds(outPath)
      } catch (error) {
        console.warn(
          `  ffprobe failed for ${outPath}; falling back to ${FALLBACK_DURATION_FRAMES / FPS}s. Reason: ${(error as Error).message}`
        )
        durationSeconds = FALLBACK_DURATION_FRAMES / FPS
      }

      return {
        audioFrames: Math.ceil(durationSeconds * FPS),
        voiceFile: outPath,
      }
    }
  )

  const timings: SceneTiming[] = []
  let cursor = 0
  for (const audio of audioBySceneIndex) {
    const durationFrames = audio.audioFrames + PRE_PAD_FRAMES + POST_PAD_FRAMES
    timings.push({
      startFrame: cursor,
      durationFrames,
      voiceFile: audio.voiceFile,
    })
    cursor += durationFrames
  }

  return { ...storyboard, timings }
}
