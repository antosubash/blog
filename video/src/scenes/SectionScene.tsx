import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion"
import type { z } from "zod"
import type { SectionSceneSchema } from "../types"
import { SceneFooter, SceneHeader } from "./SceneChrome"

type Props = {
  scene: z.infer<typeof SectionSceneSchema>
  index: number
  total: number
}

export const SectionScene: React.FC<Props> = ({ scene, index, total }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const headingProgress = spring({ frame, fps, config: { damping: 18 } })

  return (
    <AbsoluteFill
      style={{
        background: "#0f172a",
        padding: "100px 120px",
        fontFamily: "Geist, sans-serif",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <SceneHeader
          eyebrow={`Chapter ${index} / ${total - 1}`}
          title={scene.heading}
          progress={headingProgress}
        />
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {scene.bullets.map((bullet, i) => {
            const delay = fps * 0.6 + i * fps * 0.4
            const bulletOpacity = interpolate(
              frame,
              [delay, delay + fps * 0.4],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            )
            const bulletShift = interpolate(
              frame,
              [delay, delay + fps * 0.4],
              [20, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            )
            return (
              <li
                key={bullet}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 28,
                  marginBottom: 32,
                  opacity: bulletOpacity,
                  transform: `translateY(${bulletShift}px)`,
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    background: "#5eead4",
                    marginTop: 24,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    color: "#e2e8f0",
                    fontSize: 44,
                    lineHeight: 1.4,
                  }}
                >
                  {bullet}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
      <SceneFooter />
    </AbsoluteFill>
  )
}
