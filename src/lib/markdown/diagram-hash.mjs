import { createHash } from "node:crypto"

/** The file name (without .svg) of a pre-rendered diagram: shared by the render script and the rehype plugin. */
export const diagramHash = (source) =>
  createHash("sha256")
    .update(source.trim().replace(/\r\n/g, "\n"))
    .digest("hex")
    .slice(0, 12)
