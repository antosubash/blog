import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    excerpt: { type: "string", required: true },
    tags : { type: "list" , of : { type : "string" } },
    videoId: { type: "string" },
    part: { type: "number" },
    series: { type: "string" },
    isDraft: { type: "boolean" },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (post: any) => {
        const slug = post._raw.sourceFileName.replace(/\.mdx$/, "");
        return `/posts/${slug}`;
      },
    },
  },
}));

export default makeSource({ contentDirPath: "_posts", documentTypes: [Post] });
