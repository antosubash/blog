#!/usr/bin/env node
// Pre-renders every ```mermaid block in content/posts to diagrams/<hash>.svg.
// The site inlines these SVGs at build time (src/lib/markdown/mermaid.ts), so
// readers download no Mermaid JavaScript and the Vercel build needs no browser.
//
// Usage: pnpm diagrams            render the diagrams that have no SVG yet
//        pnpm diagrams --force    re-render every diagram
//        pnpm diagrams --prune    also delete SVGs no post uses any more
//
// Rendering uses @mermaid-js/mermaid-cli from the tools/diagrams workspace
// package (not installed on Vercel) with the system Chrome; set CHROME_PATH to
// use another browser.
import { execFileSync } from "node:child_process"
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { diagramHash } from "../src/lib/markdown/diagram-hash.mjs"

const ROOT = resolve(import.meta.dirname, "..")
const MMDC = join(ROOT, "tools/diagrams/node_modules/.bin/mmdc")
const POSTS = join(ROOT, "content/posts")
const OUT = join(ROOT, "diagrams")
const force = process.argv.includes("--force")
const prune = process.argv.includes("--prune")

// Outermost fences only: a ```mermaid inside a ````markdown example is content.
const FENCE = /^(`{3,}|~{3,})([^\n]*)\n([\s\S]*?)^\1[ \t]*$/gm

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })
}

const blocks = new Map() // hash -> { source, files }
for (const file of walk(POSTS).filter((f) => f.endsWith(".mdx"))) {
  for (const m of readFileSync(file, "utf8").matchAll(FENCE)) {
    if (m[2].trim() !== "mermaid") continue
    const source = m[3].trim()
    const hash = diagramHash(source)
    const entry = blocks.get(hash) ?? { source, files: [] }
    entry.files.push(file.slice(ROOT.length + 1))
    blocks.set(hash, entry)
  }
}

mkdirSync(OUT, { recursive: true })
const config = {
  theme: "base",
  look: "classic",
  // Plain SVG text instead of HTML labels in <foreignObject>.
  htmlLabels: false,
  // Don't wrap labels (Mermaid splits long identifiers mid-word); use <br/> to break lines.
  markdownAutoWrap: false,
  flowchart: {
    htmlLabels: false,
    useMaxWidth: false,
    curve: "basis",
    padding: 12,
    wrappingWidth: 400,
  },
  sequence: { useMaxWidth: false },
  themeVariables: {
    fontFamily: "Geist Variable, Geist, ui-sans-serif, system-ui, sans-serif",
    fontSize: "15px",
  },
}
const tmp = mkdtempSync(join(tmpdir(), "diagrams-"))
const cfgPath = join(tmp, "config.json")
writeFileSync(cfgPath, JSON.stringify(config))
const chrome = [
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => p && existsSync(p))
// Measure labels with the site's own font, or boxes won't fit the text on the page.
const geist = join(
  ROOT,
  "node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2"
)
const cssPath = join(tmp, "fonts.css")
writeFileSync(
  cssPath,
  existsSync(geist)
    ? `@font-face{font-family:"Geist Variable";font-weight:100 900;src:url("file://${geist}") format("woff2")}`
    : ""
)
const puppeteerPath = join(tmp, "puppeteer.json")
writeFileSync(
  puppeteerPath,
  JSON.stringify({ headless: "shell", executablePath: chrome })
)
if (blocks.size && (!existsSync(MMDC) || !chrome)) {
  console.error(
    !existsSync(MMDC)
      ? "mmdc missing: run pnpm install (tools/diagrams)"
      : "no Chrome found: set CHROME_PATH"
  )
  process.exit(1)
}

let rendered = 0
for (const [hash, { source, files }] of blocks) {
  const out = join(OUT, `${hash}.svg`)
  if (existsSync(out) && !force) continue
  const input = join(tmp, `${hash}.mmd`)
  const raw = join(tmp, `${hash}.svg`)
  writeFileSync(input, source)
  console.log(`rendering ${hash} (${files.join(", ")})`)
  execFileSync(
    MMDC,
    [
      "-q",
      "-i",
      input,
      "-o",
      raw,
      "-c",
      cfgPath,
      "-C",
      cssPath,
      "-p",
      puppeteerPath,
      "-b",
      "transparent",
    ],
    { stdio: "inherit" }
  )
  writeFileSync(out, clean(readFileSync(raw, "utf8"), hash))
  rendered++
}
rmSync(tmp, { recursive: true, force: true })

const unused = readdirSync(OUT).filter(
  (f) => f.endsWith(".svg") && !blocks.has(f.slice(0, -4))
)
for (const f of unused) {
  if (prune) unlinkSync(join(OUT, f))
  console.log(
    `${prune ? "deleted" : "unused (run with --prune to delete)"}: diagrams/${f}`
  )
}
console.log(`diagrams: ${blocks.size} in posts, ${rendered} rendered`)

/**
 * Makes Mermaid's SVG themeable by the site: drops its <style> block and inline
 * colours (src/styles.css styles .diagram instead, from the light/dark tokens),
 * gives it a fixed size from its viewBox, and prefixes every id with the hash so
 * two diagrams on one page can't collide.
 */
function clean(svg, hash) {
  const prefix = `d${hash}-`
  let s = svg
    .replace(/<\?xml[^>]*>\s*/, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/\sstyle="[^"]*"/g, "")
    .replace(/\sdata-points="[^"]*"/g, "")
  // Mermaid always emits shadow filters and a gradient; drop them when nothing uses them.
  for (const tag of ["filter", "linearGradient"]) {
    s = s.replace(
      new RegExp(`<${tag}\\b[^>]*id="([^"]+)"[\\s\\S]*?<\\/${tag}>`, "g"),
      (whole, id) => (s.includes(`url(#${id})`) ? whole : "")
    )
  }
  s = s.replace(/<defs>\s*<\/defs>/g, "")
  const ids = new Set([...s.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))
  for (const id of ids) {
    const esc = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    s = s
      .replace(new RegExp(`\\sid="${esc}"`, "g"), ` id="${prefix}${id}"`)
      .replace(new RegExp(`url\\(#${esc}\\)`, "g"), `url(#${prefix}${id})`)
      .replace(new RegExp(`href="#${esc}"`, "g"), `href="#${prefix}${id}"`)
  }
  const [, , , w, h] =
    s.match(/viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) ([\d.]+)"/) ?? []
  s = s.replace(/<svg\b([^>]*)>/, (_, attrs) => {
    const kept = attrs.replace(/\s(width|height|class)="[^"]*"/g, "")
    return `<svg${kept} class="diagram-svg" width="${Math.ceil(w)}" height="${Math.ceil(h)}">`
  })
  return `${s.trim()}\n`
}
