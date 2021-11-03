import { visit } from "unist-util-visit";
import gs from "github-slugger";
import * as hu from "hast-util-to-string";

export default function remarkTocHeadings(options: any) {
  return (tree: any) =>
    visit(tree, "heading", (node, index, parent) => {
      const textContent = hu.toString(node);
      options.exportRef.push({
        value: textContent,
        url: "#" + gs.slug(textContent),
        depth: node.depth,
      });
    });
}
