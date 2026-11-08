import Image from "@/components/Image.astro"
import Link from "@/components/Link.astro"
import Parts from "@/components/Parts.astro"
import TOC from "@/components/TOC.astro"
import TableWrapper from "@/components/TableWrapper.astro"
import YoutubeVideo from "@/components/YoutubeVideo.astro"

/**
 * MDX tags used in posts, for the post page and the feed. `<Content />` gets no
 * props, so `props.toc`, `props.videoId` and `props.slug` are undefined inside
 * posts and those tags render nothing, as on the previous site; the post page
 * renders the video and TOC above the post body instead.
 */
export const mdxComponents = {
  a: Link,
  table: TableWrapper,
  Image,
  TOCInline: TOC,
  YoutubeVideo,
  Parts,
}
