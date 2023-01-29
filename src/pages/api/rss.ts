import { getAllPosts } from "@lib/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
    .map((post) => {
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
        <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
        <channel>
            <title>Anto Subash</title>
            <link>https://blog.antosubash.com</link>
            <description>Anto Subash's Blog</description>
            <language>en</language>
            ${rssItems}
        </channel>
        </rss>`;
  res.setHeader("Content-Type", "text/xml");
  return res.status(200).send(rss);
}
