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
    
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post: { _raw: { flattenedPath: any; }; }) => `/posts/${post._raw.flattenedPath}`,
    },
  },
}));

export default makeSource({ contentDirPath: "_posts", documentTypes: [Post] });
