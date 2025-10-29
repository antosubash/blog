import { visit } from 'unist-util-visit'

export function remarkImgToJsx() {
  return (tree: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree as any, 'image', (node: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(node as any).type = 'jsx'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(node as any).value =
        `<img src="${node.url}" alt="${node.alt || ''}" title="${node.title || ''}" />`
    })
    return tree
  }
}
