import { BlogPost } from "@blog/types/postType";
import { writeFileSync, existsSync, rmSync } from "fs";
import { getAllPosts } from "./api";
export const generateRss = async () => {
  const allPosts = await getAllPosts([
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
      return `<item>
          <title>${post.title}</title>
          <link>${url}</link>
          <guid>${url}</guid>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <description>${post.excerpt}</description>
          <content:encoded><![CDATA[${post.content}]]></content:encoded>
          </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0" xmlns:content="https://blog.antosubash.com/">
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
