#!/usr/bin/env node
// Post-build checks for the static site in dist/. Fails (exit 1) when:
//  - an internal href/src/srcset in any dist HTML page points at a missing file or page,
//  - a draft post leaks into dist (page, OG image, or its slug in any HTML/XML/JSON),
//  - /feed.xml, /sitemap.xml, /search.json, or a published post's page or
//    /og/<slug>.png is missing.
// Usage: node scripts/ci/check-dist.mjs [dist-dir] [posts-dir]
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { basename, join, posix, resolve } from "node:path"

const DIST = resolve(process.argv[2] ?? "dist")
const POSTS = resolve(process.argv[3] ?? "content/posts")
const SITE = "https://blog.antosubash.com"

// Known broken references kept on purpose. Each entry needs a reason.
const ALLOWED_MISSING = new Set([])

const errors = []
const fail = (msg) => errors.push(msg)

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else out.push(p)
  }
  return out
}

// --- Posts: published vs draft, from the MDX frontmatter (file name is the slug).
function frontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return m ? m[1] : ""
}
const published = []
const drafts = []
for (const file of walk(POSTS).filter((f) => /\.mdx?$/.test(f))) {
  const slug = basename(file).replace(/\.mdx?$/, "")
  const fm = frontmatter(readFileSync(file, "utf8"))
  const isDraft = /^(draft|isDraft):\s*true\s*$/m.test(fm)
  ;(isDraft ? drafts : published).push(slug)
}
if (published.length === 0) fail(`no posts found under ${POSTS}`)

// --- Required outputs.
const required = ["feed.xml", "sitemap.xml", "search.json", "404.html"]
for (const slug of published) {
  required.push(`posts/${slug}/index.html`, `og/${slug}.png`)
}
for (const f of required) {
  if (!existsSync(join(DIST, f))) fail(`missing required output /${f}`)
}

const files = walk(DIST)
const rel = (f) =>
  posix.join(
    "/",
    f
      .slice(DIST.length + 1)
      .split("\\")
      .join("/")
  )

// --- Drafts must not appear anywhere.
for (const slug of drafts) {
  for (const p of [`posts/${slug}`, `og/${slug}.png`]) {
    if (existsSync(join(DIST, p))) fail(`draft output exists: /${p}`)
  }
}
const textFiles = files.filter((f) => /\.(html|xml|json|txt)$/.test(f))
const draftRe = drafts.length
  ? new RegExp(`/posts/(${drafts.join("|")})(?![\\w-])`)
  : null
for (const f of textFiles) {
  const m = draftRe && readFileSync(f, "utf8").match(draftRe)
  if (m) fail(`draft slug "${m[1]}" referenced in ${rel(f)}`)
}

// --- Internal links in HTML.
function pageUrl(file) {
  const r = rel(file)
  return r.endsWith("/index.html") ? r.slice(0, -"index.html".length) : r
}
function resolves(pathname) {
  let p
  try {
    p = decodeURIComponent(pathname)
  } catch {
    return false
  }
  const base = join(DIST, p)
  if (p.endsWith("/")) return existsSync(join(base, "index.html"))
  return (
    (existsSync(base) && statSync(base).isFile()) ||
    existsSync(join(base, "index.html")) ||
    existsSync(`${base}.html`)
  )
}
function internalPath(ref, from) {
  const v = ref.trim()
  if (!v || v.startsWith("#") || v.startsWith("//")) return null
  if (/^(mailto|tel|javascript|data|blob):/i.test(v)) return null
  let url
  try {
    url = new URL(v, SITE + from)
  } catch {
    return null
  }
  if (url.origin !== SITE) return null
  return url.pathname
}

// Attributes that carry URLs; content of <script>/<style>/<code>/<pre> is skipped.
const attrRe = /\s(href|src|srcset|poster)\s*=\s*("([^"]*)"|'([^']*)')/gi
let checked = 0
const broken = new Map()
for (const f of files.filter((x) => x.endsWith(".html"))) {
  const from = pageUrl(f)
  const html = readFileSync(f, "utf8")
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<(pre|code)\b[\s\S]*?<\/\1>/gi, "")
  for (const tag of html.match(/<[a-z][^>]*>/gi) ?? []) {
    if (/^<(meta)\b/i.test(tag)) continue
    for (const m of tag.matchAll(attrRe)) {
      const value = (m[3] ?? m[4]).replace(/&amp;/g, "&")
      const refs =
        m[1].toLowerCase() === "srcset"
          ? value.split(",").map((s) => s.trim().split(/\s+/)[0])
          : [value]
      for (const ref of refs) {
        const p = internalPath(ref, from)
        if (p === null) continue
        checked++
        if (!resolves(p) && !ALLOWED_MISSING.has(p)) {
          if (!broken.has(p)) broken.set(p, new Set())
          broken.get(p).add(from)
        }
      }
    }
  }
}
for (const [p, pages] of broken) {
  const list = [...pages]
  fail(
    `broken internal link ${p} on ${list.length} page(s): ${list.slice(0, 3).join(", ")}${list.length > 3 ? ", …" : ""}`
  )
}

console.log(
  `check-dist: ${published.length} published posts, ${drafts.length} drafts, ` +
    `${files.length} files, ${checked} internal references checked`
)
if (errors.length) {
  for (const e of errors) console.error(`FAIL ${e}`)
  console.error(`check-dist: ${errors.length} problem(s)`)
  process.exit(1)
}
console.log("check-dist: OK")
