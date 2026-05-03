import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion"
import type { z } from "zod"
import type { CodeSceneSchema } from "../types"
import { SceneFooter, SceneHeader } from "./SceneChrome"

type Props = {
  scene: z.infer<typeof CodeSceneSchema>
  index: number
  total: number
}

const MAX_LINES = 22
const TRAFFIC_LIGHTS = ["#ef4444", "#f59e0b", "#10b981"]

const trimCode = (code: string) => {
  const lines = code.replace(/\t/g, "  ").split("\n")
  if (lines.length <= MAX_LINES) return lines.join("\n")
  return [...lines.slice(0, MAX_LINES - 1), "…"].join("\n")
}

export const CodeScene: React.FC<Props> = ({ scene, index, total }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const headingProgress = spring({ frame, fps, config: { damping: 18 } })
  const codeReveal = interpolate(frame, [fps * 0.4, fps * 1.0], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        background: "#0f172a",
        padding: "80px 120px",
        fontFamily: "Geist, sans-serif",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <SceneHeader
          eyebrow={`Chapter ${index} / ${total - 1} · ${scene.language}`}
          title={scene.heading}
          progress={headingProgress}
          titleSize={64}
          titleMargin="20px 0 40px"
        />
        <div
          style={{
            background: "#020617",
            border: "1px solid rgba(94, 234, 212, 0.3)",
            borderRadius: 16,
            padding: "32px 40px",
            opacity: codeReveal,
            transform: `translateY(${(1 - codeReveal) * 20}px)`,
            boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {TRAFFIC_LIGHTS.map((color) => (
              <span
                key={color}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: color,
                }}
              />
            ))}
          </div>
          <pre
            style={{
              margin: 0,
              color: "#e2e8f0",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontSize: 28,
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}
          >
            <code>{trimCode(scene.code)}</code>
          </pre>
        </div>
      </div>
      <SceneFooter />
    </AbsoluteFill>
  )
}
