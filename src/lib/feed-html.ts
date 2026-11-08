import sanitizeHtml from "sanitize-html"
import { CODE_HEADER_CLASS } from "./markdown/code-block"

const absolute = (value: string | undefined, base: string) => {
  if (!value) return value
  try {
    return new URL(value, base).toString()
  } catch {
    return value
  }
}

/**
 * Site chrome that means nothing in a feed reader: the code block header
 * (language label + copy button), heading self-links added by
 * rehype-autolink-headings. Inline SVG (pre-rendered Mermaid diagrams) is
 * dropped as a non-text tag; the diagram's hidden source <pre> stays as code.
 */
const isChrome = (tagName: string, attribs: Record<string, string>) =>
  attribs.class === CODE_HEADER_CLASS ||
  (tagName === "a" && attribs["aria-hidden"] === "true")

/**
 * Turns a post's rendered HTML into feed-safe HTML for `content:encoded`:
 * no scripts, styles, classes or site chrome (code block headers and copy
 * buttons, heading anchor icons, inline SVG), and every
 * link and image URL absolute against the post URL.
 */
export function toFeedHtml(html: string, postUrl: string): string {
  return sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
    allowedAttributes: {
      "*": ["data-drop"],
      a: ["href", "title"],
      img: ["src", "alt", "title", "width", "height"],
      th: ["align", "colspan", "rowspan"],
      td: ["align", "colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    nonTextTags: [
      "script",
      "style",
      "textarea",
      "option",
      "noscript",
      "button",
      "svg",
      "template",
    ],
    // exclusiveFilter only sees the attributes left after filtering, so the
    // transform marks site chrome with data-drop first.
    exclusiveFilter: (frame) => "data-drop" in frame.attribs,
    transformTags: {
      "*": (tagName, attribs) => {
        const out: Record<string, string> = { ...attribs }
        if (tagName === "a") out.href = absolute(attribs.href, postUrl) ?? ""
        if (tagName === "img") out.src = absolute(attribs.src, postUrl) ?? ""
        if (isChrome(tagName, attribs)) out["data-drop"] = ""
        return { tagName, attribs: out }
      },
    },
  }).trim()
}
