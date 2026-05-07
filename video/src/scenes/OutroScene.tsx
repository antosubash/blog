import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion"
import type { z } from "zod"
import type { OutroSceneSchema } from "../types"

type Props = {
  scene: z.infer<typeof OutroSceneSchema>
}

export const OutroScene: React.FC<Props> = ({ scene }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const progress = spring({ frame, fps, config: { damping: 18 } })

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at bottom right, #134e4a 0%, #0f172a 55%)",
        padding: 120,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontFamily: "Geist, sans-serif",
      }}
    >
      <div
        style={{
          color: "#5eead4",
          fontSize: 36,
          fontWeight: 600,
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: progress,
        }}
      >
        Thanks for watching
      </div>
      <div
        style={{
          color: "#f8fafc",
          fontSize: 88,
          fontWeight: 700,
          lineHeight: 1.1,
          margin: "40px 0",
          maxWidth: 1500,
          transform: `translateY(${(1 - progress) * 40}px)`,
          opacity: progress,
          fontFamily: "Fraunces, serif",
        }}
      >
        {scene.cta}
      </div>
      <div
        style={{
          color: "#94a3b8",
          fontSize: 40,
          opacity: progress,
        }}
      >
        {scene.postUrl}
      </div>
    </AbsoluteFill>
  )
}
