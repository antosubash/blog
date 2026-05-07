import { readFile, writeFile } from "node:fs/promises"
import matter from "gray-matter"

export async function writeBackVideoId(
  filePath: string,
  videoId: string
): Promise<void> {
  const raw = await readFile(filePath, "utf8")
  const parsed = matter(raw)
  parsed.data.videoId = videoId
  const next = matter.stringify(parsed.content, parsed.data)
  await writeFile(filePath, next)
}
