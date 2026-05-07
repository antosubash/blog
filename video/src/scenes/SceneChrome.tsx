import { AUTHOR_NAME, SITE_LABEL } from "../config"

export const SceneFooter: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#64748b",
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: 3,
        textTransform: "uppercase",
        fontFamily: "Geist, sans-serif",
      }}
    >
      <span>{SITE_LABEL}</span>
      <span>{AUTHOR_NAME}</span>
    </div>
  )
}

type SceneHeaderProps = {
  eyebrow: string
  title: string
  progress: number
  titleSize?: number
  titleMargin?: string
}

export const SceneHeader: React.FC<SceneHeaderProps> = ({
  eyebrow,
  title,
  progress,
  titleSize = 88,
  titleMargin = "30px 0 60px",
}) => {
  return (
    <>
      <div
        style={{
          color: "#5eead4",
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: 4,
          textTransform: "uppercase",
          opacity: progress,
        }}
      >
        {eyebrow}
      </div>
      <h2
        style={{
          color: "#f8fafc",
          fontSize: titleSize,
          fontWeight: 700,
          lineHeight: 1.1,
          margin: titleMargin,
          transform: `translateY(${(1 - progress) * 30}px)`,
          opacity: progress,
          fontFamily: "Fraunces, serif",
        }}
      >
        {title}
      </h2>
    </>
  )
}
