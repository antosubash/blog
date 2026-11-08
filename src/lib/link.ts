/**
 * Link behaviour carried over from the old `<Link>` component: site pages and
 * `#anchors` open in place, everything else (external URLs and files such as
 * `/feed.xml`) opens in a new tab.
 */
export function linkAttrs(href: string | undefined) {
  const isInternalPage = href?.startsWith("/") && !(href && /\.\w+$/.test(href))
  if (isInternalPage || href?.startsWith("#")) return {}
  return { target: "_blank", rel: "noopener noreferrer" }
}
