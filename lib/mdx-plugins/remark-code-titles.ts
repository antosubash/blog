import { visit } from 'unist-util-visit'

export function remarkCodeTitles() {
  return (tree: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree as any, 'code', (node: any, index: number, parent: any) => {
      if (parent && index !== null && node.lang) {
        const match = node.lang.match(/^(.*?):title=(.+)$/)
        if (match) {
          node.lang = match[1]
          node.data = node.data || {}
          node.data.title = match[2]
        }
      }
    })
    return tree
  }
}
