import { BlogPost } from "@blog/types/postType";
import { writeFileSync, existsSync, rmSync } from "fs";
import { getAllPosts } from "./api";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { evaluateSync } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
export const generateRss = () => {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
    "tags",
    "series",
    "part",
    "content",
  ]);

  const rssItems = allPosts
    .map((post: BlogPost) => {
      const url = `https://blog.antosubash.com/posts/${post.slug}`;
      const mdx = evaluateSync(post.content, {
        ...(runtime as any),
      }).default;
      return `<item>
          <title>${post.title}</title>
          <link>${url}</link>
          <guid>${url}</guid>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <description>${post.excerpt}</description>
          <content:encoded><![CDATA[${renderToString(
            createElement(mdx)
          )}]]></content:encoded>
          </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
        <channel>
            <title>Anto Subash</title>
            <link>https://blog.antosubash.com</link>
            <description>Anto Subash's Blog</description>
            <language>en</language>
            ${rssItems}
        </channel>
        </rss>`;
  if (existsSync("public/rss.xml")) {
    rmSync("public/rss.xml");
  }
  writeFileSync("public/rss.xml", rss);
};
