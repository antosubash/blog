import rehypeSlug from "rehype-slug";
import rehypeAutoLinkHeadings from "rehype-autolink-headings";
import { compile } from "@mdx-js/mdx";
export async function compileMdx(markdown: string) {
  const code = await compile(markdown, {
    outputFormat: "function-body",
    rehypePlugins: [rehypeSlug, rehypeAutoLinkHeadings],
  });

  return String(code);
}
