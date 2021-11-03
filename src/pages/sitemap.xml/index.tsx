import { GetServerSideProps } from "next";
import { getAllPosts } from "../../lib/api";
import React from "react";

const Sitemap: React.FC = () => null;
const getDate = new Date().toISOString();
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = "https://blog.antosubash.com";

  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
  ]);
  const postListSitemap = `
    ${allPosts
      .map((post) => {
        return `
          <url>
            <loc>${`${baseUrl}/posts/${post.slug}`}</loc>
            <lastmod>${getDate}</lastmod>
          </url>`;
      })
      .join("")}
  `;

  const generatedSitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
    >
      ${postListSitemap}
    </urlset>
  `;
  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate");
  res.setHeader("Content-Type", "text/xml");
  res.write(generatedSitemap);
  res.end();
  return {
    props: {},
  }
};

export default Sitemap;
