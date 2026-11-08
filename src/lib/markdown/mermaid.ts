import { readFileSync } from "node:fs"
import { join, resolve } from "node:path"
import type { Element, Root } from "hast"
import { fromHtml } from "hast-util-from-html"
import { toText } from "hast-util-to-text"
import { visit } from "unist-util-visit"
import { diagramHash } from "./diagram-hash.mjs"

/** hast wants class lists as arrays */
const cx = (classes: string) => classes.split(" ")

const isMermaidCode = (node: Element) => {
  const cls = node.properties.className
  return Array.isArray(cls) && cls.includes("language-mermaid")
}

export type MermaidOptions = {
  /** Directory holding the pre-rendered `<hash>.svg` files (`pnpm diagrams`). */
  dir?: string
}

const svgs = new Map<string, Element>()

function loadSvg(dir: string, hash: string): Element {
  const path = join(dir, `${hash}.svg`)
  if (!svgs.has(path)) {
    let text: string
    try {
      text = readFileSync(path, "utf8")
    } catch {
      throw new Error(
        `No pre-rendered SVG for a mermaid block (diagrams/${hash}.svg). Run: pnpm diagrams`
      )
    }
    const svg = fromHtml(text, { fragment: true, space: "svg" }).children.find(
      (c): c is Element => c.type === "element" && c.tagName === "svg"
    )
    if (!svg) throw new Error(`diagrams/${hash}.svg has no <svg> element`)
    svgs.set(path, svg)
  }
  return structuredClone(svgs.get(path) as Element)
}

/**
 * Replaces ```mermaid fences (excluded from Shiki) with the diagram's SVG,
 * pre-rendered by `pnpm diagrams` (scripts/render-diagrams.mjs) and styled by
 * `.diagram` in styles.css from the theme tokens, so it follows light/dark
 * without any client JavaScript. The source stays in a hidden <pre> so feeds,
 * which drop inline SVG, still show it as code.
 */
export function rehypeMermaid(options: MermaidOptions = {}) {
  const dir = resolve(options.dir ?? "diagrams")
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre" || index === undefined || !parent) return
      const code = node.children.find(
        (c): c is Element => c.type === "element" && c.tagName === "code"
      )
      if (!code || !isMermaidCode(code)) return

      const source = toText(code, { whitespace: "pre" }).trim()
      parent.children[index] = {
        type: "element",
        tagName: "figure",
        properties: {
          className: cx(
            "diagram not-prose my-8 overflow-x-auto rounded-lg border border-border bg-card px-4 py-6"
          ),
        },
        children: [
          loadSvg(dir, diagramHash(source)),
          {
            type: "element",
            tagName: "pre",
            properties: { hidden: true, dataMermaidSource: "" },
            children: [{ type: "text", value: source }],
          },
        ],
      }
    })
  }
}
