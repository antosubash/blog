import rehypeSlug from "rehype-slug";
import rehypeAutoLinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import remarkToc from "remark-toc";
import remarkGfm from "remark-gfm";
import rehypeInferReadingTimeMeta from "rehype-infer-reading-time-meta";
import { remarkCodeHike } from "@code-hike/mdx";
import { compile } from "@mdx-js/mdx";
export async function compileMdx(markdown: string) {
  const code = await compile(markdown, {
    outputFormat: "function-body",
    rehypePlugins: [
      remarkCodeHike,
      rehypeHighlight,
      rehypeSlug,
      rehypeAutoLinkHeadings,
      rehypeKatex,
      rehypeInferReadingTimeMeta,
    ],
    remarkPlugins: [remarkGfm, remarkToc],
  });

  return String(code);
}
