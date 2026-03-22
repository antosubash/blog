import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const scripts = [
  "scripts/search.ts",
  "scripts/rss.ts",
  "scripts/sitemap.ts",
  "scripts/og.ts",
]

const projectRoot = path.resolve(__dirname, "..")

for (const script of scripts) {
  console.log(`Running ${script}...`)
  // All script paths are hardcoded constants, not user input — safe to use shell
  const result = spawnSync("npx", ["tsx", script], {
    stdio: "inherit",
    cwd: projectRoot,
    shell: true,
  })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

console.log("Postbuild complete!")
