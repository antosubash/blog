import { Link } from "@tanstack/react-router"
import { format, parseISO } from "date-fns"
import Tag from "@/components/Tag"

interface PostItemProps {
  slug: string
  date: string
  title: string
  summary: string
  tags: string[]
  series?: string
  part?: number
  readingTime?: string
}

const PostItem = ({
  slug,
  date,
  title,
  summary,
  series,
  tags,
  part,
  readingTime,
}: PostItemProps) => {
  return (
    <Link to="/posts/$" params={{ _splat: slug }} className="group block">
      <article className="-mx-3 rounded-lg px-3 py-4 transition-colors duration-150 hover:bg-surface sm:-mx-4 sm:px-4 sm:py-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <h2 className="font-display text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors duration-150 group-hover:text-accent sm:text-xl">
            {title}
          </h2>
          <time
            dateTime={date}
            className="shrink-0 text-xs tabular-nums text-muted-foreground sm:text-sm"
          >
            {format(parseISO(date), "MMM d, yyyy")}
          </time>
        </div>
        {summary && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {summary}
          </p>
        )}
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {series && (
            <span className="text-xs font-medium text-accent">
              {series}{part != null ? ` #${part}` : ""}
            </span>
          )}
          {tags.slice(0, 3).map((tag) => (
            <Tag key={tag} text={tag} asLink={false} />
          ))}
          {tags.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{tags.length - 3}
            </span>
          )}
        </div>
      </article>
    </Link>
  )
}

export default PostItem
