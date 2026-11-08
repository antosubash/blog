import type { Element, Root } from "hast"
import { toText } from "hast-util-to-text"
import { visit } from "unist-util-visit"

/** hast wants class lists as arrays */
const cx = (classes: string) => classes.split(" ")

const isMermaidCode = (node: Element) => {
  const cls = node.properties.className
  return Array.isArray(cls) && cls.includes("language-mermaid")
}

/**
 * Turns ```mermaid fences (excluded from Shiki) into a diagram card. The source
 * stays in the page and `Mermaid.astro` renders it in the browser.
 */
export function rehypeMermaid() {
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
        tagName: "div",
        properties: {
          className: cx(
            "mermaid-diagram overflow-auto rounded-lg border border-border bg-card p-4 my-6"
          ),
          dataMermaid: "",
        },
        children: [
          {
            type: "element",
            tagName: "div",
            properties: {
              className: cx(
                "mermaid-loading flex items-center justify-center p-8"
              ),
            },
            children: [
              {
                type: "element",
                tagName: "div",
                properties: { className: cx("text-center") },
                children: [
                  {
                    type: "element",
                    tagName: "div",
                    properties: {
                      className: cx(
                        "mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent"
                      ),
                    },
                    children: [],
                  },
                  {
                    type: "element",
                    tagName: "p",
                    properties: {
                      className: cx("text-sm text-muted-foreground"),
                    },
                    children: [{ type: "text", value: "Rendering diagram..." }],
                  },
                ],
              },
            ],
          },
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
