import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

/**
 * WCAG AA needs 4.5:1 for body text. Muted text sits on the page background,
 * on cards (surface) and on muted chips, so check it against all three in both
 * themes. Colours are read from src/styles.css so a token tweak can't regress
 * this silently (#201).
 */
const css = readFileSync(new URL("../../styles.css", import.meta.url), "utf8")

function block(selector: string): Record<string, [number, number, number]> {
  const start = css.indexOf(`${selector} {`)
  const body = css.slice(start, css.indexOf("}", start))
  const tokens: Record<string, [number, number, number]> = {}
  for (const m of body.matchAll(
    /--([\w-]+):\s*oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/g
  )) {
    tokens[m[1]] = [Number(m[2]), Number(m[3]), Number(m[4])]
  }
  return tokens
}

/** OKLCH → linear sRGB (clamped) → WCAG relative luminance. */
function luminance([L, C, h]: [number, number, number]): number {
  const a = C * Math.cos((h * Math.PI) / 180)
  const b = C * Math.sin((h * Math.PI) / 180)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const clamp = (x: number) => Math.min(1, Math.max(0, x))
  const r = clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)
  const g = clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)
  const bl = clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)
  return 0.2126 * r + 0.7152 * g + 0.0722 * bl
}

function contrast(
  x: [number, number, number],
  y: [number, number, number]
): number {
  const [hi, lo] = [luminance(x), luminance(y)].sort((p, q) => q - p)
  return (hi + 0.05) / (lo + 0.05)
}

describe.each([
  ["dark", ".dark"],
  ["light", ":root:not(.dark)"],
])("%s theme muted text", (_name, selector) => {
  const t = block(selector)
  it.each(["background", "surface", "muted"])(
    "has at least 4.5:1 contrast on --%s",
    (bg) => {
      expect(t["muted-foreground"]).toBeDefined()
      expect(t[bg]).toBeDefined()
      expect(contrast(t["muted-foreground"], t[bg])).toBeGreaterThanOrEqual(4.5)
    }
  )
})
