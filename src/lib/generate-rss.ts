import { siteMetadata } from "../data/siteMetadata";
import PostType from "../types/post";

const generateRssItem = (post: PostType) => `
  <item>
    <guid>${siteMetadata.siteUrl}/blog/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${siteMetadata.siteUrl}/blog/${post.slug}</link>
    ${post.excerpt && `<description>${escape(post.excerpt)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${siteMetadata.email} (${siteMetadata.author})</author>
  </item>
`;

const generateRss = (posts: PostType[], page = "feed.xml") => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(siteMetadata.title)}</title>
      <link>${siteMetadata.siteUrl}/blog</link>
      <description>${escape(siteMetadata.description)}</description>
      <language>${siteMetadata.language}</language>
      <managingEditor>${siteMetadata.email} (${
  siteMetadata.author
})</managingEditor>
      <webMaster>${siteMetadata.email} (${siteMetadata.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${
        siteMetadata.siteUrl
      }/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map(generateRssItem).join("")}
    </channel>
  </rss>
`;
export default generateRss;
