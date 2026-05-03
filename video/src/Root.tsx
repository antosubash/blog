import { Composition } from "remotion"
import { BlogVideo } from "./BlogVideo"
import { FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from "./types"
import type { RenderedStoryboard } from "./types"

const PLACEHOLDER: RenderedStoryboard = {
  slug: "placeholder",
  title: "Preview your storyboard with --props",
  totalDurationFrames: FPS * 6,
  timings: [{ startFrame: 0, durationFrames: FPS * 6, voiceFile: null }],
  scenes: [
    {
      type: "intro",
      id: "intro",
      title: "Preview your storyboard with --props",
      tags: ["remotion", "claude"],
      narration: "Pass a storyboard JSON via --props to preview a real post.",
    },
  ],
}

export const Root: React.FC = () => {
  return (
    <Composition
      id="BlogVideo"
      component={BlogVideo}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      fps={FPS}
      durationInFrames={PLACEHOLDER.totalDurationFrames}
      defaultProps={PLACEHOLDER}
      calculateMetadata={({ props }) => ({
        durationInFrames: props.totalDurationFrames,
      })}
    />
  )
}
