import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import type { Element, Root } from "hast"
import { beforeAll, describe, expect, it } from "vitest"
import { rehypeImageAttrs } from "../markdown/image-attrs"

/** Smallest PNG header image-size can read: signature + IHDR with the size. */
function png(width: number, height: number) {
  const b = Buffer.alloc(33)
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(b, 0)
  b.writeUInt32BE(13, 8)
  b.write("IHDR", 12, "ascii")
  b.writeUInt32BE(width, 16)
  b.writeUInt32BE(height, 20)
  b[24] = 8
  b[25] = 6
  return b
}

let publicDir: string
beforeAll(() => {
  publicDir = mkdtempSync(join(tmpdir(), "image-attrs-"))
  mkdirSync(join(publicDir, "static/images"), { recursive: true })
  writeFileSync(join(publicDir, "static/images/a.png"), png(800, 450))
  writeFileSync(join(publicDir, "static/images/b c.png"), png(1920, 1080))
})

const img = (src: string, extra: Element["properties"] = {}): Element => ({
  type: "element",
  tagName: "img",
  properties: { src, alt: "", ...extra },
  children: [],
})
const jsxImg = (src: string) => ({
  type: "mdxJsxFlowElement",
  name: "img",
  attributes: [{ type: "mdxJsxAttribute", name: "src", value: src }],
  children: [],
})
const run = (children: unknown[]) => {
  const tree = { type: "root", children } as Root
  rehypeImageAttrs({ publicDir })(tree)
  return tree
}

describe("rehypeImageAttrs", () => {
  it("adds size, eager + high priority to the first image, lazy to the rest", () => {
    const first = img("/static/images/a.png")
    const second = img("/static/images/b%20c.png")
    run([
      first,
      { type: "element", tagName: "p", properties: {}, children: [second] },
    ])
    expect(first.properties).toMatchObject({
      width: 800,
      height: 450,
      loading: "eager",
      fetchPriority: "high",
      decoding: "async",
    })
    expect(second.properties).toMatchObject({
      width: 1920,
      height: 1080,
      loading: "lazy",
      decoding: "async",
    })
    expect(second.properties.fetchPriority).toBeUndefined()
  })

  it("leaves remote images and attributes set in the source alone", () => {
    const remote = img("https://example.com/x.png")
    const local = img("/static/images/a.png", { width: 400 })
    run([remote, local])
    expect(remote.properties).toEqual({
      src: "https://example.com/x.png",
      alt: "",
    })
    expect(local.properties.width).toBe(400)
    expect(local.properties.height).toBeUndefined()
    // The remote image does not count as the first one.
    expect(local.properties.fetchPriority).toBe("high")
  })

  it("skips the size when the file is missing but still sets loading", () => {
    const missing = img("/static/images/nope.png")
    const next = img("/static/images/a.png")
    run([missing, next])
    expect(missing.properties.width).toBeUndefined()
    expect(missing.properties.loading).toBe("eager")
    expect(next.properties.loading).toBe("lazy")
  })

  it("handles literal <img> JSX in MDX", () => {
    const node = jsxImg("/static/images/a.png")
    run([node])
    const attrs = Object.fromEntries(
      node.attributes.map((a) => [a.name, a.value])
    )
    expect(attrs).toEqual({
      src: "/static/images/a.png",
      width: "800",
      height: "450",
      loading: "eager",
      fetchpriority: "high",
      decoding: "async",
    })
  })
})
