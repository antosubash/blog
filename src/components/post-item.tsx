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
      <article className="py-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <time dateTime={date}>{format(parseISO(date), "MMM d, yyyy")}</time>
          {readingTime && (
            <>
              <span className="text-border">&middot;</span>
              <span>{readingTime}</span>
            </>
          )}
          {series && (
            <>
              <span className="text-border">&middot;</span>
              <span className="text-accent">
                {series}{part != null ? ` #${part}` : ""}
              </span>
            </>
          )}
        </div>
        <h2 className="mt-2 font-display text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors duration-150 group-hover:text-accent sm:text-2xl">
          {title}
        </h2>
        {summary && (
          <p className="mt-2 line-clamp-2 text-muted-foreground">
            {summary}
          </p>
        )}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag) => (
              <Tag key={tag} text={tag} asLink={false} />
            ))}
            {tags.length > 4 && (
              <span className="text-sm text-muted-foreground">
                +{tags.length - 4}
              </span>
            )}
          </div>
        )}
      </article>
    </Link>
  )
}

export default PostItem
