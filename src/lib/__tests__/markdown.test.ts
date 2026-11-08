import type { Element, Root } from "hast"
import { toHtml } from "hast-util-to-html"
import { codeToHast } from "shiki"
import { describe, expect, it } from "vitest"
import { codeBlockChrome } from "../markdown/code-block"
import { rehypeMermaid } from "../markdown/mermaid"

describe("code block chrome", () => {
  it("wraps highlighted code in a header with language and copy button", async () => {
    const root = await codeToHast("const a = 1", {
      lang: "ts",
      theme: "github-dark",
      transformers: [codeBlockChrome()],
    })
    const html = toHtml(root)
    expect(html).toMatch(/^<div class="code-block /)
    expect(html).toContain(">ts</span>")
    expect(html).toContain("data-copy-code")
    expect(html).toContain("<pre")
  })

  it("labels plain text blocks as code", async () => {
    const html = toHtml(
      await codeToHast("hello", {
        lang: "text",
        theme: "github-dark",
        transformers: [codeBlockChrome()],
      })
    )
    expect(html).toContain(">code</span>")
  })
})

describe("rehypeMermaid", () => {
  it("replaces mermaid fences with a diagram card holding the source", () => {
    const code: Element = {
      type: "element",
      tagName: "code",
      properties: { className: ["language-mermaid"] },
      children: [{ type: "text", value: "graph TD\n  A-->B\n" }],
    }
    const tree: Root = {
      type: "root",
      children: [
        { type: "element", tagName: "pre", properties: {}, children: [code] },
      ],
    }
    rehypeMermaid()(tree)
    const html = toHtml(tree)
    expect(html).toContain("data-mermaid")
    expect(html).toContain(
      '<pre hidden data-mermaid-source="">graph TD\n  A-->B</pre>'
    )
  })
})
