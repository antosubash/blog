import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion"
import type { z } from "zod"
import { SITE_LABEL } from "../config"
import type { IntroSceneSchema } from "../types"

type Props = {
  scene: z.infer<typeof IntroSceneSchema>
}

export const IntroScene: React.FC<Props> = ({ scene }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleSpring = spring({ frame, fps, config: { damping: 18 } })
  const tagsOpacity = interpolate(frame, [fps * 0.6, fps * 1.0], [0, 1], {
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at top left, #134e4a 0%, #0f172a 55%)",
        padding: 120,
        justifyContent: "center",
        fontFamily: "Geist, sans-serif",
      }}
    >
      <div
        style={{
          color: "#5eead4",
          fontSize: 36,
          fontWeight: 600,
          letterSpacing: 8,
          textTransform: "uppercase",
          opacity: titleSpring,
        }}
      >
        {SITE_LABEL}
      </div>
      <div
        style={{
          color: "#f8fafc",
          fontSize: 96,
          fontWeight: 700,
          lineHeight: 1.1,
          marginTop: 40,
          maxWidth: 1500,
          transform: `translateY(${(1 - titleSpring) * 40}px)`,
          opacity: titleSpring,
          fontFamily: "Fraunces, serif",
        }}
      >
        {scene.title}
      </div>
      <div
        style={{
          marginTop: 60,
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          opacity: tagsOpacity,
        }}
      >
        {scene.tags.map((tag) => (
          <span
            key={tag}
            style={{
              padding: "14px 28px",
              borderRadius: 999,
              background: "rgba(94, 234, 212, 0.12)",
              border: "1px solid rgba(94, 234, 212, 0.4)",
              color: "#5eead4",
              fontSize: 28,
              fontWeight: 500,
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  )
}
