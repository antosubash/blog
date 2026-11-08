import fs from "node:fs/promises"
import path from "node:path"
import { Resvg } from "@resvg/resvg-js"
import type { ReactNode } from "react"
import satori from "satori"
import type { Post } from "./post-types"

const siteTitle = "Anto Subash"

// Forge palette (dark mode OKLCh converted to hex approximations for Satori)
const colors = {
  background: "#1f1b17",
  foreground: "#ede8e3",
  muted: "#807a74",
  accent: "#c07840",
  accentMuted: "rgba(192, 120, 64, 0.15)",
}

// Static-weight TTFs (Satori cannot use variable fonts), shipped in public/.
const fontDir = path.resolve("public/static/fonts")
let fonts: Promise<[Buffer, Buffer]> | undefined
const loadFonts = () => {
  fonts ??= Promise.all([
    fs.readFile(path.join(fontDir, "Fraunces-SemiBold.ttf")),
    fs.readFile(path.join(fontDir, "DMSans-Medium.ttf")),
  ])
  return fonts
}

type Node = { type: string; props: Record<string, unknown> }
const h = (
  type: string,
  style: Record<string, unknown>,
  children: unknown
): Node => ({ type, props: { style, children } })

export function ogMarkup(post: Pick<Post, "title" | "date" | "tags">): Node {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const tags = post.tags.filter(Boolean).slice(0, 3)
  const title =
    post.title.length > 80 ? `${post.title.slice(0, 77)}...` : post.title

  return h(
    "div",
    {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "60px",
      // Newer Satori sizes boxes as content-box; keep the padding inside 1200x630.
      boxSizing: "border-box",
      background: colors.background,
      fontFamily: "DM Sans",
    },
    [
      // Top: site name + copper dot
      h("div", { display: "flex", alignItems: "center", gap: "2px" }, [
        h(
          "span",
          {
            fontSize: "20px",
            // Only DM Sans 500 is loaded; asking for 600 makes Satori fake-bold it.
            fontWeight: 500,
            color: colors.foreground,
            fontFamily: "DM Sans",
          },
          siteTitle
        ),
        h(
          "span",
          { fontSize: "20px", fontWeight: 500, color: colors.accent },
          "."
        ),
      ]),
      // Middle: title
      h(
        "div",
        {
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          flex: "1",
          justifyContent: "center",
        },
        [
          h(
            "div",
            {
              fontSize: "52px",
              fontWeight: 600,
              color: colors.foreground,
              lineHeight: 1.15,
              fontFamily: "Fraunces",
              letterSpacing: "-0.02em",
            },
            title
          ),
        ]
      ),
      // Bottom: date + tags
      h(
        "div",
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
        [
          h(
            "div",
            { fontSize: "16px", color: colors.muted, fontFamily: "DM Sans" },
            formattedDate
          ),
          h(
            "div",
            { display: "flex", gap: "8px" },
            tags.map((tag) =>
              h(
                "div",
                {
                  padding: "4px 12px",
                  borderRadius: "6px",
                  background: colors.accentMuted,
                  color: colors.muted,
                  fontSize: "14px",
                  fontFamily: "DM Sans",
                },
                tag
              )
            )
          ),
        ]
      ),
    ]
  )
}

export async function renderOgImage(
  post: Pick<Post, "title" | "date" | "tags">
): Promise<Buffer> {
  const [fraunces, dmSans] = await loadFonts()
  const svg = await satori(ogMarkup(post) as unknown as ReactNode, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Fraunces", data: fraunces, weight: 600, style: "normal" },
      { name: "DM Sans", data: dmSans, weight: 500, style: "normal" },
    ],
  })
  return new Resvg(svg).render().asPng()
}
