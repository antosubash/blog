# Blog Video Pipeline

Generates branded YouTube videos from MDX blog posts using:

- **Claude Opus 4.7** — converts a post into a typed storyboard (intro → sections → code highlights → outro), with per-scene narration text and bullet points.
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
    scenes/
      IntroScene.tsx
      SectionScene.tsx
      CodeScene.tsx
      OutroScene.tsx
    pipeline/
      loadPost.ts                # Parse MDX frontmatter + section/code split
      generateStoryboard.ts      # Anthropic SDK → typed Storyboard JSON
      synthesizeVoice.ts         # ElevenLabs voiceover per scene
      render.ts                  # Programmatic Remotion render (bundle + renderMedia)
      uploadYouTube.ts           # Optional upload + frontmatter writeback
    cli/
      generate.ts                # End-to-end CLI: `pnpm video:generate <slug>`
  remotion.config.ts
  out/                           # Rendered MP4s (gitignored)
  cache/                         # Storyboards + voice MP3s per slug (gitignored)
```

## Environment

Copy `.env.example` to `.env` at the repo root and fill in:

- `ANTHROPIC_API_KEY` — required for storyboard generation.
- `ELEVENLABS_API_KEY` — required for voice synthesis.
- `ELEVENLABS_VOICE_ID` — voice to use (default: Rachel `21m00Tcm4TlvDq8ikWAM`).
- `YOUTUBE_*` — only needed if you use the upload step.

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
pnpm video:studio <slug>
```

## How it works

`generate.ts` is the orchestrator. It:

1. Loads the MDX post via `loadPost.ts` (reuses the same frontmatter shape as `content-collections.ts`).
2. Sends the post body to Claude Opus 4.7 with a `Storyboard` zod schema constraint. The model decides which sections deserve a scene, picks bullet text, and writes natural-language narration sized to a target ~6-10 minute video.
3. For each scene, calls ElevenLabs to render an MP3 sized to the narration. Scene durations are computed from MP3 length so audio and visuals stay in sync.
4. Bundles the Remotion project and runs `renderMedia` with the storyboard as `inputProps`.
5. (Optional) Uploads to YouTube and patches the post's frontmatter `videoId`.

Per-post cost (~10 min video):
- Claude Opus 4.7 storyboard: ~$0.10–0.30
- ElevenLabs TTS: ~$0.30–3 depending on tier

Re-runs use cached storyboards/voice — only re-render is needed when iterating on visuals.
