import { readFileSync } from "node:fs"
import { join, resolve } from "node:path"
import type { Element, Root } from "hast"
import { imageSize } from "image-size"
import { visit } from "unist-util-visit"

type Size = { width: number; height: number }

// MDX keeps literal `<img>` JSX as its own node type; only its attributes matter here.
type JsxAttribute = { type: string; name?: string; value?: unknown }
type JsxImg = {
  type: "mdxJsxFlowElement" | "mdxJsxTextElement"
  name: string | null
  attributes: JsxAttribute[]
}

export type ImageAttrsOptions = {
  /** Directory that `/static/...` URLs are served from. */
  publicDir?: string
}

const sizes = new Map<string, Size | null>()

function readSize(publicDir: string, src: string): Size | null {
  let path: string
  try {
    path = join(publicDir, decodeURI(src.split(/[?#]/)[0]))
  } catch {
    return null // malformed escape such as "100%.png": leave the tag alone
  }
  if (!sizes.has(path)) {
    let size: Size | null = null
    try {
      const { width, height } = imageSize(readFileSync(path))
      if (width && height) size = { width, height }
    } catch {
      // Missing or unreadable file: leave the tag as it is (check-dist reports it).
    }
    sizes.set(path, size)
  }
  return sizes.get(path) ?? null
}

const isLocal = (src: unknown): src is string =>
  typeof src === "string" && src.startsWith("/static/")

/**
 * For local `/static/...` images in a post: adds the intrinsic `width`/`height`
 * (read from the file at build time, so the browser reserves the space) and
 * `decoding="async"`. The first image in the body is the likely LCP element and
 * gets `fetchpriority="high"` and eager loading; every later one is lazy.
 * Attributes already set in the source win; a source width or height keeps
 * both dimensions out. Images with a srcset or inside <picture> get no
 * dimensions (the file on disk is only the fallback candidate), and JSX
 * <img> with a spread ({...props}) is left alone so the spread keeps control.
 */
export function rehypeImageAttrs(options: ImageAttrsOptions = {}) {
  const publicDir = resolve(options.publicDir ?? "public")
  return (tree: Root) => {
    let first = true
    visit(tree, (node, _index, parent) => {
      if (node.type === "element" && (node as Element).tagName === "img") {
        const el = node as Element
        const src = el.properties.src
        if (!isLocal(src)) return
        const responsive =
          el.properties.srcSet != null ||
          (parent?.type === "element" &&
            (parent as Element).tagName === "picture")
        const size = responsive ? null : readSize(publicDir, src)
        const add: Record<string, string | number> = {
          decoding: "async",
          loading: first ? "eager" : "lazy",
          // Only when the source sets neither, or the aspect ratio would break.
          ...(el.properties.width == null && el.properties.height == null
            ? size
            : {}),
        }
        if (first) add.fetchPriority = "high"
        first = false
        for (const [k, v] of Object.entries(add)) el.properties[k] ??= v
        return
      }
      const type: string = node.type
      if (
        (type === "mdxJsxFlowElement" || type === "mdxJsxTextElement") &&
        (node as unknown as JsxImg).name === "img"
      ) {
        const jsx = node as unknown as JsxImg
        const attr = (name: string) =>
          jsx.attributes.find(
            (a) => a.type === "mdxJsxAttribute" && a.name === name
          )
        const src = attr("src")?.value
        if (!isLocal(src)) return
        if (jsx.attributes.some((a) => a.type === "mdxJsxExpressionAttribute"))
          return
        const parentName = (parent as unknown as JsxImg | undefined)?.name
        const responsive =
          !!attr("srcSet") ||
          !!attr("srcset") ||
          parentName === "picture" ||
          (parent?.type === "element" &&
            (parent as Element).tagName === "picture")
        const size = responsive ? null : readSize(publicDir, src)
        const add: Record<string, string> = {
          decoding: "async",
          loading: first ? "eager" : "lazy",
        }
        if (size && !attr("width") && !attr("height")) {
          add.width = String(size.width)
          add.height = String(size.height)
        }
        if (first) add.fetchpriority = "high"
        first = false
        for (const [name, value] of Object.entries(add)) {
          if (!attr(name)) {
            jsx.attributes.push({ type: "mdxJsxAttribute", name, value })
          }
        }
      }
    })
  }
}
