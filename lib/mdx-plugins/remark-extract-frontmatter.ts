import { visit } from 'unist-util-visit'

export function remarkExtractFrontmatter() {
  return (tree: unknown) => {
    // Frontmatter is already extracted by gray-matter, so this is a no-op
    // But we keep it for compatibility
    return tree
  }
}
