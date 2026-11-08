import { cn } from "@/lib/utils"
import { slug as createSlug } from "github-slugger"

interface TagProps {
  text: string
  className?: string
  asLink?: boolean
}

const Tag = ({ text, className, asLink = true }: TagProps) => {
  const slug = createSlug(text)

  const base = cn(
    "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors duration-150",
    "bg-accent-muted/50 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
    className
  )

  if (asLink) {
    return (
      <a
        href={`/tags/${slug}`}
        className={base}
        aria-label={`View posts tagged ${text}`}
      >
        {text}
      </a>
    )
  }

  return <span className={base}>{text}</span>
}

export default Tag
