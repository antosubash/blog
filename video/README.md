# Blog Video Pipeline

Generates branded YouTube videos from MDX blog posts using:

- **Claude Code CLI** — invoked in headless mode (`claude -p`) to convert a post into a typed storyboard (intro → sections → code highlights → outro), with per-scene narration text and bullet points. Uses your Claude subscription, not the API.
- **ElevenLabs TTS** — synthesizes per-scene voiceover MP3s.
- **Remotion** — renders pixel-controlled MP4s using the same colors, fonts, and code styling as the blog.
- **YouTube Data API** *(optional)* — uploads the rendered MP4 and writes the returned `videoId` back into the post's frontmatter.

## Layout

```
video/
  src/
    index.ts                     # Remotion registerRoot
    Root.tsx                     # Composition registry
    BlogVideo.tsx                # Main composition, takes a Storyboard prop
    types.ts                     # Zod schema for the storyboard
    config.ts                    # Site URL, author, validation unions
    scenes/
      IntroScene.tsx
      SectionScene.tsx
      CodeScene.tsx
      OutroScene.tsx
      SceneChrome.tsx            # Shared header + footer
    pipeline/
      loadPost.ts                # Parse MDX frontmatter + body
      generateStoryboard.ts      # `claude -p` subprocess → typed Storyboard JSON
      synthesizeVoice.ts         # ElevenLabs voiceover per scene (parallel)
      render.ts                  # Programmatic Remotion render
      uploadYouTube.ts           # Optional upload + frontmatter writeback
    cli/
      generate.ts                # End-to-end CLI: `pnpm video:generate <slug>`
  remotion.config.ts
  out/                           # Rendered MP4s (gitignored)
  cache/                         # Storyboards + voice MP3s per slug (gitignored)
```

## Prerequisites

1. **Claude Code CLI installed and signed in**:
   ```sh
   # Install per https://docs.claude.com/claude-code
   claude /login          # sign in with your Pro/Max subscription
   ```
2. **`ffprobe` on PATH** — bundled with Remotion via `@remotion/renderer`, but if you've stripped FFmpeg installation, `apt install ffmpeg` (or equivalent).

## Environment

Copy `video/.env.example` to `.env` at the repo root and fill in:

- `ELEVENLABS_API_KEY` — required for voice synthesis.
- `ELEVENLABS_VOICE_ID` — voice to use (default: Rachel `21m00Tcm4TlvDq8ikWAM`).
- `YOUTUBE_*` — only needed if you use the upload step.

No `ANTHROPIC_API_KEY` is required — storyboard generation goes through the Claude Code CLI, billed against your subscription.

## Usage

```sh
# 1. Install deps (one-time)
pnpm install

# 2. End-to-end for a single post
pnpm video:generate azure/automatic-image-cleanup-in-acr

# Or run individual steps:
pnpm video:storyboard <slug>   # write cache/<slug>/storyboard.json
pnpm video:voice <slug>        # write cache/<slug>/voice/*.mp3
pnpm video:render <slug>       # write out/<slug>.mp4
pnpm video:upload <slug>       # upload to YouTube + write videoId back

# Iterate on the look in Remotion Studio (uses cached storyboard)
pnpm video:studio
```

Force-regenerate a cached step:

```sh
pnpm video:generate <slug> --force-storyboard --force-voice
```

Set YouTube privacy:

```sh
pnpm video:upload <slug> --privacy=public
```

## How it works

`generate.ts` is the orchestrator. It:

1. Loads the MDX post via `loadPost.ts`.
2. Pipes the post body + a JSON-schema-shaped prompt into `claude -p` and reads the storyboard JSON back from stdout. The model decides which sections deserve a scene, picks bullet text, and writes natural narration sized to a target 6–10 minute video. Validated with zod after parsing.
3. For each scene, calls ElevenLabs (parallel, capped at 4) to render an MP3 sized to the narration. Scene durations are computed from MP3 length via `ffprobe` so audio and visuals stay in sync. Durations are cached in `<file>.duration` sidecars so warm runs skip the probe.
4. Bundles the Remotion project and runs `renderMedia` with the storyboard as `inputProps`.
5. (Optional) Uploads to YouTube and patches the post's frontmatter `videoId`.

Re-runs use cached storyboards/voice — only re-render is needed when iterating on visuals.

## Cost (per ~10 min video)

- Claude Opus 4.7 storyboard via subscription: covered by your Claude Pro/Max plan (no per-call charge)
- ElevenLabs TTS: ~$0.30–3 depending on tier

## Picking the model

The CLI uses whatever model Claude Code is configured to use (set via `claude /model` or `~/.claude/settings.json`). For best storyboards, set Opus.
