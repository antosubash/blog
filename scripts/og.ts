import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"
import satori from "satori"
import { Resvg } from "@resvg/resvg-js"

const siteTitle = "Anto Subash"

// Forge palette (dark mode OKLCh converted to hex approximations for Satori)
const colors = {
  background: "#1f1b17",     // oklch(0.14 0.005 60)
  surface: "#2a2520",        // oklch(0.17 0.006 60)
  foreground: "#ede8e3",     // oklch(0.93 0.01 80)
  muted: "#807a74",          // oklch(0.55 0.01 60)
  accent: "#c07840",         // oklch(0.65 0.12 45) — copper
  accentMuted: "rgba(192, 120, 64, 0.15)",
  border: "#3d3832",         // oklch(0.25 0.005 60)
}

interface PostData {
  title: string
  slug: string
  tags: string[]
  excerpt: string
  draft: boolean
  isDraft: boolean
  date: string
}

async function loadFont(
  localPath: string,
  remoteUrl: string
): Promise<ArrayBuffer> {
  const abs = path.resolve(localPath)
  try {
    return fs.readFileSync(abs).buffer as ArrayBuffer
  } catch {
    console.log(`  Downloading font from ${remoteUrl}`)
    const res = await fetch(remoteUrl)
    const buf = await res.arrayBuffer()
    fs.mkdirSync(path.dirname(abs), { recursive: true })
    fs.writeFileSync(abs, Buffer.from(buf))
    return buf
  }
}

async function main() {
  const postsPath = path.resolve(
    ".content-collections/generated/allPosts.js"
  )
  const mod = await import(pathToFileURL(postsPath).href)
  const allPosts: PostData[] = mod.allPosts || mod.default
  const posts = allPosts.filter((p) => !p.draft && !p.isDraft)

  // Load fonts — static weight TTFs (Satori requires non-variable fonts)
  const fraunces = await loadFont(
    "public/static/fonts/Fraunces-SemiBold.ttf",
    "https://cdn.jsdelivr.net/fontsource/fonts/fraunces@latest/latin-600-normal.ttf"
  )
  const dmSans = await loadFont(
    "public/static/fonts/DMSans-Medium.ttf",
    "https://cdn.jsdelivr.net/fontsource/fonts/dm-sans@latest/latin-500-normal.ttf"
  )

  const ogDir = path.resolve("public/og")
  fs.mkdirSync(ogDir, { recursive: true })

  for (const post of posts) {
    const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const tags = post.tags.filter(Boolean).slice(0, 3)

    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px",
            background: colors.background,
            fontFamily: "DM Sans",
          },
          children: [
            // Top: site name + copper dot
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                },
                children: [
                  {
                    type: "span",
                    props: {
                      style: {
                        fontSize: "20px",
                        fontWeight: 600,
                        color: colors.foreground,
                        fontFamily: "DM Sans",
                      },
                      children: siteTitle,
                    },
                  },
                  {
                    type: "span",
                    props: {
                      style: {
                        fontSize: "20px",
                        fontWeight: 600,
                        color: colors.accent,
                      },
                      children: ".",
                    },
                  },
                ],
              },
            },

            // Middle: title
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  flex: "1",
                  justifyContent: "center",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        fontSize: "52px",
                        fontWeight: 600,
                        color: colors.foreground,
                        lineHeight: 1.15,
                        fontFamily: "Fraunces",
                        letterSpacing: "-0.02em",
                      },
                      children:
                        post.title.length > 80
                          ? post.title.slice(0, 77) + "..."
                          : post.title,
                    },
                  },
                ],
              },
            },

            // Bottom: date + tags
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
                children: [
                  // Date
                  {
                    type: "div",
                    props: {
                      style: {
                        fontSize: "16px",
                        color: colors.muted,
                        fontFamily: "DM Sans",
                      },
                      children: formattedDate,
                    },
                  },
                  // Tags
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        gap: "8px",
                      },
                      children: tags.map((tag) => ({
                        type: "div",
                        props: {
                          style: {
                            padding: "4px 12px",
                            borderRadius: "6px",
                            background: colors.accentMuted,
                            color: colors.muted,
                            fontSize: "14px",
                            fontFamily: "DM Sans",
                          },
                          children: tag,
                        },
                      })),
                    },
                  },
                ],
              },
            },
          ],
        },
      } as any,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Fraunces",
            data: fraunces,
            weight: 600,
            style: "normal" as const,
          },
          {
            name: "DM Sans",
            data: dmSans,
            weight: 500,
            style: "normal" as const,
          },
        ],
      }
    )

    const resvg = new Resvg(svg)
    const pngData = resvg.render().asPng()
    fs.writeFileSync(path.join(ogDir, `${post.slug}.png`), pngData)
  }

  console.log(`Generated ${posts.length} OG images`)
}

main().catch(console.error)
