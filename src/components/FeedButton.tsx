import { Rss } from "lucide-react"

export default function FeedButton() {
  return (
    <a
      href="/feed.xml"
      aria-label="RSS Feed"
      className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
    >
      <Rss className="h-[18px] w-[18px]" />
    </a>
  )
}
