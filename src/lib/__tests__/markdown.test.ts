import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import type { Root } from "hast"
import { toHtml } from "hast-util-to-html"
import { codeToHast } from "shiki"
import { describe, expect, it } from "vitest"
import { codeBlockChrome } from "../markdown/code-block"
import { diagramHash } from "../markdown/diagram-hash.mjs"
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
  const mermaidTree = (source: string): Root => ({
    type: "root",
    children: [
      {
        type: "element",
        tagName: "pre",
        properties: {},
        children: [
          {
            type: "element",
            tagName: "code",
            properties: { className: ["language-mermaid"] },
            children: [{ type: "text", value: source }],
          },
        ],
      },
    ],
  })

  it("replaces a mermaid fence with its pre-rendered SVG and keeps the source", () => {
    const dir = mkdtempSync(join(tmpdir(), "diagrams-"))
    writeFileSync(
      join(dir, `${diagramHash("graph TD\n  A-->B")}.svg`),
      '<svg viewBox="0 0 10 10" class="diagram-svg"><g class="node"><rect/></g></svg>\n'
    )
    const tree = mermaidTree("graph TD\n  A-->B\n")
    rehypeMermaid({ dir })(tree)
    const html = toHtml(tree)
    expect(html).toContain('<figure class="diagram')
    expect(html).toContain('<svg viewBox="0 0 10 10" class="diagram-svg">')
    expect(html).toContain(
      '<pre hidden data-mermaid-source="">graph TD\n  A-->B</pre>'
    )
  })

  it("fails the build when a diagram has not been rendered", () => {
    const dir = mkdtempSync(join(tmpdir(), "diagrams-"))
    expect(() =>
      rehypeMermaid({ dir })(mermaidTree("graph LR\n  X-->Y"))
    ).toThrow(/pnpm diagrams/)
  })
})
