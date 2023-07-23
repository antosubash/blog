import { defineDocumentType, makeSource } from "contentlayer/source-files";
import GithubSlugger from "github-slugger";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { rehypePrettyCodeClasses, rehypePrettyCodeOptions } from "@lib/rehyePrettyCode";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
const HEADING_LINK_ANCHOR = `before:content-['#'] before:absolute before:-ml-[1em] before:text-rose-100/0 hover:before:text-rose-100/50 pl-[1em] -ml-[1em]`;
export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    excerpt: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" } },
    videoId: { type: "string" },
    part: { type: "number" },
    series: { type: "string" },
    isDraft: { type: "boolean" },
  },
  contentType: "mdx",
  // mdx: {
  //   esbuildOptions(options: any) {
  //     options.target = "esnext";
  //     return options;
  //   },
  //   remarkPlugins: [[remarkGfm]],
  //   rehypePlugins: [
  //     [rehypeSlug],
  //     [rehypePrettyCode, rehypePrettyCodeOptions],
  //     [rehypePrettyCodeClasses],
  //     [
  //       rehypeAutolinkHeadings,
  //       {
  //         behavior: "wrap",
  //         properties: {
  //           className: [HEADING_LINK_ANCHOR],
  //         },
  //       },
  //     ],
  //   ],
  // },
  computedFields: {
    slug: {
      type: "string",
      resolve: (post: any) => {
        const slug = post._raw.sourceFileName.replace(/\.mdx$/, "");
        return slug;
      },
    },
    url: {
      type: "string",
      resolve: (post: any) => {
        const slug = post._raw.sourceFileName.replace(/\.mdx$/, "");
        return `/posts/${slug}`;
      },
    },
    heading: {
      type: "json",
      resolve: (post: any) => {
        const regXHeader = /\n(?<flag>#{1,6})\s+(?<content>.+)/g;
        const slugger = new GithubSlugger();
        const headings = Array.from(post.body.raw.matchAll(regXHeader)).map(
          ({ groups }: any) => {
            const flag = groups?.flag;
            const content = groups?.content;
            return {
              level: flag.length,
              text: content,
              slug: content ? slugger.slug(content) : undefined,
            };
          }
        );
        return headings;
      },
    },
  },
}));

export default makeSource({ contentDirPath: "_posts", documentTypes: [Post] });
